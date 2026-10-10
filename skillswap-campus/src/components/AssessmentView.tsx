import { useState } from 'react';
import { ShieldCheck, Play, Award, CheckCircle } from 'lucide-react';
import type { Quiz, QuizResult, Student } from '../types';
import QuizModal from './QuizModal';

interface AssessmentViewProps {
  quizzes: Quiz[];
  activeUser: Student;
  completedQuizzes: QuizResult[];
  onQuizComplete: (result: QuizResult) => void;
}

export default function AssessmentView({ quizzes, activeUser, completedQuizzes, onQuizComplete }: AssessmentViewProps) {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  const getResult = (quizId: string) => completedQuizzes.find((r) => r.quizId === quizId);

  const QUIZ_META: Record<string, { icon: string; color: string; description: string }> = {
    'quiz-python': {
      icon: '🐍',
      color: 'from-emerald-500 to-teal-600',
      description: 'Test your Python fundamentals: comprehensions, types, and OOP concepts.',
    },
    'quiz-webdev': {
      icon: '⚛️',
      color: 'from-sky-500 to-indigo-600',
      description: 'Validate your React hooks, CSS positioning, and HTTP knowledge.',
    },
    'quiz-dsa': {
      icon: '🌳',
      color: 'from-violet-500 to-purple-700',
      description: 'Prove your understanding of data structures and algorithm complexity.',
    },
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-800">Skill Assessment Hub</h2>
        </div>
        <p className="text-sm text-slate-500">
          Pass a quiz to earn a <strong>Verified Badge</strong> — displayed on your profile to build trust with peers.
        </p>
      </div>

      {/* Current Badges */}
      {activeUser.badges.filter((b) => b.verified).length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-indigo-50 to-emerald-50 border border-indigo-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-700">Your Verified Badges</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeUser.badges.filter((b) => b.verified).map((badge) => (
              <div
                key={badge.skill}
                className="flex items-center gap-2 bg-white border border-indigo-200 rounded-xl px-3 py-2 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <div>
                  <p className="text-xs font-bold text-slate-800">{badge.skill}</p>
                  <p className="text-[10px] text-slate-500">{badge.level} · Earned {badge.earnedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {quizzes.map((quiz) => {
          const meta = QUIZ_META[quiz.id] ?? { icon: '📝', color: 'from-slate-400 to-slate-600', description: '' };
          const result = getResult(quiz.id);
          const alreadyPassed = result?.passed;

          return (
            <div key={quiz.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200">
              {/* Gradient top */}
              <div className={`bg-gradient-to-r ${meta.color} p-5`}>
                <span className="text-4xl block mb-2">{meta.icon}</span>
                <h3 className="text-white font-bold text-base">{quiz.skill}</h3>
                <p className="text-white/75 text-xs">{quiz.level} · {quiz.questions.length} Questions</p>
              </div>

              <div className="p-4 flex flex-col gap-3">
                <p className="text-xs text-slate-500 leading-relaxed">{meta.description}</p>

                {/* Pass threshold */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  Pass with <strong className="text-slate-700">{quiz.passingScore}/{quiz.questions.length}</strong> correct answers
                </div>

                {/* Badge label */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="text-xs font-semibold text-indigo-700">Earns: "{quiz.badgeLabel}"</span>
                </div>

                {/* Result display */}
                {result && (
                  <div className={`rounded-lg px-3 py-2 flex items-center gap-2 ${result.passed ? 'bg-emerald-50 border border-emerald-100' : 'bg-amber-50 border border-amber-100'}`}>
                    <span className="text-base">{result.passed ? '🏆' : '📚'}</span>
                    <div>
                      <p className={`text-xs font-semibold ${result.passed ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {result.passed ? 'Badge Earned!' : 'Not passed yet'}
                      </p>
                      <p className="text-[10px] text-slate-500">Score: {result.score}/{result.total}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setActiveQuiz(quiz)}
                  disabled={alreadyPassed}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                    alreadyPassed
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {alreadyPassed ? (
                    <><CheckCircle className="w-4 h-4" /> Verified ✓</>
                  ) : (
                    <><Play className="w-4 h-4" /> {result ? 'Retake Quiz' : 'Start Quiz'}</>
                  )}
                </button>
              </div>
            </div>
          );
        })}
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
