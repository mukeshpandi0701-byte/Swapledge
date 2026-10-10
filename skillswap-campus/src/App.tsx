import { LandingHero } from './components/LandingHero';
import { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import PeerCard from './components/PeerCard';
import PeerFilter from './components/PeerFilter';
import BookingModal from './components/BookingModal';
import SessionsView from './components/SessionsView';
import GroupCard from './components/GroupCard';
import AssessmentView from './components/AssessmentView';
import StudentProfileModal from './components/StudentProfileModal';
import TrainerDashboard from './components/TrainerDashboard';
import TrainerVerificationView from './components/TrainerVerificationView';
import TeachingSkillsView from './components/TeachingSkillsView';
import LearnerProgressView from './components/LearnerProgressView';
import {
  ACTIVE_USER,
  MOCK_STUDENTS,
  INITIAL_SESSIONS,
  INITIAL_GROUPS,
  QUIZZES,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';
import { calculateMatchScore } from './utils/matchingAlgorithm';
import {
  Users,
  Sparkles,
  CalendarCheck,
  Award,
  Menu,
} from 'lucide-react';
import type {
  ActiveTab,
  PeerFilters,
  Student,
  SessionRequest,
  StudyGroup,
  GroupResource,
  QuizResult,
  SessionReview,
  AssessmentBadge,
  NotificationItem,
  UserMode,
  TrainerApplication,
} from './types';

// ─── LocalStorage Helpers ──────────────────────────────────────────────────────
function loadLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveLS<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Graceful storage failure handling
  }
}

function getAllSkills(students: Student[]) {
  const set = new Set<string>();
  students.forEach((s) => {
    s.teaches.forEach((sk) => set.add(sk));
    s.wantsToLearn.forEach((sk) => set.add(sk));
  });
  return Array.from(set).sort();
}

