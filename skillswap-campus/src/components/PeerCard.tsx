import { Star, ShieldCheck, CalendarPlus, Zap } from 'lucide-react';
import type { Student } from '../types';
import type { AssessmentBadge } from '../types';
import GitHubCard from './GitHubCard';
import { calculateMatchScore, getMatchLabel } from '../utils/matchingAlgorithm';

interface PeerCardProps {
  student: Student;
  activeUser: Student;
  onRequestSession: (student: Student) => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
        />
      ))}
      <span className="ml-1 text-xs text-slate-500 font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}

function BadgePill({ badge }: { badge: AssessmentBadge }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium border ${
        badge.verified
          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
          : 'bg-slate-50 text-slate-600 border-slate-200'
      }`}
    >
      {badge.verified && <ShieldCheck className="w-3 h-3 text-indigo-500" />}
      {badge.skill}
    </span>
  );
}

export default function PeerCard({ student, activeUser, onRequestSession }: PeerCardProps) {
  const score = calculateMatchScore(activeUser, student);
  const { label: matchLabel, colorClass } = getMatchLabel(score);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 flex flex-col">
      {/* Header: avatar + info + match */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-12 h-12 rounded-xl border-2 border-slate-100 bg-slate-50"
            />
            {student.isVerified && (
              <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">{student.name}</h3>
            <p className="text-xs text-slate-500">{student.department} · Year {student.year}</p>
            <StarRating rating={student.rating} />
          </div>
        </div>

        {/* Match Score */}
        <div className={`shrink-0 flex flex-col items-center px-2.5 py-1.5 rounded-xl ${colorClass}`}>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            <span className="text-base font-bold leading-none">{score}%</span>
          </div>
          <span className="text-[10px] font-medium mt-0.5 leading-none">{matchLabel}</span>
        </div>
      </div>

      {/* Bio */}
      <p className="text-xs text-slate-500 mb-3 leading-relaxed line-clamp-2">{student.bio}</p>

      {/* Teaches badges */}
      <div className="mb-2">
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1 block">Teaches</span>
        <div className="flex flex-wrap gap-1.5">
          {student.teaches.map((skill) => (
            <span key={skill} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Wants to Learn badges */}
      <div className="mb-3">
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1 block">Wants to Learn</span>
        <div className="flex flex-wrap gap-1.5">
          {student.wantsToLearn.map((skill) => (
            <span key={skill} className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Assessment Badges */}
      {student.badges.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {student.badges.map((b) => (
            <BadgePill key={b.skill} badge={b} />
          ))}
        </div>
      )}

      {/* GitHub Card */}
      <GitHubCard stats={student.github} />

      {/* Action */}
      <button
        onClick={() => onRequestSession(student)}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-150"
      >
        <CalendarPlus className="w-4 h-4" />
        Request Free Session
      </button>
    </div>
  );
}
