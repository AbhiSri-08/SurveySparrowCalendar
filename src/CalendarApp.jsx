import React, { useState, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  parseISO,
  getMonth,
  getYear,
  startOfYear,
  endOfYear,
} from "date-fns";
import { getDay } from "date-fns";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import eventsData from './events.json';
const eventColors = [
  "#FF5733", // red-orange
  "#33C3FF", // blue
  "#33FF57", // green
  "#FF33A8", // pink
  "#FFC300", // yellow
  "#8E44AD", // purple
];

const CalendarApp = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDesc, setNewEventDesc] = useState("");
  const [view, setView] = useState("month"); // "year", "month", "week"
  const [yearViewMonth, setYearViewMonth] = useState(null);
 
  useEffect(() => {
    fetch('/events.json')  // Make sure events.json is in your public folder or accessible path
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(console.error);
  }, []);
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("calendarEvents")) || [];
    // Combine stored events with events from JSON (avoid duplicates if needed)
   const combinedEvents = [...storedEvents];
   // Add JSON events that are not in storedEvents
  eventsData.forEach((e) => {
    if (!storedEvents.find(ev => ev.date === e.date && ev.title === e.title)) {
      combinedEvents.push(e);
    }
  });

  setEvents(combinedEvents);

  }, []);
  

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const handlePrev = () => {
    if (view === "year") {
      setCurrentDate(subMonths(currentDate, 12));
    } else if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(addDays(currentDate, -7));
    }
  };

  const handleNext = () => {
    if (view === "year") {
      setCurrentDate(addMonths(currentDate, 12));
    } else if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(addDays(currentDate, 7));
    }
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
    setShowModal(true);
  };

  const handleEventSubmit = () => {
    if (!newEventTitle.trim()) return;
    const newEvent = {
      title: newEventTitle,
      description: newEventDesc,
      date: format(selectedDate, "yyyy-MM-dd"),
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    setNewEventTitle("");
    setNewEventDesc("");
    setShowModal(false);
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800">
      <div className="flex items-center space-x-2">
        <button onClick={handlePrev} className="text-xl hover:text-blue-600">
          <FaAngleLeft />
        </button>
        <span className="text-lg font-semibold">
          {view === "year"
            ? format(currentDate, "yyyy")
            : view === "month"
            ? format(currentDate, "MMMM yyyy")
            : `Week of ${format(startOfWeek(currentDate), "MMM d, yyyy")}`}
        </span>
        <button onClick={handleNext} className="text-xl hover:text-blue-600">
          <FaAngleRight />
        </button>
      </div>
    </div>
  );

  const renderDays = () => {
    if (view === "year") return null;
    const days = [];
    const date = startOfWeek(currentDate);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium text-sm">
          {format(addDays(date, i), "EEE")}
        </div>
      );
    }
    return <div className="grid grid-cols-7 p-2 border-b">{days}</div>;
  };

  // const renderYearView = () => {
  //   const yearStart = startOfYear(currentDate);
  //   const months = [];
  //   for (let i = 0; i < 12; i++) {
  //     const monthDate = addMonths(yearStart, i);
  //     months.push(
  //       <div
  //         key={i}
  //         className="cursor-pointer border p-2 rounded hover:bg-blue-100 text-center"
  //         onClick={() => {
  //           setView("month");
  //           setCurrentDate(monthDate);
  //           setYearViewMonth(monthDate);
  //         }}
  //       >
  //         {format(monthDate, "MMM")}
  //       </div>
  //     );
  //   }
  //   return <div className="grid grid-cols-4 gap-4 p-4">{months}</div>;
  // };
  const renderMiniMonth = (monthDate) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
  
    const days = [];
    let day = startDate;
  
    while (day <= endDate) {
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isToday = isSameDay(day, new Date());
      days.push(
        <div
          key={day.toString()}
          className={`text-xs w-6 h-6 flex items-center justify-center rounded
            ${isToday ? "bg-blue-300 text-white font-bold" : ""}
            ${isCurrentMonth ? "text-gray-900" : "text-gray-400"}
          `}
        >
          {format(day, "d")}
        </div>
      );
      day = addDays(day, 1);
    }
  
    return (
      <div
        className="border rounded p-1 cursor-pointer hover:bg-blue-100"
        onClick={() => {
          setView("month");
          setCurrentDate(monthDate);
          setYearViewMonth(monthDate);
        }}
      >
        <div className="text-center font-semibold mb-1">{format(monthDate, "MMM")}</div>
        <div className="grid grid-cols-7 gap-0.5">{days}</div>
      </div>
    );
  };
  
  const renderYearView = () => {
    const yearStart = startOfYear(currentDate);
    const months = [];
    for (let i = 0; i < 12; i++) {
      const monthDate = addMonths(yearStart, i);
      months.push(
        <div key={i}>
          {renderMiniMonth(monthDate)}
        </div>
      );
    }
    return <div className="grid grid-cols-4 gap-4 p-4">{months}</div>;
  };
  

  const renderMonthView = (date) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());
        const dayEvents = events.filter(
          (event) => event.date === format(day, "yyyy-MM-dd")
        );

        // Fix bg colors - remove unconditional bg-white
        days.push(
          <div
            key={day.toString()}
              className={`p-2 h-24 border relative cursor-pointer text-sm transition rounded
                ${isToday ? "bg-blue-100 border-4 border-blue-700" : ""}
                ${!isToday && isCurrentMonth ? "bg-white" : ""}
                ${!isCurrentMonth ? "bg-gray-200 text-gray-400" : ""}`}

            onClick={() => handleDateClick(cloneDay)}
          >
            <div className="flex justify-between items-start">
              <div
            className={`w-6 h-6 flex items-center justify-center rounded-full
              ${isToday ? "bg-blue-500 text-white font-bold border-2 border-blue-800" : ""}
              ${getDay(day) === 0 ? "text-red-500" : ""}
            `}
            >
  {formattedDate}
</div>

              {dayEvents.length > 0 && (
                <span className="w-2 h-2 mt-0.5 bg-blue-500 rounded-full" />
              )}
            </div>
            {dayEvents.map((event, idx) => {
  const color = eventColors[idx % eventColors.length];
  return (
    <div
  key={idx}
  className="rounded px-3 py-1 mt-2 text-xs truncate"
  style={{ backgroundColor: event.color, color: "white" }}
  title={event.description} // Optional tooltip
>
  {event.title}
</div>

  );
})}
</div>
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
      days = [];
    }

    return <div className="space-y-1">{rows}</div>;
  };


