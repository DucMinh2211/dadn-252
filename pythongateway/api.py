from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
import requests

app = FastAPI(title="Smart Home API", description="API cho đồ án Nhà Thông Minh")

# Cho phép Frontend (React) gọi API mà không bị chặn lỗi CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CẤU HÌNH ---
DB_CONFIG = {
    'host': '127.0.0.1',
    'database': 'dadn_smarthome',
    'user': 'root',
    'password': '123456' # Nhớ đổi pass nhé
}

AIO_USERNAME = "DucMinh2211"
AIO_KEY = " tự copy vô nhé " #aio_qXdO16KoYp30YtjNs5ALnKuDD5Os

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

# --- CÁC MODEL DỮ LIỆU (PYDANTIC) ---
class DeviceCommand(BaseModel):
    feed_name: str
    value: str

class AutomationRule(BaseModel):
    name: str
    trigger_feed_id: int
    condition_op: str
    trigger_value: float
    action_feed_id: int
    action_value: str


# 1. API Lấy lịch sử cảm biến 
@app.get("/api/sensor/history")
def get_sensor_history(days: int = 7):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True) 
        query = """
            SELECT f.feed_name, s.value, s.created_at 
            FROM sensor_data s
            JOIN feeds f ON s.feed_id = f.id
            WHERE s.created_at >= NOW() - INTERVAL %s DAY
            ORDER BY s.created_at DESC
        """
        cursor.execute(query, (days,))
        records = cursor.fetchall()
        return {"status": "success", "data": records}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

# 2. API Lấy thông số môi trường MỚI NHẤT (Cho màn hình chính)
@app.get("/api/sensor/latest")
def get_sensor_latest():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT f.feed_name, s.value, s.created_at
            FROM sensor_data s
            JOIN feeds f ON s.feed_id = f.id
            WHERE s.id IN (
                SELECT MAX(id) FROM sensor_data GROUP BY feed_id
            )
        """
        cursor.execute(query)
        return {"status": "success", "data": cursor.fetchall()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

# 3. API Điều khiển thiết bị (Bật/Tắt quạt, đèn)
@app.post("/api/device-control")
def control_device(cmd: DeviceCommand):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Loi ket noi DB")
    try:
        aio_url = f"https://io.adafruit.com/api/v2/{AIO_USERNAME}/feeds/{cmd.feed_name}/data"
        headers = {"X-AIO-Key": AIO_KEY}
        payload = {"datum": {"value": cmd.value}}
        
        response = requests.post(aio_url, headers=headers, json=payload)
        if response.status_code != 200:
            # In thẳng lỗi của Adafruit ra để bắt bệnh
            error_msg = f"Lỗi Adafruit ({response.status_code}): {response.text}"
            print(error_msg) # In ra Terminal
            raise HTTPException(status_code=500, detail=error_msg) # Ném lên Web

        cursor = conn.cursor()
        cursor.execute("SELECT id FROM feeds WHERE feed_name = %s", (cmd.feed_name,))
        feed_row = cursor.fetchone()
        if feed_row:
            cursor.execute(
                "INSERT INTO action_logs (feed_id, action_value) VALUES (%s, %s)",
                (feed_row[0], cmd.value)
            )
            conn.commit()
        return {"status": "success", "message": "Lenh da duoc gui va luu nhat ky"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals() and conn.is_connected():
            conn.close()

# 4. API Lấy nhật ký hoạt động (Cho màn hình Activity Log)
@app.get("/api/logs")
def get_activity_logs():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT f.feed_name, a.action_value, a.created_at 
            FROM action_logs a
            JOIN feeds f ON a.feed_id = f.id
            ORDER BY a.created_at DESC LIMIT 50
        """
        cursor.execute(query)
        return {"status": "success", "data": cursor.fetchall()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

# 5. API Tạo kịch bản tự động hóa mới
@app.post("/api/automations")
def create_automation(rule: AutomationRule):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    try:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO automations (name, is_active) VALUES (%s, %s)", (rule.name, True))
        auto_id = cursor.lastrowid
        cursor.execute(
            "INSERT INTO automation_conditions (automation_id, trigger_feed_id, condition_op, trigger_value) VALUES (%s, %s, %s, %s)",
            (auto_id, rule.trigger_feed_id, rule.condition_op, rule.trigger_value)
        )
        cursor.execute(
            "INSERT INTO automation_actions (automation_id, action_feed_id, action_value) VALUES (%s, %s, %s)",
            (auto_id, rule.action_feed_id, rule.action_value)
        )
        conn.commit()
        return {"status": "success", "automation_id": auto_id}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals() and conn.is_connected():
            conn.close()