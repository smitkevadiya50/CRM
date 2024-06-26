// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './component/Sidebar';
import EmpDashboard from './component/EmpDashboard';
import SiteDashboard from './component/SiteDashboard';
import Dashboard from './component/Dashboard';
import AttendanceDashboard from './component/AttendanceDashboard';
import CalendarDashboard from './component/CalendarDashboard';
import PhotoDashboard from './component/PhotoDashboard';
import { AttendanceProvider } from './context/AttendanceContext';

function App() {
  return (
    <Router>
      <AttendanceProvider>
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
              {
                icon: '/assets/attendance.png',
                to: '/attendance-dashboard'
              },
              {
                icon: '/assets/photo.png',
                to: '/photo'
              }
            ]} />
          </div>
          <div className="flex-grow">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/emp-dashboard" element={<EmpDashboard />} />
              <Route path="/site-dashboard" element={<SiteDashboard />} />
              <Route path="/attendance-dashboard" element={<AttendanceDashboard />} />
              <Route path="/calendar-dashboard" element={<CalendarDashboard />} />
              <Route path="/photo" element={<PhotoDashboard />} />
            </Routes>
          </div>
        </div>
      </AttendanceProvider>
    </Router>
  );
}

export default App;