const renderWeekView = (date) => {
  const start = startOfWeek(date);
  const end = endOfWeek(date);
  const days = [];

  let day = start;
  for (let i = 0; i < 7; i++) {
    const cloneDay = day;
    const isToday = isSameDay(day, new Date());
    const isSelected = isSameDay(day, selectedDate); // Highlight clicked day
    const isSunday = getDay(day) === 0;
    const dayEvents = events.filter(
      (event) => event.date === format(day, "yyyy-MM-dd")
    );

    days.push(
      <div
        key={day.toString()}
        className={`p-2 h-40 border relative cursor-pointer text-sm transition rounded
          ${isToday ? "bg-blue-100 border-4 border-blue-700" : "border"}
          ${!isToday ? "bg-white" : ""}
          ${isSelected ? "ring-4 ring-yellow-400" : ""}
        `}
        onClick={() => handleDateClick(cloneDay)}
      >
        <div className="flex justify-between items-start mb-2">
          <div
            className={`w-full text-center font-medium rounded-full
              ${isToday ? "bg-blue-500 text-white font-bold border-2 border-blue-800" : ""}
               ${isSunday ? "text-red-500 font-semibold" : ""}
            `}
          >
            {format(day, "d EEE")}
          </div>
        </div>
        {dayEvents.map((event, idx) => {
          const color = eventColors[idx % eventColors.length];
          return (
            <div
  key={idx}
  className="rounded px-3 py-1 mt-2 text-xs truncate"
  style={{ backgroundColor: event.color, color: "white" }}
  title={event.description} // Optional tooltip
>
  {event.title}
</div>

          );
        })}
      </div>
    );

    day = addDays(day, 1);
  }

  return <div className="grid grid-cols-7 gap-1 p-2">{days}</div>;
};



  const renderModal = () =>
    showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-md w-96">
          <h2 className="text-xl font-bold mb-4">
            Add Task for {selectedDate && format(selectedDate, "PPP")}
          </h2>
          <input
            type="text"
            placeholder="Task Title"
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
            className="w-full border p-2 mb-2 rounded"
          />
          <textarea
            placeholder="Description"
            value={newEventDesc}
            onChange={(e) => setNewEventDesc(e.target.value)}
            className="w-full border p-2 mb-2 rounded"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleEventSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    );

  const renderSidebar = () => (
    <div className="w-60 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 space-y-6">
      {/* Circle with V and Name */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full text-xl font-bold">
          V
        </div>
        <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          Vasipalli Abhisri
        </div>
      </div>

      {/* View selector */}
      <div>
        <label className="block mb-1 font-semibold">Your Calender</label>
        <select
          className="w-full p-2 rounded border border-gray-300"
          value={view}
          onChange={(e) => {
            setView(e.target.value);
            if (e.target.value === "year") {
              setYearViewMonth(null);
            }
          }}
        >
          <option value="year">Year</option>
          <option value="month">Month</option>
          <option value="week">Week</option>
        </select>
      </div>
      {/* Upcoming Events Section */}
      <div>
        <h3 className="font-semibold mb-2">Upcoming Events</h3>
        {events
  .filter((e) => parseISO(e.date) >= new Date())
  .sort((a, b) => new Date(a.date) - new Date(b.date))
  .slice(0, 5)
  .map((event, idx) => {
    const eventDate = parseISO(event.date);
    return (
      <div
        key={idx}
        className="mb-2 text-sm cursor-pointer hover:bg-blue-100 rounded p-1"
        onClick={() => {
          setCurrentDate(eventDate);
          setSelectedDate(eventDate);
          setView("month"); // or "week" if you prefer
          setYearViewMonth(null);/// reset year view month if any
        
        }}

        title={`${event.title} - ${format(eventDate, "PPP")}`}
      >
        <div className="font-medium">{event.title}</div>
        <div className="text-xs text-gray-500">{format(eventDate, "PPP")}</div>
      </div>
    );
  })}

      </div>

    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {renderSidebar()}
      <div className="flex-1 flex flex-col">
        {renderHeader()}
        {renderDays()}

        <main className="flex-1 overflow-auto p-4">
          {view === "year" && !yearViewMonth && renderYearView()}
          {view === "year" && yearViewMonth && (
            <>
              <button
                className="mb-4 px-3 py-1 bg-blue-500 text-white rounded"
                onClick={() => setYearViewMonth(null)}
              >
                Back to Year View
              </button>
              {renderMonthView(yearViewMonth)}
            </>
          )}
          {view === "month" && renderMonthView(currentDate)}
          {view === "week" && renderWeekView(currentDate)}
        </main>
      </div>

      {renderModal()}
    </div>
  );
};

export default CalendarApp;
