import { useState } from 'react';
import { Lightbulb, Power, Sun } from 'lucide-react';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Button } from './ui/button';

export function Lights() {
  // 1. Quản lý trạng thái On/Off riêng cho 2 đèn
  const [isMainLightOn, setIsMainLightOn] = useState(false);
  const [isCeilingLightOn, setIsCeilingLightOn] = useState(false);

  // 2. Hàm điều khiển chung cho cả 2 đèn
  const toggleLight = async (feedName: string, newState: boolean, setter: Function) => {
    setter(newState);
    try {
      await fetch('http://127.0.0.1:8000/api/device-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feed_name: feedName,
          value: newState ? "1" : "0" // <--- Đổi lại thành 1 và 0 ở đây
        })
      });
    } catch (error) {
      console.error("Lỗi điều khiển đèn:", error);
    }
  };

  // 3. Hàm tắt/bật tất cả (Dùng cho 2 cái nút nhanh ở trên)
  const setAllLights = (status: boolean) => {
    toggleLight('bbc-led1', status, setIsCeilingLightOn);
    toggleLight('bbc-led2', status, setIsMainLightOn);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl mb-2 flex items-center gap-3">
              <Lightbulb className="w-8 h-8 text-yellow-500" />
              Lights Control
            </h2>
            <p className="text-gray-500">Manage all lights in your home</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setAllLights(true)} variant="outline">
              <Power className="w-4 h-4 mr-2" />
              All On
            </Button>
            <Button onClick={() => setAllLights(false)} variant="outline">
              <Power className="w-4 h-4 mr-2" />
              All Off
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="p-6 mb-8 bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Lights Status</p>
            <p className="text-2xl font-semibold">
              {[isMainLightOn, isCeilingLightOn].filter(status => status).length} of 2 lights on
            </p>
          </div>
          <Sun className="w-12 h-12 text-yellow-500" />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Đèn 1: Ceiling Light (Phòng khách) */}
        <Card className={`p-6 ${isCeilingLightOn ? 'ring-2 ring-yellow-400' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isCeilingLightOn ? 'bg-yellow-400' : 'bg-gray-200'
                }`}
              >
                <Lightbulb className={`w-6 h-6 ${isCeilingLightOn ? 'text-gray-800' : 'text-gray-400'}`} />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Outside Light</h4>
                <p className="text-sm text-gray-500">Outside</p>
              </div>
            </div>
            <Switch 
              checked={isCeilingLightOn}
              onCheckedChange={(checked) => toggleLight('bbc-led1', checked, setIsCeilingLightOn)}
            />
          </div>
        </Card>

        {/* Đèn 2: Main Light (Phòng ngủ) */}
        <Card className={`p-6 ${isMainLightOn ? 'ring-2 ring-yellow-400' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isMainLightOn ? 'bg-yellow-400' : 'bg-gray-200'
                }`}
              >
                <Lightbulb className={`w-6 h-6 ${isMainLightOn ? 'text-gray-800' : 'text-gray-400'}`} />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Main Light</h4>
                <p className="text-sm text-gray-500">Livingroom</p>
              </div>
            </div>
            <Switch 
              checked={isMainLightOn}
              onCheckedChange={(checked) => toggleLight('bbc-led2', checked, setIsMainLightOn)}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}