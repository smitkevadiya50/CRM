import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './component/Sidebar';
import EmpDashboard from './component/EmpDashboard';
import SiteDashboard from './component/SiteDashboard';
import Dashboard from './component/Dashboard';
import AttendanceDashboard from './component/AttendanceDashboard';

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <div className="w-16">
          <Sidebar icons={[
            {
              icon: '/assets/dashboard.png',
              to: '/dashboard'
            },
            {
              icon: '/assets/user.png',
              to: '/emp-dashboard'
            },
            {
              icon: '/assets/site.png',
              to: '/site-dashboard'
            },
            ,
            {
              icon: '/assets/attendance.png',
              to: '/attendance-dashboard'
            }
          ]} />
        </div>
        <div className="flex-grow">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/emp-dashboard" element={<EmpDashboard />} />
            <Route path="/site-dashboard" element={<SiteDashboard />} />
            <Route path="/attendance-dashboard" element={<AttendanceDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
