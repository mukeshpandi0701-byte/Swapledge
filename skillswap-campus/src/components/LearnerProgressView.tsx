import {
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import type { Student, SessionRequest } from '../types';

interface LearnerProgressViewProps {
  activeUser: Student;
  sessions: SessionRequest[];
  allTrainers: Student[];
  onNavigateExplore: () => void;
  onNavigateAssessment: () => void;
}

export default function LearnerProgressView({
  activeUser,
  sessions,
  allTrainers,
  onNavigateExplore,
  onNavigateAssessment,
}: LearnerProgressViewProps) {
  // Learning sessions where activeUser is the requester/learner
  const learnerSessions = sessions.filter((s) => s.requesterId === activeUser.id);
  const completedLearnerSessions = learnerSessions.filter((s) => s.status === 'completed');
  const upcomingLearnerSessions = learnerSessions.filter((s) => s.status === 'accepted');

  const verifiedBadges = activeUser.badges.filter((b) => b.verified);

  // Find trainers that teach what user wants to learn
  const wishlistSkills = new Set(activeUser.wantsToLearn.map((s) => s.toLowerCase()));
  const recommendedTrainers = allTrainers.filter(
    (t) => t.id !== activeUser.id && t.teaches.some((s) => wishlistSkills.has(s.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-slate-800">
      {/* Overview Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              Learner Analytics
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Your Learning Journey
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg">
              Track skills you're currently mastering, completed mentoring sessions with campus peers, and earned technical badges.
            </p>
          </div>

          <div className="shrink-0 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center min-w-[150px]">
            <span className="text-2xl font-bold text-indigo-600 block">
              {completedLearnerSessions.length * 1.5} hrs
            </span>
            <span className="text-[11px] font-medium text-slate-500 mt-0.5 block">Estimated Learning Time</span>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3.5 text-center">
            <span className="text-xl font-bold text-slate-900 block">{activeUser.wantsToLearn.length}</span>
            <span className="text-[11px] font-medium text-slate-500 mt-0.5 block">Wishlist Skills</span>
          </div>

          <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3.5 text-center">
            <span className="text-xl font-bold text-slate-900 block">{upcomingLearnerSessions.length}</span>
            <span className="text-[11px] font-medium text-slate-500 mt-0.5 block">Upcoming Sessions</span>
          </div>

          <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3.5 text-center">
            <span className="text-xl font-bold text-slate-900 block">{completedLearnerSessions.length}</span>
            <span className="text-[11px] font-medium text-slate-500 mt-0.5 block">Completed Sessions</span>
          </div>

          <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3.5 text-center">
            <span className="text-xl font-bold text-slate-900 block">{verifiedBadges.length}</span>
            <span className="text-[11px] font-medium text-slate-500 mt-0.5 block">Verified Badges</span>
          </div>
        </div>
      </div>

      {/* Target Skills in Wishlist */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Skills on Your Learning List
            </h3>
          </div>
          <button
            onClick={onNavigateExplore}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
          >
            Find Trainers <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {activeUser.wantsToLearn.map((skill) => {
            const hasCompleted = completedLearnerSessions.some(
              (s) => s.skill.toLowerCase() === skill.toLowerCase()
            );
            return (
              <div
                key={skill}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-800 block">{skill}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {hasCompleted ? 'Session completed ✓' : 'Looking for sessions'}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      hasCompleted
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-indigo-50 text-indigo-700'
                    }`}
                  >
                    {hasCompleted ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> Practiced
                      </>
                    ) : (
                      'In Progress'
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verified Skill Credentials Section */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Earned Skill Credentials
            </h3>
          </div>
          <button
            onClick={onNavigateAssessment}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
          >
            Take More Assessments <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {verifiedBadges.length === 0 ? (
          <p className="text-xs text-slate-500 py-2">
            No badges earned yet. Test your competencies in the Skill Assessment hub to earn verified badges.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {verifiedBadges.map((badge) => (
              <div
                key={badge.skill}
                className="p-3 rounded-xl border border-slate-200/80 bg-white flex items-center gap-3 shadow-2xs"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{badge.skill}</h4>
                  <p className="text-[11px] text-slate-500">
                    {badge.level} Level · Earned {badge.earnedAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Trainers for Wishlist Skills */}
      {recommendedTrainers.length > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Suggested Trainers for Your Wishlist
            </h3>
            <button
              onClick={onNavigateExplore}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              Browse All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recommendedTrainers.slice(0, 3).map((trainer) => (
              <div
                key={trainer.id}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <img
                    src={trainer.avatar}
                    alt={trainer.name}
                    className="w-8 h-8 rounded-lg bg-slate-100 object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-none">{trainer.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{trainer.department}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 my-2">
                  {trainer.teaches.slice(0, 2).map((sk) => (
                    <span
                      key={sk}
                      className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-1.5 py-0.2 rounded-md font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
                <button
                  onClick={onNavigateExplore}
                  className="mt-2 text-center text-xs font-semibold py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-indigo-600 transition-colors"
                >
                  View Profile & Book
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
