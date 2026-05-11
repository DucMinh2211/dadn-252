import { useState, useEffect, useRef } from 'react';
import { Thermometer, Wind, Fan, Settings2, Power, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function Climate() {
  // Trạng thái hệ thống
  const [isSystemActive, setIsSystemActive] = useState(true);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  
  // Dữ liệu môi trường thật từ API
  const [currentTemp, setCurrentTemp] = useState(25);
  
  // Thông số cài đặt
  const [targetTemp, setTargetTemp] = useState(30); // Ngưỡng nhiệt độ người dùng set
  const [fanSpeed, setFanSpeed] = useState(0);      // Tốc độ quạt (0 - 100)

  // Dùng useRef để tránh việc Frontend gửi lệnh liên tục lên API làm treo hệ thống
  const prevAutoState = useRef<boolean | null>(null);

  // Hàm gửi lệnh xuống Quạt (Adafruit)
  const sendFanCommand = async (speedVal: string) => {
    try {
      await fetch('http://127.0.0.1:8000/api/device-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feed_name: 'bbc-fan',
          value: speedVal
        })
      });
      console.log(`Đã gửi lệnh quạt: ${speedVal}%`);
    } catch (error) {
      console.error("Lỗi điều khiển quạt:", error);
    }
  };

  // EFFECT 1: Lấy nhiệt độ thật mỗi 3 giây
  useEffect(() => {
    const fetchTemp = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/sensor/latest');
        const result = await res.json();
        if (result.status === 'success') {
          result.data.forEach((item: any) => {
            if (item.feed_name === 'bbc-temp') {
              setCurrentTemp(Number(item.value));
            }
          });
        }
      } catch (error) {
        console.log("Đang chờ dữ liệu nhiệt độ...");
      }
    };
    
    fetchTemp();
    const interval = setInterval(fetchTemp, 3000);
    return () => clearInterval(interval);
  }, []);

  // EFFECT 2: Xử lý logic AUTO (Tự động bật/tắt quạt theo ngưỡng)
  useEffect(() => {
    if (isSystemActive && mode === 'auto') {
      const shouldFanBeOn = currentTemp > targetTemp;
      
      // Chỉ gửi API nếu trạng thái cần thay đổi (từ Tắt -> Bật hoặc Bật -> Tắt)
      if (prevAutoState.current !== shouldFanBeOn) {
        const speedVal = shouldFanBeOn ? "100" : "0";
        sendFanCommand(speedVal);
        setFanSpeed(shouldFanBeOn ? 100 : 0);
        prevAutoState.current = shouldFanBeOn;
      }
    }
  }, [currentTemp, targetTemp, isSystemActive, mode]);

  // EFFECT 3: Xử lý logic MANUAL (Tránh spam API khi người dùng kéo thanh trượt)
  useEffect(() => {
    if (isSystemActive && mode === 'manual') {
      const timer = setTimeout(() => {
        sendFanCommand(fanSpeed.toString());
      }, 500); // Chờ 0.5s sau khi ngừng kéo mới gửi API
      return () => clearTimeout(timer);
    }
  }, [fanSpeed, mode, isSystemActive]);

  // Xử lý khi tắt toàn bộ hệ thống
  const handleSystemToggle = (checked: boolean) => {
    setIsSystemActive(checked);
    if (!checked) {
      sendFanCommand("0");
      setFanSpeed(0);
      prevAutoState.current = false;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl mb-2 flex items-center gap-3">
            <Wind className="w-8 h-8 text-cyan-500" />
            Smart Fan Control
          </h2>
          <p className="text-gray-500">Living Room - Temperature & Fan Management</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border">
          <Power className={`w-5 h-5 ${isSystemActive ? 'text-green-500' : 'text-gray-400'}`} />
          <span className="font-semibold">{isSystemActive ? 'System ON' : 'System OFF'}</span>
          <Switch checked={isSystemActive} onCheckedChange={handleSystemToggle} className="ml-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* THẺ HIỂN THỊ NHIỆT ĐỘ */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10">
            <Thermometer className="w-48 h-48" />
          </div>
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Thermometer className="w-6 h-6 text-blue-500" />
            Current Environment
          </h3>
          <div className="flex items-end gap-4">
            <span className="text-6xl font-bold text-blue-900">{currentTemp.toFixed(1)}</span>
            <span className="text-2xl text-blue-600 font-semibold mb-2">°C</span>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm text-blue-800 bg-blue-100 p-3 rounded-md w-fit">
            <Fan className={`w-4 h-4 ${fanSpeed > 0 ? 'animate-spin' : ''}`} />
            Fan Status: <span className="font-bold">{fanSpeed > 0 ? `Running (${fanSpeed}%)` : 'Stopped'}</span>
          </div>
        </Card>

        {/* THẺ ĐIỀU KHIỂN */}
        <Card className={`p-6 transition-opacity ${!isSystemActive ? 'opacity-50 pointer-events-none' : ''}`}>
          <Tabs value={mode} onValueChange={(v) => setMode(v as 'auto' | 'manual')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="auto" className="flex items-center gap-2">
                <Settings2 className="w-4 h-4" /> AUTO
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <Fan className="w-4 h-4" /> MANUAL
              </TabsTrigger>
            </TabsList>

            {/* TAB TỰ ĐỘNG */}
            <TabsContent value="auto" className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-lg border">
                <div className="flex items-center gap-2 text-slate-700 mb-2">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">Auto Cooling Rule</span>
                </div>
                <p className="text-sm text-slate-500 mb-4">
                  Fan will automatically turn on to 100% when room temperature exceeds your target.
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-gray-600">Target Temperature</span>
                  <span className="text-2xl font-bold text-amber-600">{targetTemp}°C</span>
                </div>
                <Slider
                  value={[targetTemp]}
                  onValueChange={(vals) => setTargetTemp(vals[0])}
                  min={20}
                  max={40}
                  step={1}
                  className="py-4"
                />
              </div>
            </TabsContent>

            {/* TAB CHỈNH TAY */}
            <TabsContent value="manual" className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-gray-600">Fan Speed</span>
                  <span className="text-2xl font-bold text-cyan-600">{fanSpeed}%</span>
                </div>
                <Slider
                  value={[fanSpeed]}
                  onValueChange={(vals) => setFanSpeed(vals[0])}
                  min={0}
                  max={100}
                  step={10}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                  <span>0% (OFF)</span>
                  <span>50%</span>
                  <span>100% (MAX)</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}