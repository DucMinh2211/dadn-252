import { useState } from 'react';
import { Zap, Plus, Trash2, Edit, Clock, Lightbulb, Wind, Thermometer, Activity } from 'lucide-react';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

interface Automation {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
  description: string;
}

interface Schedule {
  id: string;
  device: string;
  deviceType: 'light' | 'fan' | 'ac';
  action: 'on' | 'off';
  time: string;
  days: string[];
  enabled: boolean;
}

export function Automation() {
  const [automations, setAutomations] = useState<Automation[]>([
    {
      id: '1',
      name: 'Bật đèn khi tối',
      trigger: 'Phát hiện chuyển động + thiếu sáng',
      action: 'Bật đèn phòng khách',
      enabled: true,
      description: 'Tự động bật đèn khi có người và trời tối',
    },
    {
      id: '2',
      name: 'Tự động làm mát',
      trigger: 'Nhiệt độ > 30°C',
      action: 'Bật quạt tối đa',
      enabled: true,
      description: 'Bật quạt khi nhiệt độ vượt ngưỡng',
    },
    {
      id: '3',
      name: 'Tắt quạt khi mát',
      trigger: 'Nhiệt độ < 25°C',
      action: 'Tắt quạt',
      enabled: true,
      description: 'Tắt quạt khi nhiệt độ giảm xuống',
    },
    {
      id: '4',
      name: 'Chế độ đi ngủ',
      trigger: '22:00 hàng ngày',
      action: 'Tắt tất cả đèn trừ đèn ngủ',
      enabled: false,
      description: 'Tự động tắt đèn vào giờ đi ngủ',
    },
  ]);

  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: '1',
      device: 'Đèn phòng khách',
      deviceType: 'light',
      action: 'on',
      time: '18:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      enabled: true,
    },
    {
      id: '2',
      device: 'Đèn phòng khách',
      deviceType: 'light',
      action: 'off',
      time: '23:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      enabled: true,
    },
    {
      id: '3',
      device: 'Quạt phòng ngủ',
      deviceType: 'fan',
      action: 'on',
      time: '22:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      enabled: true,
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);

  const toggleAutomation = (id: string) => {
    setAutomations(automations.map(a => 
      a.id === id ? { ...a, enabled: !a.enabled } : a
    ));
  };

  const toggleSchedule = (id: string) => {
    setSchedules(schedules.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const deleteAutomation = (id: string) => {
    setAutomations(automations.filter(a => a.id !== id));
  };

  const deleteSchedule = (id: string) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'light': return <Lightbulb className="w-5 h-5" />;
      case 'fan': return <Wind className="w-5 h-5" />;
      case 'ac': return <Thermometer className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl mb-2 flex items-center gap-3">
          <Zap className="w-8 h-8 text-purple-500" />
          Tự Động Hóa
        </h2>
        <p className="text-gray-500">Thiết lập quy tắc tự động và lịch hẹn giờ cho thiết bị</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Quy tắc tự động</p>
              <p className="text-2xl font-semibold">{automations.length}</p>
            </div>
            <Activity className="w-10 h-10 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Đang hoạt động</p>
              <p className="text-2xl font-semibold text-green-600">
                {automations.filter(a => a.enabled).length}
              </p>
            </div>
            <Zap className="w-10 h-10 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Lịch hẹn giờ</p>
              <p className="text-2xl font-semibold">{schedules.length}</p>
            </div>
            <Clock className="w-10 h-10 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Lịch kích hoạt</p>
              <p className="text-2xl font-semibold text-blue-600">
                {schedules.filter(s => s.enabled).length}
              </p>
            </div>
            <Clock className="w-10 h-10 text-indigo-500" />
          </div>
        </Card>
      </div>

      {/* Automation Rules */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-500" />
            Quy tắc tự động thông minh
          </h3>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Thêm quy tắc
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm quy tắc tự động</DialogTitle>
                <DialogDescription>
                  Tạo quy tắc tự động mới để điều khiển thiết bị thông minh.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="rule-name">Tên quy tắc</Label>
                  <Input
                    id="rule-name"
                    placeholder="VD: Bật đèn khi tối"
                  />
                </div>
                <div>
                  <Label htmlFor="trigger">Điều kiện kích hoạt</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn điều kiện" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="motion">Phát hiện chuyển động</SelectItem>
                      <SelectItem value="temp">Nhiệt độ vượt ngưỡng</SelectItem>
                      <SelectItem value="time">Giờ cụ thể</SelectItem>
                      <SelectItem value="light">Thiếu ánh sáng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="action">Hành động</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn hành động" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light-on">Bật đèn</SelectItem>
                      <SelectItem value="light-off">Tắt đèn</SelectItem>
                      <SelectItem value="fan-on">Bật quạt</SelectItem>
                      <SelectItem value="fan-off">Tắt quạt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">Tạo quy tắc</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {automations.map(automation => (
            <div 
              key={automation.id}
              className={`p-4 rounded-lg border ${automation.enabled ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    automation.enabled ? 'bg-purple-500' : 'bg-gray-400'
                  } text-white`}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{automation.name}</h4>
                      <Badge className={automation.enabled ? 'bg-green-500' : 'bg-gray-400'}>
                        {automation.enabled ? 'Hoạt động' : 'Tắt'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{automation.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Khi:</span> <span className="font-medium">{automation.trigger}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">→ Thì:</span> <span className="font-medium">{automation.action}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={automation.enabled}
                    onCheckedChange={() => toggleAutomation(automation.id)}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteAutomation(automation.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Schedules */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Lịch hẹn giờ
          </h3>
          <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Thêm lịch
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm lịch hẹn giờ</DialogTitle>
                <DialogDescription>
                  Đặt lịch tự động bật/tắt thiết bị theo giờ.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="schedule-device">Thiết bị</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn thiết bị" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light1">Đèn phòng khách</SelectItem>
                      <SelectItem value="light2">Đèn phòng ngủ</SelectItem>
                      <SelectItem value="fan1">Quạt phòng khách</SelectItem>
                      <SelectItem value="ac1">Điều hòa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="schedule-action">Hành động</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn hành động" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on">Bật</SelectItem>
                      <SelectItem value="off">Tắt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="schedule-time">Thời gian</Label>
                  <Input
                    id="schedule-time"
                    type="time"
                    defaultValue="18:00"
                  />
                </div>
                <Button className="w-full">Tạo lịch</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {schedules.map(schedule => (
            <div 
              key={schedule.id}
              className={`p-4 rounded-lg border ${schedule.enabled ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    schedule.enabled ? 'bg-blue-500' : 'bg-gray-400'
                  } text-white`}>
                    {getDeviceIcon(schedule.deviceType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{schedule.device}</h4>
                      <Badge className={schedule.action === 'on' ? 'bg-green-500' : 'bg-gray-500'}>
                        {schedule.action === 'on' ? 'Bật' : 'Tắt'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{schedule.time}</span>
                      </div>
                      <div className="flex gap-1">
                        {schedule.days.map(day => (
                          <span key={day} className="px-2 py-1 bg-blue-100 rounded text-xs">
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={schedule.enabled}
                    onCheckedChange={() => toggleSchedule(schedule.id)}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteSchedule(schedule.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
