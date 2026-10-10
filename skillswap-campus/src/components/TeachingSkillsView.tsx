import { useState } from 'react';
import { BookOpen, Plus, Clock, Check, Save } from 'lucide-react';
import type { Student } from '../types';

interface TeachingSkillsViewProps {
  activeUser: Student;
  onUpdateTeachingProfile: (updates: Partial<Student>) => void;
}

export default function TeachingSkillsView({
  activeUser,
  onUpdateTeachingProfile,
}: TeachingSkillsViewProps) {
  const [skills, setSkills] = useState<string[]>(activeUser.teaches);
  const [newSkill, setNewSkill] = useState('');
  const [availability, setAvailability] = useState(
    activeUser.availability || 'Weekdays 3:00 PM – 7:00 PM'
  );
  const [bio, setBio] = useState(activeUser.bio);
  const [saved, setSaved] = useState(false);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = () => {
    onUpdateTeachingProfile({
      teaches: skills,
      availability,
      bio,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in text-slate-800">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1 block">
            Teaching Profile
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Manage Skills Offered
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Specify the topics and skills you can tutor or mentor campus peers in. Learners can request free 1-on-1 sessions based on these subjects.
          </p>
        </div>

        {/* Currently Offered Skills */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            Current Teaching Skills ({skills.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3 py-1.5 rounded-xl font-semibold"
              >
                <span>{s}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(s)}
                  className="w-4 h-4 rounded-full bg-emerald-200/60 hover:bg-emerald-300 text-emerald-900 flex items-center justify-center text-[11px] font-bold"
                  aria-label={`Remove ${s}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddSkill} className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Add skill (e.g. Next.js, Django, Linear Algebra)…"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </form>
        </div>

        {/* Availability Setting */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            <Clock className="inline w-3.5 h-3.5 mr-1 text-indigo-600" />
            Weekly Teaching Availability
          </label>
          <input
            type="text"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            placeholder="e.g. Weekdays 3:00 PM – 7:00 PM, Saturday mornings"
            className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
          <p className="text-[11px] text-slate-400">
            Displayed on your trainer card so peers request sessions during your free hours.
          </p>
        </div>

        {/* Teaching Description */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            <BookOpen className="inline w-3.5 h-3.5 mr-1 text-indigo-600" />
            Trainer Bio / Teaching Style
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Introduce your teaching background, topics you love explaining, and project experience…"
            className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 resize-none"
          />
        </div>

        {/* Save Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5" /> Saved Successfully!
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" /> Save Changes
              </>
            )}
          </button>
          {saved && (
            <span className="text-xs text-emerald-600 font-semibold animate-fade-in">
              Your profile changes are live across Swapledge.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
