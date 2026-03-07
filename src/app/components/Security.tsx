import { useState } from 'react';
import { Shield, Camera, Lock, Unlock, Bell, AlertTriangle, Eye } from 'lucide-react';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface SecurityDevice {
  id: string;
  name: string;
  type: 'camera' | 'lock' | 'sensor';
  location: string;
  status: 'active' | 'inactive' | 'alert';
  lastActivity: string;
}

interface SecurityEvent {
  id: string;
  type: 'motion' | 'door' | 'alert';
  message: string;
  time: string;
  severity: 'low' | 'medium' | 'high';
}

export function Security() {
  const [armed, setArmed] = useState(true);
  const [devices] = useState<SecurityDevice[]>([
    { id: '1', name: 'Front Door Camera', type: 'camera', location: 'Front Door', status: 'active', lastActivity: '2 min ago' },
    { id: '2', name: 'Back Door Camera', type: 'camera', location: 'Back Door', status: 'active', lastActivity: '5 min ago' },
    { id: '3', name: 'Garage Camera', type: 'camera', location: 'Garage', status: 'active', lastActivity: '1 min ago' },
    { id: '4', name: 'Living Room Camera', type: 'camera', location: 'Living Room', status: 'active', lastActivity: '3 min ago' },
    { id: '5', name: 'Front Door Lock', type: 'lock', location: 'Front Door', status: 'active', lastActivity: '10 min ago' },
    { id: '6', name: 'Back Door Lock', type: 'lock', location: 'Back Door', status: 'active', lastActivity: '1 hour ago' },
    { id: '7', name: 'Window Sensor', type: 'sensor', location: 'Living Room', status: 'active', lastActivity: 'Just now' },
    { id: '8', name: 'Motion Sensor', type: 'sensor', location: 'Hallway', status: 'active', lastActivity: '30 sec ago' },
  ]);

  const [events] = useState<SecurityEvent[]>([
    { id: '1', type: 'motion', message: 'Motion detected in hallway', time: '2 min ago', severity: 'low' },
    { id: '2', type: 'door', message: 'Front door unlocked', time: '10 min ago', severity: 'medium' },
    { id: '3', type: 'motion', message: 'Motion detected at front door', time: '15 min ago', severity: 'low' },
    { id: '4', type: 'alert', message: 'Camera offline: Garage', time: '1 hour ago', severity: 'high' },
    { id: '5', type: 'door', message: 'Back door locked', time: '2 hours ago', severity: 'low' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'inactive': return 'text-gray-600 bg-gray-50';
      case 'alert': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-600 bg-blue-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'camera': return Camera;
      case 'lock': return Lock;
      case 'sensor': return Eye;
      default: return Shield;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl mb-2 flex items-center gap-3">
          <Shield className="w-8 h-8 text-green-500" />
          Security System
        </h2>
        <p className="text-gray-500">Monitor and control your home security</p>
      </div>

      {/* Security Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className={`p-6 ${armed ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-gradient-to-br from-orange-50 to-red-50'}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">System Status</p>
              <p className="text-2xl font-semibold">{armed ? 'Armed' : 'Disarmed'}</p>
            </div>
            <div className={`p-3 rounded-full ${armed ? 'bg-green-100' : 'bg-orange-100'}`}>
              {armed ? (
                <Lock className="w-6 h-6 text-green-600" />
              ) : (
                <Unlock className="w-6 h-6 text-orange-600" />
              )}
            </div>
          </div>
          <Switch 
            checked={armed}
            onCheckedChange={setArmed}
          />
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Cameras</p>
              <p className="text-2xl font-semibold">
                {devices.filter(d => d.type === 'camera' && d.status === 'active').length}/
                {devices.filter(d => d.type === 'camera').length}
              </p>
            </div>
            <Camera className="w-10 h-10 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Recent Events</p>
              <p className="text-2xl font-semibold">{events.length}</p>
            </div>
            <Bell className="w-10 h-10 text-purple-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Devices */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Security Devices</h3>
          <div className="space-y-3">
            {devices.map(device => {
              const DeviceIcon = getDeviceIcon(device.type);
              return (
                <Card key={device.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 rounded-lg">
                        <DeviceIcon className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{device.name}</h4>
                        <p className="text-sm text-gray-500">{device.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(device.status)}>
                        {device.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{device.lastActivity}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <Card className="p-4">
            <div className="space-y-4">
              {events.map(event => (
                <div key={event.id} className="flex items-start gap-3 pb-4 border-b last:border-b-0 last:pb-0">
                  <div className={`p-2 rounded-lg ${getSeverityColor(event.severity)}`}>
                    {event.type === 'alert' && <AlertTriangle className="w-4 h-4" />}
                    {event.type === 'motion' && <Eye className="w-4 h-4" />}
                    {event.type === 'door' && <Lock className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{event.message}</p>
                    <p className="text-sm text-gray-500">{event.time}</p>
                  </div>
                  <Badge className={getSeverityColor(event.severity)}>
                    {event.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20">
                <div className="text-center">
                  <Lock className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-sm">Lock All</span>
                </div>
              </Button>
              <Button variant="outline" className="h-20">
                <div className="text-center">
                  <Camera className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-sm">View Cameras</span>
                </div>
              </Button>
              <Button variant="outline" className="h-20">
                <div className="text-center">
                  <Bell className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-sm">Notifications</span>
                </div>
              </Button>
              <Button variant="outline" className="h-20">
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-sm">Arm System</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
