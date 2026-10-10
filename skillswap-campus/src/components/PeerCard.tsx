import { Star, ShieldCheck, CalendarPlus, Sparkles } from 'lucide-react';
import type { Student, AssessmentBadge } from '../types';
import GitHubCard from './GitHubCard';
import { calculateMatchScore } from '../utils/matchingAlgorithm';

interface PeerCardProps {
  student: Student;
  activeUser: Student;
  onRequestSession: (student: Student) => void;
}

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-500 font-semibold text-xs gap-1">
        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        <span>{rating.toFixed(1)}</span>
      </div>
      <span className="text-[11px] text-slate-400 font-normal">({reviews})</span>
    </div>
  );
}

function AssessmentBadgePill({ badge }: { badge: AssessmentBadge }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border ${
        badge.verified
          ? 'bg-indigo-50 text-indigo-700 border-indigo-200/80 shadow-2xs'
          : 'bg-slate-50 text-slate-500 border-slate-200/80'
      }`}
    >
      {badge.verified && <ShieldCheck className="w-3 h-3 text-indigo-500 shrink-0" />}
      {badge.skill}
    </span>
  );
}

export default function PeerCard({ student, activeUser, onRequestSession }: PeerCardProps) {
  const score = calculateMatchScore(activeUser, student);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
      {/* Top subtle hover accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-500 transition-all duration-500" />

      {/* Top Content Block */}
      <div>
        {/* Header: Avatar, Name, Rating & Compatibility Pill */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3.5">
            {/* Avatar with Online Presence Indicator */}
            <div className="relative shrink-0">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 shadow-sm"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-xs" />
            </div>

            {/* Student Info */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition leading-tight truncate">
                  {student.name}
                </h3>
                {student.isVerified && (
                  <span title="Verified Campus Tutor">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                {student.department} · Year {student.year}
              </p>
              <div className="mt-1">
                <StarRating rating={student.rating} reviews={student.reviewCount} />
              </div>
            </div>
          </div>

          {/* Compatibility Pill */}
          <div className="shrink-0">
            <span className="bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-200/70 font-bold text-xs px-3 py-1 rounded-full shadow-xs inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              {score}% Match
            </span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 my-3 font-normal">
          {student.bio}
        </p>

        {/* Skill Tags Hierarchy */}
        <div className="space-y-2.5 mb-3">
          {/* TEACHES */}
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
              Teaches
            </span>
            <div className="flex flex-wrap gap-1.5">
              {student.teaches.map((skill) => (
                <span
                  key={skill}
                  className="bg-emerald-50 text-emerald-700 border border-emerald-200/70 text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-2xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* WANTS TO LEARN */}
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
              Wants to Learn
            </span>
            <div className="flex flex-wrap gap-1.5">
              {student.wantsToLearn.map((skill) => (
                <span
                  key={skill}
                  className="bg-indigo-50 text-indigo-700 border border-indigo-200/70 text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-2xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Assessment Badges (if any) */}
        {student.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {student.badges.map((b) => (
              <AssessmentBadgePill key={b.skill} badge={b} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Block: CTA Button & GitHub Evidence Footer */}
      <div>
        <button
          onClick={() => onRequestSession(student)}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-xs shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition active:scale-[0.99] mt-3 cursor-pointer"
        >
          <CalendarPlus className="w-3.5 h-3.5" />
          Request Free Session
        </button>

        {/* GitHub Integration Footer */}
        <GitHubCard stats={student.github} />
      </div>
    </div>
  );
}