export default function App() {
  // ─── Mode State (Learner vs Trainer) ─────────────────────────────────────────
  const [showLanding, setShowLanding] = useState(true);
  const [userMode, setUserMode] = useState<UserMode>(() =>
    loadLS<UserMode>('sl_user_mode', 'learner')
  );

  // ─── Persisted State ────────────────────────────────────────────────────────
  const [activeUser, setActiveUser] = useState<Student>(() =>
    loadLS('sl_active_user', ACTIVE_USER)
  );
  const [sessions, setSessions] = useState<SessionRequest[]>(() =>
    loadLS('sl_sessions', INITIAL_SESSIONS)
  );
  const [groups, setGroups] = useState<StudyGroup[]>(() =>
    loadLS('sl_groups', INITIAL_GROUPS)
  );
  const [completedQuizzes, setCompletedQuizzes] = useState<QuizResult[]>(() =>
    loadLS('sl_quiz_results', [])
  );
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>(() =>
    loadLS('sl_joined_groups', ['group-3'])
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadLS('sl_notifications', INITIAL_NOTIFICATIONS)
  );

  // ─── UI State ───────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<ActiveTab>(() =>
    userMode === 'learner' ? 'explore' : 'trainer_dashboard'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<PeerFilters>({
    keyword: '',
    department: '',
    skillOffered: '',
    skillWanted: '',
    verifiedOnly: false,
    availabilityFilter: '',
    sortOption: 'compatibility',
  });
  const [bookingTarget, setBookingTarget] = useState<Student | null>(null);
  const [profileTarget, setProfileTarget] = useState<Student | null>(null);
  const [selectedGroupSubject, setSelectedGroupSubject] = useState<string>('all');

  // ─── Storage Synchronization ────────────────────────────────────────────────
  useEffect(() => saveLS('sl_user_mode', userMode), [userMode]);
  useEffect(() => saveLS('sl_sessions', sessions), [sessions]);
  useEffect(() => saveLS('sl_groups', groups), [groups]);
  useEffect(() => saveLS('sl_quiz_results', completedQuizzes), [completedQuizzes]);
  useEffect(() => saveLS('sl_joined_groups', joinedGroupIds), [joinedGroupIds]);
  useEffect(() => saveLS('sl_active_user', activeUser), [activeUser]);
  useEffect(() => saveLS('sl_notifications', notifications), [notifications]);

  // Handle mode change
  const handleModeChange = (newMode: UserMode) => {
    setUserMode(newMode);
    if (newMode === 'learner') {
      setActiveTab('explore');
    } else {
      setActiveTab('trainer_dashboard');
    }
  };

  // ─── Derived Metadata ───────────────────────────────────────────────────────
  const departments = useMemo(
    () => Array.from(new Set(MOCK_STUDENTS.map((s) => s.department))).sort(),
    []
  );
  const allSkills = useMemo(() => getAllSkills(MOCK_STUDENTS), []);

  const groupSubjects = useMemo(() => {
    const subjects = Array.from(new Set(groups.map((g) => g.subject)));
    return ['all', ...subjects];
  }, [groups]);

  // ─── Filter & Sorting Logic for Exploring Trainers ──────────────────────────
  const effectiveKeyword = searchQuery || filters.keyword;

  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter((s) => {
      if (s.id === activeUser.id) return false;

      if (effectiveKeyword) {
        const kw = effectiveKeyword.toLowerCase();
        const matches =
          s.name.toLowerCase().includes(kw) ||
          s.department.toLowerCase().includes(kw) ||
          s.teaches.some((t) => t.toLowerCase().includes(kw)) ||
          s.wantsToLearn.some((t) => t.toLowerCase().includes(kw)) ||
          s.bio.toLowerCase().includes(kw);
        if (!matches) return false;
      }

      if (filters.department && s.department !== filters.department) {
        return false;
      }

      if (
        filters.skillOffered &&
        !s.teaches.some((t) => t.toLowerCase() === filters.skillOffered.toLowerCase())
      ) {
        return false;
      }

      if (
        filters.skillWanted &&
        !s.wantsToLearn.some((t) => t.toLowerCase() === filters.skillWanted.toLowerCase())
      ) {
        return false;
      }

      if (filters.verifiedOnly && s.trainerVerificationStatus !== 'verified') {
        return false;
      }

      if (filters.availabilityFilter) {
        const filterVal = filters.availabilityFilter.toLowerCase();
        const availText = (s.availability || '').toLowerCase();
        if (
          filterVal === 'weekday' &&
          !availText.includes('weekday') &&
          !availText.includes('mon') &&
          !availText.includes('tue')
        ) {
          return false;
        }
        if (filterVal === 'weekend' && !availText.includes('weekend')) {
          return false;
        }
        if (
          filterVal === 'afternoon' &&
          !availText.includes('afternoon') &&
          !availText.includes('pm') &&
          !availText.includes('evening')
        ) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortOption === 'rating') {
        return b.rating - a.rating;
      }
      if (filters.sortOption === 'reviews') {
        return b.reviewCount - a.reviewCount;
      }
      if (filters.sortOption === 'name') {
        return a.name.localeCompare(b.name);
      }
      return calculateMatchScore(activeUser, b) - calculateMatchScore(activeUser, a);
    });
  }, [effectiveKeyword, filters, activeUser]);

  // Filtered study groups
  const filteredGroups = useMemo(() => {
    if (selectedGroupSubject === 'all') return groups;
    return groups.filter((g) => g.subject.toLowerCase() === selectedGroupSubject.toLowerCase());
  }, [groups, selectedGroupSubject]);

  // Quick stats calculations
  const upcomingSessionsCount = useMemo(
    () => sessions.filter((s) => s.status === 'accepted').length,
    [sessions]
  );
  const incomingPendingCount = useMemo(
    () => sessions.filter((s) => s.status === 'pending' && s.peerId === activeUser.id).length,
    [sessions, activeUser.id]
  );
  const completedSessionsCount = useMemo(
    () => sessions.filter((s) => s.status === 'completed').length,
    [sessions]
  );

  // ─── Session Handlers ───────────────────────────────────────────────────────
  const handleBook = (session: SessionRequest) => {
    setSessions((prev) => [session, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Learning Session Request Sent',
      message: `Your request for "${session.skill}" with trainer ${session.peerName} was dispatched.`,
      time: 'Just now',
      type: 'session',
      read: false,
      targetTab: 'sessions',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleAccept = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'accepted' } : s))
    );
  };

  const handleDecline = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'declined' } : s))
    );
  };

  const handleComplete = (id: string, review: SessionReview) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'completed', review } : s))
    );
  };

  // ─── Group Handlers ─────────────────────────────────────────────────────────
  const handleToggleMembership = (groupId: string) => {
    setJoinedGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  const handleAddResource = (groupId: string, resource: GroupResource) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, resources: [resource, ...g.resources] } : g
      )
    );
  };

  // ─── Quiz Handlers ──────────────────────────────────────────────────────────
  const handleQuizComplete = (result: QuizResult) => {
    setCompletedQuizzes((prev) => {
      const withoutOld = prev.filter((r) => r.quizId !== result.quizId);
      return [...withoutOld, result];
    });

    if (result.passed) {
      const quiz = QUIZZES.find((q) => q.id === result.quizId);
      if (!quiz) return;

      const newBadge: AssessmentBadge = {
        skill: quiz.skill,
        level: quiz.level,
        verified: true,
        earnedAt: new Date().toISOString().split('T')[0],
      };

      setActiveUser((prev) => {
        const existingIndex = prev.badges.findIndex((b) => b.skill === quiz.skill);
        const updatedBadges =
          existingIndex >= 0
            ? prev.badges.map((b, i) => (i === existingIndex ? newBadge : b))
            : [...prev.badges, newBadge];
        return { ...prev, badges: updatedBadges };
      });

      const badgeNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'New Skill Credential Verified!',
        message: `Congratulations! "${quiz.badgeLabel}" badge has been added to your profile.`,
        time: 'Just now',
        type: 'badge',
        read: false,
        targetTab: 'assessment',
      };
      setNotifications((prev) => [badgeNotif, ...prev]);
    }
  };

  // ─── Trainer Profile & Verification Handlers ───────────────────────────────
  const handleUpdateTrainerApplication = (app: TrainerApplication) => {
    setActiveUser((prev) => ({
      ...prev,
      trainerApplication: app,
      trainerVerificationStatus: app.status,
      isVerified: app.status === 'verified' || prev.isVerified,
    }));

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Trainer Verification Updated',
      message:
        app.status === 'verified'
          ? 'Your trainer status is now officially VERIFIED across Swapledge!'
          : app.status === 'rejected'
          ? 'Your application requires revisions. Please review the feedback.'
          : 'Your trainer application was submitted for campus peer review.',
      time: 'Just now',
      type: 'trainer',
      read: false,
      targetTab: 'verification',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleUpdateTeachingProfile = (updates: Partial<Student>) => {
    setActiveUser((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  // ─── Notification Handlers ──────────────────────────────────────────────────
  const handleMarkNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSelectNotification = (notif: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    if (notif.targetTab) {
      setActiveTab(notif.targetTab);
    }
  };

  // ─── Hero Landing Page View ─────────────────────────────────────────────────
  if (showLanding) {
    return (
      <LandingHero
        onEnterApp={(initialQuery) => {
          try {
            const savedAuth = localStorage.getItem('swapledge_user_auth');
            if (savedAuth) {
              const parsed = JSON.parse(savedAuth);
              if (parsed.name) {
                setActiveUser((prev) => ({
                  ...prev,
                  name: parsed.name,
                  department: parsed.department || prev.department,
                }));
              }
            }
          } catch {
            // Ignore parse errors
          }

          if (initialQuery) {
            setSearchQuery(initialQuery);
            setUserMode('learner');
            setActiveTab('explore');
          }
          setShowLanding(false);
        }}
      />
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-white text-slate-800 font-sans selection:bg-teal-100 selection:text-teal-900 overflow-x-hidden flex flex-col justify-between">
      {/* ===================================================================== */}
      {/* FIXED DASHBOARD BACKGROUND PICTURE (Exact Landing Hero Illustration)  */}
      {/* ===================================================================== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Blue Curved Background Shape on Right */}
        <div
          className="hidden lg:block absolute top-0 right-0 w-[58%] h-full bg-gradient-to-br from-[#dceeff] via-[#eaf5ff] to-[#f8fbff]"
          style={{
            borderTopLeftRadius: '55% 85%',
            borderBottomLeftRadius: '35% 45%',
          }}
        />

        {/* Vector Illustration (Laptop, Idea Bulb, Stacked Books, Mug & Plant) */}
        <div className="hidden lg:flex absolute right-4 xl:right-16 top-1/2 -translate-y-1/2 w-[540px] xl:w-[620px] opacity-35 items-center justify-center">
          <svg
            viewBox="0 0 650 450"
            className="w-full h-auto"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="340" cy="405" rx="250" ry="12" fill="#CBD5E1" />
            <path
              d="M90 120H165C175 120 182 112 182 103C182 94 175 87 166 87C164 72 151 60 135 60C117 60 103 74 103 91C94 93 88 101 88 110"
              stroke="#475569"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M530 110H595C603 110 610 103 610 95C610 87 603 81 595 81C593 69 583 60 570 60C556 60 545 71 545 85"
              fill="white"
            />
            <path
              d="M525 185H580C587 185 593 179 593 172C593 165 587 160 580 160C578 150 569 142 558 142C546 142 536 152 536 164"
              fill="white"
              stroke="#475569"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <g transform="rotate(7 185 300)">
              <rect x="160" y="195" width="46" height="195" rx="3" fill="#7ED957" stroke="#334155" strokeWidth="2" />
              <rect x="160" y="218" width="46" height="12" fill="white" stroke="#334155" strokeWidth="1.5" />
              <rect x="160" y="355" width="46" height="14" fill="white" stroke="#334155" strokeWidth="1.5" />
            </g>
            <path d="M250 320H475C490 320 500 332 500 350C500 368 490 380 475 380H250V320Z" fill="#70A1FF" stroke="#334155" strokeWidth="2" />
            <path d="M260 328H472C482 328 490 337 490 350C490 363 482 372 472 372H260V328Z" fill="white" stroke="#334155" strokeWidth="1.5" />
            <line x1="275" y1="342" x2="465" y2="342" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="275" y1="356" x2="450" y2="356" stroke="#94A3B8" strokeWidth="1.5" />
            <path d="M420 328V368L430 360L440 368V328H420Z" fill="#7ED957" stroke="#334155" strokeWidth="1.5" />
            <path d="M225 250H465C448 250 448 320 465 320H225C205 320 195 305 195 285C195 265 205 250 225 250Z" fill="#FFCF40" stroke="#334155" strokeWidth="2" />
            <path d="M228 260H455C442 260 442 310 455 310H228C214 310 206 299 206 285C206 271 214 260 228 260Z" fill="white" stroke="#334155" strokeWidth="1.5" />
            <line x1="225" y1="276" x2="435" y2="276" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="225" y1="292" x2="430" y2="292" stroke="#94A3B8" strokeWidth="1.5" />
            <path d="M395 260V298L405 290L415 298V260H395Z" fill="#FF6B9D" stroke="#334155" strokeWidth="1.5" />
            <rect x="235" y="110" width="200" height="130" rx="10" fill="#E2E8F0" stroke="#334155" strokeWidth="2" />
            <rect x="245" y="122" width="180" height="106" fill="white" stroke="#334155" strokeWidth="1.5" />
            <line x1="245" y1="135" x2="425" y2="135" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="400" cy="128.5" r="2.5" fill="#FF6B9D" />
            <circle cx="408" cy="128.5" r="2.5" fill="#FFCF40" />
            <circle cx="416" cy="128.5" r="2.5" fill="#7ED957" />
            <path d="M335 150C321 150 310 161 310 175C310 184 315 192 322 196V204H348V196C355 192 360 184 360 175C360 161 349 150 335 150Z" fill="#FFE066" stroke="#334155" strokeWidth="2" />
            <rect x="325" y="204" width="20" height="5" fill="#CBD5E1" stroke="#334155" strokeWidth="1.5" />
            <rect x="328" y="209" width="14" height="4" fill="#94A3B8" stroke="#334155" strokeWidth="1.5" />
            <line x1="292" y1="162" x2="300" y2="166" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            <line x1="288" y1="176" x2="298" y2="176" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            <line x1="292" y1="190" x2="300" y2="186" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            <line x1="378" y1="162" x2="370" y2="166" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            <line x1="382" y1="176" x2="372" y2="176" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            <line x1="378" y1="190" x2="370" y2="186" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            <path d="M215 240H455L445 250H225L215 240Z" fill="#E2E8F0" stroke="#334155" strokeWidth="2" />
            <rect x="220" y="340" width="46" height="58" rx="4" fill="#FF6B9D" stroke="#334155" strokeWidth="2" />
            <path d="M266 352H274C281 352 286 357 286 364V372C286 379 281 384 274 384H266" stroke="#FF6B9D" strokeWidth="6" />
            <path d="M266 350H275C283 350 288 356 288 364V372C288 380 283 386 275 386H266" stroke="#334155" strokeWidth="2" />
            <path d="M545 335C520 315 510 280 518 255C540 265 552 295 545 335Z" fill="#7ED957" stroke="#334155" strokeWidth="2" />
            <line x1="518" y1="255" x2="544" y2="330" stroke="#334155" strokeWidth="1.5" />
            <path d="M550 335C542 295 548 255 562 235C576 260 572 300 550 335Z" fill="#7ED957" stroke="#334155" strokeWidth="2" />
            <line x1="562" y1="235" x2="550" y2="335" stroke="#334155" strokeWidth="1.5" />
            <path d="M555 335C575 305 605 280 625 275C618 305 590 328 555 335Z" fill="#7ED957" stroke="#334155" strokeWidth="2" />
            <line x1="625" y1="275" x2="555" y2="335" stroke="#334155" strokeWidth="1.5" />
            <path d="M520 345H585L576 398H529L520 345Z" fill="#FFCF40" stroke="#334155" strokeWidth="2" />
            <rect x="514" y="333" width="77" height="12" rx="2" fill="#FFCF40" stroke="#334155" strokeWidth="2" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Full-Width Navigation Header */}
        <Navbar
          userMode={userMode}
          onModeChange={handleModeChange}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeUser={activeUser}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          pendingRequestsCount={incomingPendingCount}
          notifications={notifications}
          onMarkNotificationsRead={handleMarkNotificationsRead}
          onSelectNotification={handleSelectNotification}
          onOpenProfile={() => setProfileTarget(activeUser)}
        />

        {/* ===================================================================== */}
        {/* UPDATED LIME-GREEN NOTIFICATION BAR (MATCHING LANDING PAGE THEME)     */}
        {/* ===================================================================== */}
        {incomingPendingCount > 0 &&
          activeTab !== 'incoming_requests' &&
          activeTab !== 'teaching_sessions' && (
            <div className="bg-[#7ed957] text-white text-xs font-bold py-2.5 px-4 shadow-xs">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  You have {incomingPendingCount} pending session request
                  {incomingPendingCount > 1 ? 's' : ''} from campus learners
                </span>
                <button
                  onClick={() => {
                    if (userMode !== 'trainer') setUserMode('trainer');
                    setActiveTab('teaching_sessions');
                  }}
                  className="underline font-extrabold hover:text-slate-900 transition-colors ml-4 shrink-0 cursor-pointer"
                >
                  Review Requests in Trainer Mode →
                </button>
              </div>
            </div>
          )}

        {/* Main App Workspace */}
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1">
          {/* ─── TAB: EXPLORE TRAINERS ─── */}
          {userMode === 'learner' && activeTab === 'explore' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
                <div className="max-w-2xl">
                  <span className="text-xs font-semibold text-slate-500 mb-1.5 block">
                    Campus peer education · Learner Mode
                  </span>
                  <h1 className="text-3xl sm:text-5xl font-light text-slate-700 tracking-tight leading-tight">
                    Discover mentors <br />
                    <span className="font-extrabold text-slate-800">at campus</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                    Browse fellow campus students offering free 1-on-1 sessions. Filter by verified credentials,
                    subject skills, and weekly availability.
                  </p>
                </div>

                {/* Real-time Quick Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
                  <div className="bg-white/90 backdrop-blur-xs border border-slate-200/80 rounded-xl p-3 text-center shadow-2xs min-w-[100px]">
                    <div className="flex items-center justify-center text-teal-600 mb-1">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-base font-bold text-slate-800 leading-none block">
                      {MOCK_STUDENTS.length}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 mt-1 block">
                      Trainers Available
                    </span>
                  </div>

                  <div className="bg-white/90 backdrop-blur-xs border border-slate-200/80 rounded-xl p-3 text-center shadow-2xs min-w-[100px]">
                    <div className="flex items-center justify-center text-[#7ed957] mb-1">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="text-base font-bold text-slate-800 leading-none block">
                      {groups.length}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 mt-1 block">
                      Study Groups
                    </span>
                  </div>

                  <div className="bg-white/90 backdrop-blur-xs border border-slate-200/80 rounded-xl p-3 text-center shadow-2xs min-w-[100px]">
                    <div className="flex items-center justify-center text-sky-500 mb-1">
                      <CalendarCheck className="w-4 h-4" />
                    </div>
                    <span className="text-base font-bold text-slate-800 leading-none block">
                      {upcomingSessionsCount}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 mt-1 block">
                      Upcoming
                    </span>
                  </div>

                  <div className="bg-white/90 backdrop-blur-xs border border-slate-200/80 rounded-xl p-3 text-center shadow-2xs min-w-[100px]">
                    <div className="flex items-center justify-center text-[#ffcf40] mb-1">
                      <Award className="w-4 h-4" />
                    </div>
                    <span className="text-base font-bold text-slate-800 leading-none block">
                      {completedSessionsCount}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 mt-1 block">
                      Completed
                    </span>
                  </div>
                </div>
              </div>

              <PeerFilter
                filters={filters}
                onChange={setFilters}
                departments={departments}
                allSkills={allSkills}
                totalPeers={MOCK_STUDENTS.length}
                filteredCount={filteredStudents.length}
              />

              {filteredStudents.length === 0 ? (
                <div className="bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-16 text-center shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">
                    No trainers found matching your criteria
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Try adjusting your search query, clearing filters, or switching off "Verified Trainers Only".
                  </p>
                  <button
                    onClick={() =>
                      setFilters({
                        keyword: '',
                        department: '',
                        skillOffered: '',
                        skillWanted: '',
                        verifiedOnly: false,
                        availabilityFilter: '',
                        sortOption: 'compatibility',
                      })
                    }
                    className="mt-4 px-5 py-2 bg-[#7ed957] hover:bg-[#6ec847] text-white text-xs font-bold rounded-full shadow-xs transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredStudents.map((student) => (
                    <PeerCard
                      key={student.id}
                      student={student}
                      activeUser={activeUser}
                      onRequestSession={setBookingTarget}
                      onViewProfile={setProfileTarget}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── TAB: MY LEARNING SESSIONS ─── */}
          {userMode === 'learner' && activeTab === 'sessions' && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-2">
                <span className="text-xs font-semibold text-slate-500 mb-1 block">
                  Campus peer education · Learner Mode
                </span>
                <h1 className="text-3xl sm:text-4xl font-light text-slate-700 tracking-tight">
                  My learning <span className="font-extrabold text-slate-800">sessions</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  View your requested sessions with campus trainers, confirmed upcoming tutoring, and completed session notes.
                </p>
              </div>

              <SessionsView
                sessions={sessions}
                activeUserId={activeUser.id}
                userMode="learner"
                onAccept={handleAccept}
                onDecline={handleDecline}
                onComplete={handleComplete}
                onNavigateToExplore={() => setActiveTab('explore')}
              />
            </div>
          )}

          {/* ─── TAB: STUDY GROUPS ─── */}
          {userMode === 'learner' && activeTab === 'groups' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
                <div>
                  <span className="text-xs font-semibold text-slate-500 mb-1 block">
                    Campus peer education · Study Cohorts
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-light text-slate-700 tracking-tight">
                    Study groups & <span className="font-extrabold text-slate-800">subject guilds</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Collaborate in subject-specific circles, share lecture notes, and join peer study sessions.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {groupSubjects.map((subj) => (
                    <button
                      key={subj}
                      onClick={() => setSelectedGroupSubject(subj)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        selectedGroupSubject === subj
                          ? 'bg-[#7ed957] text-white shadow-2xs font-bold'
                          : 'bg-white/90 border border-slate-200/80 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {subj === 'all' ? 'All Subjects' : subj}
                    </button>
                  ))}
                </div>
              </div>

              {filteredGroups.length === 0 ? (
                <div className="bg-white/90 border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
                  <p className="text-sm font-semibold">No study groups under this subject yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredGroups.map((group) => (
                    <GroupCard
                      key={group.id}
                      group={group}
                      isMember={joinedGroupIds.includes(group.id)}
                      onToggleMembership={handleToggleMembership}
                      onAddResource={handleAddResource}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── TAB: SKILL ASSESSMENT ─── */}
          {userMode === 'learner' && activeTab === 'assessment' && (
            <div className="space-y-6 animate-fade-in">
              <AssessmentView
                quizzes={QUIZZES}
                activeUser={activeUser}
                completedQuizzes={completedQuizzes}
                onQuizComplete={handleQuizComplete}
              />
            </div>
          )}

          {/* ─── TAB: LEARNING PROGRESS ─── */}
          {userMode === 'learner' && activeTab === 'progress' && (
            <LearnerProgressView
              activeUser={activeUser}
              sessions={sessions}
              allTrainers={MOCK_STUDENTS}
              onNavigateExplore={() => setActiveTab('explore')}
              onNavigateAssessment={() => setActiveTab('assessment')}
            />
          )}

          {/* ─── TAB: TRAINER DASHBOARD ─── */}
          {userMode === 'trainer' && activeTab === 'trainer_dashboard' && (
            <TrainerDashboard
              activeUser={activeUser}
              sessions={sessions}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onAcceptSession={handleAccept}
              onDeclineSession={handleDecline}
            />
          )}

          {/* ─── TAB: TEACHING SKILLS ─── */}
          {userMode === 'trainer' && activeTab === 'teaching_skills' && (
            <TeachingSkillsView
              activeUser={activeUser}
              onUpdateTeachingProfile={handleUpdateTeachingProfile}
            />
          )}

          {/* ─── TAB: TEACHING SESSIONS / INCOMING REQUESTS ─── */}
          {userMode === 'trainer' &&
            (activeTab === 'teaching_sessions' || activeTab === 'incoming_requests') && (
              <div className="space-y-6 animate-fade-in">
                <div className="pb-2">
                  <span className="text-xs font-semibold text-slate-500 mb-1 block">
                    Campus peer education · Trainer Mode
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-light text-slate-700 tracking-tight">
                    Teaching sessions & <span className="font-extrabold text-slate-800">requests</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Manage incoming session requests from students wanting to learn from you, upcoming mentoring sessions, and feedback.
                  </p>
                </div>

                <SessionsView
                  sessions={sessions}
                  activeUserId={activeUser.id}
                  userMode="trainer"
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  onComplete={handleComplete}
                  onNavigateToExplore={() => handleModeChange('learner')}
                />
              </div>
            )}

          {/* ─── TAB: TRAINER VERIFICATION ─── */}
          {userMode === 'trainer' && activeTab === 'verification' && (
            <TrainerVerificationView
              activeUser={activeUser}
              onUpdateTrainerApplication={handleUpdateTrainerApplication}
            />
          )}

          {/* ─── TAB: LEARNER FEEDBACK & REVIEWS ─── */}
          {userMode === 'trainer' && activeTab === 'feedback' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
              <div className="pb-2">
                <span className="text-xs font-semibold text-slate-500 mb-1 block">
                  Campus peer education · Trainer Reputation
                </span>
                <h1 className="text-3xl sm:text-4xl font-light text-slate-700 tracking-tight">
                  Learner feedback & <span className="font-extrabold text-slate-800">reviews</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Reviews and ratings left by students who completed tutoring sessions with you.
                </p>
              </div>

              <SessionsView
                sessions={sessions.filter(
                  (s) => s.peerId === activeUser.id && s.status === 'completed'
                )}
                activeUserId={activeUser.id}
                userMode="trainer"
                onAccept={handleAccept}
                onDecline={handleDecline}
                onComplete={handleComplete}
              />
            </div>
          )}
        </main>
      </div>

      {/* Full-Width Footer with Matching Landing Page Brand Style */}
      <footer className="relative z-10 mt-16 border-t border-slate-200/80 bg-white/90 backdrop-blur-xs py-8 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#7ed957]/15 border border-[#7ed957]/40 text-slate-700 flex items-center justify-center">
              <Menu className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-700 text-sm">Swapledge</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-medium">
              Share Knowledge. Learn Freely. Grow Together.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowLanding(true)}
              className="text-teal-700 font-bold hover:underline cursor-pointer"
            >
              ← Welcome Page
            </button>
            <span className="text-slate-300">|</span>
            <p className="text-slate-400">100% Free Campus Peer-to-Peer Learning Platform</p>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      {bookingTarget && (
        <BookingModal
          peer={bookingTarget}
          activeUser={activeUser}
          onClose={() => setBookingTarget(null)}
          onBook={(session) => {
            handleBook(session);
            setBookingTarget(null);
          }}
        />
      )}

      {/* Student Profile Modal */}
      {profileTarget && (
        <StudentProfileModal
          student={profileTarget}
          activeUser={activeUser}
          onClose={() => setProfileTarget(null)}
          onRequestSession={(peer) => {
            setProfileTarget(null);
            setBookingTarget(peer);
          }}
        />
      )}
    </div>
  );
}