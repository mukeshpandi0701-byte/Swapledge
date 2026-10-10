import { useState } from 'react';
import { CalendarDays, Clock, CheckCircle2, XCircle, Star, MessageSquare, Hourglass } from 'lucide-react';
import type { SessionRequest, SessionTab, SessionReview } from '../types';
import ReviewModal from './ReviewModal';

interface SessionsViewProps {
  sessions: SessionRequest[];
  activeUserId: string;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onComplete: (id: string, review: SessionReview) => void;
}

function StatusBadge({ status }: { status: SessionRequest['status'] }) {
  const map = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    declined: 'bg-rose-50 text-rose-700 border-rose-200',
    completed: 'bg-slate-100 text-slate-600 border-slate-200',
  };
  const icons = {
    pending: <Hourglass className="w-3 h-3" />,
    accepted: <CheckCircle2 className="w-3 h-3" />,
    declined: <XCircle className="w-3 h-3" />,
    completed: <Star className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${map[status]}`}>
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
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
    ? { name: session.peerName, avatar: session.peerAvatar }
    : { name: session.requesterName, avatar: session.requesterAvatar };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-3">
        <img src={peer.avatar} alt={peer.name} className="w-10 h-10 rounded-xl border-2 border-slate-100 bg-slate-50 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-800">{peer.name}</p>
              <p className="text-xs text-indigo-600 font-medium">{session.skill}</p>
            </div>
            <StatusBadge status={session.status} />
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" />
              {session.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {session.timeSlot}
            </span>
            <span className="text-xs text-slate-400">{isRequester ? 'You requested' : 'Requested from you'}</span>
          </div>

          {session.note && (
            <div className="mt-2 flex items-start gap-1.5 bg-slate-50 rounded-lg px-3 py-2">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <p className="text-xs text-slate-600 italic">"{session.note}"</p>
            </div>
          )}

          {/* Actions for pending incoming requests */}
          {session.status === 'pending' && !isRequester && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => onAccept(session.id)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Accept
              </button>
              <button
                onClick={() => onDecline(session.id)}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold rounded-lg transition active:scale-95"
              >
                <XCircle className="w-3.5 h-3.5" />
                Decline
              </button>
            </div>
          )}

          {/* Complete session (accepted + requester) */}
          {session.status === 'accepted' && isRequester && (
            <button
              onClick={() => onReview(session)}
              className="mt-3 flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition active:scale-95"
            >
              <Star className="w-3.5 h-3.5" />
              Mark Complete & Rate
            </button>
          )}

          {/* Review display */}
          {session.status === 'completed' && session.review && (
            <div className="mt-3 bg-amber-50 rounded-xl px-3 py-2.5 border border-amber-100">
              <div className="flex items-center gap-0.5 mb-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i <= session.review!.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
                  />
                ))}
              </div>
              {session.review.comment && (
                <p className="text-xs text-amber-800 italic">"{session.review.comment}"</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SessionsView({ sessions, activeUserId, onAccept, onDecline, onComplete }: SessionsViewProps) {
  const [tab, setTab] = useState<SessionTab>('upcoming');
  const [reviewTarget, setReviewTarget] = useState<SessionRequest | null>(null);

  const tabs: { id: SessionTab; label: string; count: (s: SessionRequest[]) => number }[] = [
    {
      id: 'upcoming',
      label: 'Upcoming / Accepted',
      count: (s) => s.filter((x) => x.status === 'accepted').length,
    },
    {
      id: 'pending',
      label: 'Pending Requests',
      count: (s) => s.filter((x) => x.status === 'pending').length,
    },
    {
      id: 'completed',
      label: 'Completed',
      count: (s) => s.filter((x) => x.status === 'completed').length,
    },
  ];

  const filtered = sessions.filter((s) => {
    if (tab === 'upcoming') return s.status === 'accepted';
    if (tab === 'pending') return s.status === 'pending';
    if (tab === 'completed') return s.status === 'completed';
    return false;
  });

  return (
    <div className="max-w-3xl mx-auto">
      {/* Tab header */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6">
        {tabs.map(({ id, label, count }) => {
          const n = count(sessions);
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                tab === id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {label}
              {n > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${tab === id ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}>
                  {n}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Session cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-5xl mb-4">
            {tab === 'upcoming' ? '📅' : tab === 'pending' ? '⏳' : '✅'}
          </div>
          <p className="font-medium text-slate-500">No {tab} sessions</p>
          <p className="text-sm mt-1">
            {tab === 'pending' ? 'All caught up!' : tab === 'upcoming' ? 'Book a session with a peer to get started.' : 'Complete a session to see it here.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
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
