import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="servers" element={<div className="p-6 text-xl text-slate-500">Servers page coming soon...</div>} />
          <Route path="labs" element={<div className="p-6 text-xl text-slate-500">Labs & Devices page coming soon...</div>} />
          <Route path="power" element={<div className="p-6 text-xl text-slate-500">Power Usage page coming soon...</div>} />
          <Route path="alerts" element={<div className="p-6 text-xl text-slate-500">Alerts page coming soon...</div>} />
          <Route path="settings" element={<div className="p-6 text-xl text-slate-500">Settings page coming soon...</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
