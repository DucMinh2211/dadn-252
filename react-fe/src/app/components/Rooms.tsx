import { useState } from 'react';
import { Home, Lightbulb, Thermometer, Lock, Tv, Users } from 'lucide-react';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Room {
  id: string;
  name: string;
  icon: any;
  occupied: boolean;
  temperature: number;
  lights: number;
  lightsTotal: number;
  devices: string[];
  locked: boolean;
}

export function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: '1',
      name: 'Living Room',
      icon: Home,
      occupied: true,
      temperature: 22,
      lights: 3,
      lightsTotal: 4,
      devices: ['TV', 'Sound System', 'Air Purifier'],
      locked: false,
    },
    {
      id: '2',
      name: 'Master Bedroom',
      icon: Home,
      occupied: false,
      temperature: 20,
      lights: 1,
      lightsTotal: 3,
      devices: ['TV', 'Ceiling Fan'],
      locked: true,
    },
    {
      id: '3',
      name: 'Kitchen',
      icon: Home,
      occupied: true,
      temperature: 23,
      lights: 2,
      lightsTotal: 3,
      devices: ['Refrigerator', 'Coffee Maker', 'Dishwasher'],
      locked: false,
    },
    {
      id: '4',
      name: 'Bathroom',
      icon: Home,
      occupied: false,
      temperature: 24,
      lights: 0,
      lightsTotal: 2,
      devices: ['Exhaust Fan'],
      locked: false,
    },
    {
      id: '5',
      name: 'Office',
      icon: Home,
      occupied: true,
      temperature: 21,
      lights: 2,
      lightsTotal: 2,
      devices: ['Computer', 'Desk Lamp', 'Air Conditioner'],
      locked: true,
    },
    {
      id: '6',
      name: 'Guest Room',
      icon: Home,
      occupied: false,
      temperature: 19,
      lights: 0,
      lightsTotal: 2,
      devices: ['TV'],
      locked: true,
    },
  ]);

  const [selectedRoom, setSelectedRoom] = useState(rooms[0]);

  const updateRoom = (id: string, updates: Partial<Room>) => {
    setRooms(rooms.map(room => {
      if (room.id === id) {
        const updated = { ...room, ...updates };
        if (room.id === selectedRoom.id) {
          setSelectedRoom(updated);
        }
        return updated;
      }
      return room;
    }));
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl mb-2 flex items-center gap-3">
          <Home className="w-8 h-8 text-indigo-500" />
          Rooms
        </h2>
        <p className="text-gray-500">Control each room individually</p>
      </div>

      {/* Room Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Rooms</p>
              <p className="text-2xl font-semibold">{rooms.length}</p>
            </div>
            <Home className="w-10 h-10 text-indigo-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Occupied</p>
              <p className="text-2xl font-semibold">
                {rooms.filter(r => r.occupied).length}
              </p>
            </div>
            <Users className="w-10 h-10 text-green-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Temperature</p>
              <p className="text-2xl font-semibold">
                {(rooms.reduce((acc, r) => acc + r.temperature, 0) / rooms.length).toFixed(1)}°C
              </p>
            </div>
            <Thermometer className="w-10 h-10 text-blue-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room List */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Select Room</h3>
            <div className="space-y-2">
              {rooms.map(room => {
                const Icon = room.icon;
                return (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      selectedRoom.id === room.id
                        ? 'bg-indigo-100 ring-2 ring-indigo-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-indigo-600" />
                        <div>
                          <h4 className="font-medium">{room.name}</h4>
                          <p className="text-xs text-gray-500">
                            {room.lights}/{room.lightsTotal} lights on
                          </p>
                        </div>
                      </div>
                      {room.occupied && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Room Details */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-semibold">{selectedRoom.name}</h3>
                <p className="text-sm text-gray-500">
                  {selectedRoom.occupied ? 'Occupied' : 'Empty'} • {selectedRoom.devices.length} devices
                </p>
              </div>
              <div className={`px-4 py-2 rounded-full ${
                selectedRoom.occupied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {selectedRoom.occupied ? 'Active' : 'Inactive'}
              </div>
            </div>

            <Tabs defaultValue="climate" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="climate">Climate</TabsTrigger>
                <TabsTrigger value="lighting">Lighting</TabsTrigger>
                <TabsTrigger value="devices">Devices</TabsTrigger>
              </TabsList>

              <TabsContent value="climate" className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Thermometer className="w-6 h-6 text-blue-600" />
                      <span className="font-semibold">Temperature</span>
                    </div>
                    <span className="text-3xl font-bold">{selectedRoom.temperature}°C</span>
                  </div>
                  <Slider
                    value={[selectedRoom.temperature]}
                    onValueChange={(vals) => updateRoom(selectedRoom.id, { temperature: vals[0] })}
                    min={16}
                    max={30}
                    step={0.5}
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>16°C</span>
                    <span>30°C</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Humidity</p>
                    <p className="text-xl font-semibold">45%</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Air Quality</p>
                    <p className="text-xl font-semibold text-green-600">Good</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="lighting" className="space-y-4">
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Lightbulb className="w-6 h-6 text-yellow-600" />
                      <span className="font-semibold">Active Lights</span>
                    </div>
                    <span className="text-3xl font-bold">
                      {selectedRoom.lights}/{selectedRoom.lightsTotal}
                    </span>
                  </div>
                  <Slider
                    value={[selectedRoom.lights]}
                    onValueChange={(vals) => updateRoom(selectedRoom.id, { lights: vals[0] })}
                    min={0}
                    max={selectedRoom.lightsTotal}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>All Off</span>
                    <span>All On</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Brightness</p>
                    <p className="text-xl font-semibold">75%</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Color</p>
                    <div className="flex gap-2 mt-1">
                      <div className="w-6 h-6 bg-white rounded-full border-2 border-gray-300"></div>
                      <div className="w-6 h-6 bg-yellow-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="devices" className="space-y-3">
                {selectedRoom.devices.map((device, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Tv className="w-5 h-5 text-indigo-600" />
                      <span className="font-medium">{device}</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Door Lock</span>
                  </div>
                  <Switch 
                    checked={selectedRoom.locked}
                    onCheckedChange={(checked) => updateRoom(selectedRoom.id, { locked: checked })}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
