import { useState } from 'react';
import { X, Star } from 'lucide-react';
import type { SessionRequest, SessionReview } from '../types';

interface ReviewModalProps {
  session: SessionRequest;
  onClose: () => void;
  onSubmit: (sessionId: string, review: SessionReview) => void;
}

export default function ReviewModal({ session, onClose, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    const review: SessionReview = {
      rating,
      comment,
      reviewedAt: new Date().toISOString(),
    };
    onSubmit(session.id, review);
    setSubmitted(true);
    setTimeout(onClose, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">Rate Your Session</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-12 flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-3xl">⭐</div>
            <h3 className="text-lg font-bold text-slate-800">Thanks for your review!</h3>
            <p className="text-sm text-slate-500">Your feedback helps the SkillSwap community grow.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
            {/* Session info */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p className="text-xs text-slate-500">Session with</p>
              <p className="text-sm font-semibold text-slate-800">{session.peerName}</p>
              <p className="text-xs text-indigo-600 mt-0.5">{session.skill} · {session.date}</p>
            </div>

            {/* Star Rating */}
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2">How would you rate this session?</p>
              <div className="flex items-center gap-1.5 justify-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-9 h-9 transition-colors ${
                        i <= (hovered || rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-xs text-slate-500 mt-1.5">
                  {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][rating]}
                </p>
              )}
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Comments <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell others about your experience…"
                rows={3}
                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={rating === 0}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all active:scale-95"
            >
              Submit Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
