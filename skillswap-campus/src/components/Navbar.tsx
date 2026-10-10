import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Users,
  Calendar,
  BookOpen,
  Award,
  TrendingUp,
  LayoutDashboard,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  GraduationCap,
  Presentation,
  CheckCheck,
  Menu,
} from 'lucide-react';
import type { ActiveTab, Student, NotificationItem, UserMode } from '../types';

interface NavbarProps {
  userMode: UserMode;
  onModeChange: (mode: UserMode) => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  activeUser: Student;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  pendingRequestsCount: number;
  notifications: NotificationItem[];
  onMarkNotificationsRead: () => void;
  onSelectNotification: (notif: NotificationItem) => void;
  onOpenProfile: () => void;
}

export default function Navbar({
  userMode,
  onModeChange,
  activeTab,
  onTabChange,
  activeUser,
  searchQuery,
  onSearchChange,
  pendingRequestsCount,
  notifications,
  onMarkNotificationsRead,
  onSelectNotification,
  onOpenProfile,
}: NavbarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const learnerTabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'explore', label: 'Explore Trainers', icon: <Users className="w-3.5 h-3.5" /> },
    {
      id: 'sessions',
      label: 'My Learning Sessions',
      icon: <Calendar className="w-3.5 h-3.5" />,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
    },
    { id: 'groups', label: 'Study Groups', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'assessment', label: 'Skill Assessment', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'progress', label: 'Learning Progress', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  ];

  const trainerTabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'trainer_dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: 'teaching_skills', label: 'Teaching Skills', icon: <Sparkles className="w-3.5 h-3.5" /> },
    {
      id: 'teaching_sessions',
      label: 'Session Requests',
      icon: <Calendar className="w-3.5 h-3.5" />,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
    },
    { id: 'verification', label: 'Verification', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'feedback', label: 'Reviews', icon: <MessageSquare className="w-3.5 h-3.5" /> },
  ];

  const navItems = userMode === 'learner' ? learnerTabs : trainerTabs;

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
        
        {/* Left: Brand Identity (Matching Landing Page Minimal Style) */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => onTabChange(userMode === 'learner' ? 'explore' : 'trainer_dashboard')}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#7ed957]/15 border border-[#7ed957]/40 text-slate-700 flex items-center justify-center shadow-2xs group-hover:bg-[#7ed957] group-hover:text-white transition-all">
              <Menu className="w-4 h-4" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-700 block leading-none">
                Swapledge
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide block mt-1">
                Campus peer education
              </span>
            </div>
          </button>

          {/* Mode Switcher Pill (Matching Landing Page Green/Slate Aesthetic) */}
          <div className="hidden sm:flex items-center bg-slate-100/90 p-1 rounded-full border border-slate-200/60 ml-2">
            <button
              onClick={() => onModeChange('learner')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                userMode === 'learner'
                  ? 'bg-[#7ed957] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Learner
            </button>
            <button
              onClick={() => onModeChange('trainer')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                userMode === 'trainer'
                  ? 'bg-[#7ed957] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              Trainer
            </button>
          </div>
        </div>

        {/* Center Search Input (Pill Style Matching Landing Page) */}
        {userMode === 'learner' && (
          <div className="hidden xl:flex items-center flex-1 max-w-xs mx-2">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (activeTab !== 'explore') onTabChange('explore');
                }}
                placeholder="Search skills or peers..."
                className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200/80 rounded-full text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#7ed957] transition-all"
              />
            </div>
          </div>
        )}

        {/* Navigation Links (Matching Landing Page Uppercase / Underline Nav Style) */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-full text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#eaf5ff] text-slate-900 font-extrabold shadow-2xs'
                    : 'text-slate-500 font-semibold hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span className={isActive ? 'text-teal-600' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-0.5 px-1.5 py-0.2 bg-[#7ed957] text-white text-[10px] font-extrabold rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Notifications & Active Student Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((o) => !o)}
              className="relative p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#ffcf40] text-slate-900 text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                  <span className="text-xs font-bold text-slate-800">Campus Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkNotificationsRead}
                      className="text-[11px] font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">No notifications yet</p>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => {
                          onSelectNotification(n);
                          setNotifOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition flex items-start gap-2.5 ${
                          !n.read ? 'bg-[#eaf5ff]/40' : ''
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            !n.read ? 'bg-[#7ed957]' : 'bg-slate-200'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{n.title}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Pill */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full border border-slate-200/80 hover:border-[#7ed957] bg-white transition-all cursor-pointer"
          >
            <img
              src={activeUser.avatar}
              alt={activeUser.name}
              className="w-7 h-7 rounded-full object-cover bg-slate-100"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-700 leading-none truncate max-w-[110px]">
                {activeUser.name}
              </p>
              <p className="text-[10px] text-slate-400 font-medium leading-none mt-1 truncate max-w-[110px]">
                {activeUser.department}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-100 bg-white px-2 py-1.5 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[10px] font-semibold transition-all ${
                isActive ? 'text-teal-700 font-bold bg-[#eaf5ff]/60' : 'text-slate-500'
              }`}
            >
              {item.icon}
              <span className="truncate max-w-[70px]">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}