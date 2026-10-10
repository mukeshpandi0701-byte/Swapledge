import { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import PeerCard from './components/PeerCard';
import PeerFilter from './components/PeerFilter';
import BookingModal from './components/BookingModal';
import SessionsView from './components/SessionsView';
import GroupCard from './components/GroupCard';
import AssessmentView from './components/AssessmentView';
import { ACTIVE_USER, MOCK_STUDENTS, INITIAL_SESSIONS, INITIAL_GROUPS, QUIZZES } from './data/mockData';
import { calculateMatchScore } from './utils/matchingAlgorithm';
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
} from './types';

// ─── LocalStorage helpers ─────────────────────────────────────────────────────
function loadLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function saveLS<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Skill helpers ────────────────────────────────────────────────────────────
function getAllSkills(students: Student[]) {
  const set = new Set<string>();
  students.forEach((s) => {
    s.teaches.forEach((sk) => set.add(sk));
    s.wantsToLearn.forEach((sk) => set.add(sk));
  });
  return Array.from(set).sort();
}

export default function App() {
  // ── Persisted state ──────────────────────────────────────────────────────
  const [activeUser, setActiveUser] = useState<Student>(() =>
    loadLS('ss_active_user', ACTIVE_USER)
  );
  const [sessions, setSessions] = useState<SessionRequest[]>(() =>
    loadLS('ss_sessions', INITIAL_SESSIONS)
  );
  const [groups, setGroups] = useState<StudyGroup[]>(() =>
    loadLS('ss_groups', INITIAL_GROUPS)
  );
  const [completedQuizzes, setCompletedQuizzes] = useState<QuizResult[]>(() =>
    loadLS('ss_quiz_results', [])
  );
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>(() =>
    loadLS('ss_joined_groups', ['group-3']) // Alex is already in React group
  );

  // ── UI state ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<PeerFilters>({
    keyword: '',
    department: '',
    skillOffered: '',
    skillWanted: '',
    verifiedOnly: false,
  });
  const [bookingTarget, setBookingTarget] = useState<Student | null>(null);

  // ── Persist to localStorage on state changes ──────────────────────────────
  useEffect(() => saveLS('ss_sessions', sessions), [sessions]);
  useEffect(() => saveLS('ss_groups', groups), [groups]);
  useEffect(() => saveLS('ss_quiz_results', completedQuizzes), [completedQuizzes]);
  useEffect(() => saveLS('ss_joined_groups', joinedGroupIds), [joinedGroupIds]);
  useEffect(() => saveLS('ss_active_user', activeUser), [activeUser]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const departments = useMemo(
    () => Array.from(new Set(MOCK_STUDENTS.map((s) => s.department))).sort(),
    []
  );
  const allSkills = useMemo(() => getAllSkills(MOCK_STUDENTS), []);

  const effectiveKeyword = searchQuery || filters.keyword;

  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter((s) => {
      if (effectiveKeyword) {
        const kw = effectiveKeyword.toLowerCase();
        const matches =
          s.name.toLowerCase().includes(kw) ||
          s.department.toLowerCase().includes(kw) ||
          s.teaches.some((t) => t.toLowerCase().includes(kw)) ||
          s.wantsToLearn.some((t) => t.toLowerCase().includes(kw));
        if (!matches) return false;
      }
      if (filters.department && s.department !== filters.department) return false;
      if (filters.skillOffered && !s.teaches.some((t) => t.toLowerCase() === filters.skillOffered.toLowerCase())) return false;
      if (filters.skillWanted && !s.wantsToLearn.some((t) => t.toLowerCase() === filters.skillWanted.toLowerCase())) return false;
      if (filters.verifiedOnly && !s.isVerified) return false;
      return true;
    }).sort((a, b) => calculateMatchScore(activeUser, b) - calculateMatchScore(activeUser, a));
  }, [effectiveKeyword, filters, activeUser]);

  // ── Session handlers ──────────────────────────────────────────────────────
  const handleBook = (session: SessionRequest) => {
    setSessions((prev) => [session, ...prev]);
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

  // ── Group handlers ────────────────────────────────────────────────────────
  const handleToggleMembership = (groupId: string) => {
    setJoinedGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  const handleAddResource = (groupId: string, resource: GroupResource) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, resources: [...g.resources, resource] } : g
      )
    );
  };

  // ── Quiz handlers ─────────────────────────────────────────────────────────
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
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  const pendingCount = sessions.filter((s) => s.status === 'pending' && s.peerId === activeUser.id).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeUser={activeUser}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Modern Centered Notification Banner */}
      {pendingCount > 0 && activeTab !== 'sessions' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
          <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl px-4 py-2.5 text-xs sm:text-sm shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse shrink-0" />
              <span className="text-slate-700">
                You have <strong className="font-semibold text-slate-900">{pendingCount} pending session request{pendingCount > 1 ? 's' : ''}</strong> awaiting your response.
              </span>
            </div>
            <button
              onClick={() => setActiveTab('sessions')}
              className="shrink-0 text-xs font-bold text-indigo-700 hover:text-indigo-900 transition underline underline-offset-2 cursor-pointer"
            >
              Review now →
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── EXPLORE PEERS ── */}
        {activeTab === 'explore' && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Explore Peers
              </h1>
              <p className="text-sm font-normal text-slate-500 mt-1.5">
                Sorted by <span className="font-semibold text-indigo-600">compatibility match</span> — students offering skills you want to learn appear first.
              </p>
            </div>

            <PeerFilter
              filters={filters}
              onChange={setFilters}
              departments={departments}
              allSkills={allSkills}
            />

            {filteredStudents.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-sm max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mx-auto mb-4">
                  🔍
                </div>
                <h3 className="font-bold text-slate-800 text-base">No peers match your filters</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Try broadening your search term or clearing one of the skill filters.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Showing {filteredStudents.length} Available Peer{filteredStudents.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredStudents.map((student) => (
                    <PeerCard
                      key={student.id}
                      student={student}
                      activeUser={activeUser}
                      onRequestSession={setBookingTarget}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── MY SESSIONS ── */}
        {activeTab === 'sessions' && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                My Sessions
              </h1>
              <p className="text-sm font-normal text-slate-500 mt-1.5">
                Manage upcoming tutoring appointments, pending incoming requests, and history.
              </p>
            </div>
            <SessionsView
              sessions={sessions}
              activeUserId={activeUser.id}
              onAccept={handleAccept}
              onDecline={handleDecline}
              onComplete={handleComplete}
            />
          </div>
        )}

        {/* ── STUDY GROUPS ── */}
        {activeTab === 'groups' && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Campus Study Groups
              </h1>
              <p className="text-sm font-normal text-slate-500 mt-1.5">
                Join subject-specific student circles to access curated resource notes, code repos, and guides.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {groups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  isMember={joinedGroupIds.includes(group.id)}
                  onToggleMembership={handleToggleMembership}
                  onAddResource={handleAddResource}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── ASSESSMENT ── */}
        {activeTab === 'assessment' && (
          <div>
            <AssessmentView
              quizzes={QUIZZES}
              activeUser={activeUser}
              completedQuizzes={completedQuizzes}
              onQuizComplete={handleQuizComplete}
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
    </div>
  );
}
