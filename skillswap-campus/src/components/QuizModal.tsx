import { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  Loader2,
  Terminal,
  Globe,
  Binary,
  BookOpenCheck,
  Trophy,
  ShieldCheck,
  ArrowRight,
  Info,
} from 'lucide-react';
import type { Quiz, QuizResult } from '../types';

interface QuizModalProps {
  quiz: Quiz;
  onClose: () => void;
  onComplete: (result: QuizResult) => void;
}

type Phase = 'intro' | 'quiz' | 'result';

function getSkillIcon(skill: string) {
  switch (skill.toLowerCase()) {
    case 'python':
      return <Terminal className="w-8 h-8 text-emerald-600" />;
    case 'web development':
      return <Globe className="w-8 h-8 text-indigo-600" />;
    case 'dsa':
      return <Binary className="w-8 h-8 text-violet-600" />;
    default:
      return <BookOpenCheck className="w-8 h-8 text-indigo-600" />;
  }
}

export default function QuizModal({ quiz, onClose, onComplete }: QuizModalProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(false);

  const question = quiz.questions[current];
  const totalQ = quiz.questions.length;

  const handleSelect = (optionId: string) => {
    if (revealed) return;
    setSelected(optionId);
  };

  const handleNext = () => {
    if (!selected) return;
    if (!revealed) {
      setRevealed(true);
      setAnswers((prev) => ({ ...prev, [question.id]: selected }));
      return;
    }
    // Move to next question or complete
    if (current + 1 < totalQ) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      finishQuiz({ ...answers, [question.id]: selected });
    }
  };

  const finishQuiz = async (finalAnswers: Record<string, string>) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const score = quiz.questions.filter((q) => finalAnswers[q.id] === q.correctOptionId).length;
    const passed = score >= quiz.passingScore;
    const qResult: QuizResult = {
      quizId: quiz.id,
      skill: quiz.skill,
      score,
      total: totalQ,
      passed,
      completedAt: new Date().toISOString(),
    };
    setResult(qResult);
    onComplete(qResult);
    setLoading(false);
    setPhase('result');
  };

  const progress = ((current + (revealed ? 1 : 0)) / totalQ) * 100;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl border border-slate-200/90 w-full max-w-lg overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div>
            <h3 className="text-sm font-bold text-slate-900">{quiz.skill} Competency Assessment</h3>
            <p className="text-[11px] text-slate-500">{quiz.level} Level · {totalQ} Questions</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Phase: Intro */}
        {phase === 'intro' && (
          <div className="p-6 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200/80 shadow-2xs">
              {getSkillIcon(quiz.skill)}
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-900 mb-1">{quiz.skill} Verification</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                Answer <strong className="text-slate-800">{totalQ} technical questions</strong>. Score at least{' '}
                <strong className="text-slate-800">{quiz.passingScore}/{totalQ}</strong> to earn your{' '}
                <span className="text-indigo-600 font-semibold">"{quiz.badgeLabel}"</span> verified credential.
              </p>
            </div>

            <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-left text-xs space-y-1.5">
              <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                Assessment Rules
              </span>
              <ul className="text-slate-600 space-y-1 text-[11px] list-disc list-inside">
                <li>Immediate question-by-question explanations provided for learning</li>
                <li>Passing immediately awards the badge to your student profile</li>
                <li>You can retake anytime to refresh knowledge</li>
              </ul>
            </div>

            <button
              onClick={() => setPhase('quiz')}
              className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-semibold py-2.5 rounded-xl text-xs shadow-xs transition-all"
            >
              <span>Begin Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Phase: Quiz Active */}
        {phase === 'quiz' && (
          <div className="p-6 flex flex-col gap-4">
            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1.5">
                <span>Question {current + 1} of {totalQ}</span>
                <span>{Math.round(progress)}% Completed</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <p className="text-sm font-semibold text-slate-900 leading-snug">
              {question.question}
            </p>

            {/* Options */}
            <div className="space-y-2">
              {question.options.map((opt) => {
                const isCorrect = opt.id === question.correctOptionId;
                const isSelected = opt.id === selected;

                let stateClass = 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50';
                if (revealed) {
                  if (isCorrect) {
                    stateClass = 'border-emerald-300 bg-emerald-50 text-emerald-900 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    stateClass = 'border-rose-300 bg-rose-50 text-rose-900';
                  } else {
                    stateClass = 'border-slate-200 bg-slate-50 text-slate-400 opacity-70';
                  }
                } else if (isSelected) {
                  stateClass = 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold ring-1 ring-indigo-600';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    className={`w-full text-left text-xs px-3.5 py-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${stateClass}`}
                  >
                    <span className="leading-relaxed">{opt.text}</span>
                    {revealed && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    {revealed && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation Note */}
            {revealed && (
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 text-xs animate-fade-in">
                <div className="flex items-center gap-1.5 font-bold text-indigo-900 text-[11px] mb-1">
                  <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Explanation & Context</span>
                </div>
                <p className="text-indigo-950 leading-relaxed text-[11px]">{question.explanation}</p>
              </div>
            )}

            {/* Bottom Stepper Button */}
            <button
              onClick={handleNext}
              disabled={!selected || loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 active:scale-98 text-white font-semibold py-2.5 rounded-xl text-xs shadow-xs transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying score…
                </>
              ) : !revealed ? (
                'Check Answer'
              ) : current + 1 < totalQ ? (
                'Next Question →'
              ) : (
                'Finish & View Results'
              )}
            </button>
          </div>
        )}

        {/* Phase: Result */}
        {phase === 'result' && result && (
          <div className="p-6 flex flex-col items-center text-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${
                result.passed
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                  : 'bg-rose-50 border-rose-200 text-rose-600'
              }`}
            >
              {result.passed ? <Trophy className="w-8 h-8" /> : <BookOpenCheck className="w-8 h-8" />}
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {result.passed ? 'Assessment Passed!' : 'Practice Recommended'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                You correctly answered <strong className="text-slate-800">{result.score} of {result.total}</strong> questions
              </p>
            </div>

            {result.passed ? (
              <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-xl p-4 w-full text-left space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Credential Badge Awarded</span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  The verified <strong>"{quiz.badgeLabel}"</strong> badge is now displayed on your campus peer card.
                </p>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 w-full text-left space-y-1">
                <span className="text-slate-800 font-bold text-xs block">Passing Requirement</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A minimum score of {quiz.passingScore}/{quiz.questions.length} is required for verification. Review the explanations and retake when ready!
                </p>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors"
            >
              Return to Assessment Hub
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
