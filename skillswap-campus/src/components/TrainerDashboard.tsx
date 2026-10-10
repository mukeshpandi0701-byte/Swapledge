import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
  Users,
  BookOpen,
  CalendarCheck,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import type { Student, SessionRequest, TrainerTab } from '../types';

interface TrainerDashboardProps {
  activeUser: Student;
  sessions: SessionRequest[];
  onNavigateTab: (tab: TrainerTab) => void;
  onAcceptSession: (id: string) => void;
  onDeclineSession: (id: string) => void;
}

export default function TrainerDashboard({
  activeUser,
  sessions,
  onNavigateTab,
  onAcceptSession,
  onDeclineSession,
}: TrainerDashboardProps) {
  // Teaching sessions where activeUser is the peer/trainer
  const teachingSessions = sessions.filter((s) => s.peerId === activeUser.id);
  const incomingPending = teachingSessions.filter((s) => s.status === 'pending');
  const upcomingTeaching = teachingSessions.filter((s) => s.status === 'accepted');
  const completedTeaching = teachingSessions.filter((s) => s.status === 'completed');

  const verificationStatus = activeUser.trainerVerificationStatus || 'not_started';

  return (
    <div className="space-y-8 animate-fade-in text-slate-800">
      {/* Top Welcome & Verification Status Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1 block">
              Trainer Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome, Trainer {activeUser.name.split(' ')[0]}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              Manage your teaching subjects, review incoming session requests from campus learners, and build your peer reputation on Swapledge.
            </p>
          </div>

          {/* Verification Status Callout */}
          <div className="shrink-0 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 min-w-[240px]">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Verification
              </span>
              {verificationStatus === 'verified' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              )}
              {verificationStatus === 'pending' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  <Clock className="w-3 h-3" /> Pending Review
                </span>
              )}
              {verificationStatus === 'rejected' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                  <XCircle className="w-3 h-3" /> Needs Fixes
                </span>
              )}
              {verificationStatus === 'not_started' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-200 px-2.5 py-0.5 rounded-full">
                  Not Started
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-snug">
              {verificationStatus === 'verified'
                ? 'Your verified trainer badge is active across all learner search results.'
                : verificationStatus === 'pending'
                ? 'Your teaching portfolio and evidence are currently under peer review.'
                : 'Complete the verification workflow to earn your campus verified badge.'}
            </p>

            <button
              onClick={() => onNavigateTab('verification')}
              className="mt-3 w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl transition-colors shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>{verificationStatus === 'verified' ? 'View Verification Details' : 'Open Verification Center'}</span>
            </button>
          </div>
        </div>

        {/* Trainer Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3.5 text-center">
            <div className="flex items-center justify-center text-indigo-600 mb-1">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold text-slate-900 block">{activeUser.teaches.length}</span>
            <span className="text-[11px] font-medium text-slate-500 mt-0.5 block">Teaching Subjects</span>
          </div>

          <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3.5 text-center">
            <div className="flex items-center justify-center text-amber-600 mb-1">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold text-slate-900 block">{incomingPending.length}</span>
            <span className="text-[11px] font-medium text-slate-500 mt-0.5 block">Pending Requests</span>
          </div>

          <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3.5 text-center">
            <div className="flex items-center justify-center text-emerald-600 mb-1">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold text-slate-900 block">
              {upcomingTeaching.length + completedTeaching.length}
            </span>
            <span className="text-[11px] font-medium text-slate-500 mt-0.5 block">Teaching Sessions</span>
          </div>

          <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3.5 text-center">
            <div className="flex items-center justify-center text-amber-500 mb-1">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <span className="text-xl font-bold text-slate-900 block">{activeUser.rating.toFixed(1)}</span>
            <span className="text-[11px] font-medium text-slate-500 mt-0.5 block">
              ({activeUser.reviewCount} Reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Main Split: Incoming Requests + Teaching Subjects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Incoming Learning Requests (Needs Attention) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Incoming Learning Requests ({incomingPending.length})
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('teaching_sessions')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              All Teaching Sessions <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {incomingPending.length === 0 ? (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-8 text-center text-slate-500 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">No Pending Requests</h4>
              <p className="text-xs text-slate-400 mt-1">
                You have addressed all learner booking requests. New requests will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {incomingPending.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <img
                      src={req.requesterAvatar}
                      alt={req.requesterName}
                      className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-100 shrink-0 object-cover"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900">{req.requesterName}</h4>
                        <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                          Topic: {req.skill}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {req.date} · {req.timeSlot}
                      </p>
                      {req.note && (
                        <p className="text-xs text-slate-600 italic mt-1 line-clamp-1">
                          "{req.note}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      onClick={() => onAcceptSession(req.id)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                    </button>
                    <button
                      onClick={() => onDeclineSession(req.id)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-semibold transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upcoming Confirmed Teaching Sessions */}
          <div className="pt-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Upcoming Confirmed Sessions ({upcomingTeaching.length})
            </h3>
            {upcomingTeaching.length === 0 ? (
              <p className="text-xs text-slate-400 bg-white border border-slate-200/80 rounded-xl p-4 text-center">
                No upcoming confirmed sessions scheduled right now.
              </p>
            ) : (
              <div className="space-y-2.5">
                {upcomingTeaching.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={s.requesterAvatar}
                        alt={s.requesterName}
                        className="w-8 h-8 rounded-lg bg-slate-100 object-cover"
                      />
                      <div>
                        <p className="font-bold text-slate-800">{s.requesterName}</p>
                        <p className="text-slate-500 text-[11px]">
                          {s.skill} · {s.date} at {s.timeSlot}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Confirmed
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Teaching Subjects & Quick Management */}
        <div className="space-y-6">
          {/* Active Teaching Skills Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Skills Offered
              </h3>
              <button
                onClick={() => onNavigateTab('teaching_skills')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
              >
                <SlidersHorizontal className="w-3 h-3" /> Edit
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {activeUser.teaches.map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-1 rounded-lg font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <span className="font-semibold text-slate-700 block">Weekly Availability:</span>
              <p className="text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 font-medium">
                {activeUser.availability || 'Weekdays 3:00 PM – 7:00 PM'}
              </p>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Trainer Actions
            </h3>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => onNavigateTab('teaching_skills')}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-medium text-slate-700 flex items-center justify-between transition-colors"
              >
                <span>Add / Edit Teaching Subjects</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateTab('verification')}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-medium text-slate-700 flex items-center justify-between transition-colors"
              >
                <span>Update Verification Evidence</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateTab('feedback')}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-medium text-slate-700 flex items-center justify-between transition-colors"
              >
                <span>View Learner Reviews & Ratings</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
