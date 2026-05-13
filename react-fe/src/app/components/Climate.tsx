import { useState, useEffect, useRef } from 'react';
import { Wind, Fan, Power } from 'lucide-react';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function Climate() {
  const [isSystemActive, setIsSystemActive] = useState(true);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');

  const [currentTemp, setCurrentTemp] = useState(25);
  const [targetTemp, setTargetTemp] = useState(30);
  const [fanSpeed, setFanSpeed] = useState(0);

  const [selectedRoom, setSelectedRoom] = useState('Living Room');

  const prevAutoState = useRef<boolean | null>(null);

  const rooms = [
    { name: 'Living Room', temp: currentTemp, fan: fanSpeed },
    { name: 'Bedroom', temp: 27, fan: 80 },
    { name: 'Kitchen', temp: 31.5, fan: 100 },
    { name: 'Office', temp: 24.8, fan: 0 }
  ];

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
    } catch (error) {
      console.error('Lỗi điều khiển quạt:', error);
    }
  };

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
      } catch {
        console.log('Đang chờ dữ liệu...');
      }
    };

    fetchTemp();
    const interval = setInterval(fetchTemp, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isSystemActive && mode === 'auto') {
      const shouldFanBeOn = currentTemp > targetTemp;

      if (prevAutoState.current !== shouldFanBeOn) {
        const speedVal = shouldFanBeOn ? '100' : '0';
        sendFanCommand(speedVal);
        setFanSpeed(shouldFanBeOn ? 100 : 0);
        prevAutoState.current = shouldFanBeOn;
      }
    }
  }, [currentTemp, targetTemp, isSystemActive, mode]);

  useEffect(() => {
    if (isSystemActive && mode === 'manual') {
      const timer = setTimeout(() => {
        sendFanCommand(fanSpeed.toString());
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [fanSpeed, mode, isSystemActive]);

  const handleSystemToggle = (checked: boolean) => {
    setIsSystemActive(checked);

    if (!checked) {
      sendFanCommand('0');
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
          <p className="text-gray-500">Multi-room Temperature Management</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border">
          <Power
            className={`w-5 h-5 ${
              isSystemActive ? 'text-green-500' : 'text-gray-400'
            }`}
          />
          <span className="font-semibold">
            {isSystemActive ? 'System ON' : 'System OFF'}
          </span>
          <Switch
            checked={isSystemActive}
            onCheckedChange={handleSystemToggle}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT SIDE */}
        <div className="space-y-4">
          {rooms.map((room) => (
            <Card
              key={room.name}
              onClick={() => setSelectedRoom(room.name)}
              className={`p-6 cursor-pointer transition-all ${
                selectedRoom === room.name
                  ? 'ring-2 ring-cyan-500 bg-cyan-50'
                  : 'hover:shadow-lg'
              }`}
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Fan
                  className={`w-6 h-6 ${
                    room.fan > 0
                      ? 'animate-spin text-cyan-500'
                      : 'text-gray-400'
                  }`}
                />
                {room.name}
              </h3>

              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold">{room.temp}</span>
                <span className="text-xl">°C</span>
              </div>

              <div className="mt-4 text-sm bg-slate-100 p-3 rounded-md">
                Fan Status:{' '}
                {room.fan > 0
                  ? `Running (${room.fan}%)`
                  : 'Stopped'}
              </div>
            </Card>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <Card
          className={`p-6 ${
            !isSystemActive ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          <h3 className="text-xl font-semibold mb-4">
            Control Panel - {selectedRoom}
          </h3>

          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as 'auto' | 'manual')}
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="auto">AUTO</TabsTrigger>
              <TabsTrigger value="manual">MANUAL</TabsTrigger>
            </TabsList>

            <TabsContent value="auto">
              <div className="space-y-4">
                <p className="font-medium">
                  Target Temperature: {targetTemp}°C
                </p>
                <Slider
                  value={[targetTemp]}
                  onValueChange={(vals) => setTargetTemp(vals[0])}
                  min={20}
                  max={40}
                  step={1}
                />
              </div>
            </TabsContent>

            <TabsContent value="manual">
              <div className="space-y-4">
                <p className="font-medium">
                  Fan Speed: {fanSpeed}%
                </p>
                <Slider
                  value={[fanSpeed]}
                  onValueChange={(vals) => setFanSpeed(vals[0])}
                  min={0}
                  max={100}
                  step={10}
                />
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
