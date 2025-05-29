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

const eventColors = [
  "#FF5733", 
  "#33C3FF", 
  "#33FF57", 
  "#FF33A8", 
  "#FFC300", 
  "#8E44AD", 
];

const defaultEvents = [
  {
    "title": "Team Meeting",
    "date": "2025-05-28",
    "time": "10:00",
    "duration": "1 hour",
    "color": "#1E90FF"
  },
  {
    "title": "Workshop",
    "date": "2025-06-05",
    "time": "14:00",
    "duration": "3 hours",
    "color": "#6A5ACD"
  },
  {
    "title": "project Expo",
    "date": "2025-07-06",
    "time": "14:00",
    "duration": "3 hours",
    "color": "#FF69B4"
  },
  {
    "title": "New Year Celebration",
    "date": "2025-01-01",
    "description": "Celebrate the new year!",
    "color": "#FFD700"
  },
  {
    "title": "Republic Day",
    "date": "2025-01-26",
    "description": "National holiday",
    "color": "#FF4500"
  },
  {
    "title": "Valentine's Day",
    "date": "2025-02-14",
    "description": "Celebrate love",
    "color": "#FF1493"
  },
  {
    "title": "Holi",
    "date": "2025-03-10",
    "description": "Festival of colors",
    "color": "#8A2BE2"
  },
  {
    "title": "Good Friday",
    "date": "2025-04-18",
    "description": "Christian holiday",
    "color": "#A52A2A"
  },
  {
    "title": "Labour Day",
    "date": "2025-05-01",
    "description": "International Workers' Day",
    "color": "#808080"
  },
  {
    "title": "Independence Day",
    "date": "2025-08-15",
    "description": "National holiday",
    "color": "#228B22"
  },
  {
    "title": "Ganesh Chaturthi",
    "date": "2025-09-02",
    "description": "Festival of Lord Ganesha",
    "color": "#DAA520"
  },
  {
    "title": "Dussehra",
    "date": "2025-10-10",
    "description": "Victory of good over evil",
    "color": "#B22222"
  },
  {
    "title": "Diwali",
    "date": "2025-11-01",
    "description": "Festival of lights",
    "color": "#FFD700"
  },
  {
    "title": "Christmas",
    "date": "2025-12-25",
    "description": "Christmas Day celebration",
    "color": "#FF0000"
  }
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
  const [showAllEvents, setShowAllEvents] = useState(false);

  useEffect(() => {
    // Load events from localStorage if available, else initialize with defaultEvents
    const localEvents = JSON.parse(localStorage.getItem("calendarEvents")) || [];

    if (localEvents.length === 0) {
      // No events stored, so save defaultEvents to localStorage and set state
      localStorage.setItem("calendarEvents", JSON.stringify(defaultEvents));
      setEvents(defaultEvents);
    } else {
      // Merge local events with defaultEvents to avoid duplicates
      const mergedEvents = [...localEvents];

      defaultEvents.forEach((defaultEvent) => {
        const exists = localEvents.some(
          (localEvent) =>
            localEvent.date === defaultEvent.date &&
            localEvent.title === defaultEvent.title
        );
        if (!exists) {
          mergedEvents.push(defaultEvent);
        }
      });

      setEvents(mergedEvents);
    }
  }, []);

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
    const color = eventColors[events.length % eventColors.length];
    const newEvent = {
      title: newEventTitle,
      description: newEventDesc,
      date: format(selectedDate, "yyyy-MM-dd"),
      color:color,
    };
    const updatedEvents = [...events, newEvent];
    localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));
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
         const isSunday = getDay(day) === 0;
        const dayEvents = events.filter(
          (event) => event.date === format(day, "yyyy-MM-dd")
        );
        const maxEventsToShow = 2;
  const visibleEvents = dayEvents.slice(0, maxEventsToShow);
  const remainingCount = dayEvents.length - visibleEvents.length;

      
days.push(
  <div
    key={day.toString()}
    className={`p-2 h-24 border relative cursor-pointer text-sm transition rounded 
      ${isToday ? "bg-blue-100 border-blue-400 border-2" : ""}
      ${isCurrentMonth ? "bg-white" : "bg-gray-100"}
       ${isSunday ?"bbg-red-50" : ""}
    `}
    onClick={() => handleDateClick(cloneDay)}
  >
    <div className="text-xs font-medium text-right">
  <span
    className={`inline-flex items-center justify-center w-6 h-6 rounded-full 
      ${isToday ? "border-2 border-blue-500 text-blue-600" : ""}
      ${isSunday ? "text-red-600 font-bold" : ""} 
    `}
  >
    {formattedDate}
  </span>
</div>

    <div className="mt-1 space-y-0.5">
      {visibleEvents.map((event, idx) => (
        <div
          key={idx}
          className="truncate text-xs px-1 rounded"
          style={{ backgroundColor: event.color, color: "white" }}
        >
          {event.title}
        </div>
      ))}
      {remainingCount > 0 && (
        <div className="text-xs text-blue-500 cursor-pointer" onClick={(e) => {
          e.stopPropagation();
          setSelectedDate(cloneDay);
          setShowAllEvents(true);
        }}>
          +{remainingCount} more
        </div>
      )}
    </div>
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
          
          console.log("Event:", event.title, "Color:", event.color);
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

<div>
  <h3 className="font-semibold mb-2">Upcoming Events</h3>
  {events
    .filter((e) => parseISO(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5)
    .map((event, idx) => {
      const color = eventColors[idx % eventColors.length];
      return (
        <div
          key={idx}
          className="rounded px-3 py-1 mb-1 text-xs truncate cursor-pointer"
          style={{ backgroundColor: color, color: "white" }}
          title={`${event.title}: ${event.description}`}
          onClick={() => setCurrentDate(parseISO(event.date))}
        >
          {event.title} - {format(parseISO(event.date), "MMM d")}
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
        {showAllEvents && selectedDate && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow max-w-sm w-full">
      <h2 className="text-lg font-bold mb-2">
        Events on {format(selectedDate, "PPP")}
      </h2>
      {events
        .filter((event) => event.date === format(selectedDate, "yyyy-MM-dd"))
        .map((event, idx) => (
          <div
            key={idx}
            className="mb-2 p-2 rounded text-white"
            style={{ backgroundColor: event.color }}
          >
            <strong>{event.title}</strong>
            <div className="text-xs">{event.description || "No details"}</div>
          </div>
        ))}
      <button
        onClick={() => setShowAllEvents(false)}
        className="mt-3 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Close
      </button>
    </div>
  </div>
)}

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
