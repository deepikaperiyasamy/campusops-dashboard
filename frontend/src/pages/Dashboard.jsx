import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Server, Activity, Zap, AlertTriangle } from 'lucide-react';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Dashboard = () => {
  const [servers, setServers] = useState([]);
  const [powerData, setPowerData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [historicalPower, setHistoricalPower] = useState([
    { time: '10:00', value: 400 },
    { time: '10:05', value: 450 },
    { time: '10:10', value: 420 },
    { time: '10:15', value: 500 },
    { time: '10:20', value: 480 },
  ]);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    
    socket.emit('join_dashboard');

    socket.on('dashboard:servers', (data) => {
      setServers(data.servers);
    });

    socket.on('dashboard:power', (data) => {
      setPowerData(data.buildings);
      // Append historical for chart
      const totalPower = data.buildings.reduce((acc, curr) => acc + curr.consumption, 0);
      setHistoricalPower(prev => {
        const newHistory = [...prev, { time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'}), value: totalPower }];
        if (newHistory.length > 10) newHistory.shift();
        return newHistory;
      });
    });

    socket.on('dashboard:alert', (data) => {
      setAlerts(prev => [data, ...prev].slice(0, 5));
    });

    return () => socket.disconnect();
  }, []);

  const getStatusColor = (status) => {
    return status === 'ONLINE' ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10';
  };

  const totalServers = servers.length;
  const onlineServers = servers.filter(s => s.status === 'ONLINE').length;
  const currentTotalPower = powerData.reduce((acc, curr) => acc + curr.consumption, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">Campus Infrastructure Overview</h2>
          <p className="text-slate-500 dark:text-slate-400">Real-time monitoring of critical systems</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Server Health</p>
              <h3 className="text-3xl font-bold mt-2 dark:text-white">{onlineServers}/{totalServers}</h3>
              <p className="text-sm text-green-500 mt-1">Servers Online</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg"><Server className="text-blue-500" /></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Avg CPU Load</p>
              <h3 className="text-3xl font-bold mt-2 dark:text-white">
                {servers.length ? Math.round(servers.reduce((acc, s) => acc + s.cpu, 0) / servers.length) : 0}%
              </h3>
              <p className="text-sm text-slate-400 mt-1">Across all active servers</p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg"><Activity className="text-purple-500" /></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Power Consumption</p>
              <h3 className="text-3xl font-bold mt-2 dark:text-white">{currentTotalPower} <span className="text-lg">kW</span></h3>
              <p className="text-sm text-amber-500 mt-1">Campus wide total</p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg"><Zap className="text-amber-500" /></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Active Alerts</p>
              <h3 className="text-3xl font-bold mt-2 dark:text-white">{alerts.length}</h3>
              <p className="text-sm text-red-500 mt-1">Requires attention</p>
            </div>
            <div className="p-3 bg-red-500/10 rounded-lg"><AlertTriangle className="text-red-500" /></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Power Consumption Trend</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalPower} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                  itemStyle={{ color: '#f59e0b' }}
                />
                <Area type="monotone" dataKey="value" stroke="#f59e0b" fillOpacity={1} fill="url(#colorPower)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Alerts */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
            <AlertTriangle size={20} className="text-red-500" /> 
            Recent Alerts
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {alerts.length === 0 ? (
              <p className="text-slate-500 text-center mt-10">No recent alerts. System is stable.</p>
            ) : (
              alerts.map((alert, idx) => (
                <div key={idx} className={`p-4 rounded-lg border-l-4 ${alert.type === 'CRITICAL' ? 'border-red-500 bg-red-500/10' : 'border-amber-500 bg-amber-500/10'}`}>
                  <p className="text-sm font-bold dark:text-white">{alert.type}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{alert.message}</p>
                  <p className="text-xs text-slate-500 mt-2">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Server Status Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold dark:text-white">Server Infrastructure Status</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4">Server Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">CPU Usage</th>
                <th className="px-6 py-4">Memory Usage</th>
                <th className="px-6 py-4">Disk Usage</th>
              </tr>
            </thead>
            <tbody>
              {servers.map((server) => (
                <tr key={server.id} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium dark:text-white">{server.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(server.status)}`}>
                      {server.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div className={`h-2 rounded-full ${server.cpu > 80 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${server.cpu}%` }}></div>
                      </div>
                      <span className="w-8">{server.cpu}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div className={`h-2 rounded-full ${server.ram > 80 ? 'bg-red-500' : 'bg-purple-500'}`} style={{ width: `${server.ram}%` }}></div>
                      </div>
                      <span className="w-8">{server.ram}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{server.disk}%</td>
                </tr>
              ))}
              {servers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Waiting for server telemetry data...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
