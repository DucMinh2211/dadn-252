import { FileText, Lightbulb, Wind, Thermometer, DoorOpen, Filter, Download, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState, useEffect } from 'react';

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
  const [filterDate, setFilterDate] = useState<string>('all');
  const [logs, setLogs] = useState<DeviceLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/logs');
        const result = await response.json();
        
        if (result.status === 'success') {
          const formattedLogs: DeviceLog[] = result.data.map((item: any, index: number) => {
            const dateObj = new Date(item.created_at);
            const timeStr = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
            
            // TÍNH TOÁN NGÀY ĐỂ FILTER CHÍNH XÁC
            const now = new Date();
            const diffTime = now.getTime() - dateObj.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            let dateStr = 'Cũ hơn';
            if (diffDays === 0 && now.getDate() === dateObj.getDate()) dateStr = 'Hôm nay';
            else if (diffDays <= 1) dateStr = 'Hôm qua';
            else if (diffDays <= 2) dateStr = '2 ngày trước';
            else dateStr = dateObj.toLocaleDateString('vi-VN');

            // ÁNH XẠ THIẾT BỊ THỰC TẾ CỦA NHÓM
            let deviceName = item.feed_name;
            let type: 'light' | 'fan' | 'ac' | 'door' = 'light';
            let actionType: any = 'on';

            const val = String(item.action_value);

            if (item.feed_name === 'bbc-led1') {
              deviceName = 'Đèn Outside'; 
              type = 'light';
              actionType = (val === '0') ? 'off' : 'on';
            } else if (item.feed_name === 'bbc-led2') {
              deviceName = 'Đèn Main'; 
              type = 'light';
              actionType = (val === '0') ? 'off' : 'on';
            } else if (item.feed_name === 'bbc-fan') {
              deviceName = 'Quạt làm mát'; 
              type = 'fan';
              actionType = (val === '0') ? 'off' : 'on';
            } else if (item.feed_name === 'bbc-door') {
              deviceName = 'Cửa thông minh'; 
              type = 'door';
              actionType = (val === '0') ? 'closed' : 'opened';
            }

            return {
              id: index.toString(),
              device: deviceName,
              deviceType: type,
              action: actionType,
              user: 'Hệ thống/Tự động', 
              time: timeStr,
              date: dateStr,
            };
          });

          setLogs(formattedLogs);
        }
      } catch (error) {
        console.error('Lỗi lấy log từ Backend:', error);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

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
      default: return 'bg-orange-500';
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'on': return 'Bật';
      case 'off': return 'Tắt';
      case 'opened': return 'Mở';
      case 'closed': return 'Đóng';
      default: return action;
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filterType !== 'all' && log.deviceType !== filterType) return false;
    if (filterDate !== 'all' && log.date !== filterDate) return false;
    return true;
  });

  // CẬP NHẬT THỐNG KÊ
  const deviceCounts = {
    light: logs.filter(l => l.deviceType === 'light').length,
    fan: logs.filter(l => l.deviceType === 'fan').length,
    door: logs.filter(l => l.deviceType === 'door').length,
  };

  const todayLogsCount = logs.filter(l => l.date === 'Hôm nay').length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl mb-2 flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-500" />
          Nhật Ký Hoạt Động
        </h2>
        <p className="text-gray-500">Xem lịch sử hoạt động của tất cả thiết bị</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Hoạt động hôm nay</p>
              <p className="text-2xl font-semibold">{todayLogsCount}</p>
            </div>
            <FileText className="w-10 h-10 text-blue-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng lịch sử</p>
              <p className="text-2xl font-semibold">{logs.length}</p>
            </div>
            <Calendar className="w-10 h-10 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Thiết bị kết nối</p>
              <p className="text-2xl font-semibold">4</p>
            </div>
            <Lightbulb className="w-10 h-10 text-yellow-500" />
          </div>
        </Card>
      </div>

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
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6">Nhật ký ({filteredLogs.length})</h3>
        <Tabs defaultValue="list">
          <TabsList className="mb-6">
            <TabsTrigger value="list">Danh sách</TabsTrigger>
            <TabsTrigger value="timeline">Theo thời gian</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-3">
            {filteredLogs.map(log => (
              <div key={log.id} className="p-4 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActionColor(log.action)} text-white`}>
                      {getDeviceIcon(log.deviceType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{log.device}</h4>
                        <Badge className={getActionColor(log.action) + ' text-white'}>{getActionText(log.action)}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Bởi: <span className="font-medium">{log.user}</span></p>
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
                    <Calendar className="w-5 h-5 text-blue-500" /> {dateGroup}
                  </h4>
                  <div className="space-y-3 pl-6 border-l-2 border-gray-200">
                    {groupLogs.map(log => (
                      <div key={log.id} className="p-4 rounded-lg border bg-white ml-4 relative before:absolute before:left-[-30px] before:top-[20px] before:w-4 before:h-4 before:bg-blue-500 before:rounded-full before:border-4 before:border-white">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActionColor(log.action)} text-white`}>
                              {getDeviceIcon(log.deviceType)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{log.device}</h4>
                                <Badge className={getActionColor(log.action) + ' text-white'}>{getActionText(log.action)}</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">Bởi: <span className="font-medium">{log.user}</span></p>
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