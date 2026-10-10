import { useState } from 'react';
import {
  Star,
  Clock,
  ShieldCheck,
  CalendarPlus,
  User,
  ChevronDown,
  ChevronUp,
  Info,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { calculateMatchScore, getMatchLabel } from '../utils/matchingAlgorithm';
import type { Student } from '../types';

interface PeerCardProps {
  student: Student;
  activeUser: Student;
  onRequestSession: (student: Student) => void;
  onViewProfile: (student: Student) => void;
}

export default function PeerCard({
  student,
  activeUser,
  onRequestSession,
  onViewProfile,
}: PeerCardProps) {
  const [showWhy, setShowWhy] = useState(false);

  const score = calculateMatchScore(activeUser, student);
  const matchInfo = getMatchLabel(score);

  // Built-in match breakdown calculation
  const teachesWhatYouWant = student.teaches.filter((skill) =>
    activeUser.wantsToLearn.some((w) => w.toLowerCase() === skill.toLowerCase())
  );
  const wantsWhatYouTeach = student.wantsToLearn.filter((skill) =>
    activeUser.teaches.some((t) => t.toLowerCase() === skill.toLowerCase())
  );
  const sameDepartment = student.department === activeUser.department;

  const isVerifiedTrainer =
    student.trainerVerificationStatus === 'verified' || student.isVerified;

  // Safe extraction of GitHub fields regardless of interface key naming
  const gh = student.github as Record<string, any> | undefined;
  const ghUsername = gh?.username || '';
  const ghRepos = gh?.publicRepos ?? gh?.repos ?? gh?.repoCount ?? 0;
  const ghStars = gh?.totalStars ?? gh?.stars ?? gh?.starCount ?? 0;
  const ghLanguages: string[] = gh?.topLanguages ?? gh?.languages ?? gh?.stack ?? [];

  const langDotColor = (lang: string) => {
    const l = lang.toLowerCase();
    if (l.includes('python')) return 'bg-emerald-500';
    if (l.includes('type') || l.includes('ts')) return 'bg-sky-500';
    if (l.includes('java') || l.includes('js') || l.includes('jupyter')) return 'bg-amber-500';
    return 'bg-[#7ed957]';
  };

  return (
    <div className="bg-white/95 backdrop-blur-xs border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Top Row: Avatar, Name, Verified Badge & Match Score Box */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-12 h-12 rounded-2xl object-cover bg-slate-100 border border-slate-200/60"
              />
              {isVerifiedTrainer && (
                <span
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#7ed957] text-white flex items-center justify-center ring-2 ring-white"
                  title="Verified Campus Trainer"
                >
                  <ShieldCheck className="w-3 h-3" />
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className="text-sm font-bold text-slate-800 truncate">{student.name}</h3>
                {isVerifiedTrainer && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#7ed957]/15 text-emerald-800 border border-[#7ed957]/40">
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-700" />
                    Verified Trainer
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 mt-0.5 truncate">
                🎓 {student.department} · Yr {student.year}
              </p>

              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3.5 h-3.5 text-[#ffcf40] fill-[#ffcf40]" />
                <span className="text-xs font-bold text-slate-800">{student.rating.toFixed(1)}</span>
                <span className="text-[11px] text-slate-400">
                  ({student.reviewCount} learner reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Match Score Box (Lime-Green Bar Theme) */}
          <div className="shrink-0 bg-[#7ed957]/15 border border-[#7ed957]/40 rounded-xl px-2.5 py-1.5 text-right min-w-[78px]">
            <span className="text-xs font-extrabold text-emerald-800 block leading-none">
              {score}%
            </span>
            <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">
              {matchInfo.label}
            </span>
            <div className="w-full h-1 bg-white/90 rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-[#7ed957] rounded-full transition-all"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>

        {/* Availability Pill */}
        {student.availability && (
          <div className="mt-3.5 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-600">
            <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="truncate">{student.availability}</span>
          </div>
        )}

        {/* Bio */}
        <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">{student.bio}</p>

        {/* Collapsible "Why this match?" */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowWhy((prev) => !prev)}
            className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-600 hover:text-teal-800 py-1 cursor-pointer"
          >
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-[#7ed957]" />
              Why this match?
            </span>
            {showWhy ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showWhy && (
            <div className="mt-1.5 p-2.5 rounded-xl bg-[#7ed957]/10 border border-[#7ed957]/30 text-[11px] text-slate-600 space-y-1">
              {teachesWhatYouWant.length > 0 && (
                <p>
                  ✅ Teaches skills you want:{' '}
                  <span className="font-bold text-slate-800">
                    {teachesWhatYouWant.join(', ')}
                  </span>
                </p>
              )}
              {wantsWhatYouTeach.length > 0 && (
                <p>
                  🔄 Wants to learn from you:{' '}
                  <span className="font-bold text-slate-800">
                    {wantsWhatYouTeach.join(', ')}
                  </span>
                </p>
              )}
              {sameDepartment && <p>🏛️ Same department ({student.department})</p>}
              {teachesWhatYouWant.length === 0 &&
                wantsWhatYouTeach.length === 0 &&
                !sameDepartment && (
                  <p>✨ Active campus peer mentor with high learner ratings</p>
                )}
            </div>
          )}
        </div>

        {/* CAN TEACH Skills */}
        <div className="mt-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Can Teach
          </span>
          <div className="flex flex-wrap gap-1.5">
            {student.teaches.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-[#7ed957]/15 text-emerald-800 border border-[#7ed957]/30"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* WANTS TO LEARN Skills */}
        <div className="mt-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Wants to Learn
          </span>
          <div className="flex flex-wrap gap-1.5">
            {student.wantsToLearn.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-[#eaf5ff] text-teal-800 border border-teal-200/60"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Earned Verification Badges */}
        {student.badges && student.badges.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {student.badges.map((b) => (
              <span
                key={b.skill}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-[#7ed957]/12 text-emerald-800 border border-[#7ed957]/30"
              >
                <ShieldCheck className="w-3 h-3 text-[#7ed957]" />
                {b.skill}
              </span>
            ))}
          </div>
        )}

        {/* GitHub Portfolio Box */}
        {gh && ghUsername && (
          <div className="mt-3.5 p-3 rounded-xl bg-slate-50/90 border border-slate-200/70">
            <div className="flex items-center justify-between text-xs">
              <a
                href={`https://github.com/${ghUsername}`}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-slate-700 hover:text-teal-700 inline-flex items-center gap-1"
              >
                @{ghUsername}
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-slate-400" />
                  <strong className="text-slate-700">{ghRepos}</strong> repos
                </span>
                <span className="inline-flex items-center gap-1">
                  <Star className="w-3 h-3 text-[#ffcf40] fill-[#ffcf40]" />
                  <strong className="text-slate-700">{ghStars}</strong> stars
                </span>
              </div>
            </div>

            {ghLanguages.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">
                  &lt;/&gt; Stack:
                </span>
                {ghLanguages.map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200/80 text-[10px] font-medium text-slate-600"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${langDotColor(lang)}`} />
                    {lang}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Buttons (Updated Request Session to #7ed957 Lime Green) */}
      <div className="mt-5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => onViewProfile(student)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200/90 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <User className="w-3.5 h-3.5" />
          View Profile
        </button>

        <button
          type="button"
          onClick={() => onRequestSession(student)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#7ed957] hover:bg-[#6ec847] text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
        >
          <CalendarPlus className="w-3.5 h-3.5" />
          Request Session
        </button>
      </div>
    </div>
  );
}