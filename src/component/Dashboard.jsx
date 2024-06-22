import React, { useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { format, addMonths, subMonths, addDays, startOfWeek, endOfWeek, isSameDay, getMonth } from 'date-fns';

const Dashboard = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);

  const handleExpandCalendar = () => {
    setIsCalendarExpanded(!isCalendarExpanded);
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

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

  const renderCells = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        days.push(
          <div
            key={day}
            className={`text-center p-2 rounded-lg ${isSameDay(day, selectedDate) ? 'bg-blue-500 text-white' : ''}`}
            onClick={() => setSelectedDate(cloneDay)}
          >
            {format(day, 'd')}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
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
              <button className="text-blue-500" onClick={handleExpandCalendar}>
                More
              </button>
            </div>
            <div className="flex items-center justify-center mb-2">
                <div className="text-lg font-semibold">
                {format(currentMonth, 'MMMM yyyy')}
                </div>
            </div>
            <div className='flex'>
                    <div onClick={isCalendarExpanded ? prevMonth : prevDate} className="p-2">
                        <ArrowBackIosIcon/>
                    </div>
                        {   
                        isCalendarExpanded ? (
                            <div className='w-full'>
                              {renderDays()}
                              {renderCells()}
                            </div>
                          ):                 
                        (
                        <div className='w-full'>
                        {renderDays()}
                        {renderWeekView()}
                        </div> 
                        )
                    }      
                    <div onClick={isCalendarExpanded ? nextMonth : nextDate} className="p-2">
                        <ArrowForwardIosIcon />
                    </div>             
            </div>
           
          </div>
          <div className="mt-4">
            <div className="bg-white p-4 rounded shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white">S</span>
                </div>
                <div className="ml-4">
                  <div className="text-lg font-semibold">Site Name</div>
                  <div className="text-gray-600">Location</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-600">Supervisor</div>
                  <div className="font-semibold">Supervisor Name</div>
                  <div className="text-gray-600">📞 +91 12345 67890</div>
                </div>
                <div>
                  <div className="text-gray-600">Manager</div>
                  <div className="font-semibold">Manager Name</div>
                  <div className="text-gray-600">📞 +91 12345 67890</div>
                </div>
                <div>
                  <div className="text-gray-600">No. of worker</div>
                  <div className="font-semibold">30</div>
                </div>
                <div>
                  <div className="text-gray-600">No. of helper</div>
                  <div className="font-semibold">05</div>
                </div>
                <div>
                  <div className="text-gray-600">Joining date</div>
                  <div className="font-semibold">13 Jun, 2024</div>
                </div>
                <div>
                  <div className="text-gray-600">Ending date</div>
                  <div className="font-semibold">30 Jun, 2026</div>
                </div>
              </div>
            </div>
            {/* Additional site cards can go here */}
          </div>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">Quick Reminder</div>
              <button className="text-blue-500">More</button>
            </div>
            <div className="mt-2 space-y-4">
              <div className="p-2 rounded" style={{borderWidth: 1}}>Stock</div>
              <div className="p-2 rounded" style={{borderWidth: 1}}>Salary</div>
              <div className="p-2 rounded" style={{borderWidth: 1}}>Training time</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">Inventory</div>
              <button className="text-blue-500">More</button>
            </div>
            <div className="mt-2 space-y-4">
              <div className="p-2 rounded" style={{borderWidth: 1}}>Stock</div>
              <div className="p-2 rounded" style={{borderWidth: 1}}>Salary</div>
              <div className="p-2 rounded" style={{borderWidth: 1}}>Training time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
