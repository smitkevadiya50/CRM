import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { format, addMonths, subMonths, addDays, startOfWeek, isSameDay, getMonth } from 'date-fns';
import LoadingComp from './loading';
import { Link } from 'react-router-dom';
import { useAttendance } from '../context/AttendanceContext';

const Dashboard = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const { attendanceData, isloading, error } = useAttendance();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [siteRes, employeeRes] = await Promise.all([
          axios.get('http://127.0.0.1:3001/site'),
          axios.get('http://127.0.0.1:3001/employee'),
        ]);
        setSites(siteRes.data);
        setEmployees(employeeRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const nextDate = () => {
    const nextDay = addDays(selectedDate, 1);
    if (getMonth(nextDay) !== getMonth(selectedDate)) {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
    setSelectedDate(nextDay);
  };

  const prevDate = () => {
    const prevDay = addDays(selectedDate, -1);
    if (getMonth(prevDay) !== getMonth(selectedDate)) {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
    setSelectedDate(prevDay);
  };

  const renderWeekView = () => {
    const startOfCurrentWeek = startOfWeek(selectedDate);
    const days = [];
    let day = startOfCurrentWeek;
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, 'd');
      days.push(
        <div
          key={day}
          className={`text-center rounded-lg p-2 ${isSameDay(day, selectedDate) ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => setSelectedDate(day)}
        >
          {formattedDate}
        </div>
      );
      day = addDays(day, 1);
    }

    return <div className="grid grid-cols-7">{days}</div>;
  };

  const renderDays = () => {
    const days = [];
    const date = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium">
          {date[i]}
        </div>
      );
    }

    return <div className="grid grid-cols-7">{days}</div>;
  };

  const getTodayAttendance = (data) => {
    const todayDateStr = selectedDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
    return data.filter(item => item.date === todayDateStr);
  };

  if (loading || isloading) {
    return <LoadingComp />;
  }
  if (error) return <div>Error: {error.message}</div>;

  const todayAttendance = getTodayAttendance(attendanceData);

  return (
    <div className="h-full mx-8">
      <div className="mb-4 mt-4 p-4 rounded bg-white w-full text-lg font-semibold">
        Dashboard
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold">Calendar</div>
              <Link to="/calendar-dashboard">
                <button className="text-blue-500">
                  More
                </button>
              </Link>
            </div>
            <div className="flex items-center justify-center mb-2">
              <div className="text-lg font-semibold">
                {format(currentMonth, 'MMMM yyyy')}
              </div>
            </div>
            <div className='flex'>
              <div onClick={prevDate} className="p-2">
                <ArrowBackIosIcon />
              </div>
              <div className='w-full'>
                {renderDays()}
                {renderWeekView()}
              </div>
              <div onClick={nextDate} className="p-2">
                <ArrowForwardIosIcon />
              </div>
            </div>
          </div>
          <div className="mt-4 bg-white p-4 rounded shadow">
            {sites.map((site, index) => {

              const siteAttendance = todayAttendance.find(item => item.site_id === site._id);
              const today_arrive = siteAttendance? siteAttendance.total_worker_arrived + siteAttendance.total_helper_arrived: '';
              const total_emp = siteAttendance? siteAttendance.total_worker + siteAttendance.total_helper: '';
              const per = siteAttendance? today_arrive * 100 / total_emp: '';
              const attendance = siteAttendance
              ? `${today_arrive}/${total_emp}`
              : "No data";
              return (
                <div key={index} className="mb-4">
                  <div className='text-right'>
                  {per}{siteAttendance?"%":""} {siteAttendance?"|":""} {attendance}
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white">S</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-semibold">{site.site_name}</div>
                      <div className="text-gray-600">{site.site_location}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-gray-600">Supervisor</div>
                      <div className="font-semibold">{employees.find(emp => emp._id === site.supervisor)?.name}</div>
                      <div className="text-gray-600">📞 +91{employees.find(emp => emp._id === site.supervisor)?.number}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Manager</div>
                      <div className="font-semibold">{employees.find(emp => emp._id === site.manager)?.name}</div>
                      <div className="text-gray-600">📞 +91{employees.find(emp => emp._id === site.manager)?.number}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">No. of worker</div>
                      <div className="font-semibold">{site.worker.length}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">No. of helper</div>
                      <div className="font-semibold">{site.helper.length}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Joining date</div>
                      <div className="font-semibold">{site.joining_date.split('T')[0]}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Ending date</div>
                      <div className="font-semibold">{site.ending_date.split('T')[0]}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Starting Time</div>
                      <div className="font-semibold">{site.start_time}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Ending Time</div>
                      <div className="font-semibold">{site.end_time}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">Quick Reminder</div>
              <Link to="/calendar-dashboard">
                <button className="text-blue-500">More</button>
              </Link>
            </div>
            <div className="mt-2 space-y-4">
              <div className="p-2 rounded" style={{ borderWidth: 1 }}>Stock</div>
              <div className="p-2 rounded" style={{ borderWidth: 1 }}>Salary</div>
              <div className="p-2 rounded" style={{ borderWidth: 1 }}>Training time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
