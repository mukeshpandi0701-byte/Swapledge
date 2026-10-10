import { useState } from 'react';
import { X, CalendarDays, Clock, BookOpen, MessageSquare, Loader2 } from 'lucide-react';
import type { Student, SessionRequest } from '../types';

interface BookingModalProps {
  peer: Student;
  activeUser: Student;
  onClose: () => void;
  onBook: (session: SessionRequest) => void;
}

const TIME_SLOTS = [
  '9:00 AM – 10:00 AM',
  '10:00 AM – 11:00 AM',
  '11:00 AM – 12:00 PM',
  '2:00 PM – 3:00 PM',
  '3:00 PM – 4:00 PM',
  '4:00 PM – 5:00 PM',
  '6:00 PM – 7:00 PM',
  '7:00 PM – 8:00 PM',
];

function getTomorrowDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

export default function BookingModal({ peer, activeUser, onClose, onBook }: BookingModalProps) {
  const [date, setDate] = useState(getTomorrowDate());
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [skill, setSkill] = useState(peer.teaches[0] ?? '');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !timeSlot || !skill) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800)); // Simulate network delay

    const session: SessionRequest = {
      id: `session-${Date.now()}`,
      requesterId: activeUser.id,
      requesterName: activeUser.name,
      requesterAvatar: activeUser.avatar,
      peerId: peer.id,
      peerName: peer.name,
      peerAvatar: peer.avatar,
      skill,
      date,
      timeSlot,
      note,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    onBook(session);
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(onClose, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img src={peer.avatar} alt={peer.name} className="w-9 h-9 rounded-xl border-2 border-slate-100 bg-slate-50" />
            <div>
              <h2 className="text-base font-bold text-slate-800">Book a Free Session</h2>
              <p className="text-xs text-slate-500">with {peer.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-12 flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
              <span className="text-3xl">🎉</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800">Session Requested!</h3>
            <p className="text-sm text-slate-500">Your request has been sent to {peer.name}. You'll be notified once accepted.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            {/* Skill */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                <BookOpen className="inline w-3.5 h-3.5 mr-1 text-indigo-500" />
                Skill / Topic
              </label>
              <select
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                required
                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700"
              >
                {peer.teaches.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                <CalendarDays className="inline w-3.5 h-3.5 mr-1 text-indigo-500" />
                Date
              </label>
              <input
                type="date"
                value={date}
                min={getTomorrowDate()}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700"
              />
            </div>

            {/* Time Slot */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                <Clock className="inline w-3.5 h-3.5 mr-1 text-indigo-500" />
                Time Slot
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`text-xs py-2 px-3 rounded-lg border font-medium transition-all ${
                      timeSlot === slot
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                <MessageSquare className="inline w-3.5 h-3.5 mr-1 text-indigo-500" />
                Note <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What do you want to focus on?"
                rows={3}
                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all active:scale-95"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending Request…</>
              ) : (
                'Confirm Session Request'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
