import { Outlet, Link, useLocation } from 'react-router';
import { 
  Home, 
  Lightbulb, 
  Thermometer, 
  Shield, 
  Tv, 
  Zap, 
  DoorOpen,
  Menu,
  Users,
  LogOut,
  User,
  Wind,
  Bell,
  Activity,
  UserCheck,
  FileText
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

export function Root() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Lights', path: '/lights', icon: Lightbulb },
    { name: 'Climate', path: '/climate', icon: Thermometer },
    { name: 'Security', path: '/security', icon: Shield },
    { name: 'Appliances', path: '/appliances', icon: Tv },
    { name: 'Energy', path: '/energy', icon: Zap },
    { name: 'Rooms', path: '/rooms', icon: DoorOpen },
    { name: 'Giám sát môi trường', path: '/environmental', icon: Wind },
    { name: 'Cảnh báo an ninh', path: '/security-monitoring', icon: Bell },
    { name: 'Tự động hóa', path: '/automation', icon: Activity },
    { name: 'FaceID & Truy cập', path: '/faceid', icon: UserCheck },
    { name: 'Nhật ký hoạt động', path: '/activity-log', icon: FileText },
    { name: 'Users', path: '/users', icon: Users },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`bg-gradient-to-b from-indigo-600 to-purple-700 text-white transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h1 className="text-2xl font-bold">YOLO Home</h1>
              <p className="text-indigo-200 text-sm">Smart Control</p>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-8 flex-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-6 py-4 transition-all ${
                  isActive 
                    ? 'bg-white/20 border-r-4 border-white' 
                    : 'hover:bg-white/10'
                }`}
              >
                <Icon className="w-6 h-6" />
                {sidebarOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="border-t border-white/20 p-4">
          {sidebarOpen ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user?.name}</p>
                  <p className="text-xs text-indigo-200 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-2 py-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full p-2 hover:bg-white/10 rounded-lg transition-colors flex justify-center"
            >
              <LogOut className="w-6 h-6" />
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}