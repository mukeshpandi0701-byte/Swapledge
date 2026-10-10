import { useState } from 'react';
import { ShieldCheck, Play, Award, CheckCircle2, Terminal, Globe, Binary, BookOpenCheck } from 'lucide-react';
import type { Quiz, QuizResult, Student } from '../types';
import QuizModal from './QuizModal';

interface AssessmentViewProps {
  quizzes: Quiz[];
  activeUser: Student;
  completedQuizzes: QuizResult[];
  onQuizComplete: (result: QuizResult) => void;
}

function getQuizIcon(quizId: string) {
  switch (quizId) {
    case 'quiz-python':
      return <Terminal className="w-5 h-5 text-emerald-600" />;
    case 'quiz-webdev':
      return <Globe className="w-5 h-5 text-indigo-600" />;
    case 'quiz-dsa':
      return <Binary className="w-5 h-5 text-violet-600" />;
    default:
      return <BookOpenCheck className="w-5 h-5 text-indigo-600" />;
  }
}

export default function AssessmentView({
  quizzes,
  activeUser,
  completedQuizzes,
  onQuizComplete,
}: AssessmentViewProps) {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  const getResult = (quizId: string) => completedQuizzes.find((r) => r.quizId === quizId);

  const verifiedBadges = activeUser.badges.filter((b) => b.verified);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold mb-2.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Campus Skill Verification System
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Skill Assessment Hub
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
              Verify your technical competencies with targeted campus assessments. Passing a quiz awards a
              verified credential badge displayed directly on your student profile to build peer trust.
            </p>
          </div>

          <div className="shrink-0 p-4 rounded-xl bg-slate-50 border border-slate-100 text-center min-w-[140px]">
            <span className="text-2xl font-bold text-indigo-600 block">{verifiedBadges.length}</span>
            <span className="text-xs font-semibold text-slate-600 mt-0.5 block">Verified Badges</span>
          </div>
        </div>

        {/* Current Active User Badges */}
        {verifiedBadges.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Your Earned Credentials
              </h3>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {verifiedBadges.map((badge) => (
                <div
                  key={badge.skill}
                  className="flex items-center gap-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl px-3.5 py-2 shadow-2xs"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-100/80 text-indigo-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{badge.skill}</p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {badge.level} · Verified {badge.earnedAt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quizzes Grid */}
      <div>
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Available Assessments</h3>
          <p className="text-xs text-slate-500">
            Complete the questions below to demonstrate practical topic mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quizzes.map((quiz) => {
            const result = getResult(quiz.id);
            const alreadyPassed = Boolean(result?.passed);

            return (
              <div
                key={quiz.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all flex flex-col overflow-hidden text-slate-800"
              >
                {/* Card Top */}
                <div className="p-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-3 bg-linear-to-b from-slate-50/70 to-white">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0">
                      {getQuizIcon(quiz.id)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{quiz.skill}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {quiz.level} · {quiz.questions.length} Questions
                      </p>
                    </div>
                  </div>

                  {alreadyPassed && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Passed
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>
                        Passing score: <strong className="text-slate-800">{quiz.passingScore}/{quiz.questions.length}</strong> correct
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100/80 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="text-xs font-semibold text-indigo-900 truncate">
                        Earns "{quiz.badgeLabel}" badge
                      </span>
                    </div>

                    {result && (
                      <div
                        className={`p-2.5 rounded-xl text-xs flex items-center justify-between border ${
                          result.passed
                            ? 'bg-emerald-50/60 text-emerald-800 border-emerald-200/60'
                            : 'bg-amber-50/60 text-amber-800 border-amber-200/60'
                        }`}
                      >
                        <span className="font-semibold">
                          {result.passed ? 'Badge Earned' : 'Not passed yet'}
                        </span>
                        <span className="font-mono text-[11px]">
                          Score: {result.score}/{result.total}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Start / Retake Action Button */}
                  <button
                    onClick={() => setActiveQuiz(quiz)}
                    className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
                      alreadyPassed
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                    }`}
                  >
                    {alreadyPassed ? (
                      'Review / Retake Quiz'
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        {result ? 'Retake Quiz' : 'Begin Assessment'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeQuiz && (
        <QuizModal
          quiz={activeQuiz}
          onClose={() => setActiveQuiz(null)}
          onComplete={(result) => {
            onQuizComplete(result);
            setActiveQuiz(null);
          }}
        />
      )}
    </div>
  );
}
