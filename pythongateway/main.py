import sys
import time
import mysql.connector
from mysql.connector import Error
from Adafruit_IO import MQTTClient

# --- 1. THONG TIN TAI KHOAN ADAFRUIT ---
AIO_USERNAME = "DucMinh2211"
AIO_KEY = "tren zalo"

# --- 2. THONG TIN KET NOI DATABASE ---
DB_CONFIG = {
    'host': '127.0.0.1',
    'database': 'dadn_smarthome',
    'user': 'root',
    'password': '123456' # Nhớ đổi pass nhé
}

# Khai báo các kênh dữ liệu
FEEDS = ["bbc-temp", "bbc-moist", "bbc-move", "bbc-led", "bbc-fan", "bbc-remote"]

# --- 3. HAM KET NOI DATABASE ---
def get_db_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Loi ket noi MySQL: {e}")
    return None

# --- 4. CAC HAM XU LY MQTT ---
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
    print(f"[Nhan du lieu] Kenh: {feed_id} ---> Gia tri: {payload}")
    
    # KẾT NỐI DB ĐỂ LƯU DỮ LIỆU
    conn = get_db_connection()
    if conn is not None:
        try:
            cursor = conn.cursor()
            
            # B1: Lấy id của feed dựa vào feed_name (Vd: bbc-temp -> id: 1)
            cursor.execute("SELECT id FROM feeds WHERE feed_name = %s", (feed_id,))
            result = cursor.fetchone()
            
            if result:
                db_feed_id = result[0]
                
                # B2: Lưu vào bảng sensor_data (nếu là cảm biến)
                # Tạm thời lưu mọi thứ nhận được vào bảng này để test tính năng
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

    # Kịch bản 1 (Hardcode tạm thời): Xử lý Nhiệt độ
    if feed_id == "bbc-temp":
        try:
            nhiet_do = float(payload) 
            if nhiet_do >= 35:
                print("He thong tu dong ra lenh BAT QUAT!")
                client.publish("bbc-fan", "100") 
            elif nhiet_do <= 30:
                print("He thong tu dong ra lenh TAT QUAT!")
                client.publish("bbc-fan", "0")
        except ValueError:
            pass


# --- 5. KHOI TAO VA CHAY CHUONG TRINH ---
print("Dang khoi dong tram Gateway Python ...")

client = MQTTClient(AIO_USERNAME, AIO_KEY)
client.on_connect = connected # type: ignore
client.on_disconnect = disconnected # type: ignore
client.on_message = message # type: ignore
client.on_subscribe = subscribe # type: ignore

client.connect()
client.loop_background()

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("Dung chuong trinh...")
    sys.exit(0)
