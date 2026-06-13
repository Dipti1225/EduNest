import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import {
  BookOpenText, Video, FileText, NotebookPen,
  PenLine, ClipboardList, Trophy, LayoutDashboard,
  Calendar, MessageCircle
} from 'lucide-react';

const cardData = [
  {
    to: '/students/dashboard',
    icon: <LayoutDashboard size={32} className="text-blue-500" />,
    label: 'Dashboard',
    desc: 'View your performance overview',
    gradient: 'from-blue-50 to-indigo-50',
    border: 'border-blue-200',
  },
  {
    to: '/students/homework',
    icon: <PenLine size={32} className="text-purple-500" />,
    label: 'Homework',
    desc: 'Check pending homework',
    gradient: 'from-purple-50 to-pink-50',
    border: 'border-purple-200',
  },
  {
    to: '/students/assignments',
    icon: <ClipboardList size={32} className="text-emerald-500" />,
    label: 'Assignments',
    desc: 'Submit & track assignments',
    gradient: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-200',
  },
  {
    to: '/students/syllabus',
    icon: <BookOpenText size={32} className="text-blue-600" />,
    label: 'Syllabus',
    desc: 'View your class syllabus',
    gradient: 'from-sky-50 to-blue-50',
    border: 'border-sky-200',
  },
  {
    to: '/students/video-material',
    icon: <Video size={32} className="text-orange-500" />,
    label: 'Video Material',
    desc: 'Watch learning videos',
    gradient: 'from-orange-50 to-amber-50',
    border: 'border-orange-200',
  },
  {
    to: '/students/tests',
    icon: <FileText size={32} className="text-green-600" />,
    label: 'Tests',
    desc: 'Attempt available tests',
    gradient: 'from-green-50 to-lime-50',
    border: 'border-green-200',
  },
  {
    to: '/students/notes',
    icon: <NotebookPen size={32} className="text-pink-500" />,
    label: 'Notes PDF',
    desc: 'Download study notes',
    gradient: 'from-pink-50 to-rose-50',
    border: 'border-pink-200',
  },
  {
    to: '/students/test-records',
    icon: <Trophy size={32} className="text-yellow-500" />,
    label: 'Test Records',
    desc: 'View scores & leaderboard',
    gradient: 'from-yellow-50 to-amber-50',
    border: 'border-yellow-200',
  },
  {
    to: '/students/calendar',
    icon: <Calendar size={32} className="text-cyan-500" />,
    label: 'Calendar',
    desc: 'View upcoming events',
    gradient: 'from-cyan-50 to-sky-50',
    border: 'border-cyan-200',
  },
  {
    to: '/students/messages',
    icon: <MessageCircle size={32} className="text-indigo-500" />,
    label: 'Messages',
    desc: 'Chat with teachers',
    gradient: 'from-indigo-50 to-violet-50',
    border: 'border-indigo-200',
  },
];

const StudentHome = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen p-4 pb-24 lg:pb-8">
      <div className="max-w-5xl mx-auto">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name?.split(" ")[0] || "Student"}! 👋
          </h1>
          <p className="text-base-content/60 mt-1">
            Class {user?.classNumber || "—"} · What would you like to do today?
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {cardData.map((card) => (
            <Link
              to={card.to}
              key={card.label}
              className={`card bg-gradient-to-br ${card.gradient} border ${card.border} shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200`}
            >
              <div className="card-body items-center text-center p-4">
                <div className="mb-2">{card.icon}</div>
                <h2 className="font-semibold text-sm">{card.label}</h2>
                <p className="text-xs text-base-content/50 hidden sm:block">
                  {card.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-base-content/40 text-xs">
          EduNest · Your AI-Powered Learning Companion · © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
