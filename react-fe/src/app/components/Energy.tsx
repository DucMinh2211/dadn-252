import { useState } from 'react';
import { Zap, TrendingDown, TrendingUp, DollarSign, Leaf } from 'lucide-react';
import { Card } from './ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function Energy() {
  const dailyData = [
    { time: '00:00', usage: 1.2 },
    { time: '04:00', usage: 0.8 },
    { time: '08:00', usage: 2.5 },
    { time: '12:00', usage: 3.2 },
    { time: '16:00', usage: 2.8 },
    { time: '20:00', usage: 4.1 },
    { time: '23:00', usage: 2.3 },
  ];

  const weeklyData = [
    { day: 'Mon', usage: 45 },
    { day: 'Tue', usage: 52 },
    { day: 'Wed', usage: 38 },
    { day: 'Thu', usage: 48 },
    { day: 'Fri', usage: 55 },
    { day: 'Sat', usage: 42 },
    { day: 'Sun', usage: 35 },
  ];

  const deviceBreakdown = [
    { name: 'HVAC', value: 35, color: '#6366f1' },
    { name: 'Lighting', value: 20, color: '#f59e0b' },
    { name: 'Kitchen', value: 18, color: '#10b981' },
    { name: 'Entertainment', value: 15, color: '#8b5cf6' },
    { name: 'Other', value: 12, color: '#6b7280' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl mb-2 flex items-center gap-3">
          <Zap className="w-8 h-8 text-yellow-500" />
          Energy Management
        </h2>
        <p className="text-gray-500">Monitor and optimize your energy consumption</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Usage</p>
              <p className="text-2xl font-semibold">2.4 kW</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingDown className="w-3 h-3" />
                12% less than usual
              </p>
            </div>
            <Zap className="w-10 h-10 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Today's Total</p>
              <p className="text-2xl font-semibold">45.2 kWh</p>
              <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                5% more than yesterday
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">This Month</p>
              <p className="text-2xl font-semibold">$142</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingDown className="w-3 h-3" />
                $18 saved
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-green-500" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">CO₂ Saved</p>
              <p className="text-2xl font-semibold">24 kg</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <Leaf className="w-3 h-3" />
                This month
              </p>
            </div>
            <Leaf className="w-10 h-10 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Today's Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="usage" 
                stroke="#6366f1" 
                strokeWidth={3}
                dot={{ fill: '#6366f1', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Weekly Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="usage" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Device Breakdown and Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Energy by Device</h3>
          <div className="flex items-center justify-center mb-4">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={deviceBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {deviceBreakdown.map(device => (
              <div key={device.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: device.color }}
                  />
                  <span className="text-sm">{device.name}</span>
                </div>
                <span className="text-sm font-semibold">{device.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-600" />
            Energy Saving Tips
          </h3>
          <div className="space-y-3">
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <h4 className="font-semibold text-green-900 mb-1">Reduce HVAC Usage</h4>
              <p className="text-sm text-green-700">
                Lower temperature by 2°C during the day to save up to $25/month
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-900 mb-1">Optimize Lighting</h4>
              <p className="text-sm text-blue-700">
                Switch to LED bulbs in 3 remaining fixtures to save $8/month
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-semibold text-purple-900 mb-1">Off-Peak Hours</h4>
              <p className="text-sm text-purple-700">
                Run dishwasher and laundry between 10 PM - 6 AM for lower rates
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <h4 className="font-semibold text-yellow-900 mb-1">Standby Power</h4>
              <p className="text-sm text-yellow-700">
                5 devices are consuming standby power. Unplug to save $5/month
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
