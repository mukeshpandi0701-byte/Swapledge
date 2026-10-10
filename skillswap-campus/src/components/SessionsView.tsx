import { useState } from 'react';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
  MessageSquare,
  Hourglass,
  CalendarCheck,
  Search,
  GraduationCap,
  Presentation,
} from 'lucide-react';
import type { SessionRequest, SessionTab, SessionReview, UserMode } from '../types';
import ReviewModal from './ReviewModal';

interface SessionsViewProps {
  sessions: SessionRequest[];
  activeUserId: string;
  userMode?: UserMode;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onComplete: (id: string, review: SessionReview) => void;
  onNavigateToExplore?: () => void;
}

function StatusBadge({ status }: { status: SessionRequest['status'] }) {
  const map = {
    pending: 'bg-amber-50 text-amber-800 border-amber-200/80',
    accepted: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    declined: 'bg-rose-50 text-rose-800 border-rose-200/80',
    completed: 'bg-slate-100 text-slate-700 border-slate-200',
  };
  const icons = {
    pending: <Hourglass className="w-3 h-3 text-amber-600" />,
    accepted: <CheckCircle2 className="w-3 h-3 text-emerald-600" />,
    declined: <XCircle className="w-3 h-3 text-rose-600" />,
    completed: <Star className="w-3 h-3 text-amber-500 fill-amber-400" />,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${map[status]}`}>
      {icons[status]}
      {status === 'accepted' ? 'Confirmed' : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function SessionCard({
  session,
  activeUserId,
  onAccept,
  onDecline,
  onReview,
}: {
  session: SessionRequest;
  activeUserId: string;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onReview: (session: SessionRequest) => void;
}) {
  const isRequester = session.requesterId === activeUserId;
  const peer = isRequester
    ? { name: session.peerName, avatar: session.peerAvatar, roleLabel: 'Trainer' }
    : { name: session.requesterName, avatar: session.requesterAvatar, roleLabel: 'Learner' };

  const isIncomingPending = session.status === 'pending' && !isRequester;

  return (
    <div
      className={`bg-white border rounded-2xl p-5 shadow-xs transition-all ${
        isIncomingPending
          ? 'border-indigo-300 ring-2 ring-indigo-500/10'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <img
          src={peer.avatar}
          alt={peer.name}
          className="w-11 h-11 rounded-xl border border-slate-200 bg-slate-50 shrink-0 object-cover"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-bold text-slate-900">{peer.name}</h4>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {peer.roleLabel}
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  {isRequester ? '(Your Learning Session)' : '(Your Teaching Session)'}
                </span>
              </div>
              <p className="text-xs font-semibold text-indigo-700 mt-0.5">
                Topic: {session.skill}
              </p>
            </div>
            <StatusBadge status={session.status} />
          </div>

          {/* Schedule details */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
            <span className="flex items-center gap-1.5 font-medium">
              <CalendarDays className="w-3.5 h-3.5 text-indigo-500" />
              {session.date}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              {session.timeSlot}
            </span>
          </div>

          {/* Student note */}
          {session.note && (
            <div className="mt-2.5 flex items-start gap-2 bg-slate-50/60 rounded-xl px-3 py-2 border border-slate-100">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <p className="text-xs text-slate-600 italic">"{session.note}"</p>
            </div>
          )}

          {/* Actions for Incoming Pending Requests (Trainer perspective) */}
          {isIncomingPending && (
            <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => onAccept(session.id)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-semibold rounded-xl shadow-2xs transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Accept Learner Request
              </button>
              <button
                onClick={() => onDecline(session.id)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 active:scale-98 text-xs font-semibold rounded-xl transition-all"
              >
                <XCircle className="w-3.5 h-3.5" />
                Decline
              </button>
            </div>
          )}

          {/* Action for Outgoing Pending Requests (Learner perspective) */}
          {session.status === 'pending' && isRequester && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => onDecline(session.id)}
                className="text-xs text-slate-500 hover:text-rose-600 font-medium transition-colors"
              >
                Cancel Request
              </button>
            </div>
          )}

          {/* Complete & Rate session (Accepted session) */}
          {session.status === 'accepted' && (
            <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => onReview(session)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-semibold rounded-xl shadow-2xs transition-all"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                Mark Complete & Leave Review
              </button>
            </div>
          )}

          {/* Review Card for Completed Sessions */}
          {session.status === 'completed' && session.review && (
            <div className="mt-3 bg-amber-50/70 rounded-xl p-3 border border-amber-200/70">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i <= session.review!.rating ? 'text-amber-500 fill-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-xs font-bold text-amber-900">{session.review.rating}/5</span>
                </div>
                <span className="text-[10px] text-amber-700">Verified Session Review</span>
              </div>
              {session.review.comment && (
                <p className="text-xs text-amber-900 italic mt-1 leading-relaxed">"{session.review.comment}"</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SessionsView({
  sessions,
  activeUserId,
  userMode = 'learner',
  onAccept,
  onDecline,
  onComplete,
  onNavigateToExplore,
}: SessionsViewProps) {
  const [tab, setTab] = useState<SessionTab>('upcoming');
  const [roleFilter, setRoleFilter] = useState<'all' | 'learner' | 'trainer'>(
    userMode === 'trainer' ? 'trainer' : 'all'
  );
  const [reviewTarget, setReviewTarget] = useState<SessionRequest | null>(null);

  // Filter sessions by role
  const roleFilteredSessions = sessions.filter((s) => {
    if (roleFilter === 'learner') return s.requesterId === activeUserId;
    if (roleFilter === 'trainer') return s.peerId === activeUserId;
    return true;
  });

  const tabs: { id: SessionTab; label: string; count: number }[] = [
    {
      id: 'upcoming',
      label: 'Upcoming',
      count: roleFilteredSessions.filter((x) => x.status === 'accepted').length,
    },
    {
      id: 'pending',
      label: 'Pending Requests',
      count: roleFilteredSessions.filter((x) => x.status === 'pending').length,
    },
    {
      id: 'completed',
      label: 'Completed',
      count: roleFilteredSessions.filter((x) => x.status === 'completed').length,
    },
    {
      id: 'declined',
      label: 'Declined',
      count: roleFilteredSessions.filter((x) => x.status === 'declined').length,
    },
  ];

  const filtered = roleFilteredSessions.filter((s) => {
    if (tab === 'upcoming') return s.status === 'accepted';
    if (tab === 'pending') return s.status === 'pending';
    if (tab === 'completed') return s.status === 'completed';
    if (tab === 'declined') return s.status === 'declined';
    return false;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Controls: Status Tabs & Role Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Tab Switcher */}
        <div className="flex gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200/60 overflow-x-auto">
          {tabs.map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 min-w-[110px] flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                tab === id
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <span>{label}</span>
              {count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    tab === id ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Role Filter Pills */}
        <div className="flex items-center gap-1 bg-white border border-slate-200/80 p-1 rounded-xl text-xs self-start sm:self-auto shadow-2xs">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
              roleFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Roles
          </button>
          <button
            onClick={() => setRoleFilter('learner')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
              roleFilter === 'learner' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-3 h-3" /> As Learner
          </button>
          <button
            onClick={() => setRoleFilter('trainer')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
              roleFilter === 'trainer' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Presentation className="w-3 h-3" /> As Trainer
          </button>
        </div>
      </div>

      {/* Sessions List */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center text-slate-500 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <CalendarDays className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {tab === 'upcoming'
              ? 'No upcoming sessions scheduled'
              : tab === 'pending'
              ? 'No pending session requests'
              : tab === 'completed'
              ? 'No completed sessions yet'
              : 'No declined sessions'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {tab === 'upcoming'
              ? 'Book a learning session or confirm incoming requests to build your schedule.'
              : tab === 'pending'
              ? 'All incoming and outgoing session requests have been handled.'
              : tab === 'completed'
              ? 'Completed learning and teaching sessions with verified ratings will appear here.'
              : 'Declined or cancelled requests will appear here for your records.'}
          </p>
          {onNavigateToExplore && tab === 'upcoming' && (
            <button
              onClick={onNavigateToExplore}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              Explore Campus Trainers
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3.5">
          {filtered.map((s) => (
            <SessionCard
              key={s.id}
              session={s}
              activeUserId={activeUserId}
              onAccept={onAccept}
              onDecline={onDecline}
              onReview={setReviewTarget}
            />
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewTarget && (
        <ReviewModal
          session={reviewTarget}
          onClose={() => setReviewTarget(null)}
          onSubmit={(id, review) => {
            onComplete(id, review);
            setReviewTarget(null);
          }}
        />
      )}
    </div>
  );
}
