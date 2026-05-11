import { useState, useEffect } from 'react';
import { Thermometer, Droplets, Wind, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';

interface EnvironmentData {
  time: string;
  temperature: number;
  humidity: number;
}

export function Environmental() {
  const [currentTemp, setCurrentTemp] = useState(25.5);
  const [currentHumidity, setCurrentHumidity] = useState(65);
  const [alerts, setAlerts] = useState<Array<{ id: string; message: string; time: string; type: 'warning' | 'danger' }>>([]);

  // Mock historical data
  const [historyData, setHistoryData] = useState<EnvironmentData[]>([
    
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const resLatest = await fetch('http://127.0.0.1:8000/api/sensor/latest');
        const latestResult = await resLatest.json();
        
        if (latestResult.status === 'success') {
          latestResult.data.forEach((item: any) => {
            if (item.feed_name === 'bbc-temp') {
              const tempVal = Number(item.value);
              setCurrentTemp(tempVal);
              
              if (tempVal > 35) {
                const alert = {
                  id: String(Date.now()),
                  message: `Cảnh báo: Nhiệt độ cao (${tempVal.toFixed(1)}°C)`,
                  time: new Date(item.created_at).toLocaleTimeString('vi-VN'),
                  type: 'danger' as const,
                };
                setAlerts(prev => {
                  if (prev.length > 0 && prev[0].message === alert.message) return prev;
                  return [alert, ...prev.slice(0, 3)];
                });
              }
            }
            if (item.feed_name === 'bbc-moist') setCurrentHumidity(Number(item.value));
          });
        }

        const resHistory = await fetch('http://127.0.0.1:8000/api/sensor/history');
        const historyResult = await resHistory.json();

        if (historyResult.status === 'success') {
           const groupedData: Record<string, any> = {};

           const reversedData = [...historyResult.data].reverse();

           reversedData.forEach((item: any) => {
              // Lấy mốc thời gian (Giờ:Phút)
              const timeStr = new Date(item.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
              
              if (!groupedData[timeStr]) {
                groupedData[timeStr] = { time: timeStr };
              }

              if (item.feed_name === 'bbc-temp') {
                groupedData[timeStr].temperature = Number(item.value);
              } else if (item.feed_name === 'bbc-moist') {
                groupedData[timeStr].humidity = Number(item.value);
              }
           });

           setHistoryData(Object.values(groupedData));
        }

      } catch (error) {
        console.error('Lỗi kết nối Backend:', error);
      }
    };

    fetchRealData();
    const interval = setInterval(fetchRealData, 3000);
    return () => clearInterval(interval);
  }, []);

  const getTemperatureStatus = (temp: number) => {
    if (temp > 40) return { text: 'Nguy hiểm', color: 'bg-red-500' };
    if (temp > 35) return { text: 'Cao', color: 'bg-orange-500' };
    if (temp > 30) return { text: 'Ấm', color: 'bg-yellow-500' };
    if (temp > 20) return { text: 'Bình thường', color: 'bg-green-500' };
    return { text: 'Mát', color: 'bg-blue-500' };
  };

  const getHumidityStatus = (humidity: number) => {
    if (humidity > 70) return { text: 'Ẩm', color: 'bg-blue-500' };
    if (humidity > 40) return { text: 'Bình thường', color: 'bg-green-500' };
    return { text: 'Khô', color: 'bg-orange-500' };
  };

  const tempStatus = getTemperatureStatus(currentTemp);
  const humidityStatus = getHumidityStatus(currentHumidity);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl mb-2 flex items-center gap-3">
          <Wind className="w-8 h-8 text-green-500" />
          Giám Sát Môi Trường
        </h2>
        <p className="text-gray-500">Theo dõi nhiệt độ và độ ẩm trong nhà theo thời gian thực</p>
      </div>

      {/* Current Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Temperature Card */}
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <Thermometer className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Nhiệt độ hiện tại</p>
                <p className="text-3xl font-bold">{currentTemp}°C</p>
              </div>
            </div>
            <Badge className={`${tempStatus.color} text-white`}>
              {tempStatus.text}
            </Badge>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Mức độ</span>
              <span>{((currentTemp / 50) * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((currentTemp / 50) * 100, 100)}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Humidity Card */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Độ ẩm hiện tại</p>
                <p className="text-3xl font-bold">{currentHumidity}%</p>
              </div>
            </div>
            <Badge className={`${humidityStatus.color} text-white`}>
              {humidityStatus.text}
            </Badge>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Mức độ</span>
              <span>{currentHumidity}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${currentHumidity}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Cảnh báo gần đây
          </h3>
          <div className="space-y-3">
            {alerts.map(alert => (
              <div 
                key={alert.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  alert.type === 'danger' ? 'bg-red-50 border border-red-200' : 'bg-orange-50 border border-orange-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`w-5 h-5 ${alert.type === 'danger' ? 'text-red-600' : 'text-orange-600'}`} />
                  <span className={alert.type === 'danger' ? 'text-red-800' : 'text-orange-800'}>
                    {alert.message}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {alert.time}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Historical Charts */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-500" />
          Biểu đồ lịch sử
        </h3>

        <Tabs defaultValue="temperature">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="temperature">Nhiệt độ</TabsTrigger>
            <TabsTrigger value="humidity">Độ ẩm</TabsTrigger>
          </TabsList>

          <TabsContent value="temperature">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 50]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  name="Nhiệt độ (°C)"
                  dot={{ fill: '#f97316', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="humidity">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Độ ẩm (%)"
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
