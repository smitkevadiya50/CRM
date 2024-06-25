import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import LoadingComp from './loading';

const AttendanceDashboard = () => {
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [siteOptions, setSiteOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const { site_id, date } = state || {};

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '34px',
      height: '34px',
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: '32px',
      padding: '0 6px'
    }),
    input: (provided) => ({
      ...provided,
      margin: '0px',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '34px',
    })
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch site data
        const siteResponse = await axios.get('http://127.0.0.1:3001/site');
        const siteData = siteResponse.data.map(site => ({
          value: site._id,
          label: site.site_name,
        }));
        setSiteOptions(siteData);

        // Set initial selected site and date
        if (siteData.length > 0) {
          const initialSite = siteData[0];
          setSelectedSite(initialSite.value);
          const initialDate = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
          setSelectedDate(initialDate);
          // Fetch attendance data for initial site and date
          const attendanceResponse = await axios.get('http://127.0.0.1:3001/attendance',{
            params: {
              site_id: site_id?site_id:initialSite.value,
              date: date?date:initialDate,
            }
          });
          setAttendanceData(attendanceResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (selectedSite && selectedDate) {
        setLoading(true);
        try {
          const response = await axios.get('http://127.0.0.1:3001/attendance', {
            params: {
              site_id: selectedSite,
              date: selectedDate,
            }
          });
          setAttendanceData(response.data);
        } catch (error) {
          console.error('Error fetching attendance data', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAttendance();
  }, [selectedSite, selectedDate]);

  if (loading) {
    return <LoadingComp />;
  }

  return (
    <div className="h-full">
      <div className="mb-4 mt-4 mx-8 p-4 rounded bg-white flex items-center">
        <h1 className='text-lg font-semibold'>Attendance Dashboard</h1>
        <div className="flex ml-auto">
          <Select
            options={siteOptions}
            value={siteOptions.find(option => option.value === selectedSite)}
            onChange={(selectedOption) => setSelectedSite(selectedOption.value)}
            placeholder="Select Site"
            isSearchable
            className="w-40 mr-2"
            styles={customStyles}
          />
          <input
            type="date"
            className='border p-1 rounded border-gray-300 text-gray-500'
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>
      <div className='mb-4 mt-4 mx-8 p-4 rounded bg-white'>
        {attendanceData.map((attendance) => (
          <ListCard
            key={attendance._id}
            employeeName={attendance.employee_name}
            employeeCategory={attendance.employee_category}
            startTime={convertTo12Hour(attendance.start_time)}
            endTime={convertTo12Hour(attendance.end_time)}
            employeePhoto={attendance.employee_photo}
          />
        ))}
      </div>
    </div>
  );
};

const ListCard = ({ employeeName, employeeCategory, startTime, endTime, employeePhoto }) => {
  return (
    <div className="flex items-end p-4">
      <div className="flex mr-auto items-end">
        <div className="w-16 h-16 bg-gray-300 rounded overflow-hidden">
          <img
            src={employeePhoto}
            alt="photo"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-4">
          <h2 className="text-md font-semibold">{employeeName}</h2>
          <p className="text-gray-600">{employeeCategory}</p>
        </div>
      </div>
      <div className="ml-auto flex items-center space-x-8">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Clock In</label>
          <div className="flex items-center space-x-2">
            <h1 className="w-10 h-10 border rounded text-center text-gray-400 text-lg flex items-center justify-center">
              {startTime.split(':')[0]}
            </h1>
            <span>:</span>
            <h1 className="w-10 h-10 border rounded text-center text-gray-400 text-lg flex items-center justify-center">
              {startTime.split(':')[1]}
            </h1>
            <span>:</span>
            <h1 className="w-10 h-10 border rounded text-center text-gray-400 text-lg flex items-center justify-center">
              {startTime.split(':')[2]}
            </h1>
          </div>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Clock Out</label>
          <div className="flex items-center space-x-2">
            <h1 className="w-10 h-10 border rounded text-center text-gray-400 text-lg flex items-center justify-center">
              {endTime ? endTime.split(':')[0] : '--'}
            </h1>
            <span>:</span>
            <h1 className="w-10 h-10 border rounded text-center text-gray-400 text-lg flex items-center justify-center">
              {endTime  ? endTime.split(':')[1] : '--'}
            </h1>
            <span>:</span>
            <h1 className="w-10 h-10 border rounded text-center text-gray-400 text-lg flex items-center justify-center">
              {endTime  ? endTime.split(':')[2] : '--'}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

function convertTo12Hour(time24) {
  if(time24){
    const [hours, minutes] = time24.split(':');
    const hoursInt = parseInt(hours);
    const suffix = hoursInt >= 12 ? 'PM' : 'AM';
    const hours12 = hoursInt % 12 || 12; // Convert '0' to '12' for midnight
    return `${String(hours12).padStart(2, '0')}:${minutes}:${suffix}`;
  }else{
    return '';
  }
}

export default AttendanceDashboard;
