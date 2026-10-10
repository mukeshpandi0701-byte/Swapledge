import { useState } from 'react';
import { X, Star, CheckCircle2 } from 'lucide-react';
import type { SessionRequest, SessionReview } from '../types';

interface ReviewModalProps {
  session: SessionRequest;
  onClose: () => void;
  onSubmit: (sessionId: string, review: SessionReview) => void;
}

export default function ReviewModal({ session, onClose, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    const review: SessionReview = {
      rating,
      comment: comment.trim(),
      reviewedAt: new Date().toISOString(),
    };
    onSubmit(session.id, review);
    setSubmitted(true);
    setTimeout(onClose, 1400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl border border-slate-200/90 w-full max-w-sm overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">Rate Peer Learning Session</h3>
            <p className="text-[11px] text-slate-500">with {session.peerName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-10 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Review Submitted</h4>
              <p className="text-xs text-slate-500 mt-1">
                Thank you for contributing to campus peer reputation and community trust.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            {/* Session info callout */}
            <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-100 text-xs">
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Completed Session</p>
              <p className="font-bold text-slate-800 mt-0.5">{session.skill}</p>
              <p className="text-slate-500 text-[11px] mt-0.5">{session.date} · {session.timeSlot}</p>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-center text-xs font-semibold text-slate-700 mb-2">
                Overall Session Rating
              </label>
              <div className="flex items-center gap-1.5 justify-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(0)}
                    className="p-1 rounded-lg transition-transform hover:scale-115"
                    aria-label={`Rate ${i} stars`}
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        i <= (hovered || rating)
                          ? 'text-amber-500 fill-amber-400'
                          : 'text-slate-200 fill-slate-100'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-center text-[11px] font-bold text-slate-600 mt-1.5">
                {['', 'Needs Improvement', 'Fair Session', 'Good Learning', 'Great Mentor', 'Outstanding Session!'][hovered || rating]}
              </p>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Peer Feedback <span className="font-normal text-slate-400 lowercase">(optional)</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience to help other campus peers…"
                rows={3}
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/70 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={rating === 0}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-xs shadow-xs transition-all active:scale-98"
            >
              Submit Peer Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
