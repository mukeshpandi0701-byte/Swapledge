import { useState } from 'react';
import { X, CalendarDays, Clock, BookOpen, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
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
    await new Promise((r) => setTimeout(r, 600)); // Simulate brief network dispatch

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
        className="bg-white rounded-2xl shadow-xl border border-slate-200/90 w-full max-w-md overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <img
              src={peer.avatar}
              alt={peer.name}
              className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-100 object-cover"
            />
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Request Free Peer Session</h3>
              <p className="text-[11px] text-slate-500">with {peer.name} ({peer.department})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
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
              <h4 className="text-base font-bold text-slate-900">Session Request Sent</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                {peer.name} will be notified. Once confirmed, this session will show up in your Upcoming schedule.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            {/* Skill / Topic */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                <BookOpen className="inline w-3 h-3 mr-1 text-indigo-600" />
                Select Topic / Skill
              </label>
              <select
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                required
                className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/70 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              >
                {peer.teaches.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                <CalendarDays className="inline w-3 h-3 mr-1 text-indigo-600" />
                Session Date
              </label>
              <input
                type="date"
                value={date}
                min={getTomorrowDate()}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/70 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              />
            </div>

            {/* Time Slot */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                <Clock className="inline w-3 h-3 mr-1 text-indigo-600" />
                Preferred Time Slot
              </label>
              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`text-xs py-1.5 px-2.5 rounded-xl border text-center font-medium transition-all ${
                      timeSlot === slot
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-800 font-semibold shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                <MessageSquare className="inline w-3 h-3 mr-1 text-indigo-600" />
                Session Focus / Notes <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What topics or problems would you like to focus on?"
                rows={3}
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/70 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 resize-none"
              />
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 active:scale-98 text-white font-semibold py-2.5 rounded-xl text-xs shadow-xs transition-all"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Dispatching Request…
                  </>
                ) : (
                  'Confirm & Request Session'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
