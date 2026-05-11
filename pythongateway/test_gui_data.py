from Adafruit_IO import Client

aio = Client("DucMinh2211", "NHAP_KEY_VAO_DAY")

aio.send("bbc-temp", 99)

print(" Đã bắn thành công số 99 lên Adafruit!")