import { X, ShieldCheck, Star, Calendar, Mail, GraduationCap, Clock, CheckCircle2, CalendarPlus } from 'lucide-react';
import type { Student } from '../types';
import GitHubCard from './GitHubCard';
import { getMatchExplanation, getMatchLabel } from '../utils/matchingAlgorithm';

interface StudentProfileModalProps {
  student: Student;
  activeUser: Student;
  onClose: () => void;
  onRequestSession?: (student: Student) => void;
}

export default function StudentProfileModal({
  student,
  activeUser,
  onClose,
  onRequestSession,
}: StudentProfileModalProps) {
  const isSelf = student.id === activeUser.id;
  const match = !isSelf ? getMatchExplanation(activeUser, student) : null;
  const matchTier = match ? getMatchLabel(match.score) : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl border border-slate-200/90 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative px-6 pt-6 pb-5 border-b border-slate-100 bg-linear-to-b from-slate-50/80 to-white">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close profile modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-18 h-18 rounded-2xl border-2 border-slate-100 bg-slate-50 object-cover shadow-xs"
              />
              {student.isVerified && (
                <span
                  title="Campus Verified Student"
                  className="absolute -bottom-1 -right-1 bg-indigo-600 text-white rounded-full p-1 shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">{student.name}</h2>
                {student.trainerVerificationStatus === 'verified' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Trainer
                  </span>
                ) : student.isVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200/60">
                    <ShieldCheck className="w-3 h-3" /> Campus Verified
                  </span>
                ) : null}
                {isSelf && (
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                    You (Active Account)
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  {student.department} · Year {student.year}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {student.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Member since {student.joinedAt}
                </span>
              </div>

              {/* Quick stats bar */}
              <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1 text-slate-700">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span className="font-bold">{student.rating.toFixed(1)}</span>
                  <span className="text-slate-400">({student.reviewCount} peer reviews)</span>
                </div>
                {student.completedSessionsCount !== undefined && (
                  <div className="flex items-center gap-1 text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{student.completedSessionsCount} sessions completed</span>
                  </div>
                )}
                {student.availability && (
                  <div className="flex items-center gap-1 text-slate-600 bg-slate-100/80 px-2 py-0.5 rounded-md font-medium text-[11px]">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{student.availability}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Match explanation (when viewing peer) */}
          {match && matchTier && (
            <div className={`p-4 rounded-xl border ${matchTier.badgeClass} flex flex-col gap-2`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Compatibility Match: {match.score}% ({matchTier.label})
                </span>
                <span className="text-xs font-semibold">Reciprocal Peer Exchange</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-700 font-medium">{match.summary}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200/40 text-[11px]">
                <div>
                  <span className="text-slate-500 font-semibold">Skills they teach you want:</span>{' '}
                  <span className="text-slate-800">
                    {match.directMatches.length > 0 ? match.directMatches.join(', ') : 'None overlapping'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">Skills you teach they want:</span>{' '}
                  <span className="text-slate-800">
                    {match.reciprocalMatches.length > 0 ? match.reciprocalMatches.join(', ') : 'None overlapping'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* About / Bio */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">About & Background</h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
              {student.bio}
            </p>
          </div>

          {/* Skills Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-4">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 block">
                Can Teach & Tutor
              </span>
              <div className="flex flex-wrap gap-1.5">
                {student.teaches.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-1 rounded-md font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-4">
              <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2 block">
                Looking to Learn
              </span>
              <div className="flex flex-wrap gap-1.5">
                {student.wantsToLearn.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs bg-indigo-50 text-indigo-800 border border-indigo-200/80 px-2.5 py-1 rounded-md font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Verified Badges */}
          {student.badges.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Verified Skill Badges</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {student.badges.map((b) => (
                  <div
                    key={b.skill}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-white shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{b.skill}</p>
                      <p className="text-[11px] text-slate-500">
                        {b.level} Level · Verified on {b.earnedAt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GitHub Integration */}
          {student.github && (
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Developer Activity</h3>
              <GitHubCard stats={student.github} />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Close
          </button>
          {!isSelf && onRequestSession && (
            <button
              onClick={() => {
                onClose();
                onRequestSession(student);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <CalendarPlus className="w-4 h-4" />
              Request Free Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
