import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";
import TeacherNavbar from "./TeacherNavbar";
import AdminNavbar from "./AdminNavbar";
import SchoolNavbar from "./SchoolNavbar";
import BottomNav from "./BottomNav";
import AIAssistant from "./AIAssistant";
import { useUser } from "../context/UserContext";

const Layout = () => {
  const location = useLocation();
  const { user } = useUser();
  const path = location.pathname;

  const renderNavbar = () => {
    if (!user) return null;

    // Admin paths
    if (path.startsWith("/admin") && user.role === "admin") return <AdminNavbar />;

    // School paths
    if (path.startsWith("/school")) return <SchoolNavbar />;

    // Teacher
    if (user.role === "teacher") return <TeacherNavbar />;

    // Student
    if (user.role === "student") return <StudentNavbar />;

    return null;
  };

  // AI Assistant: show on homework, notes, assignments, dashboard — BUT NOT on tests pages
  const showAI = user && !path.includes("/tests");

  return (
    <div className="min-h-screen flex flex-col">
      {renderNavbar()}
      <main className="flex-grow pb-16 lg:pb-0">
        <Outlet />
      </main>
      <BottomNav />
      {showAI && <AIAssistant />}
    </div>
  );
};

export default Layout;
