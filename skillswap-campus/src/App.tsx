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
      // Exclude active user from search results
      if (s.id === activeUser.id) return false;

      // Keyword query match
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

      // Department filter
      if (filters.department && s.department !== filters.department) {
        return false;
      }

      // Skill Offered (Trainer Teaches)
      if (
        filters.skillOffered &&
        !s.teaches.some((t) => t.toLowerCase() === filters.skillOffered.toLowerCase())
      ) {
        return false;
      }

      // Skill Wanted (Trainer Wants to Learn)
      if (
        filters.skillWanted &&
        !s.wantsToLearn.some((t) => t.toLowerCase() === filters.skillWanted.toLowerCase())
      ) {
        return false;
      }

      // Verified Trainers Only Filter (Must have verified trainer status)
      if (filters.verifiedOnly && s.trainerVerificationStatus !== 'verified') {
        return false;
      }

      // Availability Filter
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
      // Default: Compatibility score
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

    // Add outgoing notification
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

      // Add badge notification
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

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Refined Navigation Header with Mode Switcher & Swapledge Brand */}
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

      {/* Pending Incoming Session Banner (Trainer Perspective) */}
      {incomingPendingCount > 0 && activeTab !== 'incoming_requests' && activeTab !== 'teaching_sessions' && (
        <div className="bg-indigo-600 text-white text-xs font-semibold py-2 px-4 shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              You have {incomingPendingCount} pending session request{incomingPendingCount > 1 ? 's' : ''} from campus learners
            </span>
            <button
              onClick={() => {
                if (userMode !== 'trainer') setUserMode('trainer');
                setActiveTab('teaching_sessions');
              }}
              className="underline font-bold hover:text-indigo-100 transition-colors ml-4 shrink-0"
            >
              Review Requests in Trainer Mode →
            </button>
          </div>
        </div>
      )}

      {/* Main App Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* ========================================================================= */}
        {/* ─── LEARNER MODE TABS ────────────────────────────────────────────────── */}
        {/* ========================================================================= */}

        {/* ─── TAB: EXPLORE TRAINERS ─── */}
        {userMode === 'learner' && activeTab === 'explore' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header & Quick Statistics */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
              <div className="max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1.5 block">
                  Learner Mode · Discover Mentors
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Discover Campus Trainers
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                  Browse fellow campus students offering free 1-on-1 sessions. Filter by verified credentials,
                  subject skills, and weekly availability.
                </p>
              </div>

              {/* Real-time Quick Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
                <div className="bg-white border border-slate-200/80 rounded-xl p-3 text-center shadow-2xs min-w-[100px]">
                  <div className="flex items-center justify-center text-indigo-600 mb-1">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-base font-bold text-slate-900 leading-none block">
                    {MOCK_STUDENTS.length}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 mt-1 block">Trainers Available</span>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-xl p-3 text-center shadow-2xs min-w-[100px]">
                  <div className="flex items-center justify-center text-emerald-600 mb-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-base font-bold text-slate-900 leading-none block">
                    {groups.length}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 mt-1 block">Study Groups</span>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-xl p-3 text-center shadow-2xs min-w-[100px]">
                  <div className="flex items-center justify-center text-sky-600 mb-1">
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                  <span className="text-base font-bold text-slate-900 leading-none block">
                    {upcomingSessionsCount}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 mt-1 block">Upcoming</span>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-xl p-3 text-center shadow-2xs min-w-[100px]">
                  <div className="flex items-center justify-center text-amber-500 mb-1">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-base font-bold text-slate-900 leading-none block">
                    {completedSessionsCount}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 mt-1 block">Completed</span>
                </div>
              </div>
            </div>

            {/* Filter and Sort Panel */}
            <PeerFilter
              filters={filters}
              onChange={setFilters}
              departments={departments}
              allSkills={allSkills}
              totalPeers={MOCK_STUDENTS.length}
              filteredCount={filteredStudents.length}
            />

            {/* Trainer Cards Grid or Empty State */}
            {filteredStudents.length === 0 ? (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-16 text-center shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No trainers found matching your criteria</h3>
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
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
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
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1 block">
                Learner Mode
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                My Learning Sessions
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
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1 block">
                  Campus Cohorts
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Study Groups & Subject Guilds
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Collaborate in subject-specific circles, share lecture notes, and join peer study sessions.
                </p>
              </div>

              {/* Subject Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {groupSubjects.map((subj) => (
                  <button
                    key={subj}
                    onClick={() => setSelectedGroupSubject(subj)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedGroupSubject === subj
                        ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                        : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {subj === 'all' ? 'All Subjects' : subj}
                  </button>
                ))}
              </div>
            </div>

            {filteredGroups.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
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

        {/* ========================================================================= */}
        {/* ─── TRAINER MODE TABS ────────────────────────────────────────────────── */}
        {/* ========================================================================= */}

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
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1 block">
                  Trainer Mode
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Teaching Sessions & Requests
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
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1 block">
                Trainer Reputation
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Learner Feedback & Reviews
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Reviews and ratings left by students who completed tutoring sessions with you.
              </p>
            </div>

            <SessionsView
              sessions={sessions.filter((s) => s.peerId === activeUser.id && s.status === 'completed')}
              activeUserId={activeUser.id}
              userMode="trainer"
              onAccept={handleAccept}
              onDecline={handleDecline}
              onComplete={handleComplete}
            />
          </div>
        )}
      </main>

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

      {/* Footer with Swapledge Brand */}
      <footer className="mt-16 border-t border-slate-200/80 bg-white py-8 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xs">
              SL
            </div>
            <span className="font-extrabold text-slate-800">Swapledge</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-medium">Share Knowledge. Learn Freely. Grow Together.</span>
          </div>

          <p className="text-slate-400 text-center sm:text-right">
            100% Free Campus Peer-to-Peer Learning Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
