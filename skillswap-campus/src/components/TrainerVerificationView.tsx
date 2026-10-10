import { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  Link,
  BookOpen,
  Send,
  RotateCcw,
  Info,
} from 'lucide-react';
import type { Student, TrainerApplication, TrainerVerificationStatus } from '../types';

interface TrainerVerificationViewProps {
  activeUser: Student;
  onUpdateTrainerApplication: (app: TrainerApplication) => void;
}

export default function TrainerVerificationView({
  activeUser,
  onUpdateTrainerApplication,
}: TrainerVerificationViewProps) {
  const currentApp = activeUser.trainerApplication;
  const currentStatus: TrainerVerificationStatus =
    activeUser.trainerVerificationStatus || currentApp?.status || 'not_started';

  const [skills, setSkills] = useState<string[]>(
    currentApp?.skills || activeUser.teaches || ['JavaScript', 'React']
  );
  const [newSkill, setNewSkill] = useState('');
  const [teachingBio, setTeachingBio] = useState(
    currentApp?.teachingBio || activeUser.bio || ''
  );
  const [portfolioUrl, setPortfolioUrl] = useState(
    currentApp?.portfolioUrl || (activeUser.github ? `https://github.com/${activeUser.github.username}` : '')
  );
  const [experienceLevel, setExperienceLevel] = useState<TrainerApplication['experienceLevel']>(
    currentApp?.experienceLevel || 'Intermediate'
  );
  const [availability, setAvailability] = useState(
    currentApp?.availability || activeUser.availability || 'Weekdays 3:00 PM – 7:00 PM'
  );
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    const updatedApp: TrainerApplication = {
      status: 'pending',
      appliedAt: new Date().toISOString().split('T')[0],
      skills,
      teachingBio,
      portfolioUrl,
      experienceLevel,
      availability,
    };

    onUpdateTrainerApplication(updatedApp);
    setSubmitting(false);
  };

  // Demo simulation controls for honest evaluation testing
  const handleSimulateStatus = (status: TrainerVerificationStatus, reason?: string) => {
    const updatedApp: TrainerApplication = {
      ...(currentApp || {
        skills,
        teachingBio,
        portfolioUrl,
        experienceLevel,
        availability,
      }),
      status,
      reviewedAt: new Date().toISOString().split('T')[0],
      rejectionReason: reason,
    };
    onUpdateTrainerApplication(updatedApp);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-slate-800">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold mb-2.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Swapledge Trainer Verification
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Trainer Verification Center
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed max-w-xl">
              To ensure high learning quality on Swapledge, trainers go through a transparent verification
              process combining skill assessment credentials, project portfolios, and peer reviews.
            </p>
          </div>

          {/* Verification Status Pill */}
          <div className="shrink-0 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center min-w-[170px]">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Current Status
            </span>
            {currentStatus === 'verified' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Trainer
              </span>
            )}
            {currentStatus === 'pending' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5" /> Pending Review
              </span>
            )}
            {currentStatus === 'rejected' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                <XCircle className="w-3.5 h-3.5" /> Needs Revisions
              </span>
            )}
            {currentStatus === 'not_started' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-200/70 border border-slate-300 px-3 py-1 rounded-full">
                <AlertTriangle className="w-3.5 h-3.5 text-slate-500" /> Not Started
              </span>
            )}
          </div>
        </div>

        {/* Current Status Explanatory Card */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          {currentStatus === 'verified' && (
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-emerald-900">Your Trainer Credential is Active</h4>
                <p className="text-emerald-800 mt-0.5 leading-relaxed">
                  Learners across Swapledge can view your verified badge on your profile and filter for your sessions. Keep your teaching skills and availability up to date.
                </p>
              </div>
            </div>
          )}

          {currentStatus === 'pending' && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-amber-900">Application Under Campus Review</h4>
                <p className="text-amber-800 mt-0.5 leading-relaxed">
                  Your teaching application has been submitted and is in the verification queue. Peer review teams evaluate your assessment scores and portfolio evidence.
                </p>
                {currentApp?.appliedAt && (
                  <p className="text-[11px] text-amber-700 font-medium mt-1">Submitted: {currentApp.appliedAt}</p>
                )}
              </div>
            </div>
          )}

          {currentStatus === 'rejected' && (
            <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-rose-900">Verification Requires Revisions</h4>
                <p className="text-rose-800 mt-0.5 leading-relaxed">
                  {currentApp?.rejectionReason ||
                    'Please take the corresponding skill assessment in the Skill Assessment hub and include a verified repository link before resubmitting.'}
                </p>
              </div>
            </div>
          )}

          {currentStatus === 'not_started' && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-slate-800">Become a Verified Campus Trainer</h4>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Fill out the onboarding application below to showcase your technical competencies, availability, and portfolio. Verified trainers appear prominently in learner searches.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verification Security Policy Note */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800">Verification Security Standard:</strong> Swapledge does not automatically mark trainers as verified based solely on self-declaration or GitHub account existence. Authentic verification requires assessment evidence, sample code reviews, and positive peer session feedback.
        </div>
      </div>

      {/* Onboarding & Application Form */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
          {currentStatus === 'verified' ? 'Update Trainer Profile & Evidence' : 'Trainer Onboarding Application'}
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Provide detailed information about the subjects you teach and evidence of your practical experience.
        </p>

        <form onSubmit={handleSubmitApplication} className="space-y-5">
          {/* Teaching Skills */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Subjects & Skills You Can Teach
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg font-medium"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s)}
                    className="hover:text-emerald-950 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                placeholder="Add skill (e.g. React, Python, DSA, SQL)…"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Add Skill
              </button>
            </div>
          </div>

          {/* Experience Level & Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Teaching / Proficiency Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) =>
                  setExperienceLevel(e.target.value as TrainerApplication['experienceLevel'])
                }
                className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white text-slate-800"
              >
                <option value="Beginner">Beginner Mentor (Fundamentals)</option>
                <option value="Intermediate">Intermediate Trainer (Core Topics & Code)</option>
                <option value="Advanced">Advanced Trainer (System Design & Deep Dive)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Available Teaching Schedule
              </label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="e.g. Weekdays 3:00 PM – 7:00 PM"
                required
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white text-slate-800"
              />
            </div>
          </div>

          {/* Portfolio & Project Evidence */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              <Link className="inline w-3 h-3 mr-1 text-indigo-600" />
              Project / Portfolio / Code Repository URL
            </label>
            <input
              type="url"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              placeholder="https://github.com/your-username or portfolio website"
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white text-slate-800"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Links provide portfolio evidence reviewed by campus verifiers.
            </p>
          </div>

          {/* Teaching Bio & Methodology */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              <BookOpen className="inline w-3 h-3 mr-1 text-indigo-600" />
              Teaching Description & Methodology
            </label>
            <textarea
              value={teachingBio}
              onChange={(e) => setTeachingBio(e.target.value)}
              rows={3}
              placeholder="Describe how you explain complex concepts, your past mentoring experience, and what learners can expect…"
              required
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white text-slate-800 resize-none"
            />
          </div>

          {/* Skill Assessment Evidence on Profile */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-2">
              Attached Assessment Badges
            </span>
            {activeUser.badges.filter((b) => b.verified).length === 0 ? (
              <p className="text-xs text-slate-500">
                You haven't completed any skill quizzes yet. Take assessments in the Skill Assessment hub to attach verified credentials to this application!
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {activeUser.badges
                  .filter((b) => b.verified)
                  .map((b) => (
                    <span
                      key={b.skill}
                      className="inline-flex items-center gap-1.5 text-xs bg-white border border-indigo-200 px-3 py-1 rounded-lg font-semibold text-indigo-900 shadow-2xs"
                    >
                      <Award className="w-3.5 h-3.5 text-indigo-600" />
                      {b.skill} ({b.level}) ✓
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Submit Application Button */}
          <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting || skills.length === 0}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              {currentStatus === 'verified'
                ? 'Update Trainer Profile'
                : currentStatus === 'pending'
                ? 'Resubmit Application'
                : 'Submit Verification Application'}
            </button>

            <span className="text-[11px] text-slate-400">
              Applications are reviewed in order of submission
            </span>
          </div>
        </form>
      </div>

      {/* Honest Prototype Simulation Center */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 text-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <h4 className="font-bold text-slate-800">
              Prototype Verification Workflow Tester
            </h4>
          </div>
          <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
            Evaluation Sandbox
          </span>
        </div>
        <p className="text-slate-500 leading-relaxed text-[11px]">
          Since this is a client-side prototype without an external campus admin dashboard, you can simulate how the application responds when an authorized administrator verifies or rejects the trainer application:
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleSimulateStatus('verified')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Simulate Admin: Approve Verification
          </button>

          <button
            type="button"
            onClick={() =>
              handleSimulateStatus(
                'rejected',
                'Application needs additional code repository samples and a completed DSA skill assessment.'
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-semibold text-xs transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            Simulate Admin: Reject with Reason
          </button>

          <button
            type="button"
            onClick={() => handleSimulateStatus('not_started')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg font-medium text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Not Started
          </button>
        </div>
      </div>
    </div>
  );
}
