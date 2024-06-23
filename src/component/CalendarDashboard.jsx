import React, { useState } from 'react';

const CalendarDashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

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

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    const isToday = (day) => {
      return (
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
      );
    };

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
              isToday(day) ? 'bg-indigo-600 text-white rounded-full' : ''
            } ${isSelectedDate(day) ? 'bg-indigo-200 rounded-full text-white' : ''}`}
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

  return (
    <div className="w-full bg-white p-4 mx-8 mb-4 mt-4 rounded text-lg font-semibold flex">
      <div>
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
                  <a tabIndex="0" className="focus:outline-none text-lg font-medium leading-5 text-gray-800 mt-2">Zoom call with design team</a>
                  <p className="text-sm pt-2 text-gray-600">Discussion on UX sprint and Wireframe review</p>
                </div>
                <div className="border-b pb-4 border-gray-400 border-dashed pt-5">
                  <p className="text-xs font-light leading-3 text-gray-500">10:00 AM</p>
                  <a tabIndex="0" className="focus:outline-none text-lg font-medium leading-5 text-gray-800 mt-2">Orientation session with new hires</a>
                </div>
                <div className="border-b pb-4 border-gray-400 border-dashed pt-5">
                  <p className="text-xs font-light leading-3 text-gray-500">9:00 AM</p>
                  <a tabIndex="0" className="focus:outline-none text-lg font-medium leading-5 text-gray-800 mt-2">Zoom call with design team</a>
                  <p className="text-sm pt-2 text-gray-600">Discussion on UX sprint and Wireframe review</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        Full Calendar
      </div>
    </div>
  );
}

export default CalendarDashboard;
