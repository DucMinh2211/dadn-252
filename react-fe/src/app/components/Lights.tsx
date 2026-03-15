import { useState } from 'react';
import { Lightbulb, Power, Sun, Plus, Trash2, Edit } from 'lucide-react';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Light {
  id: string;
  name: string;
  room: string;
  on: boolean;
  brightness: number;
}

export function Lights() {
  const [lights, setLights] = useState<Light[]>([
    { id: '1', name: 'Ceiling Light', room: 'Living Room', on: true, brightness: 80 },
    { id: '2', name: 'Reading Lamp', room: 'Living Room', on: true, brightness: 60 },
    { id: '3', name: 'Main Light', room: 'Bedroom', on: false, brightness: 100 },
    { id: '4', name: 'Bedside Lamp', room: 'Bedroom', on: true, brightness: 40 },
    { id: '5', name: 'Kitchen Light', room: 'Kitchen', on: true, brightness: 90 },
    { id: '6', name: 'Under Cabinet', room: 'Kitchen', on: true, brightness: 70 },
    { id: '7', name: 'Mirror Light', room: 'Bathroom', on: false, brightness: 100 },
    { id: '8', name: 'Shower Light', room: 'Bathroom', on: false, brightness: 80 },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingLight, setEditingLight] = useState<Light | null>(null);
  const [newLight, setNewLight] = useState({
    name: '',
    room: 'Living Room',
  });

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

  const turnAllOff = () => {
    setLights(lights.map(light => ({ ...light, on: false })));
  };

  const turnAllOn = () => {
    setLights(lights.map(light => ({ ...light, on: true })));
  };

  const handleAddLight = () => {
    const light: Light = {
      id: String(Date.now()),
      name: newLight.name,
      room: newLight.room,
      on: false,
      brightness: 100,
    };
    setLights([...lights, light]);
    setNewLight({ name: '', room: 'Living Room' });
    setIsAddDialogOpen(false);
  };

  const handleDeleteLight = (id: string) => {
    setLights(lights.filter(l => l.id !== id));
  };

  const handleEditLight = (light: Light) => {
    setEditingLight(light);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingLight) {
      setLights(lights.map(l => 
        l.id === editingLight.id ? editingLight : l
      ));
      setIsEditDialogOpen(false);
      setEditingLight(null);
    }
  };

  const rooms = Array.from(new Set(lights.map(l => l.room)));
  const availableRooms = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Dining Room', 'Office', 'Garage', 'Hallway'];

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
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Light
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Light</DialogTitle>
                  <DialogDescription>
                    Add a new light to your smart home system.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="light-name">Light Name</Label>
                    <Input
                      id="light-name"
                      value={newLight.name}
                      onChange={(e) => setNewLight({ ...newLight, name: e.target.value })}
                      placeholder="e.g., Floor Lamp"
                    />
                  </div>
                  <div>
                    <Label htmlFor="light-room">Room</Label>
                    <Select 
                      value={newLight.room} 
                      onValueChange={(value) => setNewLight({ ...newLight, room: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRooms.map(room => (
                          <SelectItem key={room} value={room}>{room}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddLight} className="w-full" disabled={!newLight.name}>
                    Add Light
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Light</DialogTitle>
            <DialogDescription>
              Edit the details of the selected light.
            </DialogDescription>
          </DialogHeader>
          {editingLight && (
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="edit-light-name">Light Name</Label>
                <Input
                  id="edit-light-name"
                  value={editingLight.name}
                  onChange={(e) => setEditingLight({ ...editingLight, name: e.target.value })}
                  placeholder="e.g., Floor Lamp"
                />
              </div>
              <div>
                <Label htmlFor="edit-light-room">Room</Label>
                <Select 
                  value={editingLight.room} 
                  onValueChange={(value) => setEditingLight({ ...editingLight, room: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRooms.map(room => (
                      <SelectItem key={room} value={room}>{room}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSaveEdit} className="w-full">
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Lights by Room */}
      {rooms.length === 0 ? (
        <Card className="p-12 text-center">
          <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No lights added yet</h3>
          <p className="text-gray-500 mb-4">Click "Add Light" to get started</p>
        </Card>
      ) : (
        rooms.map(room => (
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
                          backgroundColor: light.on ? '#fbbf24' : '#e5e7eb',
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
                  )}

                  <div className="flex gap-2 pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEditLight(light)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteLight(light.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}