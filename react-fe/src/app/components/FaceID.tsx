import { useState } from 'react';
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

interface AccessLog {
  id: string;
  personName: string;
  personId: string | null;
  action: 'opened' | 'denied';
  time: string;
  date: string;
  method: 'face' | 'manual' | 'unknown';
}

export function FaceID() {
  const [doorLocked, setDoorLocked] = useState(true);
  const [faceRecognition, setFaceRecognition] = useState(true);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const [members, setMembers] = useState<FaceMember[]>([
    {
      id: '1',
      name: 'Admin User',
      relationship: 'Chủ nhà',
      image: 'AU',
      addedDate: '2024-01-15',
      accessCount: 45,
    },
    {
      id: '2',
      name: 'John Doe',
      relationship: 'Thành viên',
      image: 'JD',
      addedDate: '2024-02-20',
      accessCount: 32,
    },
    {
      id: '3',
      name: 'Jane Smith',
      relationship: 'Thành viên',
      image: 'JS',
      addedDate: '2024-03-01',
      accessCount: 18,
    },
  ]);

  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([
    {
      id: '1',
      personName: 'Admin User',
      personId: '1',
      action: 'opened',
      time: '08:30',
      date: 'Hôm nay',
      method: 'face',
    },
    {
      id: '2',
      personName: 'John Doe',
      personId: '2',
      action: 'opened',
      time: '18:15',
      date: 'Hôm qua',
      method: 'face',
    },
    {
      id: '3',
      personName: 'Admin User',
      personId: '1',
      action: 'opened',
      time: '22:30',
      date: 'Hôm qua',
      method: 'manual',
    },
    {
      id: '4',
      personName: 'Người lạ',
      personId: null,
      action: 'denied',
      time: '03:15',
      date: '2 ngày trước',
      method: 'unknown',
    },
    {
      id: '5',
      personName: 'Jane Smith',
      personId: '3',
      action: 'opened',
      time: '17:45',
      date: '2 ngày trước',
      method: 'face',
    },
  ]);

  const handleUnlockDoor = () => {
    setDoorLocked(false);
    const log: AccessLog = {
      id: String(Date.now()),
      personName: 'Admin User',
      personId: '1',
      action: 'opened',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      date: 'Vừa xong',
      method: 'manual',
    };
    setAccessLogs([log, ...accessLogs]);
    
    // Auto lock after 5 seconds
    setTimeout(() => {
      setDoorLocked(true);
    }, 5000);
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

      {/* Door Control */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold mb-1">Trạng thái cửa</h3>
              <p className="text-sm text-gray-500">Điều khiển cửa chính từ xa</p>
            </div>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
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
            <Badge className={`text-lg px-4 py-2 ${doorLocked ? 'bg-red-500' : 'bg-green-500'}`}>
              {doorLocked ? 'Đã khóa' : 'Đã mở'}
            </Badge>
          </div>

          <Button 
            onClick={handleUnlockDoor}
            disabled={!doorLocked}
            className="w-full"
            size="lg"
          >
            <DoorOpen className="w-5 h-5 mr-2" />
            {doorLocked ? 'Mở cửa thủ công' : 'Đang mở...'}
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold mb-1">Nhận diện khuôn mặt</h3>
              <p className="text-sm text-gray-500">Tự động mở cửa khi nhận diện</p>
            </div>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              faceRecognition ? 'bg-indigo-500' : 'bg-gray-400'
            }`}>
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Kích hoạt FaceID</p>
              <p className="text-sm text-gray-500">Nhận diện tự động</p>
            </div>
            <Switch 
              checked={faceRecognition}
              onCheckedChange={setFaceRecognition}
            />
          </div>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Thành viên</p>
              <p className="text-2xl font-semibold">{members.length}</p>
            </div>
            <UserCheck className="w-10 h-10 text-indigo-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Truy cập hôm nay</p>
              <p className="text-2xl font-semibold">
                {accessLogs.filter(l => l.date === 'Hôm nay').length}
              </p>
            </div>
            <DoorOpen className="w-10 h-10 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Truy cập bị từ chối</p>
              <p className="text-2xl font-semibold text-red-600">
                {accessLogs.filter(l => l.action === 'denied').length}
              </p>
            </div>
            <Shield className="w-10 h-10 text-red-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">FaceID</p>
              <Badge className={faceRecognition ? 'bg-green-500' : 'bg-gray-400'}>
                {faceRecognition ? 'Bật' : 'Tắt'}
              </Badge>
            </div>
            <Camera className="w-10 h-10 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Members Management */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-500" />
            Quản lý thành viên
          </h3>
          <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Thêm thành viên
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm thành viên mới</DialogTitle>
                <DialogDescription>
                  Thêm khuôn mặt thành viên gia đình để tự động mở cửa.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="member-name">Tên thành viên</Label>
                  <Input
                    id="member-name"
                    placeholder="Nhập tên"
                  />
                </div>
                <div>
                  <Label htmlFor="relationship">Quan hệ</Label>
                  <Input
                    id="relationship"
                    placeholder="VD: Con trai, Con gái..."
                  />
                </div>
                <div>
                  <Label>Chụp khuôn mặt</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Nhấn để chụp ảnh khuôn mặt</p>
                  </div>
                </div>
                <Button className="w-full">Thêm thành viên</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map(member => (
            <Card key={member.id} className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {member.image}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{member.name}</h4>
                  <p className="text-sm text-gray-500">{member.relationship}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Số lần truy cập:</span>
                  <span className="font-medium">{member.accessCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ngày thêm:</span>
                  <span className="font-medium">{member.addedDate}</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleDeleteMember(member.id)}
              >
                <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                Xóa
              </Button>
            </Card>
          ))}
        </div>
      </Card>

      {/* Access Logs */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <DoorOpen className="w-5 h-5 text-green-500" />
          Nhật ký ra vào
        </h3>

        <div className="space-y-3">
          {accessLogs.map(log => (
            <div 
              key={log.id}
              className={`p-4 rounded-lg border ${
                log.action === 'opened' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    log.action === 'opened' ? 'bg-green-500' : 'bg-red-500'
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
                      {log.method === 'unknown' && (
                        <Badge className="bg-red-500">Không xác định</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {log.action === 'opened' ? 'Đã mở cửa' : 'Bị từ chối'}
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
