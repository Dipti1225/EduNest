import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import RegisterUser from "./pages/RegisterUser";
import RegisterInstitute from "./pages/RegisterInstitute";
import Layout from "./components/Layout";

// School pages
import SchoolHomePage from "./pages/schools/SchoolHomePage";
import RegisteredTeachers from "./pages/schools/RegisteredTeachers";
import ClassWiseStudents from "./pages/schools/RegisteredStudents";
import StandardWiseActivities from "./pages/schools/StandardWiseActivities";
import PublicSchoolPortal from "./pages/schools/PublicSchoolPortal";

// Teacher pages
import TeacherHome from "./pages/teachers/TeacherHome";
import TeacherProfile from "./pages/teachers/TeacherProfile";
import TCalendar from "./pages/teachers/Calendar";
import TSyllabus from "./pages/teachers/Syllabus";
import TeacherTests from "./pages/teachers/Tests";
import Notes from "./pages/teachers/Notes";
import VideoMaterialSchool from "./pages/teachers/VideoMaterialSchool";
import TeacherHomework from "./pages/teachers/Homework";
import TeacherAssignments from "./pages/teachers/Assignments";
import TeacherTestRecords from "./pages/teachers/TestRecords";
import ClassroomFolder from "./pages/teachers/ClassroomFolder";

// Student pages
import StudentHome from "./pages/students/StudentHome";
import StudentProfile from "./pages/students/StudentProfile";
import Dashboard from "./pages/students/Dashboard";
import Calendar from "./pages/students/Calendar";
import Syllabus from "./pages/students/Syllabus";
import StudentTests from "./pages/students/Tests";
import SNotes from "./pages/students/Notes";
import VideoMaterial from "./pages/students/VideoMaterial";
import PremiumUpgrade from "./pages/students/PremiumUpgrade";
import StudentHomework from "./pages/students/Homework";
import StudentAssignments from "./pages/students/Assignments";
import StudentTestRecords from "./pages/students/TestRecords";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageInstitutions from "./pages/admin/ManageInstitutions";

// Shared pages
import Messages from "./pages/Messages";

const App = () => {
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", storedTheme);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registerUser" element={<RegisterUser />} />
        <Route path="/registerInstitute" element={<RegisterInstitute />} />
        <Route path="/school/public/:schoolId" element={<PublicSchoolPortal />} />

        {/* Protected Routes with Layout/Navbar */}
        <Route element={<Layout />}>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/institutions" element={<ManageInstitutions />} />

          {/* School Routes */}
          <Route path="/school" element={<SchoolHomePage />} />
          <Route path="/school/teachers" element={<RegisteredTeachers />} />
          <Route path="/school/students" element={<ClassWiseStudents />} />
          <Route path="/school/activities" element={<StandardWiseActivities />} />

          {/* Teacher Routes */}
          <Route path="/teachers" element={<TeacherHome />} />
          <Route path="/teachers/profile" element={<TeacherProfile />} />
          <Route path="/teachers/calendar" element={<TCalendar />} />
          <Route path="/teachers/syllabus" element={<TSyllabus />} />
          <Route path="/teachers/tests" element={<TeacherTests />} />
          <Route path="/teachers/notes" element={<Notes />} />
          <Route path="/teachers/video-material" element={<VideoMaterialSchool />} />
          <Route path="/teachers/messages" element={<Messages />} />
          <Route path="/teachers/homework" element={<TeacherHomework />} />
          <Route path="/teachers/assignments" element={<TeacherAssignments />} />
          <Route path="/teachers/test-records" element={<TeacherTestRecords />} />
          <Route path="/teachers/classroom/:allocationId" element={<ClassroomFolder />} />

          {/* Student Routes */}
          <Route path="/students" element={<StudentHome />} />
          <Route path="/students/profile" element={<StudentProfile />} />
          <Route path="/students/dashboard" element={<Dashboard />} />
          <Route path="/students/calendar" element={<Calendar />} />
          <Route path="/students/syllabus" element={<Syllabus />} />
          <Route path="/students/tests" element={<StudentTests />} />
          <Route path="/students/notes" element={<SNotes />} />
          <Route path="/students/video-material" element={<VideoMaterial />} />
          <Route path="/students/premium" element={<PremiumUpgrade />} />
          <Route path="/students/messages" element={<Messages />} />
          <Route path="/students/homework" element={<StudentHomework />} />
          <Route path="/students/assignments" element={<StudentAssignments />} />
          <Route path="/students/test-records" element={<StudentTestRecords />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;