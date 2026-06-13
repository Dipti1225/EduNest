import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import {
  LayoutDashboard, Users, Building2, LogOut, Menu, Trophy
} from "lucide-react";
import logo from "../assets/edunest-logo.png";

const AdminNavbar = () => {
  const { user, setUser } = useUser();
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
    { name: "Institutions", path: "/admin/institutions", icon: <Building2 size={20} /> },
  ];

  const isActive = (path) => location.pathname === path ? "btn-active" : "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  return (
    <nav className="navbar bg-base-100 shadow-md z-50 sticky top-0">
      <div className="flex-1">
        <Link to="/admin" className="flex items-center gap-2">
          <img src={logo} alt="EduNest" className="h-10" />
          <span className="text-sm badge badge-primary badge-outline">Admin</span>
        </Link>
      </div>

      {/* Desktop Links */}
      <div className="hidden lg:flex gap-2">
        {navItems.map(({ name, path, icon }, idx) => (
          <Link
            to={path}
            key={idx}
            className={`btn btn-ghost ${isActive(path)} tooltip tooltip-bottom`}
            data-tip={name}
          >
            {icon}
            <span className="ml-1">{name}</span>
          </Link>
        ))}
        <Link to="/login" onClick={handleLogout} className="btn btn-ghost btn-error tooltip tooltip-bottom" data-tip="Logout">
          <LogOut size={20} />
        </Link>
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

export default AdminNavbar;
