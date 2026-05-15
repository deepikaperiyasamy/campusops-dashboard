import React from 'react';
import { Bell, Search, UserCircle } from 'lucide-react';

const TopNav = () => {
  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 w-96">
        <Search size={18} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="Search servers, devices..." 
          className="bg-transparent border-none outline-none ml-2 w-full text-sm dark:text-white"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
        </button>
        <button className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <UserCircle size={28} />
        </button>
      </div>
    </header>
  );
};

export default TopNav;
