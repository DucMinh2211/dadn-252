import { useState } from 'react';
import { Tv, Coffee, WashingMachine, Refrigerator, PlayCircle, PauseCircle, Power } from 'lucide-react';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';

interface Appliance {
  id: string;
  name: string;
  type: string;
  on: boolean;
  status: string;
  progress?: number;
  icon: any;
}

export function Appliances() {
  const [appliances, setAppliances] = useState<Appliance[]>([
    { id: '1', name: 'Living Room TV', type: 'Entertainment', on: true, status: 'Playing Netflix', icon: Tv },
    { id: '2', name: 'Coffee Maker', type: 'Kitchen', on: false, status: 'Ready', icon: Coffee },
    { id: '3', name: 'Washing Machine', type: 'Laundry', on: true, status: 'Running', progress: 65, icon: WashingMachine },
    { id: '4', name: 'Dishwasher', type: 'Kitchen', on: true, status: 'Washing', progress: 45, icon: WashingMachine },
    { id: '5', name: 'Refrigerator', type: 'Kitchen', on: true, status: 'Normal', icon: Refrigerator },
    { id: '6', name: 'Bedroom TV', type: 'Entertainment', on: false, status: 'Off', icon: Tv },
  ]);

  const [volume, setVolume] = useState(45);
  const [fridgeTemp, setFridgeTemp] = useState(4);

  const toggleAppliance = (id: string) => {
    setAppliances(appliances.map(app => 
      app.id === id ? { ...app, on: !app.on, status: !app.on ? 'On' : 'Off' } : app
    ));
  };

  const turnAllOff = () => {
    setAppliances(appliances.map(app => ({ ...app, on: false, status: 'Off' })));
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl mb-2 flex items-center gap-3">
              <Tv className="w-8 h-8 text-purple-500" />
              Appliances
            </h2>
            <p className="text-gray-500">Control all your smart appliances</p>
          </div>
          <Button onClick={turnAllOff} variant="outline">
            <Power className="w-4 h-4 mr-2" />
            Turn All Off
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
          <p className="text-sm text-gray-600 mb-1">Active Appliances</p>
          <p className="text-3xl font-semibold">
            {appliances.filter(a => a.on).length}/{appliances.length}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
          <p className="text-sm text-gray-600 mb-1">Currently Running</p>
          <p className="text-3xl font-semibold">
            {appliances.filter(a => a.progress !== undefined && a.on).length}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
          <p className="text-sm text-gray-600 mb-1">Energy Efficient</p>
          <p className="text-3xl font-semibold">85%</p>
        </Card>
      </div>

      {/* Appliances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {appliances.map(appliance => {
          const Icon = appliance.icon;
          return (
            <Card key={appliance.id} className={`p-6 ${appliance.on ? 'ring-2 ring-purple-400' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full ${appliance.on ? 'bg-purple-100' : 'bg-gray-100'}`}>
                    <Icon className={`w-6 h-6 ${appliance.on ? 'text-purple-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold">{appliance.name}</h4>
                    <p className="text-sm text-gray-500">{appliance.type}</p>
                  </div>
                </div>
                <Switch 
                  checked={appliance.on}
                  onCheckedChange={() => toggleAppliance(appliance.id)}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium ${appliance.on ? 'text-green-600' : 'text-gray-400'}`}>
                    {appliance.status}
                  </span>
                </div>

                {appliance.progress !== undefined && appliance.on && (
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{appliance.progress}%</span>
                    </div>
                    <Progress value={appliance.progress} className="h-2" />
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Detailed Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Tv className="w-6 h-6 text-purple-600" />
            Living Room TV
          </h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Button variant="outline" size="lg" className="flex-1">
                <PlayCircle className="w-5 h-5 mr-2" />
                Play
              </Button>
              <Button variant="outline" size="lg" className="flex-1">
                <PauseCircle className="w-5 h-5 mr-2" />
                Pause
              </Button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Volume</span>
                <span className="text-sm font-semibold">{volume}%</span>
              </div>
              <Slider
                value={[volume]}
                onValueChange={(vals) => setVolume(vals[0])}
                min={0}
                max={100}
                step={1}
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Now Playing</p>
              <p className="text-sm text-gray-600">Netflix - Stranger Things</p>
              <p className="text-xs text-gray-400 mt-1">Season 4, Episode 3</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Refrigerator className="w-6 h-6 text-blue-600" />
            Smart Refrigerator
          </h3>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Temperature</span>
                <span className="text-lg font-semibold">{fridgeTemp}°C</span>
              </div>
              <Slider
                value={[fridgeTemp]}
                onValueChange={(vals) => setFridgeTemp(vals[0])}
                min={1}
                max={7}
                step={1}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Coldest</span>
                <span>Warmest</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Door Status</p>
                <p className="font-semibold text-green-600">Closed</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Ice Maker</p>
                <p className="font-semibold text-blue-600">Active</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Filter Status</p>
                <p className="font-semibold text-yellow-600">Replace Soon</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Energy Mode</p>
                <p className="font-semibold text-green-600">Eco</p>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              View Inventory
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
