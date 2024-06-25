// src/hooks/useAttendanceData.js

import { useState, useEffect } from 'react';
import axios from 'axios';

const useAttendanceData = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3001/attendance/get-current-month-data');
        setAttendanceData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  return { attendanceData, loading, error };
};

export default useAttendanceData;
