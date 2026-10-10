import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  BookOpen,
  Users,
  Award,
  Menu,
  X,
  Check,
  Sparkles,
  ExternalLink,
  ChevronDown,
  GraduationCap,
  Presentation,
  ShieldCheck,
  TrendingUp,
  SlidersHorizontal,
  User,
  LogOut,
  Settings,
} from 'lucide-react';
import type {
  ActiveTab,
  Student,
  NotificationItem,
  UserMode,
  LearnerTab,
  TrainerTab,
} from '../types';

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

const LEARNER_TABS: { id: LearnerTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'explore', label: 'Explore Trainers', icon: Users },
  { id: 'sessions', label: 'My Learning Sessions', icon: BookOpen },
  { id: 'groups', label: 'Study Groups', icon: Sparkles },
  { id: 'assessment', label: 'Skill Assessment', icon: Award },
  { id: 'progress', label: 'Learning Progress', icon: TrendingUp },
];

const TRAINER_TABS: { id: TrainerTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'trainer_dashboard', label: 'Trainer Dashboard', icon: Presentation },
  { id: 'teaching_skills', label: 'Teaching Skills', icon: SlidersHorizontal },
  { id: 'teaching_sessions', label: 'Teaching Sessions', icon: BookOpen },
  { id: 'verification', label: 'Trainer Verification', icon: ShieldCheck },
  { id: 'feedback', label: 'Learner Reviews', icon: Award },
];

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentTabs = userMode === 'learner' ? LEARNER_TABS : TRAINER_TABS;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 lg:gap-6">
          {/* Brand Identity: Swapledge (SL Logo) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onTabChange(userMode === 'learner' ? 'explore' : 'trainer_dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
              aria-label="Swapledge Home"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm tracking-wider shadow-xs group-hover:bg-indigo-700 transition-colors">
                SL
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-base leading-tight block tracking-tight">
                  Swap<span className="text-indigo-600">ledge</span>
                </span>
                <span className="text-[10px] text-slate-500 hidden xl:block font-medium tracking-tight">
                  Share Knowledge. Learn Freely. Grow Together.
                </span>
              </div>
            </button>
          </div>

          {/* Mode Switcher: Segmented Control [ Learner ] [ Trainer ] */}
          <div className="hidden md:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 shadow-2xs">
            <button
              onClick={() => onModeChange('learner')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                userMode === 'learner'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to Learner Mode — Find trainers and learn new skills"
            >
              <GraduationCap className={`w-3.5 h-3.5 ${userMode === 'learner' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Learner</span>
            </button>
            <button
              onClick={() => onModeChange('trainer')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                userMode === 'trainer'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to Trainer Mode — Share skills, manage sessions & verification"
            >
              <Presentation className={`w-3.5 h-3.5 ${userMode === 'trainer' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Trainer</span>
              {activeUser.trainerVerificationStatus === 'verified' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Verified Trainer" />
              )}
            </button>
          </div>

          {/* Quick Search Bar */}
          <div className="flex-1 max-w-xs md:max-w-sm hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                placeholder={
                  userMode === 'learner'
                    ? 'Search trainers, skills, topics…'
                    : 'Search teaching subjects, topics…'
                }
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50/70 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-sm"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Mode-Aware Navigation Tabs */}
          <nav className="hidden xl:flex items-center gap-1" aria-label="Mode Navigation">
            {currentTabs.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              const hasBadge =
                (id === 'sessions' || id === 'teaching_sessions') &&
                pendingRequestsCount > 0;

              return (
                <button
                  key={id}
                  onClick={() => onTabChange(id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{label}</span>
                  {hasBadge && (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-600 text-white animate-pulse">
                      {pendingRequestsCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Utilities: Notifications & Profile */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Notifications Popover */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setProfileOpen(false);
                }}
                className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors focus:outline-hidden"
                aria-label={`Notifications (${unreadCount} unread)`}
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-92 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-3 z-50 text-slate-800 animate-fade-in">
                  <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">Notifications</h3>
                      <p className="text-[11px] text-slate-500">Activity on Swapledge</p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={onMarkNotificationsRead}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-6">No notifications yet.</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            onSelectNotification(n);
                            setNotifOpen(false);
                          }}
                          className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-2.5 ${
                            !n.read ? 'bg-indigo-50/40' : ''
                          }`}
                        >
                          <span
                            className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                              !n.read ? 'bg-indigo-600' : 'bg-slate-300'
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 leading-tight">{n.title}</p>
                            <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-2">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown Menu (No Persona Switcher, No Reset Mock Data) */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2 p-1 pl-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-hidden"
              >
                <img
                  src={activeUser.avatar}
                  alt={activeUser.name}
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-slate-100 object-cover"
                />
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-slate-800 leading-none">{activeUser.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[110px]">{activeUser.department}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 text-slate-800 animate-fade-in">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{activeUser.name}</p>
                    <p className="text-[11px] text-slate-500">{activeUser.email}</p>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200/60">
                        {activeUser.department} · Yr {activeUser.year}
                      </span>
                      {activeUser.trainerVerificationStatus === 'verified' ? (
                        <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200/60">
                          Verified Trainer
                        </span>
                      ) : activeUser.trainerVerificationStatus === 'pending' ? (
                        <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200/60">
                          Verification Pending
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Mode Indicator in Dropdown */}
                  <div className="px-4 py-2 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px] font-medium">Active Role:</span>
                    <span className="font-bold text-indigo-600 capitalize flex items-center gap-1">
                      {userMode === 'learner' ? <GraduationCap className="w-3.5 h-3.5" /> : <Presentation className="w-3.5 h-3.5" />}
                      {userMode} Mode
                    </span>
                  </div>

                  <div className="py-1 text-xs">
                    <button
                      onClick={() => {
                        onOpenProfile();
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        View My Profile
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        onModeChange(userMode === 'learner' ? 'trainer' : 'learner');
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-indigo-600 font-medium flex items-center gap-2 transition-colors"
                    >
                      {userMode === 'learner' ? (
                        <>
                          <Presentation className="w-3.5 h-3.5" />
                          Switch to Trainer Mode
                        </>
                      ) : (
                        <>
                          <GraduationCap className="w-3.5 h-3.5" />
                          Switch to Learner Mode
                        </>
                      )}
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => {
                        alert('Account settings are configured according to your campus enrollment.');
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-600 font-medium flex items-center gap-2 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      Account Settings
                    </button>

                    <button
                      onClick={() => {
                        alert('You are securely signed in via Swapledge Campus Auth.');
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-500 font-medium flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 text-slate-400" />
                      Session Status: Active
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder={userMode === 'learner' ? 'Search trainers, skills…' : 'Search subjects…'}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden pb-4 border-t border-slate-100 pt-3 flex flex-col gap-2 animate-fade-in">
            {/* Mobile Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => onModeChange('learner')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  userMode === 'learner' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
                }`}
              >
                <GraduationCap className="w-4 h-4" /> Learner Mode
              </button>
              <button
                onClick={() => onModeChange('trainer')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  userMode === 'trainer' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
                }`}
              >
                <Presentation className="w-4 h-4" /> Trainer Mode
              </button>
            </div>

            {/* Mode-Specific Navigation Links */}
            <div className="flex flex-col gap-1">
              {currentTabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    onTabChange(id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors text-left ${
                    activeTab === id
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{label}</span>
                  </div>
                  {(id === 'sessions' || id === 'teaching_sessions') && pendingRequestsCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                      {pendingRequestsCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
