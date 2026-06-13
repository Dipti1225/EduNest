import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import api from "../../utils/api";
import {
  BookOpenText, Video, FileText, NotebookPen,
  PenLine, ClipboardList, Trophy, LayoutDashboard,
  Calendar, MessageCircle, FolderOpen, ChevronRight, AlertCircle
} from "lucide-react";

const cardData = [
  {
    to: '/teachers/homework',
    icon: <PenLine size={24} className="text-purple-500" />,
    label: 'Homework',
    desc: 'Create & manage homework',
    gradient: 'from-purple-50 to-pink-50',
    border: 'border-purple-200',
  },
  {
    to: '/teachers/assignments',
    icon: <ClipboardList size={24} className="text-emerald-500" />,
    label: 'Assignments',
    desc: 'Create & grade assignments',
    gradient: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-200',
  },
  {
    to: '/teachers/syllabus',
    icon: <BookOpenText size={24} className="text-blue-600" />,
    label: 'Syllabus Control',
    desc: 'Manage class syllabus',
    gradient: 'from-sky-50 to-blue-50',
    border: 'border-sky-200',
  },
  {
    to: '/teachers/tests',
    icon: <FileText size={24} className="text-green-600" />,
    label: 'Manage Tests',
    desc: 'Create & view test results',
    gradient: 'from-green-50 to-lime-50',
    border: 'border-green-200',
  },
  {
    to: '/teachers/notes',
    icon: <NotebookPen size={24} className="text-pink-500" />,
    label: 'Notes PDF',
    desc: 'Upload study notes',
    gradient: 'from-pink-50 to-rose-50',
    border: 'border-pink-200',
  },
  {
    to: '/teachers/video-material',
    icon: <Video size={24} className="text-orange-500" />,
    label: 'Video Uploads',
    desc: 'Upload video material',
    gradient: 'from-orange-50 to-amber-50',
    border: 'border-orange-200',
  },
  {
    to: '/teachers/test-records',
    icon: <Trophy size={24} className="text-yellow-500" />,
    label: 'Test Records',
    desc: 'View student performance',
    gradient: 'from-yellow-50 to-amber-50',
    border: 'border-yellow-200',
  },
  {
    to: '/teachers/calendar',
    icon: <Calendar size={24} className="text-cyan-500" />,
    label: 'Calendar',
    desc: 'Manage schedule & events',
    gradient: 'from-cyan-50 to-sky-50',
    border: 'border-cyan-200',
  },
  {
    to: '/teachers/messages',
    icon: <MessageCircle size={24} className="text-indigo-500" />,
    label: 'Messages',
    desc: 'Chat with students',
    gradient: 'from-indigo-50 to-violet-50',
    border: 'border-indigo-200',
  },
];

const TeacherHome = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/allocations/my-allocations")
      .then(res => {
        setAllocations(res.data.allocations || []);
      })
      .catch(err => {
        console.error("Error loading teacher allocations:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen p-6 pb-24 lg:pb-8 bg-base-200">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="text-center card bg-base-100 p-6 shadow-md border border-base-200">
          <h1 className="text-3xl font-black text-primary">
            Welcome Back, {user?.name || "Teacher"}! 👩‍🏫
          </h1>
          <p className="text-base-content/60 mt-1">
            Manage your classroom files, video lectures, and student records.
          </p>
        </div>

        {/* Classroom Folders Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold flex items-center gap-2 text-secondary">
            <FolderOpen /> Assigned Classroom Folders
          </h2>
          <p className="text-sm text-base-content/60">
            Select an allocated folder to upload notes or lectures directly for those students.
          </p>

          {loading ? (
            <div className="flex items-center justify-center p-12 bg-base-100 rounded-2xl border">
              <span className="loading loading-spinner loading-md text-primary"></span>
            </div>
          ) : allocations.length === 0 ? (
            <div className="card bg-base-100 border p-6 flex flex-col items-center justify-center text-center space-y-2">
              <AlertCircle size={40} className="text-base-content/30" />
              <h4 className="font-bold text-base">No Allocated Folders</h4>
              <p className="text-xs text-base-content/50 max-w-sm">
                Your school, college or coaching academy hasn't allocated any standards/subjects to your profile yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {allocations.map((alloc) => {
                const isSem = alloc.standard?.toLowerCase().includes("semester");
                const folderTitle = isSem ? `${alloc.standard} - ${alloc.subject}` : `Class ${alloc.standard} - ${alloc.subject}`;
                
                return (
                  <div 
                    key={alloc._id} 
                    onClick={() => navigate(`/teachers/classroom/${alloc._id}`)}
                    className="card bg-base-100 shadow border border-base-200 hover:border-secondary hover:shadow-md cursor-pointer transition-all duration-200 group"
                  >
                    <div className="card-body p-4 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-secondary/10 text-secondary rounded-xl group-hover:bg-secondary group-hover:text-white transition-colors duration-200">
                          <FolderOpen size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-base-content group-hover:text-secondary transition-colors">{folderTitle}</h4>
                          <span className="text-xs text-base-content/40">Batch/Section: {alloc.classNumber || "A"}</span>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-base-content/30 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-secondary flex items-center gap-2">
            <LayoutDashboard size={20} /> Quick Utilities Panel
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {cardData.map((card) => (
              <Link
                to={card.to}
                key={card.label}
                className={`card bg-gradient-to-br ${card.gradient} border ${card.border} shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200`}
              >
                <div className="card-body items-center text-center p-4">
                  <div className="mb-2">{card.icon}</div>
                  <h2 className="font-semibold text-xs">{card.label}</h2>
                  <p className="text-[11px] text-base-content/50 hidden sm:block">
                    {card.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-base-content/40 text-xs">
          EduNest · Teacher Panel · © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default TeacherHome;
