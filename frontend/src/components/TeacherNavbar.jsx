import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import {
  Menu, Calendar, BookOpenText, Video,
  FileText, NotebookPen, LayoutDashboard, MessageCircle, LogOut,
  PenLine, ClipboardList, Trophy,
} from "lucide-react";
import logo from "../assets/edunest-logo.png";

const TeacherNavbar = () => {
  const { user, setUser } = useUser();
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/teachers", icon: <LayoutDashboard size={20} /> },
    { name: "Calendar", path: "/teachers/calendar", icon: <Calendar size={20} /> },
    { name: "Syllabus", path: "/teachers/syllabus", icon: <BookOpenText size={20} /> },
    { name: "Homework", path: "/teachers/homework", icon: <PenLine size={20} /> },
    { name: "Assignments", path: "/teachers/assignments", icon: <ClipboardList size={20} /> },
    { name: "Tests", path: "/teachers/tests", icon: <FileText size={20} /> },
    { name: "Notes", path: "/teachers/notes", icon: <NotebookPen size={20} /> },
    { name: "Videos", path: "/teachers/video-material", icon: <Video size={20} /> },
    { name: "Records", path: "/teachers/test-records", icon: <Trophy size={20} /> },
    { name: "Messages", path: "/teachers/messages", icon: <MessageCircle size={20} /> },
  ];

  const isActive = (path) => location.pathname === path ? "btn-active" : "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  return (
    <nav className="navbar bg-base-100 shadow-md z-50 sticky top-0">
      {/* Logo */}
      <div className="flex-1">
        <Link to="/teachers" className="flex items-center gap-2">
          <img src={logo} alt="EduNest" className="h-10" />
          <span className="text-sm badge badge-secondary badge-outline hidden sm:inline-flex">Teacher</span>
        </Link>
      </div>

      {/* Desktop Links */}
      <div className="hidden lg:flex gap-1">
        {navItems.map(({ name, path, icon }, idx) => (
          <Link
            to={path}
            key={idx}
            className={`btn btn-ghost btn-sm ${isActive(path)} tooltip tooltip-bottom`}
            data-tip={name}
          >
            {icon}
          </Link>
        ))}
        <Link to="/login" onClick={handleLogout} className="btn btn-ghost btn-sm btn-error tooltip tooltip-bottom" data-tip="Logout">
          <LogOut size={20} />
        </Link>
      </div>

      {/* Profile */}
      <div className="ml-2">
        <div className="avatar">
          <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
            <Link to="/teachers/profile">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" />
              ) : (
                <div className="w-10 h-10 bg-primary flex items-center justify-center text-primary-content font-bold uppercase">
                  {user?.name?.charAt(0) ?? "?"}
                </div>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div className="dropdown dropdown-end lg:hidden">
        <label tabIndex={0} className="btn btn-ghost">
          <Menu />
        </label>
        <ul tabIndex={0} className="menu dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          {navItems.map(({ name, path, icon }, idx) => (
            <li key={idx}>
              <Link to={path} className="flex items-center gap-2">
                {icon} {name}
              </Link>
            </li>
          ))}
          <li><Link to="/login" onClick={handleLogout} className="text-error"><LogOut size={16} /> Logout</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default TeacherNavbar;
