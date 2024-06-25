// src/context/AttendanceContext.js

import React, { createContext, useContext } from 'react';
import useAttendanceData from '../hooks/useAttendanceData';

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const { attendanceData, loading, error } = useAttendanceData();

  return (
    <AttendanceContext.Provider value={{ attendanceData, loading, error }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  return useContext(AttendanceContext);
};
