from fastapi import FastAPI, HTTPException
import mysql.connector
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Smart Home API", description="API cho đồ án Nhà Thông Minh")

# Cho phép Frontend (React) gọi API mà không bị chặn lỗi CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cấu hình DB (giống hệt file main.py)
DB_CONFIG = {
    'host': '127.0.0.1',
    'database': 'dadn_smarthome',
    'user': 'root',
    'password': '123456' # Nhớ đổi pass nhé
}

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

@app.get("/api/sensor/history")
def get_sensor_history(days: int = 7):
    """
    API lấy dữ liệu cảm biến trong N ngày gần nhất (Mặc định là 7 ngày).
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True) # Trả về dạng Dictionary (JSON) rất tiện
        
        # Câu lệnh SQL lấy lịch sử 7 ngày, JOIN với bảng feeds để lấy tên cảm biến
        query = """
            SELECT f.feed_name, s.value, s.created_at 
            FROM sensor_data s
            JOIN feeds f ON s.feed_id = f.id
            WHERE s.created_at >= NOW() - INTERVAL %s DAY
            ORDER BY s.created_at DESC
        """
        cursor.execute(query, (days,))
        records = cursor.fetchall()
        
        return {
            "status": "success",
            "data": records
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()