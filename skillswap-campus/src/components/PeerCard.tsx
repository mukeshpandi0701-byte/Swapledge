import { useState } from 'react';
import {
  Star,
  ShieldCheck,
  CalendarPlus,
  Clock,
  ChevronDown,
  ChevronUp,
  Info,
  User,
  GraduationCap,
} from 'lucide-react';
import type { Student, AssessmentBadge } from '../types';
import GitHubCard from './GitHubCard';
import { getMatchExplanation, getMatchLabel } from '../utils/matchingAlgorithm';

interface PeerCardProps {
  student: Student;
  activeUser: Student;
  onRequestSession: (student: Student) => void;
  onViewProfile?: (student: Student) => void;
}

function BadgePill({ badge }: { badge: AssessmentBadge }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-medium border ${
        badge.verified
          ? 'bg-indigo-50 text-indigo-700 border-indigo-200/80'
          : 'bg-slate-50 text-slate-600 border-slate-200'
      }`}
    >
      {badge.verified && <ShieldCheck className="w-3 h-3 text-indigo-500" />}
      {badge.skill}
    </span>
  );
}

export default function PeerCard({
  student,
  activeUser,
  onRequestSession,
  onViewProfile,
}: PeerCardProps) {
  const [whyOpen, setWhyOpen] = useState(false);
  const match = getMatchExplanation(activeUser, student);
  const { label: matchLabel, badgeClass, barColor } = getMatchLabel(match.score);

  const isVerifiedTrainer = student.trainerVerificationStatus === 'verified';
  const isPendingTrainer = student.trainerVerificationStatus === 'pending';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col p-5 text-slate-800">
      {/* Top Profile Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="relative shrink-0">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 object-cover"
            />
            {isVerifiedTrainer && (
              <span
                title="Verified Campus Trainer"
                className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow-xs"
              >
                <ShieldCheck className="w-3 h-3" />
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-sm font-bold text-slate-900 truncate leading-snug">{student.name}</h3>
              {isVerifiedTrainer && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Trainer
                </span>
              )}
              {isPendingTrainer && (
                <span className="text-[10px] font-medium text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">
                  Pending Verification
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{student.department} · Yr {student.year}</span>
            </p>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="ml-1 font-bold text-slate-800 text-[11px]">{student.rating.toFixed(1)}</span>
              </div>
              <span className="text-slate-400 text-[11px]">({student.reviewCount} learner reviews)</span>
            </div>
          </div>
        </div>

        {/* Compatibility Match Meter Badge */}
        <div className={`shrink-0 flex flex-col items-end text-right px-2.5 py-1.5 rounded-xl border ${badgeClass}`}>
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold leading-none">{match.score}%</span>
          </div>
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight">{matchLabel}</span>
          <div className="w-12 bg-slate-200/70 h-1 rounded-full mt-1.5 overflow-hidden">
            <div className={`h-full rounded-full ${barColor}`} style={{ width: `${match.score}%` }} />
          </div>
        </div>
      </div>

      {/* Availability Pill */}
      {student.availability && (
        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1 mb-3">
          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate font-medium">{student.availability}</span>
        </div>
      )}

      {/* Short Bio */}
      <p className="text-xs text-slate-600 mb-3 leading-relaxed line-clamp-2">{student.bio}</p>

      {/* "Why this match?" Interactive Drawer */}
      <div className="mb-3">
        <button
          type="button"
          onClick={() => setWhyOpen(!whyOpen)}
          className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-500 hover:text-indigo-600 py-1 transition-colors"
        >
          <span className="flex items-center gap-1">
            <Info className="w-3 h-3 text-indigo-500" />
            Why this match?
          </span>
          {whyOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {whyOpen && (
          <div className="mt-1.5 p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80 text-[11px] space-y-1.5 animate-fade-in">
            <p className="text-slate-700 font-medium leading-relaxed">{match.summary}</p>
            <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 space-y-0.5">
              <div>
                <span className="font-semibold text-slate-600">They teach:</span>{' '}
                {match.directMatches.length > 0
                  ? `${match.directMatches.join(', ')} (+25% each)`
                  : 'No direct wishlist match'}
              </div>
              <div>
                <span className="font-semibold text-slate-600">You teach:</span>{' '}
                {match.reciprocalMatches.length > 0
                  ? `${match.reciprocalMatches.join(', ')} (+15% reciprocal bonus)`
                  : 'No reciprocal overlap'}
              </div>
              {match.sharedDepartment && (
                <div className="text-indigo-600 font-medium">Shared Department (+10% synergy)</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Teaches Skills */}
      <div className="mb-2">
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1 block">Can Teach</span>
        <div className="flex flex-wrap gap-1">
          {student.teaches.map((skill) => (
            <span
              key={skill}
              className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200/70 px-2 py-0.5 rounded-md font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Wants to Learn Skills */}
      <div className="mb-3">
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1 block">Wants to Learn</span>
        <div className="flex flex-wrap gap-1">
          {student.wantsToLearn.map((skill) => (
            <span
              key={skill}
              className="text-[11px] bg-indigo-50 text-indigo-800 border border-indigo-200/70 px-2 py-0.5 rounded-md font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Assessment Badges if any */}
      {student.badges.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {student.badges.map((b) => (
            <BadgePill key={b.skill} badge={b} />
          ))}
        </div>
      )}

      {/* GitHub Card */}
      {student.github && (
        <div className="mb-4">
          <GitHubCard stats={student.github} compact />
        </div>
      )}

      {/* Card Actions Footer */}
      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center gap-2">
        {onViewProfile && (
          <button
            onClick={() => onViewProfile(student)}
            className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
          >
            <User className="w-3.5 h-3.5 text-slate-400" />
            View Profile
          </button>
        )}

        <button
          onClick={() => onRequestSession(student)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white shadow-xs transition-all"
        >
          <CalendarPlus className="w-3.5 h-3.5" />
          Request Session
        </button>
      </div>
    </div>
  );
}
