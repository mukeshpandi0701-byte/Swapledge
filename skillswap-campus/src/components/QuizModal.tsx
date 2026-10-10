import { useState } from 'react';
import { X, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import type { Quiz, QuizResult } from '../types';

interface QuizModalProps {
  quiz: Quiz;
  onClose: () => void;
  onComplete: (result: QuizResult) => void;
}

type Phase = 'intro' | 'quiz' | 'result';

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
    // Move to next or finish
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800">{quiz.skill} Assessment</h2>
            <p className="text-xs text-slate-400">{quiz.level} · {totalQ} Questions</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Phase: Intro */}
        {phase === 'intro' && (
          <div className="p-6 flex flex-col gap-5 items-center text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-4xl">
              {quiz.skill === 'Python' ? '🐍' : quiz.skill === 'DSA' ? '🌳' : '⚛️'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">{quiz.skill} Skill Quiz</h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                Answer <strong>{totalQ} multiple-choice questions</strong>. Score{' '}
                <strong>{quiz.passingScore}/{totalQ}</strong> or above to earn your{' '}
                <span className="text-indigo-600 font-semibold">"{quiz.badgeLabel}"</span> verified badge.
              </p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-3 w-full text-left border border-indigo-100">
              <p className="text-xs text-indigo-700 font-medium">📌 Rules</p>
              <ul className="mt-1.5 text-xs text-indigo-600 space-y-1 list-disc list-inside">
                <li>Select the best answer for each question</li>
                <li>You'll see the explanation before moving on</li>
                <li>Badges are added to your profile instantly</li>
              </ul>
            </div>
            <button
              onClick={() => setPhase('quiz')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all active:scale-95"
            >
              Start Quiz →
            </button>
          </div>
        )}

        {/* Phase: Quiz */}
        {phase === 'quiz' && (
          <div className="p-6 flex flex-col gap-4">
            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 -mt-1">Question {current + 1} of {totalQ}</p>

            {/* Question */}
            <p className="text-sm font-semibold text-slate-800 leading-relaxed">{question.question}</p>

            {/* Options */}
            <div className="flex flex-col gap-2">
              {question.options.map((opt) => {
                const isCorrect = opt.id === question.correctOptionId;
                const isSelected = opt.id === selected;
                let cls = 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50';
                if (revealed) {
                  if (isCorrect) cls = 'border-emerald-400 bg-emerald-50 text-emerald-800';
                  else if (isSelected && !isCorrect) cls = 'border-rose-400 bg-rose-50 text-rose-700';
                  else cls = 'border-slate-200 bg-slate-50 text-slate-400';
                } else if (isSelected) {
                  cls = 'border-indigo-500 bg-indigo-50 text-indigo-800';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    className={`text-left text-sm px-4 py-3 rounded-xl border transition-all font-medium flex items-center justify-between ${cls}`}
                  >
                    <span>{opt.text}</span>
                    {revealed && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                    {revealed && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {revealed && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs font-semibold text-amber-700 mb-0.5">💡 Explanation</p>
                <p className="text-xs text-amber-800">{question.explanation}</p>
              </div>
            )}

            <button
              onClick={handleNext}
              disabled={!selected || loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all active:scale-95"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Calculating…</>
              ) : !revealed ? (
                'Check Answer'
              ) : current + 1 < totalQ ? (
                'Next Question →'
              ) : (
                'Finish Quiz'
              )}
            </button>
          </div>
        )}

        {/* Phase: Result */}
        {phase === 'result' && result && (
          <div className="p-6 flex flex-col items-center text-center gap-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl ${result.passed ? 'bg-emerald-50' : 'bg-rose-50'}`}>
              {result.passed ? '🏆' : '📚'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                {result.passed ? 'You Passed!' : 'Keep Practicing!'}
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                You scored <strong className="text-slate-700">{result.score}/{result.total}</strong>
              </p>
            </div>
            {result.passed ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 w-full">
                <p className="text-sm font-semibold text-emerald-700 mb-1">🎖️ Badge Earned!</p>
                <p className="text-sm text-emerald-600">
                  <strong>"{quiz.badgeLabel}"</strong> badge has been added to your profile.
                </p>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 w-full">
                <p className="text-sm text-amber-700">
                  You needed <strong>{quiz.passingScore}/{quiz.questions.length}</strong> to pass. Study up and try again!
                </p>
              </div>
            )}
            <button
              onClick={onClose}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 rounded-xl transition-all active:scale-95"
            >
              Back to Assessment Hub
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
