import React, { useState } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import LoadingComp from './loading';
import { useNavigate } from 'react-router-dom';

const CalendarDashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  const { attendanceData, loading, error } = useAttendance();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({});

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selected);
    console.log(selected.toDateString());
  };

  const renderDaysOfWeek = () => {
    return daysOfWeek.map((day, index) => (
      <th key={index} className="px-2 py-2">
        <div className="w-full flex justify-center">
          <p className="text-base font-medium text-center text-gray-800">{day}</p>
        </div>
      </th>
    ));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  const isToday = (day) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const renderCalendarDays = () => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const isSelectedDate = (day) => {
      return (
        selectedDate &&
        day === selectedDate.getDate() &&
        month === selectedDate.getMonth() &&
        year === selectedDate.getFullYear()
      );
    };

    const calendarDays = [];
    let week = [];

    // Fill the first week with empty cells if the month does not start on Monday
    for (let i = 1; i < firstDayOfMonth; i++) {
      week.push(<td key={`empty-start-${i}`} className="px-2 py-2"></td>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      if (week.length === 7) {
        calendarDays.push(<tr key={`week-${calendarDays.length}`}>{week}</tr>);
        week = [];
      }
      week.push(
        <td key={day} className="">
          <div
            className={`cursor-pointer flex w-full justify-center p-2 ${
              isToday(day) ? 'bg-indigo-500 text-white rounded-full' : ''
            } ${isSelectedDate(day) ? 'bg-indigo-200 text-white rounded-full' : ''}`}
            onClick={() => handleDateClick(day)}
          >
            <p className={`text-base ${isToday(day) ? 'font-bold' : 'text-gray-500'}`}>{day}</p>
          </div>
        </td>
      );
    }

    // Fill the last week with empty cells if needed
    while (week.length < 7) {
      week.push(<td key={`empty-end-${week.length}`} className="px-2 py-2"></td>);
    }
    calendarDays.push(<tr key={`week-${calendarDays.length}`}>{week}</tr>);

    return calendarDays;
  };

  const handleDropdownToggle = (eventIndex, event, eventDetails) => {
    event.stopPropagation();
    const { clientX, clientY } = event;
    setDropdownPosition({ top: clientY, left: clientX });
    if (isDropdownOpen && isDropdownOpen.index === eventIndex) {
      setIsDropdownOpen(null);
    } else {
      setIsDropdownOpen({ index: eventIndex, details: eventDetails });
    }
  };

  const closeDropdownToggle = () => {
    setIsDropdownOpen(null);
  }

  const handleViewDetails = (event) => {
    navigate('/attendance-dashboard', { state: { site_id: event.site_id, date: event.date } });
  };

  const renderFullCalendar = () => {
    const getEventsForDate = (date) => {
      return attendanceData.filter(
        (event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      });
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const weeks = [];
    let days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<td key={`empty-${i}`} className="border p-1 h-32 overflow-auto"></td>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEvents = getEventsForDate(date);

      if (days.length === 7) {
        weeks.push(<tr key={`week-${weeks.length}`}>{days}</tr>);
        days = [];
      }
      days.push(
            <td onClick={()=> closeDropdownToggle()} key={day} className={`border p-1 h-32 overflow-auto transition cursor-pointer duration-500 ease ${isToday(day) ? "bg-indigo-200" : ""} hover:bg-gray-300`}>
              <div className="flex flex-col h-32 mx-auto overflow-hidden">
                <div className="top w-full">
                  <span className="text-gray-500 text-sm">{day}</span>
                </div>
                <div className="bottom flex-grow py-1 w-full cursor-pointer">
                  {dayEvents.map((event, index) => (
                    <div key={index} onClick={(e) => handleDropdownToggle(index, e, event)} className="event bg-purple-400 text-white rounded p-1 text-sm mb-1 flex justify-between items-start">
                      <span className="event-name">{event.site_name}</span>
                      <span className="time">{`${event.total_worker_arrived + event.total_helper_arrived}/${event.total_worker + event.total_helper}`}</span>
                      {isDropdownOpen && isDropdownOpen.index === index && (
                        <div style={{ position: 'absolute', top: dropdownPosition.top, left: dropdownPosition.left }} className="mt-2 w-56 h-52 bg-white border border-gray-300 rounded-md shadow-lg p-2 space-y-20">
                            <div>
                            <h1 className='text-black'>Date: <b className='text-gray-400'>{isDropdownOpen.details.date}</b></h1>
                            <h1 className='text-black'>Site Name: <b className='text-gray-400'>{isDropdownOpen.details.site_name}</b></h1>
                            <h1 className='text-black'>Worker: <b className='text-gray-400'>{`${isDropdownOpen.details.total_worker_arrived}/${isDropdownOpen.details.total_worker}`}</b></h1>
                            <h1 className='text-black'>Helper: <b className='text-gray-400'>{`${isDropdownOpen.details.total_helper_arrived}/${isDropdownOpen.details.total_helper}`}</b></h1>
                            </div>
                              <div onClick={() => handleViewDetails(isDropdownOpen.details)} className='text-blue-600 text-center'>View In Details</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </td>
      ); 
    }

    while (days.length < 7) {
      days.push(<td key={`empty-end-${days.length}`} className="border p-1 h-40 overflow-auto"></td>);
    }
    weeks.push(<tr key={`week-${weeks.length}`}>{days}</tr>);

    if (loading) return <LoadingComp/>;
    if (error) return <div>Error: {error.message}</div>;

    return (
      <div className="container">
        <div className="wrapper bg-white rounded shadow w-full">
          <div className="header flex justify-between border-b p-2">
            <span className="text-lg font-bold">
              {currentDate.getFullYear()} {months[currentDate.getMonth()]}
            </span>
            <div className="buttons">
              <button className="p-1" onClick={handlePreviousMonth}>
                <svg width="1em" fill="gray" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-left-circle" fillRule="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path fillRule="evenodd" d="M8.354 11.354a.5.5 0 0 0 0-.708L5.707 8l2.647-2.646a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708 0z"/>
                  <path fillRule="evenodd" d="M11.5 8a.5.5 0 0 0-.5-.5H6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 .5-.5z"/>
                </svg>
              </button>
              <button className="p-1" onClick={handleNextMonth}>
                <svg width="1em" fill="gray" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-right-circle" fillRule="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path fillRule="evenodd" d="M7.646 11.354a.5.5 0 0 1 0-.708L10.293 8 7.646 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0z"/>
                  <path fillRule="evenodd" d="M4.5 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"/>
                </svg>
              </button>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-1 border-r h-2 text-sm">Sun</th>
                <th className="p-1 border-r h-2 text-sm">Mon</th>
                <th className="p-1 border-r h-2 text-sm">Tue</th>
                <th className="p-1 border-r h-2 text-sm">Wed</th>
                <th className="p-1 border-r h-2 text-sm">Thu</th>
                <th className="p-1 border-r h-2 text-sm">Fri</th>
                <th className="p-1 border-r h-2 text-sm">Sat</th>
              </tr>
            </thead>
            <tbody>
              {weeks}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-white p-4 mx-8 mb-4 mt-4 rounded text-lg font-semibold flex">
      <div>
        <div className='text-center'>Scheduled Events</div>
        <div className="flex items-center justify-center">
          <div className="max-w-sm w-full shadow-lg">
            <div className="bg-white rounded-t">
              <div className="px-4 py-4 flex items-center justify-between">
                <span tabIndex="0" className="focus:outline-none text-base font-bold text-gray-800">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <div className="flex items-center">
                  <button
                    aria-label="calendar backward"
                    onClick={handlePreviousMonth}
                    className="focus:text-gray-400 hover:text-gray-400 text-gray-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-left" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <polyline points="15 6 9 12 15 18" />
                    </svg>
                  </button>
                  <button
                    aria-label="calendar forward"
                    onClick={handleNextMonth}
                    className="focus:text-gray-400 hover:text-gray-400 ml-3 text-gray-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-right" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <polyline points="9 6 15 12 9 18" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-12 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      {renderDaysOfWeek()}
                    </tr>
                  </thead>
                  <tbody>
                    {renderCalendarDays()}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="py-5 bg-gray-50 rounded-b">
              <div className="px-4">
                <div className="border-b pb-4 border-gray-400 border-dashed">
                  <p className="text-xs font-light leading-3 text-gray-500">9:00 AM</p>
                  <a tabIndex="0" className="focus:outline-none text-lg font-medium leading-5 text-gray-800 mt-2">Meeting with Kishor bhai</a>
                  <p className="text-sm pt-2 text-gray-600">At site location</p>
                </div>
                <div className="border-b pb-4 border-gray-400 border-dashed pt-5">
                  <p className="text-xs font-light leading-3 text-gray-500">12:00 AM</p>
                  <a tabIndex="0" className="focus:outline-none text-lg font-medium leading-5 text-gray-800 mt-2">Orientation session with new hires</a>
                </div>
                <div className="border-b pb-4 border-gray-400 border-dashed pt-5">
                  <p className="text-xs font-light leading-3 text-gray-500">05:00 PM</p>
                  <a tabIndex="0" className="focus:outline-none text-lg font-medium leading-5 text-gray-800 mt-2">Zoom call with manager's team</a>
                  <p className="text-sm pt-2 text-gray-600">discussion about Diwali bonus</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className='text-center'>Site Details</div>
        {renderFullCalendar()}
      </div>
    </div>
  );
};

export default CalendarDashboard;
