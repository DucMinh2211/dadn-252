import { useState, useEffect, useRef } from 'react';
import { UserCheck, UserPlus, Trash2, DoorOpen, Lock, Unlock, Camera, Shield } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';

interface FaceMember {
  id: string;
  name: string;
  relationship: string;
  image: string;
  addedDate: string;
  accessCount: number;
}

// Bổ sung thêm hành động 'locked' cho Nhật ký
interface AccessLog {
  id: string;
  personName: string;
  personId: string | null;
  action: 'opened' | 'denied' | 'locked';
  time: string;
  date: string;
  method: 'face' | 'manual' | 'unknown';
}

export function FaceID() {
  const [doorLocked, setDoorLocked] = useState(true);
  const [faceRecognition, setFaceRecognition] = useState(true);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const lastFaceValueRef = useRef<string>('');

  const [members, setMembers] = useState<FaceMember[]>([
    { id: '1', name: 'Admin User', relationship: 'Chủ nhà', image: 'AU', addedDate: '2024-01-15', accessCount: 45 },
    { id: '2', name: 'Thắng', relationship: 'Thành viên', image: 'TH', addedDate: '2024-02-20', accessCount: 32 },
  ]);

  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([
    { id: '1', personName: 'Admin User', personId: '1', action: 'opened', time: '08:30', date: 'Hôm nay', method: 'face' }
  ]);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/sensor/latest');
        const result = await res.json();
        
        if (result.status === 'success') {
          result.data.forEach((item: any) => {
            if (item.feed_name === 'bbc-door') {
              setDoorLocked(item.value === '0');
            }
            
            if (item.feed_name === 'bbc-faceai' && faceRecognition) {
              const currentFace = item.value;
              
              if (currentFace !== lastFaceValueRef.current && currentFace !== '') {
                lastFaceValueRef.current = currentFace; 
                
                const isKnown = currentFace !== 'UNKNOWN';
                
                const newLog: AccessLog = {
                  id: String(Date.now()),
                  personName: isKnown ? currentFace : 'Người lạ (UNKNOWN)',
                  personId: isKnown ? '2' : null,
                  action: isKnown ? 'opened' : 'denied',
                  time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                  date: 'Vừa xong',
                  method: 'face',
                };
                
                setAccessLogs(prevLogs => [newLog, ...prevLogs]);
              }
            }
          });
        }
      } catch (error) {
        console.error('Lỗi đồng bộ cảm biến:', error);
      }
    };

    fetchSensorData();
    // Đã tăng lên 8 giây (8000ms) để hệ thống nhẹ nhàng, không bị báo lỗi 500 nữa
    const interval = setInterval(fetchSensorData, 8000);
    return () => clearInterval(interval);
  }, [faceRecognition]);

  // HÀM ĐIỀU KHIỂN CỬA BẰNG APP (Công tắc Bật/Tắt)
  const handleToggleDoor = async () => {
    const isUnlocking = doorLocked; // Ghi nhớ hành động (Đang khóa thì là Mở, Đang mở thì là Khóa)
    setDoorLocked(!isUnlocking); // Cập nhật giao diện UI ngay lập tức cho mượt
    
    try {
      await fetch('http://127.0.0.1:8000/api/device-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feed_name: 'bbc-door', value: isUnlocking ? '1' : '0' })
      });
    } catch (error) {
      console.error('Lỗi điều khiển cửa:', error);
    }

    // Ghi log ra vào
    const log: AccessLog = {
      id: String(Date.now()),
      personName: isUnlocking ? 'Chủ nhà (Mở cửa)' : 'Chủ nhà (Khóa cửa)',
      personId: '1',
      action: isUnlocking ? 'opened' : 'locked',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      date: 'Vừa xong',
      method: 'manual',
    };
    setAccessLogs(prev => [log, ...prev]);
  };

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl mb-2 flex items-center gap-3">
          <Shield className="w-8 h-8 text-indigo-500" />
          Nhận Diện Khuôn Mặt & Kiểm Soát Truy Cập
        </h2>
        <p className="text-gray-500">Quản lý thành viên và kiểm soát ra vào bằng AI</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold mb-1">Trạng thái cửa</h3>
              <p className="text-sm text-gray-500">Điều khiển cửa chính từ xa</p>
            </div>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-500 ${
              doorLocked ? 'bg-red-500' : 'bg-green-500'
            }`}>
              {doorLocked ? (
                <Lock className="w-8 h-8 text-white" />
              ) : (
                <Unlock className="w-8 h-8 text-white" />
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <Badge className={`text-lg px-4 py-2 transition-colors duration-500 ${doorLocked ? 'bg-red-500' : 'bg-green-500'}`}>
              {doorLocked ? 'Đã khóa' : 'Đã mở'}
            </Badge>
          </div>

          <Button 
            onClick={handleToggleDoor}
            // Nếu đang khóa thì nút màu tím, nếu đang mở thì nút tự chuyển sang màu đỏ cảnh báo
            className={`w-full ${doorLocked ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-rose-500 hover:bg-rose-600'} text-white`}
            size="lg"
          >
            {doorLocked ? <DoorOpen className="w-5 h-5 mr-2" /> : <Lock className="w-5 h-5 mr-2" />}
            {doorLocked ? 'Mở cửa thủ công' : 'Khóa cửa thủ công'}
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold mb-1">Nhận diện khuôn mặt</h3>
              <p className="text-sm text-gray-500">Hệ thống Edge AI tại cửa</p>
            </div>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              faceRecognition ? 'bg-indigo-500' : 'bg-gray-400'
            }`}>
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Trạng thái AI</p>
              <p className="text-sm text-gray-500">Camera đang hoạt động độc lập</p>
            </div>
            <Switch 
              checked={faceRecognition}
              onCheckedChange={setFaceRecognition}
            />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <DoorOpen className="w-5 h-5 text-green-500" />
          Nhật ký ra vào trực tuyến
        </h3>

        <div className="space-y-3">
          {accessLogs.map(log => (
            <div 
              key={log.id}
              className={`p-4 rounded-lg border ${
                log.action === 'opened' ? 'bg-green-50 border-green-200' : 
                log.action === 'locked' ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    log.action === 'opened' ? 'bg-green-500' : 
                    log.action === 'locked' ? 'bg-blue-500' : 'bg-red-500'
                  } text-white`}>
                    {log.action === 'opened' ? (
                      <DoorOpen className="w-5 h-5" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{log.personName}</h4>
                      {log.method === 'face' && (
                        <Badge className="bg-indigo-500">FaceID</Badge>
                      )}
                      {log.method === 'manual' && (
                        <Badge className="bg-blue-500">Thủ công</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {log.action === 'opened' ? 'Đã mở cửa thành công' : 
                       log.action === 'locked' ? 'Đã khóa cửa an toàn' : 
                       'Bị từ chối truy cập! Cảnh báo an ninh!'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{log.time}</p>
                  <p className="text-sm text-gray-500">{log.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}