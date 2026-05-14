import sys
import time
from Adafruit_IO import MQTTClient

# --- ĐIỀN THÔNG TIN CỦA NHÓM VÀO ĐÂY ---
AIO_USERNAME = "DucMinh2211"
AIO_KEY = "aio_mKBd37ammL8wtWoEEqZiQ6Q6sXQh" 

def connected(client):
    print("✅ Đã kết nối thành công mây Adafruit (Module AI Giả Lập)!")

def disconnected(client):
    print("❌ Đã ngắt kết nối!")
    sys.exit(1)

# Khởi tạo Client
client = MQTTClient(AIO_USERNAME, AIO_KEY)
client.on_connect = connected
client.on_disconnect = disconnected

print("Đang kết nối đến Adafruit IO...")
client.connect()
client.loop_background()
time.sleep(2) # Đợi 2s cho kết nối ổn định

try:
    while True:
        print("\n" + "="*40)
        print("  BẢNG ĐIỀU KHIỂN AI GIẢ LẬP")
        print("="*40)
        print("1. Nhận diện ra: Thắng (Chủ nhà)")
        print("2. Nhận diện ra: Người lạ (UNKNOWN)")
        print("3. Thoát chương trình")
        
        choice = input("👉 Mời bạn chọn kịch bản (1/2/3): ")

        if choice == '1':
            print("🚀 Đang gửi dữ liệu: Thắng -> bbc-faceai")
            client.publish("bbc-faceai", "Thắng")
            print("✅ Đã gửi xong! Kiểm tra Web xem cửa có mở không nhé.")
            
        elif choice == '2':
            print("🚀 Đang gửi dữ liệu: UNKNOWN -> bbc-faceai")
            client.publish("bbc-faceai", "UNKNOWN")
            print("✅ Đã gửi xong! Kiểm tra Web xem có cảnh báo đỏ không.")
            
        elif choice == '3':
            print("Tắt AI giả lập...")
            sys.exit(0)
        else:
            print("⚠️ Lựa chọn không hợp lệ, vui lòng gõ 1, 2 hoặc 3.")
            
        # Nghỉ ngơi 3 giây để tránh bị Adafruit khóa vì spam dữ liệu
        time.sleep(3) 

except KeyboardInterrupt:
    print("\nĐã tắt chương trình bằng Ctrl+C")
    sys.exit(0)