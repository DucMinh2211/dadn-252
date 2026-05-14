import sys
import time
from datetime import datetime
import mysql.connector
from mysql.connector import Error
from Adafruit_IO import MQTTClient

AIO_USERNAME = "DucMinh2211"
AIO_KEY = "aio_mKBd37ammL8wtWoEEqZiQ6Q6sXQh" 

DB_CONFIG = {
    'host': '127.0.0.1',
    'database': 'dadn_smarthome',
    'user': 'root',
    'password': '123456'
}

FEEDS = ["bbc-temp", "bbc-moist", "bbc-move", "bbc-lisen", "bbc-led1", "bbc-led2", "bbc-fan", "bbc-remote", "bbc-door", "bbc-faceai"]
last_motion_stop_time = 0
motion_detected = False

current_device_states = {
    "bbc-led1": "0",
    "bbc-led2": "0",
    "bbc-door": "0",
    "bbc-fan": "0"
}
last_received_values = {}
def get_db_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Loi ket noi MySQL: {e}")
    return None

def connected(client):
    print("Ket noi thanh cong den may chu Adafruit IO ...")
    for feed in FEEDS:
        client.subscribe(feed)

def subscribe(client, userdata, mid, granted_qos):
    print("Subscribe thanh cong cac kenh...")

def disconnected(client):
    print("Ngat ket noi ...")
    sys.exit(1)

def smart_publish(client, feed_id, value):
    global current_device_states
    
    if current_device_states.get(feed_id) == str(value):
        return
    client.publish(feed_id, value)
    current_device_states[feed_id] = str(value)
    conn = get_db_connection()
    if conn is not None:
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM feeds WHERE feed_name = %s", (feed_id,))
            result = cursor.fetchone()
            
            if result:
                db_feed_id = result[0]
                cursor.execute(
                    "INSERT INTO action_logs (feed_id, action_value) VALUES (%s, %s)",
                    (db_feed_id, str(value))
                )
                conn.commit()
        except Error as e:
            print(f"Lỗi khi lưu nhật ký tự động: {e}")
        finally:
            if conn.is_connected():
                cursor.close()
                conn.close()

def message(client, feed_id, payload):
    global last_motion_stop_time, motion_detected, current_device_states
    print(f"\n[Nhan du lieu] Kenh: {feed_id} ---> Gia tri: {payload}")
    
    if feed_id in current_device_states:
        current_device_states[feed_id] = str(payload)
    
    conn = get_db_connection()
    if conn is not None:
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM feeds WHERE feed_name = %s", (feed_id,))
            result = cursor.fetchone()
            
            if result:
                db_feed_id = result[0]
                insert_query = "INSERT INTO sensor_data (feed_id, value) VALUES (%s, %s)"
                cursor.execute(insert_query, (db_feed_id, float(payload) if payload.replace('.','',1).isdigit() else payload))
                conn.commit()
                print(" -> Da luu vao Database thanh cong!")
                
        except Error as e:
            print(f"Loi khi thao tac voi DB: {e}")
        finally:
            if conn.is_connected():
                cursor.close()
                conn.close()

    # 1. CẢM BIẾN ÁNH SÁNG
    if feed_id == "bbc-lisen":
        try:
            anh_sang = float(payload)
            if anh_sang < 30 and current_device_states.get("bbc-led1") != "1":
                print("Tối quá! Kích hoạt lệnh BẬT đèn Outside (bbc-led1).")
                smart_publish(client, "bbc-led1", "1")
            elif anh_sang > 50 and current_device_states.get("bbc-led1") != "0":
                print("Trời sáng! Kích hoạt lệnh TẮT đèn Outside (bbc-led1).")
                smart_publish(client, "bbc-led1", "0")
        except ValueError:
            pass

    # 2. CẢM BIẾN CHUYỂN ĐỘNG
    if feed_id == "bbc-move":
        try:
            move_val = int(float(payload))
            if move_val == 1 and not motion_detected:
                print("Có người! Kích hoạt lệnh BẬT đèn Main (bbc-led2) và hủy đếm ngược.")
                smart_publish(client, "bbc-led2", "1")
                motion_detected = True
                last_motion_stop_time = 0 
            elif move_val == 0 and motion_detected:
                print("Hết người! Bắt đầu đếm ngược 10s để tắt đèn.")
                motion_detected = False
                last_motion_stop_time = time.time() 
        except ValueError:
            pass
            
    # KỊCH BẢN FACE ID
    if feed_id == "bbc-faceai":
        if payload != "UNKNOWN": 
            print(f"Bảo vệ AI: Nhận diện thành công [{payload}]! Tự động mở cửa!")
            smart_publish(client, "bbc-door", "1")
        else:
            print("Bảo vệ AI: Người lạ xuất hiện! Đóng cửa!")
            smart_publish(client, "bbc-door", "0")

print("Dang khoi dong tram Gateway Python ...")

client = MQTTClient(AIO_USERNAME, AIO_KEY)
client.on_connect = connected
client.on_disconnect = disconnected 
client.on_message = message 
client.on_subscribe = subscribe 

client.connect()
client.loop_background()

try:
    while True:
        now = datetime.now()
        
        if not motion_detected and last_motion_stop_time > 0:
            if time.time() - last_motion_stop_time >= 10:
                print("Đã qua 10s không có chuyển động. Kích hoạt lệnh TẮT đèn Main (bbc-led2)!")
                smart_publish(client, "bbc-led2", "0")
                last_motion_stop_time = 0 

        # --- CHẾ ĐỘ ĐI NGỦ: TẮT HẾT ĐÈN ---
        if now.hour == 22 and now.minute == 0:
            print("Đã 22:00 - Chế độ đi ngủ: Kích hoạt lệnh TẮT hết đèn!")
            smart_publish(client, "bbc-led1", "0") 
            smart_publish(client, "bbc-led2", "0") 
            time.sleep(60)
        else:
            time.sleep(1) 
            
except KeyboardInterrupt:
    print("Dung chuong trinh...")
    sys.exit(0)