from Adafruit_IO import Client

aio = Client("DucMinh2211", "tự điên key ở trên zalo vô nhé")

aio.send("bbc-temp", 99)

print(" Đã bắn thành công số 99 lên Adafruit!")