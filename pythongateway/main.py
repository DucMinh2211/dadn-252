import sys
import time
from Adafruit_IO import MQTTClient

# --- 1. THONG TIN TAI KHOAN ADAFRUIT ---
AIO_USERNAME = "DucMinh2211"
AIO_KEY = "tự điên key ở trên zalo vô nhé"

# --- 2. KHAI BAO CAC KENH DU LIEU (FEEDS) ---
FEED_TEMP = "bbc-temp"
FEED_MOIST = "bbc-moist"
FEED_MOVE = "bbc-move"
FEED_LED = "bbc-led"
FEED_FAN = "bbc-fan"
FEED_REMOTE = "bbc-remote"

def connected(client):
    print("Ket noi thanh cong den may chu Adafruit IO ...")
    client.subscribe(FEED_TEMP)
    client.subscribe(FEED_MOIST)
    client.subscribe(FEED_MOVE)
    client.subscribe(FEED_LED)
    client.subscribe(FEED_FAN)
    client.subscribe(FEED_REMOTE)

def subscribe(client, userdata, mid, granted_qos):
    print("Subscribe thanh cong ...")

def disconnected(client):
    print("Ngat ket noi ...")
    sys.exit(1)

def message(client, feed_id, payload):
    print(f"[Nhan du lieu] Kenh: {feed_id} ---> Gia tri: {payload}")
    # Kịch bản 1: Xử lý Nhiệt độ
    if feed_id == "bbc-temp":
        nhiet_do = float(payload) 
        
        if nhiet_do >= 35:
            print("He thong tu dong ra lenh BAT QUAT!")
            # Gửi lệnh mức quạt 100 lên kênh bbc-fan
            client.publish("bbc-fan", "100") 
            
        elif nhiet_do <= 30:
            print(" He thong tu dong ra lenh TAT QUAT!")
            # Gửi lệnh mức quạt 0 lên kênh bbc-fan
            client.publish("bbc-fan", "0")


# --- 3. KHOI TAO VA CHAY CHUONG TRINH ---
print("Dang khoi dong tram Gateway Python ...")

client = MQTTClient(AIO_USERNAME, AIO_KEY)
client.on_connect = connected
client.on_disconnect = disconnected
client.on_message = message
client.on_subscribe = subscribe

client.connect()
client.loop_background()

while True:
    time.sleep(1)
    pass