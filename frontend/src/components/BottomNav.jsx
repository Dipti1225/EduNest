import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import {
  LayoutDashboard, BookOpenText, FileText,
  NotebookPen, ClipboardList, User, Home,
  PenLine, GraduationCap, Users, Building2,
} from "lucide-react";

const BottomNav = () => {
  const { user } = useUser();
  const location = useLocation();

  if (!user) return null;

  const getNavItems = () => {
    if (user.role === "student") {
      return [
        { name: "Home", path: "/students", icon: <Home size={20} /> },
        { name: "Homework", path: "/students/homework", icon: <PenLine size={20} /> },
        { name: "Tests", path: "/students/tests", icon: <FileText size={20} /> },
        { name: "Notes", path: "/students/notes", icon: <NotebookPen size={20} /> },
        { name: "Profile", path: "/students/profile", icon: <User size={20} /> },
      ];
    }
    if (user.role === "teacher") {
      return [
        { name: "Home", path: "/teachers", icon: <Home size={20} /> },
        { name: "Homework", path: "/teachers/homework", icon: <PenLine size={20} /> },
        { name: "Tests", path: "/teachers/tests", icon: <FileText size={20} /> },
        { name: "Notes", path: "/teachers/notes", icon: <NotebookPen size={20} /> },
        { name: "Profile", path: "/teachers/profile", icon: <User size={20} /> },
      ];
    }
    if (user.role === "admin") {
      return [
        { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
        { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
        { name: "Schools", path: "/admin/institutions", icon: <Building2 size={20} /> },
      ];
    }
    // School
    return [
      { name: "Dashboard", path: "/school", icon: <LayoutDashboard size={20} /> },
      { name: "Teachers", path: "/school/teachers", icon: <GraduationCap size={20} /> },
      { name: "Students", path: "/school/students", icon: <Users size={20} /> },
      { name: "Activities", path: "/school/activities", icon: <ClipboardList size={20} /> },
    ];
  };

  const navItems = getNavItems();
  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[90] lg:hidden"
      style={{
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(0, 0, 0, 0.08)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex items-center justify-around py-1">
        {navItems.map(({ name, path, icon }, idx) => (
          <Link
            to={path}
            key={idx}
            className={`flex flex-col items-center justify-center py-1.5 px-2 min-w-[56px] rounded-xl transition-all duration-200 ${
              isActive(path)
                ? "text-primary"
                : "text-base-content/50 hover:text-base-content/80"
            }`}
            id={`bottom-nav-${name.toLowerCase().replace(/\s/g, "-")}`}
          >
            <div
              className={`p-1 rounded-lg transition-all duration-200 ${
                isActive(path)
                  ? "bg-primary/10 scale-110"
                  : ""
              }`}
            >
              {icon}
            </div>
            <span
              className={`text-[10px] mt-0.5 font-medium transition-all ${
                isActive(path) ? "text-primary" : ""
              }`}
            >
              {name}
            </span>
            {isActive(path) && (
              <div
                className="absolute top-0 h-[3px] w-8 rounded-b-full bg-primary"
                style={{ transition: "all 0.3s ease" }}
              />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
