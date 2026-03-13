import { useState } from 'react';
import { Camera, AlertTriangle, Bell, User, Clock, MapPin, Shield, Activity } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface SecurityEvent {
  id: string;
  type: 'motion' | 'temperature' | 'door' | 'unknown';
  message: string;
  location: string;
  time: string;
  image?: string;
  severity: 'low' | 'medium' | 'high';
}

export function SecurityMonitoring() {
  const [awayMode, setAwayMode] = useState(false);
  const [motionDetection, setMotionDetection] = useState(true);
  const [temperatureAlert, setTemperatureAlert] = useState(true);

  const [events, setEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'motion',
      message: 'Phát hiện chuyển động lạ',
      location: 'Cửa trước',
      time: '22:15',
      severity: 'high',
    },
    {
      id: '2',
      type: 'door',
      message: 'Cửa được mở bởi John Doe',
      location: 'Cửa chính',
      time: '18:30',
      severity: 'low',
    },
    {
      id: '3',
      type: 'temperature',
      message: 'Nhiệt độ vượt ngưỡng 40°C',
      location: 'Phòng khách',
      time: '15:20',
      severity: 'high',
    },
    {
      id: '4',
      type: 'motion',
      message: 'Phát hiện chuyển động',
      location: 'Sân sau',
      time: '14:10',
      severity: 'medium',
    },
    {
      id: '5',
      type: 'unknown',
      message: 'Khuôn mặt không xác định',
      location: 'Cửa chính',
      time: '12:05',
      severity: 'high',
    },
  ]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'motion': return <Activity className="w-5 h-5" />;
      case 'temperature': return <AlertTriangle className="w-5 h-5" />;
      case 'door': return <Shield className="w-5 h-5" />;
      case 'unknown': return <User className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'low': return 'bg-green-100 border-green-300 text-green-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const highSeverityCount = events.filter(e => e.severity === 'high').length;
  const todayEvents = events.length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl mb-2 flex items-center gap-3">
          <Shield className="w-8 h-8 text-red-500" />
          Giám Sát An Ninh
        </h2>
        <p className="text-gray-500">Cảnh báo và giám sát an ninh thông minh</p>
      </div>

      {/* Security Mode Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${awayMode ? 'bg-red-500' : 'bg-gray-300'}`}>
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Chế độ vắng nhà</h3>
                <p className="text-sm text-gray-500">Bật giám sát tối đa</p>
              </div>
            </div>
            <Switch checked={awayMode} onCheckedChange={setAwayMode} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${motionDetection ? 'bg-blue-500' : 'bg-gray-300'}`}>
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Phát hiện chuyển động</h3>
                <p className="text-sm text-gray-500">Cảnh báo khi có di chuyển</p>
              </div>
            </div>
            <Switch checked={motionDetection} onCheckedChange={setMotionDetection} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${temperatureAlert ? 'bg-orange-500' : 'bg-gray-300'}`}>
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Cảnh báo nhiệt độ</h3>
                <p className="text-sm text-gray-500">Thông báo nhiệt độ cao</p>
              </div>
            </div>
            <Switch checked={temperatureAlert} onCheckedChange={setTemperatureAlert} />
          </div>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Sự kiện hôm nay</p>
              <p className="text-2xl font-semibold">{todayEvents}</p>
            </div>
            <Bell className="w-10 h-10 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Cảnh báo nghiêm trọng</p>
              <p className="text-2xl font-semibold text-red-600">{highSeverityCount}</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Camera hoạt động</p>
              <p className="text-2xl font-semibold">4/4</p>
            </div>
            <Camera className="w-10 h-10 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
              <Badge className={awayMode ? 'bg-red-500' : 'bg-green-500'}>
                {awayMode ? 'Vắng nhà' : 'Ở nhà'}
              </Badge>
            </div>
            <Shield className="w-10 h-10 text-indigo-500" />
          </div>
        </Card>
      </div>

      {/* Events List */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-500" />
          Nhật ký sự kiện
        </h3>

        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">Tất cả ({events.length})</TabsTrigger>
            <TabsTrigger value="high">Nghiêm trọng ({highSeverityCount})</TabsTrigger>
            <TabsTrigger value="motion">Chuyển động</TabsTrigger>
            <TabsTrigger value="temperature">Nhiệt độ</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {events.map(event => (
              <div 
                key={event.id}
                className={`p-4 rounded-lg border ${getSeverityColor(event.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getSeverityBadgeColor(event.severity)} text-white`}>
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{event.message}</h4>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge className={getSeverityBadgeColor(event.severity) + ' text-white'}>
                    {event.severity === 'high' ? 'Cao' : event.severity === 'medium' ? 'Trung bình' : 'Thấp'}
                  </Badge>
                </div>
                {event.type === 'motion' && (
                  <div className="mt-3 pl-13">
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Xem hình ảnh
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="high" className="space-y-4">
            {events.filter(e => e.severity === 'high').map(event => (
              <div 
                key={event.id}
                className={`p-4 rounded-lg border ${getSeverityColor(event.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getSeverityBadgeColor(event.severity)} text-white`}>
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{event.message}</h4>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="motion" className="space-y-4">
            {events.filter(e => e.type === 'motion').map(event => (
              <div 
                key={event.id}
                className={`p-4 rounded-lg border ${getSeverityColor(event.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getSeverityBadgeColor(event.severity)} text-white`}>
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{event.message}</h4>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pl-13">
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Xem hình ảnh
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="temperature" className="space-y-4">
            {events.filter(e => e.type === 'temperature').map(event => (
              <div 
                key={event.id}
                className={`p-4 rounded-lg border ${getSeverityColor(event.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getSeverityBadgeColor(event.severity)} text-white`}>
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{event.message}</h4>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
