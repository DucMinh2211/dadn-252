import { useState } from 'react';
import { Thermometer, Wind, Droplets, Fan, Snowflake, Flame } from 'lucide-react';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ClimateZone {
  id: string;
  name: string;
  temperature: number;
  targetTemp: number;
  humidity: number;
  mode: 'heating' | 'cooling' | 'auto' | 'off';
  fanSpeed: number;
  active: boolean;
}

export function Climate() {
  const [zones, setZones] = useState<ClimateZone[]>([
    { 
      id: '1', 
      name: 'Living Room', 
      temperature: 22, 
      targetTemp: 22,
      humidity: 45, 
      mode: 'auto',
      fanSpeed: 2,
      active: true 
    },
    { 
      id: '2', 
      name: 'Bedroom', 
      temperature: 20, 
      targetTemp: 20,
      humidity: 50, 
      mode: 'cooling',
      fanSpeed: 1,
      active: true 
    },
    { 
      id: '3', 
      name: 'Kitchen', 
      temperature: 23, 
      targetTemp: 22,
      humidity: 42, 
      mode: 'cooling',
      fanSpeed: 3,
      active: true 
    },
    { 
      id: '4', 
      name: 'Office', 
      temperature: 21, 
      targetTemp: 21,
      humidity: 48, 
      mode: 'auto',
      fanSpeed: 2,
      active: false 
    },
  ]);

  const updateZone = (id: string, updates: Partial<ClimateZone>) => {
    setZones(zones.map(zone => 
      zone.id === id ? { ...zone, ...updates } : zone
    ));
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'heating': return <Flame className="w-5 h-5 text-orange-500" />;
      case 'cooling': return <Snowflake className="w-5 h-5 text-blue-500" />;
      case 'auto': return <Thermometer className="w-5 h-5 text-green-500" />;
      default: return <Wind className="w-5 h-5 text-gray-400" />;
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'heating': return 'from-orange-50 to-red-50';
      case 'cooling': return 'from-blue-50 to-cyan-50';
      case 'auto': return 'from-green-50 to-emerald-50';
      default: return 'from-gray-50 to-gray-100';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl mb-2 flex items-center gap-3">
          <Thermometer className="w-8 h-8 text-blue-500" />
          Climate Control
        </h2>
        <p className="text-gray-500">Manage temperature and air quality</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Average Temperature</p>
              <p className="text-2xl font-semibold">
                {(zones.reduce((acc, z) => acc + z.temperature, 0) / zones.length).toFixed(1)}°C
              </p>
            </div>
            <Thermometer className="w-10 h-10 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Average Humidity</p>
              <p className="text-2xl font-semibold">
                {Math.round(zones.reduce((acc, z) => acc + z.humidity, 0) / zones.length)}%
              </p>
            </div>
            <Droplets className="w-10 h-10 text-cyan-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active Zones</p>
              <p className="text-2xl font-semibold">
                {zones.filter(z => z.active).length}/{zones.length}
              </p>
            </div>
            <Wind className="w-10 h-10 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Climate Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {zones.map(zone => (
          <Card key={zone.id} className={`p-6 bg-gradient-to-br ${getModeColor(zone.mode)}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {getModeIcon(zone.mode)}
                <div>
                  <h3 className="text-xl font-semibold">{zone.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{zone.mode} mode</p>
                </div>
              </div>
              <Switch 
                checked={zone.active}
                onCheckedChange={(checked) => updateZone(zone.id, { active: checked })}
              />
            </div>

            {zone.active && (
              <Tabs defaultValue="temperature" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="temperature">Temperature</TabsTrigger>
                  <TabsTrigger value="mode">Mode</TabsTrigger>
                  <TabsTrigger value="fan">Fan</TabsTrigger>
                </TabsList>

                <TabsContent value="temperature" className="space-y-4">
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Current</p>
                        <p className="text-3xl font-bold">{zone.temperature}°C</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Target</p>
                        <p className="text-3xl font-bold">{zone.targetTemp}°C</p>
                      </div>
                    </div>
                    <Slider
                      value={[zone.targetTemp]}
                      onValueChange={(vals) => updateZone(zone.id, { targetTemp: vals[0] })}
                      min={16}
                      max={30}
                      step={0.5}
                    />
                  </div>

                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-cyan-600" />
                        <span>Humidity</span>
                      </div>
                      <span className="font-semibold">{zone.humidity}%</span>
                    </div>
                    <div className="mt-2 flex gap-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div 
                          key={i}
                          className={`flex-1 h-2 rounded ${
                            i < Math.floor(zone.humidity / 10) ? 'bg-cyan-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="mode" className="space-y-3">
                  {['heating', 'cooling', 'auto', 'off'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => updateZone(zone.id, { mode: mode as any })}
                      className={`w-full p-4 rounded-lg text-left transition-all ${
                        zone.mode === mode 
                          ? 'bg-white ring-2 ring-indigo-500 shadow-md' 
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {mode === 'heating' && <Flame className="w-5 h-5 text-orange-500" />}
                          {mode === 'cooling' && <Snowflake className="w-5 h-5 text-blue-500" />}
                          {mode === 'auto' && <Thermometer className="w-5 h-5 text-green-500" />}
                          {mode === 'off' && <Wind className="w-5 h-5 text-gray-400" />}
                          <span className="capitalize font-medium">{mode}</span>
                        </div>
                        {zone.mode === mode && (
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </TabsContent>

                <TabsContent value="fan" className="space-y-4">
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Fan className="w-5 h-5 text-indigo-600" />
                        <span>Fan Speed</span>
                      </div>
                      <span className="font-semibold">Level {zone.fanSpeed}</span>
                    </div>
                    <Slider
                      value={[zone.fanSpeed]}
                      onValueChange={(vals) => updateZone(zone.id, { fanSpeed: vals[0] })}
                      min={1}
                      max={5}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>

                  <div className="bg-white/50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">Air Quality</p>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div 
                              key={i}
                              className={`flex-1 h-3 rounded ${
                                i < 4 ? 'bg-green-500' : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="ml-4 text-green-600 font-medium">Good</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
