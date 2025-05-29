import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock, MapPin, User, Search, Filter, X } from "lucide-react";

// Date utility functions (replacing date-fns)
const dateUtils = {
  format: (date, format) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const d = new Date(date);
    
    if (format === 'yyyy-MM-dd') {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    } else if (format === 'MMMM yyyy') {
      return `${months[d.getMonth()]} ${d.getFullYear()}`;
    } else if (format === 'MMM d') {
      return `${shortMonths[d.getMonth()]} ${d.getDate()}`;
    } else if (format === 'MMM d, yyyy') {
      return `${shortMonths[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    } else if (format === 'EEEE, MMMM d, yyyy') {
      return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    } else if (format === 'EEE') {
      return shortDays[d.getDay()];
    } else if (format === 'd EEE') {
      return `${d.getDate()} ${shortDays[d.getDay()]}`;
    } else if (format === 'd') {
      return d.getDate().toString();
    } else if (format === 'yyyy') {
      return d.getFullYear().toString();
    } else if (format === 'MMM') {
      return shortMonths[d.getMonth()];
    } else if (format === 'yyyy-MM') {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }
    return d.toDateString();
  },
  
  startOfMonth: (date) => new Date(date.getFullYear(), date.getMonth(), 1),
  endOfMonth: (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0),
  startOfWeek: (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  },
  endOfWeek: (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + 6;
    return new Date(d.setDate(diff));
  },
  addDays: (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },
  addMonths: (date, months) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  },
  subMonths: (date, months) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() - months);
    return result;
  },
  isSameMonth: (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
  },
  isSameDay: (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() && 
           date1.getMonth() === date2.getMonth() && 
           date1.getDate() === date2.getDate();
  },
  isToday: (date) => {
    return dateUtils.isSameDay(date, new Date());
  },
  parseISO: (dateString) => new Date(dateString),
  startOfYear: (date) => new Date(date.getFullYear(), 0, 1),
  endOfYear: (date) => new Date(date.getFullYear(), 11, 31),
  getDay: (date) => date.getDay()
};

const eventCategories = [
  { id: 'work', name: 'Work', color: '#6366f1', icon: '💼' },
  { id: 'personal', name: 'Personal', color: '#ec4899', icon: '🌟' },
  { id: 'health', name: 'Health', color: '#10b981', icon: '🏃' },
  { id: 'social', name: 'Social', color: '#f59e0b', icon: '👥' },
  { id: 'travel', name: 'Travel', color: '#8b5cf6', icon: '✈️' },
  { id: 'holiday', name: 'Holiday', color: '#ef4444', icon: '🎉' }
];

const defaultEvents = [
  {
    id: 1,
    title: "Team Standup",
    date: "2025-05-10",
    time: "09:00",
    duration: "30 min",
    category: "work",
    location: "Conference Room A",
    description: "Daily team synchronization meeting"
  },
  {
    id: 2,
    title: "Product Review",
    date: "2025-05-15",
    time: "14:00",
    duration: "2 hours",
    category: "work",
    location: "Main Hall",
    description: "Quarterly product review and planning"
  },
  {
    id: 3,
    title: "Yoga Class",
    date: "2025-05-20",
    time: "07:00",
    duration: "1 hour",
    category: "health",
    location: "Fitness Center",
    description: "Morning yoga session"
  },
  {
    id: 4,
    title: "Coffee with Sarah",
    date: "2025-06-02",
    time: "15:30",
    duration: "1 hour",
    category: "social",
    location: "Starbucks Downtown",
    description: "Catch up over coffee"
  },
  {
    id: 5,
    title: "Weekend Getaway",
    date: "2025-06-07",
    time: "10:00",
    duration: "2 days",
    category: "travel",
    location: "Mountain Resort",
    description: "Weekend trip to the mountains"
  },
  {
    id: 6,
    title: "Project Deadline",
    date: "2025-06-15",
    time: "17:00",
    duration: "All day",
    category: "work",
    location: "Office",
    description: "Final submission of quarterly project"
  },
  {
    id: 7,
    title: "Birthday Party",
    date: "2025-06-20",
    time: "19:00",
    duration: "3 hours",
    category: "social",
    location: "Restaurant",
    description: "Celebrating Alex's birthday"
  }
];

const CalendarApp = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState(defaultEvents);
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("month");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showEventDetails, setShowEventDetails] = useState(null);
  const [draggedEvent, setDraggedEvent] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    time: "09:00",
    duration: "1 hour",
    category: "work",
    location: ""
  });

  const handlePrev = () => {
    if (view === "year") {
      setCurrentDate(dateUtils.subMonths(currentDate, 12));
    } else if (view === "month") {
      setCurrentDate(dateUtils.subMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(dateUtils.addDays(currentDate, -7));
    }
  };

  const handleNext = () => {
    if (view === "year") {
      setCurrentDate(dateUtils.addMonths(currentDate, 12));
    } else if (view === "month") {
      setCurrentDate(dateUtils.addMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(dateUtils.addDays(currentDate, 7));
    }
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
    setShowModal(true);
  };

  const handleEventSubmit = () => {
    if (!formData.title.trim()) return;
    
    const category = eventCategories.find(cat => cat.id === formData.category);
    const newEvent = {
      id: Date.now(),
      ...formData,
      date: dateUtils.format(selectedDate, "yyyy-MM-dd"),
      color: category.color
    };
    
    setEvents([...events, newEvent]);
    setFormData({
      title: "",
      description: "",
      time: "09:00",
      duration: "1 hour",
      category: "work",
      location: ""
    });
    setShowModal(false);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getEventsForDate = (date) => {
    return filteredEvents.filter(event => event.date === dateUtils.format(date, "yyyy-MM-dd"));
  };

  const handleDragStart = (event, eventData) => {
    setDraggedEvent(eventData);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event, newDate) => {
    event.preventDefault();
    if (draggedEvent) {
      const updatedEvents = events.map(evt => 
        evt.id === draggedEvent.id 
          ? { ...evt, date: dateUtils.format(newDate, "yyyy-MM-dd") }
          : evt
      );
      setEvents(updatedEvents);
      setDraggedEvent(null);
    }
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
      <div className="flex items-center space-x-3">
        <button 
          onClick={handlePrev}
          className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <ChevronLeft size={18} />
        </button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {view === "year"
            ? dateUtils.format(currentDate, "yyyy")
            : view === "month"
            ? dateUtils.format(currentDate, "MMMM yyyy")
            : `Week of ${dateUtils.format(dateUtils.startOfWeek(currentDate), "MMM d, yyyy")}`}
        </h1>
        <button 
          onClick={handleNext}
          className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300 text-sm"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300 text-sm"
        >
          <option value="">All Categories</option>
          {eventCategories.map(category => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>
        
        <div className="flex bg-white/50 backdrop-blur-sm rounded-xl p-1 border border-gray-200">
          {["month", "week", "year"].map((viewType) => (
            <button
              key={viewType}
              onClick={() => setView(viewType)}
              className={`px-3 py-2 rounded-lg transition-all duration-300 capitalize text-sm ${
                view === viewType
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-white/50"
              }`}
            >
              {viewType}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDays = () => {
    if (view === "year") return null;
    const days = [];
    const date = dateUtils.startOfWeek(currentDate);
    
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-semibold text-gray-600 py-3">
          {dateUtils.format(dateUtils.addDays(date, i), "EEE")}
        </div>
      );
    }
    return <div className="grid grid-cols-7 bg-white/50 backdrop-blur-sm border-b border-gray-200/50">{days}</div>;
  };

  const renderMonthView = () => {
    const monthStart = dateUtils.startOfMonth(currentDate);
    const monthEnd = dateUtils.endOfMonth(monthStart);
    const startDate = dateUtils.startOfWeek(monthStart);
    const endDate = dateUtils.endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = new Date(startDate);

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day);
        const isCurrentMonth = dateUtils.isSameMonth(day, monthStart);
        const isTodayDate = dateUtils.isToday(day);
        const isSunday = dateUtils.getDay(day) === 0;
        const dayEvents = getEventsForDate(day);

        days.push(
          <div
            key={day.toString()}
            className={`h-24 p-2 relative cursor-pointer transition-all duration-300 transform hover:scale-102 group ${
              isTodayDate
                ? "bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-300 shadow-lg"
                : isCurrentMonth
                ? "bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:shadow-md"
                : "bg-gray-50/40 text-gray-400"
            } ${isSunday ? "bg-red-50/50" : ""} rounded-xl border border-gray-200/50`}
            onClick={() => handleDateClick(cloneDay)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, cloneDay)}
          >
            <div className="flex justify-between items-start mb-1">
              <span className={`text-xs font-medium ${
                isTodayDate 
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-1.5 py-0.5 rounded-full shadow-sm" 
                  : isSunday
                  ? "text-red-500 font-bold"
                  : ""
              }`}>
                {dateUtils.format(day, "d")}
              </span>
              {dayEvents.length > 0 && (
                <span className="text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">
                  {dayEvents.length}
                </span>
              )}
            </div>
            
            <div className="space-y-0.5">
              {dayEvents.slice(0, 2).map((event, idx) => {
                const category = eventCategories.find(cat => cat.id === event.category);
                return (
                  <div
                    key={event.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, event)}
                    className="text-xs p-1 rounded text-white cursor-move hover:shadow-md transform transition-all duration-200 hover:scale-105"
                    style={{ backgroundColor: category?.color || '#6366f1' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowEventDetails(event);
                    }}
                  >
                    <div className="flex items-center space-x-1">
                      <span className="text-xs">{category?.icon}</span>
                      <span className="truncate font-medium">{event.title}</span>
                    </div>
                  </div>
                );
              })}
              {dayEvents.length > 2 && (
                <div className="text-xs text-indigo-600 font-medium cursor-pointer hover:text-indigo-800 transition-colors">
                  +{dayEvents.length - 2} more
                </div>
              )}
            </div>
            
            <button
              className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-1 shadow-md hover:shadow-lg transform hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                handleDateClick(cloneDay);
              }}
            >
              <Plus size={12} className="text-indigo-600" />
            </button>
          </div>
        );

        day = dateUtils.addDays(day, 1);
      }

      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-2">
          {days}
        </div>
      );
      days = [];
    }

    return <div className="space-y-2 p-4">{rows}</div>;
  };

  const renderWeekView = () => {
    const start = dateUtils.startOfWeek(currentDate);
    const days = [];

    let day = new Date(start);
    for (let i = 0; i < 7; i++) {
      const cloneDay = new Date(day);
      const isTodayDate = dateUtils.isToday(day);
      const isSunday = dateUtils.getDay(day) === 0;
      const dayEvents = getEventsForDate(day);

      days.push(
        <div
          key={day.toString()}
          className={`p-3 h-80 relative cursor-pointer transition-all duration-300 group ${
            isTodayDate
              ? "bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-300 shadow-lg"
              : "bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:shadow-md"
          } rounded-xl border border-gray-200/50`}
          onClick={() => handleDateClick(cloneDay)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, cloneDay)}
        >
          <div className="text-center mb-3">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold ${
              isTodayDate
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                : isSunday
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-700"
            }`}>
              {dateUtils.format(day, "d")}
            </div>
            <div className="text-xs font-medium text-gray-600 mt-1">
              {dateUtils.format(day, "EEE")}
            </div>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-56">
            {dayEvents.map((event) => {
              const category = eventCategories.find(cat => cat.id === event.category);
              return (
                <div
                  key={event.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, event)}
                  className="p-2 rounded-lg text-white cursor-move hover:shadow-lg transform transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: category?.color || '#6366f1' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEventDetails(event);
                  }}
                >
                  <div className="flex items-center space-x-1 mb-1">
                    <span className="text-sm">{category?.icon}</span>
                    <span className="font-semibold text-sm truncate">{event.title}</span>
                  </div>
                  <div className="space-y-1 text-xs opacity-90">
                    {event.time && (
                      <div className="flex items-center space-x-1">
                        <Clock size={10} />
                        <span>{event.time}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-start space-x-1">
                        <MapPin size={10} className="mt-0.5 flex-shrink-0" />
                        <span className="break-words leading-tight">{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-1.5 shadow-md hover:shadow-lg transform hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              handleDateClick(cloneDay);
            }}
          >
            <Plus size={16} className="text-indigo-600" />
          </button>
        </div>
      );

      day = dateUtils.addDays(day, 1);
    }

    return <div className="grid grid-cols-7 gap-3 p-4">{days}</div>;
  };

  const renderYearView = () => {
    const yearStart = dateUtils.startOfYear(currentDate);
    const months = [];
    
    for (let i = 0; i < 12; i++) {
      const monthDate = dateUtils.addMonths(yearStart, i);
      const monthEvents = events.filter(event => 
        dateUtils.format(dateUtils.parseISO(event.date), "yyyy-MM") === dateUtils.format(monthDate, "yyyy-MM")
      );
      
      months.push(
        <div
          key={i}
          className="bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-gray-200/50 hover:bg-white/80 hover:shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-105"
          onClick={() => {
            setView("month");
            setCurrentDate(monthDate);
          }}
        >
          <div className="text-center font-bold text-base mb-2 text-gray-800">
            {dateUtils.format(monthDate, "MMM")}
          </div>
          <div className="text-center text-xs text-gray-600 mb-2">
            {monthEvents.length} events
          </div>
          {monthEvents.length > 0 && (
            <div className="space-y-1">
              {monthEvents.slice(0, 2).map((event, idx) => {
                const category = eventCategories.find(cat => cat.id === event.category);
                return (
                  <div
                    key={idx}
                    className="text-xs p-1 rounded text-white truncate"
                    style={{ backgroundColor: category?.color || '#6366f1' }}
                  >
                    {event.title}
                  </div>
                );
              })}
              {monthEvents.length > 2 && (
                <div className="text-xs text-gray-500">+{monthEvents.length - 2} more</div>
              )}
            </div>
          )}
        </div>
      );
    }
    
    return <div className="grid grid-cols-4 gap-4 p-4">{months}</div>;
  };

  const renderModal = () =>
    showModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Create Event
            </h2>
            <p className="text-gray-600 mt-1">
              {selectedDate && dateUtils.format(selectedDate, "EEEE, MMMM d, yyyy")}
            </p>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
              <input
                type="text"
                placeholder="Enter event title..."
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="30 min">30 minutes</option>
                  <option value="1 hour">1 hour</option>
                  <option value="2 hours">2 hours</option>
                  <option value="All day">All day</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {eventCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                placeholder="Enter location..."
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                placeholder="Enter description..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-200 flex space-x-3">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleEventSubmit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 font-medium transform hover:scale-105 shadow-lg"
            >
              Create Event
            </button>
          </div>
        </div>
      </div>
    );

  const renderEventDetails = () =>
    showEventDetails && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{showEventDetails.title}</h2>
                <p className="text-gray-600 mt-1">{dateUtils.format(dateUtils.parseISO(showEventDetails.date), "EEEE, MMMM d, yyyy")}</p>
              </div>
              <button
                onClick={() => setShowEventDetails(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {showEventDetails.time && (
              <div className="flex items-center space-x-3">
                <Clock size={20} className="text-gray-500" />
                <span>{showEventDetails.time} ({showEventDetails.duration})</span>
              </div>
            )}
            
            {showEventDetails.location && (
              <div className="flex items-center space-x-3">
                <MapPin size={20} className="text-gray-500" />
                <span>{showEventDetails.location}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded-full" style={{ backgroundColor: eventCategories.find(cat => cat.id === showEventDetails.category)?.color }} />
              <span>{eventCategories.find(cat => cat.id === showEventDetails.category)?.name}</span>
            </div>
            
            {showEventDetails.description && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-gray-700">{showEventDetails.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );

  const renderSidebar = () => (
    <div className="w-72 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 p-4 space-y-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center rounded-full text-lg font-bold shadow-lg">
          V
        </div>
        <div>
          <div className="font-semibold text-gray-900 text-sm">Vasipalli Abhisri</div>
          <div className="text-xs text-gray-600">Personal Calendar</div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 flex items-center space-x-2 text-sm">
          <Calendar size={16} />
          <span>Categories</span>
        </h3>
        <div className="space-y-1">
          {eventCategories.map(category => {
            const categoryEvents = events.filter(event => event.category === category.id);
            return (
              <div
                key={category.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 group"
                onClick={() => setSelectedCategory(selectedCategory === category.id ? "" : category.id)}
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-gray-700 group-hover:text-gray-900 text-sm">{category.name}</span>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                  {categoryEvents.length}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 text-sm">Upcoming Events</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredEvents
            .filter(event => dateUtils.parseISO(event.date) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 8)
            .map((event) => {
              const category = eventCategories.find(cat => cat.id === event.category);
              return (
                <div
                  key={event.id}
                  className="p-2 rounded-lg border border-gray-200 hover:shadow-md cursor-pointer transition-all duration-200 transform hover:scale-102"
                  onClick={() => setShowEventDetails(event)}
                >
                  <div className="flex items-start space-x-2">
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: category?.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate text-sm">{event.title}</div>
                      <div className="text-xs text-gray-600">
                        {dateUtils.format(dateUtils.parseISO(event.date), "MMM d")}
                        {event.time && ` at ${event.time}`}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      {renderSidebar()}
      <div className="flex-1 flex flex-col min-h-0">
        {renderHeader()}
        {renderDays()}
        <main className="flex-1 overflow-hidden">
          {view === "year" && renderYearView()}
          {view === "month" && renderMonthView()}
          {view === "week" && renderWeekView()}
        </main>
      </div>
      {renderModal()}
      {renderEventDetails()}
    </div>
  );
};

export default CalendarApp;