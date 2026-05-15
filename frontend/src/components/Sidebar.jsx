import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Server, Monitor, Power, Bell, Settings } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/' },
    { name: 'Servers', icon: Server, path: '/servers' },
    { name: 'Labs & Devices', icon: Monitor, path: '/labs' },
    { name: 'Power Usage', icon: Power, path: '/power' },
    { name: 'Alerts', icon: Bell, path: '/alerts' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Server className="text-blue-500" />
          SmartCampus
        </h1>
      </div>
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 transition-colors ${
                    isActive
                      ? 'bg-blue-600/10 text-blue-500 border-r-4 border-blue-500'
                      : 'hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-800 text-sm">
        <p>Admin User</p>
        <p className="text-slate-500">admin@campus.edu</p>
      </div>
    </div>
  );
};

export default Sidebar;
