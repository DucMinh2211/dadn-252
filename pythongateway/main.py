import sys
import time
from datetime import datetime
import mysql.connector
from mysql.connector import Error
from Adafruit_IO import MQTTClient

AIO_USERNAME = "DucMinh2211"
AIO_KEY = "tự copy vô nhé " 

DB_CONFIG = {
    'host': '127.0.0.1',
    'database': 'dadn_smarthome',
    'user': 'root',
    'password': '123456'
}

FEEDS = ["bbc-temp", "bbc-moist", "bbc-move", "bbc-lisen", "bbc-led1", "bbc-led2", "bbc-fan", "bbc-remote"]

last_motion_stop_time = 0
motion_detected = False

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

def message(client, feed_id, payload):
    global last_motion_stop_time, motion_detected
    print(f"[Nhan du lieu] Kenh: {feed_id} ---> Gia tri: {payload}")
    
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

    

    if feed_id == "bbc-lisen":
        try:
            anh_sang = float(payload)
            if anh_sang < 30:
                print("Tối quá! Tự động BẬT đèn Outside (bbc-led1).")
                client.publish("bbc-led1", "1")
            elif anh_sang > 50:
                print("Trời sáng! Tự động TẮT đèn Outside (bbc-led1).")
                client.publish("bbc-led1", "0")
        except ValueError:
            pass

    if feed_id == "bbc-move":
        try:
            move_val = int(float(payload))
            if move_val == 1:
                print("Có người! BẬT đèn Main (bbc-led2) và hủy đếm ngược.")
                client.publish("bbc-led2", "1")
                motion_detected = True
                last_motion_stop_time = 0 # Xóa mốc thời gian tắt
            elif move_val == 0:
                print("Hết người! Bắt đầu đếm ngược 10s để tắt đèn.")
                motion_detected = False
                last_motion_stop_time = time.time() # Lưu lại thời điểm đồng hồ lúc vừa hết người
        except ValueError:
            pass

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
                print("Đã qua 10s không có chuyển động. Tự động TẮT đèn Main (bbc-led2)!")
                client.publish("bbc-led2", "0")
                last_motion_stop_time = 0 # Khóa lại bộ đếm để không bị spam lệnh tắt

        # --- CHẾ ĐỘ ĐI NGỦ: TẮT HẾT ĐÈN ---
        if now.hour == 22 and now.minute == 0:
            print("Đã 22:00 - Chế độ đi ngủ: Tự động TẮT hết đèn!")
            client.publish("bbc-led1", "0") 
            client.publish("bbc-led2", "0") 
            time.sleep(60)
        else:
            time.sleep(1) # Nghỉ 1 giây để đỡ hao tài nguyên CPU
            
except KeyboardInterrupt:
    print("Dung chuong trinh...")
    sys.exit(0)