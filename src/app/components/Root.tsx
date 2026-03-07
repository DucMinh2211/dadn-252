import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Lightbulb, 
  Thermometer, 
  Shield, 
  Tv, 
  Zap, 
  DoorOpen,
  Menu
} from 'lucide-react';
import { useState } from 'react';

export function Root() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Lights', path: '/lights', icon: Lightbulb },
    { name: 'Climate', path: '/climate', icon: Thermometer },
    { name: 'Security', path: '/security', icon: Shield },
    { name: 'Appliances', path: '/appliances', icon: Tv },
    { name: 'Energy', path: '/energy', icon: Zap },
    { name: 'Rooms', path: '/rooms', icon: DoorOpen },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`bg-gradient-to-b from-indigo-600 to-purple-700 text-white transition-all duration-300 ${
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

        <nav className="mt-8">
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
