from Adafruit_IO import Client

aio = Client("DucMinh2211", "aio_mKBd37ammL8wtWoEEqZiQ6Q6sXQh")

aio.send("BBC_TEMP", 99)

print(" Đã bắn thành công số 99 lên Adafruit!")