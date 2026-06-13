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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Calendar as CalendarIcon, Trash as FaTrash, Plus, RefreshCw } from "lucide-react";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const STANDARDS = ["1","2","3","4","5","6","7","8","9","10","11","12", "Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"];

export default function TeacherCalendar() {
  const { user } = useUser();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Event form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [eventType, setEventType] = useState("event");
  const [classNumber, setClassNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [color, setColor] = useState("#3B82F6");
  const [saving, setSaving] = useState(false);

  // Fetch all calendar events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/calendar");
      const list = Array.isArray(res.data) 
        ? res.data 
        : (res.data.data || []);
      
      const mapped = list.map(ev => ({
        ...ev,
        start: new Date(ev.start || ev.startDate),
        end: new Date(ev.end || ev.endDate)
      }));
      setEvents(mapped);
    } catch (err) {
      console.error("Error loading calendar events:", err);
      toast.error("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (new Date(startDate) >= new Date(endDate)) {
      toast.error("End date must be after start date!");
      return;
    }

    setSaving(true);
    const payload = {
      title,
      description,
      startDate,
      endDate,
      eventType,
      classNumber,
      subject,
      color
    };

    try {
      const res = await api.post("/calendar", payload);
      toast.success("Calendar event created!");
      // Reset form
      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setEventType("event");
      setClassNumber("");
      setSubject("");
      setColor("#3B82F6");

      fetchEvents();
    } catch (err) {
      console.error("Save event error:", err);
      toast.error(err.response?.data?.message || "Failed to save calendar event.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await api.delete(`/calendar/${id}`);
      toast.success("Event deleted!");
      fetchEvents();
    } catch (err) {
      console.error("Delete event error:", err);
      toast.error(err.response?.data?.message || "Not authorized to delete this event.");
    }
  };

  // Color mapper based on event type
  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color || "#3B82F6",
        borderRadius: "8px",
        opacity: 0.85,
        color: "white",
        border: "none",
        display: "block",
        padding: "2px 6px"
      }
    };
  };

  // Custom agenda row for displaying delete button
  const handleSelectEvent = (event) => {
    // Show quick info and delete button
    const confirmDelete = window.confirm(
      `Event: ${event.title}\nDescription: ${event.description || "No description"}\nType: ${event.eventType}\n\nDo you want to delete this event?`
    );
    if (confirmDelete) {
      handleDelete(event._id || event.id);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-base-200 space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div>
        <h2 className="text-3xl font-extrabold text-primary flex items-center gap-2">
          <CalendarIcon className="text-secondary" /> Schedule & Updates Management
        </h2>
        <p className="text-base-content/60 mt-1">Manage events, exams, assignments, classes and holidays for students.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Form Column */}
        <div className="lg:col-span-1 card bg-base-100 border border-base-200 shadow-xl p-5 space-y-4 h-fit">
          <h3 className="text-lg font-bold border-b pb-2 flex items-center gap-2 text-secondary">
            <Plus /> Add Calendar Update
          </h3>
          <form onSubmit={handleAddEvent} className="space-y-3">
            <div>
              <label className="label"><span className="label-text">Event Title *</span></label>
              <input 
                type="text" 
                placeholder="e.g. Mid-Term Examination" 
                className="input input-bordered w-full input-sm" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label className="label"><span className="label-text">Description</span></label>
              <textarea 
                placeholder="Detailed information..." 
                className="textarea textarea-bordered w-full textarea-sm"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="label"><span className="label-text">Event Type *</span></label>
              <select 
                className="select select-bordered w-full select-sm" 
                value={eventType} 
                onChange={e => setEventType(e.target.value)} 
                required
              >
                <option value="event">Campus Event</option>
                <option value="class">Regular Class</option>
                <option value="examination">Examination</option>
                <option value="assignment">Assignment Deadline</option>
                <option value="holiday">Holiday</option>
                <option value="meeting">Parent-Teacher Meeting</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="label"><span className="label-text">Start Date & Time *</span></label>
                <input 
                  type="datetime-local" 
                  className="input input-bordered w-full input-sm"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label"><span className="label-text">End Date & Time *</span></label>
                <input 
                  type="datetime-local" 
                  className="input input-bordered w-full input-sm"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label"><span className="label-text">Standard (Opt)</span></label>
                <select 
                  className="select select-bordered w-full select-sm" 
                  value={classNumber} 
                  onChange={e => setClassNumber(e.target.value)}
                >
                  <option value="">All Classes</option>
                  {STANDARDS.map(std => <option key={std} value={std}>{std.includes("Semester") ? std : `Class ${std}`}</option>)}
                </select>
              </div>
              <div>
                <label className="label"><span className="label-text">Subject (Opt)</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. Science" 
                  className="input input-bordered w-full input-sm"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="label"><span className="label-text">Color Tag</span></label>
              <div className="flex gap-2">
                {["#3B82F6", "#EF4444", "#F59E0B", "#10B981", "#8B5CF6"].map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    className={`w-6 h-6 rounded-full border-2 ${color === hex ? "border-base-content" : "border-transparent"}`}
                    style={{ backgroundColor: hex }}
                    onClick={() => setColor(hex)}
                  />
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-secondary btn-sm w-full mt-4" 
              disabled={saving}
            >
              {saving ? <span className="loading loading-spinner loading-xs"></span> : "Add Event"}
            </button>
          </form>
        </div>

        {/* Calendar Column */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">📂 Academic Schedule</h3>
            <button className="btn btn-ghost btn-sm text-primary flex items-center gap-1" onClick={fetchEvents}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          <div className="bg-base-100 p-5 rounded-2xl shadow border border-base-200">
            <p className="text-xs text-base-content/50 mb-3">* Tip: Click on any event block to view detailed description or delete it.</p>
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              eventPropGetter={eventStyleGetter}
              onSelectEvent={handleSelectEvent}
              style={{ height: 600 }}
              views={["month", "week", "day", "agenda"]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
