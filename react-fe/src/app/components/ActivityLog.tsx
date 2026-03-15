import { useState } from 'react';
import { FileText, Lightbulb, Wind, Thermometer, DoorOpen, Filter, Download, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface DeviceLog {
  id: string;
  device: string;
  deviceType: 'light' | 'fan' | 'ac' | 'door';
  action: 'on' | 'off' | 'opened' | 'closed' | 'adjusted';
  user: string;
  time: string;
  date: string;
  details?: string;
}

export function ActivityLog() {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('today');

  const [logs, setLogs] = useState<DeviceLog[]>([
    {
      id: '1',
      device: 'Đèn phòng khách',
      deviceType: 'light',
      action: 'on',
      user: 'Admin User',
      time: '20:15',
      date: 'Hôm nay',
    },
    {
      id: '2',
      device: 'Quạt phòng ngủ',
      deviceType: 'fan',
      action: 'on',
      user: 'John Doe',
      time: '19:30',
      date: 'Hôm nay',
      details: 'Tốc độ: Mức 3',
    },
    {
      id: '3',
      device: 'Đèn bếp',
      deviceType: 'light',
      action: 'off',
      user: 'Tự động',
      time: '18:45',
      date: 'Hôm nay',
    },
    {
      id: '4',
      device: 'Cửa chính',
      deviceType: 'door',
      action: 'opened',
      user: 'Jane Smith',
      time: '18:30',
      date: 'Hôm nay',
      details: 'Mở bằng FaceID',
    },
    {
      id: '5',
      device: 'Điều hòa phòng khách',
      deviceType: 'ac',
      action: 'adjusted',
      user: 'Admin User',
      time: '17:20',
      date: 'Hôm nay',
      details: 'Nhiệt độ: 24°C',
    },
    {
      id: '6',
      device: 'Đèn phòng khách',
      deviceType: 'light',
      action: 'off',
      user: 'Admin User',
      time: '23:45',
      date: 'Hôm qua',
    },
    {
      id: '7',
      device: 'Quạt phòng khách',
      deviceType: 'fan',
      action: 'off',
      user: 'Tự động',
      time: '23:30',
      date: 'Hôm qua',
      details: 'Tự động tắt khi nhiệt độ < 25°C',
    },
    {
      id: '8',
      device: 'Cửa chính',
      deviceType: 'door',
      action: 'opened',
      user: 'John Doe',
      time: '22:15',
      date: 'Hôm qua',
      details: 'Mở thủ công qua App',
    },
    {
      id: '9',
      device: 'Đèn phòng ngủ',
      deviceType: 'light',
      action: 'on',
      user: 'Tự động',
      time: '19:15',
      date: 'Hôm qua',
      details: 'Tự động bật khi phát hiện chuyển động',
    },
    {
      id: '10',
      device: 'Quạt bếp',
      deviceType: 'fan',
      action: 'on',
      user: 'Jane Smith',
      time: '12:30',
      date: '2 ngày trước',
      details: 'Tốc độ: Mức 2',
    },
  ]);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'light': return <Lightbulb className="w-5 h-5" />;
      case 'fan': return <Wind className="w-5 h-5" />;
      case 'ac': return <Thermometer className="w-5 h-5" />;
      case 'door': return <DoorOpen className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'on': return 'bg-green-500';
      case 'off': return 'bg-gray-500';
      case 'opened': return 'bg-blue-500';
      case 'closed': return 'bg-red-500';
      case 'adjusted': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'on': return 'Bật';
      case 'off': return 'Tắt';
      case 'opened': return 'Mở';
      case 'closed': return 'Đóng';
      case 'adjusted': return 'Điều chỉnh';
      default: return action;
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filterType !== 'all' && log.deviceType !== filterType) return false;
    if (filterDate !== 'all' && log.date !== filterDate) return false;
    return true;
  });

  const deviceCounts = {
    light: logs.filter(l => l.deviceType === 'light').length,
    fan: logs.filter(l => l.deviceType === 'fan').length,
    ac: logs.filter(l => l.deviceType === 'ac').length,
    door: logs.filter(l => l.deviceType === 'door').length,
  };

  const todayLogs = logs.filter(l => l.date === 'Hôm nay').length;
  const autoLogs = logs.filter(l => l.user === 'Tự động').length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl mb-2 flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-500" />
          Nhật Ký Hoạt Động
        </h2>
        <p className="text-gray-500">Xem lịch sử hoạt động của tất cả thiết bị</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Hoạt động hôm nay</p>
              <p className="text-2xl font-semibold">{todayLogs}</p>
            </div>
            <FileText className="w-10 h-10 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng hoạt động</p>
              <p className="text-2xl font-semibold">{logs.length}</p>
            </div>
            <Calendar className="w-10 h-10 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tự động hóa</p>
              <p className="text-2xl font-semibold">{autoLogs}</p>
            </div>
            <Thermometer className="w-10 h-10 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Thiết bị</p>
              <p className="text-2xl font-semibold">
                {Object.keys(deviceCounts).length}
              </p>
            </div>
            <Lightbulb className="w-10 h-10 text-yellow-500" />
          </div>
        </Card>
      </div>

      {/* Device Type Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">Đèn</span>
            </div>
            <Badge>{deviceCounts.light}</Badge>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Quạt</span>
            </div>
            <Badge>{deviceCounts.fan}</Badge>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-red-500" />
              <span className="font-medium">Điều hòa</span>
            </div>
            <Badge>{deviceCounts.ac}</Badge>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DoorOpen className="w-5 h-5 text-green-500" />
              <span className="font-medium">Cửa</span>
            </div>
            <Badge>{deviceCounts.door}</Badge>
          </div>
        </Card>
      </div>

      {/* Filters & Export */}
      <Card className="p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Bộ lọc:</span>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Loại thiết bị" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="light">Đèn</SelectItem>
                <SelectItem value="fan">Quạt</SelectItem>
                <SelectItem value="ac">Điều hòa</SelectItem>
                <SelectItem value="door">Cửa</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterDate} onValueChange={setFilterDate}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Hôm nay">Hôm nay</SelectItem>
                <SelectItem value="Hôm qua">Hôm qua</SelectItem>
                <SelectItem value="2 ngày trước">2 ngày trước</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </Card>

      {/* Activity Logs */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6">
          Nhật ký ({filteredLogs.length})
        </h3>

        <Tabs defaultValue="list">
          <TabsList className="mb-6">
            <TabsTrigger value="list">Danh sách</TabsTrigger>
            <TabsTrigger value="timeline">Theo thời gian</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-3">
            {filteredLogs.map(log => (
              <div 
                key={log.id}
                className="p-4 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActionColor(log.action)} text-white`}>
                      {getDeviceIcon(log.deviceType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{log.device}</h4>
                        <Badge className={getActionColor(log.action) + ' text-white'}>
                          {getActionText(log.action)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Bởi: <span className="font-medium">{log.user}</span>
                      </p>
                      {log.details && (
                        <p className="text-sm text-gray-500">{log.details}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium">{log.time}</p>
                    <p className="text-gray-500">{log.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            {['Hôm nay', 'Hôm qua', '2 ngày trước'].map(dateGroup => {
              const groupLogs = filteredLogs.filter(l => l.date === dateGroup);
              if (groupLogs.length === 0) return null;

              return (
                <div key={dateGroup}>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    {dateGroup}
                  </h4>
                  <div className="space-y-3 pl-6 border-l-2 border-gray-200">
                    {groupLogs.map(log => (
                      <div 
                        key={log.id}
                        className="p-4 rounded-lg border bg-white ml-4 relative before:absolute before:left-[-30px] before:top-[20px] before:w-4 before:h-4 before:bg-blue-500 before:rounded-full before:border-4 before:border-white"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActionColor(log.action)} text-white`}>
                              {getDeviceIcon(log.deviceType)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{log.device}</h4>
                                <Badge className={getActionColor(log.action) + ' text-white'}>
                                  {getActionText(log.action)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">
                                Bởi: <span className="font-medium">{log.user}</span>
                              </p>
                              {log.details && (
                                <p className="text-sm text-gray-500">{log.details}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            <p className="font-medium">{log.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
