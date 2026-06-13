import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import api from "../../utils/api";
import { useUser } from "../../context/UserContext";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar as CalendarIcon, Filter } from "lucide-react";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function StudentCalendar() {
  const { user } = useUser();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchEvents = () => {
    if (!user?.schoolId) return;
    setLoading(true);
    api.get("/calendar")
      .then(res => {
        // api returns { success: true, data: events }
        const list = Array.isArray(res.data) 
          ? res.data 
          : (res.data.data || []);
        
        const mapped = list.map(ev => ({
          ...ev,
          title: ev.title,
          start: new Date(ev.start || ev.startDate),
          end: new Date(ev.end || ev.endDate),
        }));
        setEvents(mapped);
        setFilteredEvents(mapped);
      })
      .catch(err => console.error("Error loading calendar events:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  // Handle Event Type Filter
  useEffect(() => {
    if (eventTypeFilter === "all") {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(ev => ev.eventType === eventTypeFilter));
    }
  }, [eventTypeFilter, events]);

  // Color mapper based on event type
  const eventStyleGetter = (event) => {
    let backgroundColor = "#3B82F6"; // default blue for general events
    if (event.color) {
      backgroundColor = event.color;
    } else {
      switch (event.eventType) {
        case "holiday":
          backgroundColor = "#EF4444"; // red
          break;
        case "examination":
        case "exam":
          backgroundColor = "#8B5CF6"; // purple
          break;
        case "test":
        case "assignment":
          backgroundColor = "#F59E0B"; // amber
          break;
        case "meeting":
          backgroundColor = "#10B981"; // emerald
          break;
        default:
          backgroundColor = "#3B82F6";
      }
    }
    return {
      style: {
        backgroundColor,
        borderRadius: "8px",
        opacity: 0.85,
        color: "white",
        border: "none",
        display: "block",
        padding: "2px 6px"
      }
    };
  };

  return (
    <div className="p-6 min-h-screen bg-base-200 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-base-100 p-5 rounded-2xl shadow border border-base-200">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-primary">
            <CalendarIcon /> Academic Schedule & Updates
          </h2>
          <p className="text-sm text-base-content/60 mt-1">Keep track of classes, exams, homework deadlines and holidays.</p>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-secondary" />
          <select 
            className="select select-bordered select-sm w-44" 
            value={eventTypeFilter}
            onChange={e => setEventTypeFilter(e.target.value)}
          >
            <option value="all">All Events</option>
            <option value="class">Classes</option>
            <option value="examination">Examinations</option>
            <option value="assignment">Assignments</option>
            <option value="holiday">Holidays</option>
            <option value="event">Campus Events</option>
            <option value="meeting">Meetings</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96 bg-base-100 rounded-2xl shadow">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <div className="bg-base-100 p-5 rounded-2xl shadow border border-base-200">
          <BigCalendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            eventPropGetter={eventStyleGetter}
            style={{ height: 600 }}
            views={["month", "week", "day", "agenda"]}
          />
        </div>
      )}
    </div>
  );
}
