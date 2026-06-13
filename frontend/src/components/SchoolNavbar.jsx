import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import {
  LayoutDashboard, Users, Menu, LogOut, ClipboardList, Trophy, MessageCircle
} from "lucide-react";
import logo from "../assets/edunest-logo.png";

const SchoolNavbar = () => {
  const { user, setUser } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [instType, setInstType] = React.useState("School");

  React.useEffect(() => {
    if (user?.schoolId) {
      const cachedType = localStorage.getItem(`inst_type_${user.schoolId}`);
      if (cachedType) {
        setInstType(cachedType);
      } else {
        fetch(`http://localhost:5001/api/eduNest/institutions/${user.schoolId}`)
          .then(res => res.json())
          .then(data => {
            if (data.type) {
              const formattedType = data.type === "coachingCenter" ? "Coaching" : data.type === "college" ? "College" : "School";
              setInstType(formattedType);
              localStorage.setItem(`inst_type_${user.schoolId}`, formattedType);
            }
          })
          .catch(() => {});
      }
    }
  }, [user]);

  const navItems = [
    { name: "Dashboard", path: "/school", icon: <LayoutDashboard size={20} /> },
    { name: "Teachers", path: "/school/teachers", icon: <Users size={20} /> },
    { name: "Students", path: "/school/students", icon: <Users size={20} /> },
    { name: "Activities", path: "/school/activities", icon: <ClipboardList size={20} /> },
    { name: "Test Records", path: "/school/test-records", icon: <Trophy size={20} /> },
  ];

  const isActive = (path) => location.pathname === path ? "btn-active" : "";

  const handleLogout = (e) => {
    e.preventDefault();
    const currentSchoolId = user?.schoolId;
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setUser(null);
    if (currentSchoolId) {
      navigate(`/school/public/${currentSchoolId}`);
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="navbar bg-base-100 shadow-md z-50 sticky top-0">
      <div className="flex-1">
        <Link to="/school" className="flex items-center gap-2">
          <img src={logo} alt="EduNest" className="h-10" />
          <span className="text-sm badge badge-secondary badge-outline">{instType}</span>
        </Link>
      </div>

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
        <button onClick={handleLogout} className="btn btn-ghost btn-error tooltip tooltip-bottom" data-tip="Logout">
          <LogOut size={20} />
        </button>
      </div>

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
          <li><button onClick={handleLogout} className="text-error w-full text-left flex items-center gap-2"><LogOut size={16} /> Logout</button></li>
        </ul>
      </div>
    </nav>
  );
};

export default SchoolNavbar;
