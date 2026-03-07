import { useState } from 'react';
import { Lightbulb, Power, Palette, Sun } from 'lucide-react';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Button } from './ui/button';

interface Light {
  id: string;
  name: string;
  room: string;
  on: boolean;
  brightness: number;
  color: string;
}

export function Lights() {
  const [lights, setLights] = useState<Light[]>([
    { id: '1', name: 'Ceiling Light', room: 'Living Room', on: true, brightness: 80, color: '#FFD700' },
    { id: '2', name: 'Reading Lamp', room: 'Living Room', on: true, brightness: 60, color: '#FFA500' },
    { id: '3', name: 'Main Light', room: 'Bedroom', on: false, brightness: 100, color: '#FFFFFF' },
    { id: '4', name: 'Bedside Lamp', room: 'Bedroom', on: true, brightness: 40, color: '#FF6B6B' },
    { id: '5', name: 'Kitchen Light', room: 'Kitchen', on: true, brightness: 90, color: '#FFFFFF' },
    { id: '6', name: 'Under Cabinet', room: 'Kitchen', on: true, brightness: 70, color: '#87CEEB' },
    { id: '7', name: 'Mirror Light', room: 'Bathroom', on: false, brightness: 100, color: '#FFFFFF' },
    { id: '8', name: 'Shower Light', room: 'Bathroom', on: false, brightness: 80, color: '#FFFFFF' },
  ]);

  const colorPresets = [
    { name: 'Warm White', color: '#FFD700' },
    { name: 'Cool White', color: '#FFFFFF' },
    { name: 'Soft Yellow', color: '#FFA500' },
    { name: 'Sky Blue', color: '#87CEEB' },
    { name: 'Soft Red', color: '#FF6B6B' },
    { name: 'Mint Green', color: '#98FF98' },
  ];

  const toggleLight = (id: string) => {
    setLights(lights.map(light => 
      light.id === id ? { ...light, on: !light.on } : light
    ));
  };

  const setBrightness = (id: string, brightness: number) => {
    setLights(lights.map(light => 
      light.id === id ? { ...light, brightness } : light
    ));
  };

  const setColor = (id: string, color: string) => {
    setLights(lights.map(light => 
      light.id === id ? { ...light, color } : light
    ));
  };

  const turnAllOff = () => {
    setLights(lights.map(light => ({ ...light, on: false })));
  };

  const turnAllOn = () => {
    setLights(lights.map(light => ({ ...light, on: true })));
  };

  const rooms = Array.from(new Set(lights.map(l => l.room)));

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
            <Button onClick={turnAllOn} variant="outline">
              <Power className="w-4 h-4 mr-2" />
              All On
            </Button>
            <Button onClick={turnAllOff} variant="outline">
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
              {lights.filter(l => l.on).length} of {lights.length} lights on
            </p>
          </div>
          <Sun className="w-12 h-12 text-yellow-500" />
        </div>
      </Card>

      {/* Lights by Room */}
      {rooms.map(room => (
        <div key={room} className="mb-8">
          <h3 className="text-xl font-semibold mb-4">{room}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lights.filter(l => l.room === room).map(light => (
              <Card key={light.id} className={`p-6 ${light.on ? 'ring-2 ring-yellow-400' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: light.on ? light.color : '#e5e7eb',
                        opacity: light.on ? light.brightness / 100 : 1
                      }}
                    >
                      <Lightbulb className={`w-5 h-5 ${light.on ? 'text-gray-800' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{light.name}</h4>
                      <p className="text-sm text-gray-500">{light.room}</p>
                    </div>
                  </div>
                  <Switch 
                    checked={light.on}
                    onCheckedChange={() => toggleLight(light.id)}
                  />
                </div>

                {light.on && (
                  <>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Brightness</span>
                        <span className="text-sm font-medium">{light.brightness}%</span>
                      </div>
                      <Slider
                        value={[light.brightness]}
                        onValueChange={(vals) => setBrightness(light.id, vals[0])}
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Palette className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600">Color</span>
                      </div>
                      <div className="flex gap-2">
                        {colorPresets.map(preset => (
                          <button
                            key={preset.name}
                            onClick={() => setColor(light.id, preset.color)}
                            className={`w-8 h-8 rounded-full border-2 ${
                              light.color === preset.color ? 'border-indigo-600' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: preset.color }}
                            title={preset.name}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
