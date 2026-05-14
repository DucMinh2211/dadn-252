import { useState } from 'react';
import { Lightbulb, Power, Sun } from 'lucide-react';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Button } from './ui/button';

export function Lights() {
  const [isMainLightOn, setIsMainLightOn] = useState(false);
  const [isCeilingLightOn, setIsCeilingLightOn] = useState(false);
  
  const [fakeLight1, setFakeLight1] = useState(false);
  const [fakeLight2, setFakeLight2] = useState(true);

  const toggleLight = async (feedName: string, newState: boolean, setter: Function) => {
    setter(newState);
    if (!feedName.startsWith('bbc-')) return;

    try {
      await fetch('http://127.0.0.1:8000/api/device-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feed_name: feedName, value: newState ? "1" : "0" })
      });
    } catch (error) { console.error("Lỗi điều khiển đèn:", error); }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl mb-2 flex items-center gap-3">
              <Lightbulb className="w-8 h-8 text-yellow-500" /> Lights Control
            </h2>
            <p className="text-gray-500">Quản lý hệ thống chiếu sáng toàn nhà</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => { toggleLight('bbc-led1',true,setIsCeilingLightOn); toggleLight('bbc-led2',true,setIsMainLightOn); }} variant="outline">All On</Button>
            <Button onClick={() => { toggleLight('bbc-led1',false,setIsCeilingLightOn); toggleLight('bbc-led2',false,setIsMainLightOn); }} variant="outline">All Off</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Đèn THẬT 1 */}
        <Card className={`p-6 ${isCeilingLightOn ? 'ring-2 ring-yellow-400 bg-yellow-50' : ''}`}>
          <div className="flex flex-col gap-4">
            <Lightbulb className={`w-10 h-10 ${isCeilingLightOn ? 'text-yellow-500' : 'text-gray-300'}`} />
            <div>
              <h4 className="font-semibold">Outside Light</h4>
              <p className="text-xs text-gray-500">Hardware Connected</p>
            </div>
            <Switch checked={isCeilingLightOn} onCheckedChange={(c) => toggleLight('bbc-led1', c, setIsCeilingLightOn)} />
          </div>
        </Card>

        {/* Đèn THẬT 2 */}
        <Card className={`p-6 ${isMainLightOn ? 'ring-2 ring-yellow-400 bg-yellow-50' : ''}`}>
          <div className="flex flex-col gap-4">
            <Lightbulb className={`w-10 h-10 ${isMainLightOn ? 'text-yellow-500' : 'text-gray-300'}`} />
            <div>
              <h4 className="font-semibold">Main Light</h4>
              <p className="text-xs text-gray-500">Hardware Connected</p>
            </div>
            <Switch checked={isMainLightOn} onCheckedChange={(c) => toggleLight('bbc-led2', c, setIsMainLightOn)} />
          </div>
        </Card>

        {/* Đèn ẢO 1 */}
        <Card className={`p-6 ${fakeLight1 ? 'bg-yellow-50 opacity-80' : ''}`}>
          <div className="flex flex-col gap-4">
            <Lightbulb className={`w-10 h-10 ${fakeLight1 ? 'text-yellow-500' : 'text-gray-300'}`} />
            <div>
              <h4 className="font-semibold">Bedroom Light</h4>
              <p className="text-xs text-gray-400">Simulation Mode</p>
            </div>
            <Switch checked={fakeLight1} onCheckedChange={setFakeLight1} />
          </div>
        </Card>

        {/* Đèn ẢO 2 */}
        <Card className={`p-6 ${fakeLight2 ? 'bg-yellow-50 opacity-80' : ''}`}>
          <div className="flex flex-col gap-4">
            <Lightbulb className={`w-10 h-10 ${fakeLight2 ? 'text-yellow-500' : 'text-gray-300'}`} />
            <div>
              <h4 className="font-semibold">Kitchen Light</h4>
              <p className="text-xs text-gray-400">Simulation Mode</p>
            </div>
            <Switch checked={fakeLight2} onCheckedChange={setFakeLight2} />
          </div>
        </Card>
      </div>
    </div>
  );
}