import { useState } from 'react';
import { 
  Lightbulb, 
  Thermometer, 
  Shield, 
  Zap, 
  Home,
  Lock,
  Unlock,
  Camera,
  Wind,
  Sun,
  Moon
} from 'lucide-react';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';

export function Dashboard() {
  const [isLocked, setIsLocked] = useState(true);
  const [temperature, setTemperature] = useState(22);
  const [lightsOn, setLightsOn] = useState(6);

  const quickStats = [
    { 
      label: 'Active Lights', 
      value: `${lightsOn}/12`, 
      icon: Lightbulb, 
      color: 'text-yellow-500',
      bg: 'bg-yellow-50'
    },
    { 
      label: 'Temperature', 
      value: `${temperature}°C`, 
      icon: Thermometer, 
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    { 
      label: 'Security', 
      value: isLocked ? 'Locked' : 'Unlocked', 
      icon: Shield, 
      color: 'text-green-500',
      bg: 'bg-green-50'
    },
    { 
      label: 'Energy Usage', 
      value: '2.4 kW', 
      icon: Zap, 
      color: 'text-purple-500',
      bg: 'bg-purple-50'
    },
  ];

  const rooms = [
    { name: 'Living Room', temp: 22, lights: 3, occupied: true },
    { name: 'Bedroom', temp: 20, lights: 1, occupied: false },
    { name: 'Kitchen', temp: 23, lights: 2, occupied: true },
    { name: 'Bathroom', temp: 24, lights: 0, occupied: false },
  ];

  const [time] = useState(new Date());
  const hour = time.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const TimeIcon = hour < 6 || hour >= 20 ? Moon : Sun;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <TimeIcon className="w-8 h-8 text-indigo-600" />
          <h2 className="text-3xl">{greeting}</h2>
        </div>
        <p className="text-gray-500">Welcome back to YOLO Home</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-full`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-xl mb-4 flex items-center gap-2">
            <Home className="w-5 h-5 text-indigo-600" />
            Quick Controls
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {isLocked ? (
                  <Lock className="w-5 h-5 text-green-600" />
                ) : (
                  <Unlock className="w-5 h-5 text-red-600" />
                )}
                <span>Front Door Lock</span>
              </div>
              <Switch 
                checked={isLocked} 
                onCheckedChange={setIsLocked}
              />
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Thermometer className="w-5 h-5 text-blue-600" />
                  <span>Temperature</span>
                </div>
                <span className="font-semibold">{temperature}°C</span>
              </div>
              <Slider 
                value={[temperature]} 
                onValueChange={(vals) => setTemperature(vals[0])}
                min={16}
                max={30}
                step={1}
                className="mt-2"
              />
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Wind className="w-5 h-5 text-cyan-600" />
                  <span>Air Quality</span>
                </div>
                <span className="text-green-600 font-medium">Good</span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-green-500 h-2 rounded"></div>
                <div className="flex-1 bg-green-500 h-2 rounded"></div>
                <div className="flex-1 bg-green-500 h-2 rounded"></div>
                <div className="flex-1 bg-gray-300 h-2 rounded"></div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-600" />
            Security Status
          </h3>
          <div className="space-y-3">
            {['Front Door', 'Back Door', 'Garage', 'Living Room'].map((location) => (
              <div key={location} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>{location}</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600">Active</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Rooms Overview */}
      <Card className="p-6">
        <h3 className="text-xl mb-4 flex items-center gap-2">
          <DoorOpen className="w-5 h-5 text-indigo-600" />
          Rooms Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rooms.map((room) => (
            <div 
              key={room.name} 
              className={`p-4 rounded-lg border-2 ${
                room.occupied ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200 bg-white'
              }`}
            >
              <h4 className="font-semibold mb-3">{room.name}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Temperature</span>
                  <span className="font-medium">{room.temp}°C</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Lights On</span>
                  <span className="font-medium">{room.lights}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium ${room.occupied ? 'text-green-600' : 'text-gray-400'}`}>
                    {room.occupied ? 'Occupied' : 'Empty'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function DoorOpen(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>;
}
