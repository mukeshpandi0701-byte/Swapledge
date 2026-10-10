import { useState } from 'react';
import {
  X,
  Star,
  CheckCircle2,
  Clock,
  ShieldCheck,
  CalendarPlus,
  Mail,
  Calendar,
  BookOpen,
  ExternalLink,
  Sparkles,
  Loader2,
  AlertCircle,
  Code2,
  GitFork,
  PlusCircle,
} from 'lucide-react';
import type { Student } from '../types';

interface StudentProfileModalProps {
  student: Student;
  activeUser: Student;
  onClose: () => void;
  onRequestSession: (student: Student) => void;
  onUpdateActiveUser?: (updates: Partial<Student>) => void;
}

interface AnalyzedRepo {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
}

export default function StudentProfileModal({
  student,
  activeUser,
  onClose,
  onRequestSession,
  onUpdateActiveUser,
}: StudentProfileModalProps) {
  const isOwnProfile = student.id === activeUser.id;
  const s = student as Record<string, any>;

  // GitHub Analyzer State
  const existingGh = (s.github as Record<string, any> | undefined) || {};
  const [githubInput, setGithubInput] = useState(
    existingGh.username ? `https://github.com/${existingGh.username}` : ''
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState('');
  const [analyzedRepos, setAnalyzedRepos] = useState<AnalyzedRepo[]>([]);
  const [followersCount, setFollowersCount] = useState<number | null>(null);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const isVerifiedTrainer =
    student.trainerVerificationStatus === 'verified' || student.isVerified;

  // Safe extraction of student & GitHub stats
  const studentEmail = s.email || `${student.name.toLowerCase().replace(/\s+/g, '.')}@campus.edu`;
  const studentJoined = s.joinedDate || s.joinedAt || '2026-01-10';
  const studentSessionsCount = s.sessionsCompleted ?? s.completedSessions ?? 12;

  const ghUsername = existingGh.username || '';
  const ghRepos = existingGh.publicRepos ?? existingGh.repos ?? 0;
  const ghStars = existingGh.totalStars ?? existingGh.stars ?? 0;
  const ghLanguages: string[] =
    existingGh.topLanguages ?? existingGh.languages ?? existingGh.stack ?? [];

  // Extract clean username from full GitHub URL or @handle
  const extractGithubUsername = (input: string): string => {
    const trimmed = input.trim().replace(/\/+$/, '');
    if (!trimmed) return '';
    if (trimmed.includes('github.com/')) {
      const parts = trimmed.split('github.com/')[1].split('/');
      return parts[0].replace(/^@/, '');
    }
    return trimmed.replace(/^@/, '');
  };

  // Real-time GitHub Profile & Repository Analyzer
  const handleAnalyzeGithub = async (e: React.FormEvent) => {
    e.preventDefault();
    const username = extractGithubUsername(githubInput);
    if (!username) {
      setAnalyzeError('Please enter a valid GitHub profile URL or username.');
      return;
    }

    setIsAnalyzing(true);
    setAnalyzeError('');
    setSyncSuccess(false);

    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${encodeURIComponent(username)}`),
        fetch(
          `https://api.github.com/users/${encodeURIComponent(
            username
          )}/repos?per_page=100&sort=updated`
        ),
      ]);

      if (!userRes.ok) {
        throw new Error('GitHub profile not found. Check the URL or username.');
      }

      const userData = await userRes.json();
      const reposData: AnalyzedRepo[] = reposRes.ok ? await reposRes.json() : [];

      let totalStars = 0;
      const langCounts: Record<string, number> = {};

      reposData.forEach((repo) => {
        totalStars += repo.stargazers_count || 0;
        if (repo.language) {
          langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
        }
      });

      const topLanguages = Object.entries(langCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([lang]) => lang);

      const topRepos = [...reposData]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 3);

      setAnalyzedRepos(topRepos);
      setFollowersCount(userData.followers ?? 0);

      const updatedGithubData = {
        username: userData.login || username,
        repos: userData.public_repos ?? reposData.length,
        publicRepos: userData.public_repos ?? reposData.length,
        stars: totalStars,
        totalStars: totalStars,
        topLanguages: topLanguages.length > 0 ? topLanguages : ['JavaScript', 'TypeScript'],
        profileUrl: userData.html_url || `https://github.com/${username}`,
      };

      if (onUpdateActiveUser && isOwnProfile) {
        onUpdateActiveUser({
          github: updatedGithubData as any,
          bio: userData.bio || student.bio,
        });
      }
      setSyncSuccess(true);
    } catch (err: any) {
      setAnalyzeError(err.message || 'Could not analyze GitHub profile.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Add detected GitHub languages into user's "Can Teach" skills
  const handleAddDetectedSkillsToProfile = () => {
    if (!onUpdateActiveUser || !isOwnProfile) return;
    const mergedSkills = Array.from(new Set([...student.teaches, ...ghLanguages]));
    onUpdateActiveUser({ teaches: mergedSkills });
    setSyncSuccess(true);
  };

  const langDotColor = (lang: string) => {
    const l = lang.toLowerCase();
    if (l.includes('python')) return 'bg-emerald-500';
    if (l.includes('type') || l.includes('ts')) return 'bg-sky-500';
    if (l.includes('java') || l.includes('js')) return 'bg-amber-400';
    if (l.includes('html') || l.includes('css')) return 'bg-rose-500';
    return 'bg-[#7ed957]';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full overflow-hidden my-8 animate-fade-in">
        
        {/* Top Header Section */}
        <div className="p-6 sm:p-7 border-b border-slate-100 relative bg-gradient-to-r from-white via-[#f8fbff] to-[#eaf5ff]/50">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-20 h-20 rounded-2xl object-cover bg-slate-100 border-2 border-white shadow-md"
              />
              {isVerifiedTrainer && (
                <span
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#7ed957] text-white flex items-center justify-center ring-2 ring-white shadow-xs"
                  title="Campus Verified"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 truncate">
                  {student.name}
                </h2>
                {isVerifiedTrainer && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#7ed957]/15 text-emerald-800 border border-[#7ed957]/40">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" />
                    Campus Verified
                  </span>
                )}
                {isOwnProfile && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                    You (Active Account)
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span>
                  🎓 {student.department} · Year {student.year}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {studentEmail}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Member since {studentJoined}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                  <Star className="w-4 h-4 text-[#ffcf40] fill-[#ffcf40]" />
                  {student.rating.toFixed(1)}
                  <span className="font-normal text-slate-400">
                    ({student.reviewCount} peer reviews)
                  </span>
                </span>

                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7ed957]" />
                  {studentSessionsCount} sessions completed
                </span>

                {student.availability && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium text-[11px]">
                    <Clock className="w-3 h-3 text-teal-600" />
                    {student.availability}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* About & Background */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              About & Background
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {student.bio}
            </div>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-slate-100 bg-white">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block mb-2.5">
                Can Teach & Tutor
              </span>
              <div className="flex flex-wrap gap-1.5">
                {student.teaches.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#7ed957]/15 text-emerald-800 border border-[#7ed957]/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-100 bg-white">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 block mb-2.5">
                Looking to Learn
              </span>
              <div className="flex flex-wrap gap-1.5">
                {student.wantsToLearn.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#eaf5ff] text-teal-800 border border-teal-200/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Verified Skill Badges */}
          {student.badges && student.badges.length > 0 && (
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Verified Skill Badges
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {student.badges.map((b) => (
                  <div
                    key={b.skill}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200/80 bg-white"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#7ed957]/15 text-emerald-700 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{b.skill}</p>
                      <p className="text-[11px] text-slate-400">
                        {b.level} Level · Verified on {b.earnedAt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* DEVELOPER ACTIVITY + LIVE GITHUB LINK ANALYZER                        */}
          {/* ===================================================================== */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-slate-600" />
                Developer Activity & GitHub Analyzer
              </h3>
              {syncSuccess && (
                <span className="text-[11px] font-bold text-emerald-700 bg-[#7ed957]/20 px-2.5 py-0.5 rounded-full">
                  ✓ Live GitHub Data Synced!
                </span>
              )}
            </div>

            {/* Interactive GitHub Link Paste & Analyze Box (Shown on User's Own Profile) */}
            {isOwnProfile && (
              <form
                onSubmit={handleAnalyzeGithub}
                className="mb-3 p-3.5 rounded-2xl bg-gradient-to-r from-[#eaf5ff]/70 via-white to-[#7ed957]/10 border border-teal-200/70 space-y-2.5"
              >
                <label className="block text-xs font-bold text-slate-700">
                  Paste your GitHub Profile URL or Username to Analyze Repositories & Tech Stack:
                </label>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Code2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={githubInput}
                      onChange={(e) => setGithubInput(e.target.value)}
                      placeholder="https://github.com/your-username"
                      className="w-full pl-9 pr-3.5 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#7ed957]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isAnalyzing}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#7ed957] hover:bg-[#6ec847] disabled:opacity-60 text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        Analyze GitHub
                      </>
                    )}
                  </button>
                </div>

                {analyzeError && (
                  <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {analyzeError}
                  </p>
                )}
              </form>
            )}

            {/* Analyzed GitHub Summary Card */}
            {ghUsername && (
              <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <a
                    href={`https://github.com/${ghUsername}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold text-slate-800 hover:text-teal-700 inline-flex items-center gap-1.5"
                  >
                    @{ghUsername}
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <strong className="text-slate-800">{ghRepos}</strong> repos
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#ffcf40] fill-[#ffcf40]" />
                      <strong className="text-slate-800">{ghStars}</strong> stars
                    </span>
                    {followersCount !== null && (
                      <span className="inline-flex items-center gap-1">
                        <strong className="text-slate-800">{followersCount}</strong> followers
                      </span>
                    )}
                  </div>
                </div>

                {/* Detected Languages Stack */}
                {ghLanguages.length > 0 && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">
                        &lt;/&gt; Stack:
                      </span>
                      {ghLanguages.map((lang) => (
                        <span
                          key={lang}
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-white border border-slate-200/80 text-xs font-medium text-slate-700"
                        >
                          <span className={`w-2 h-2 rounded-full ${langDotColor(lang)}`} />
                          {lang}
                        </span>
                      ))}
                    </div>

                    {isOwnProfile && onUpdateActiveUser && (
                      <button
                        type="button"
                        onClick={handleAddDetectedSkillsToProfile}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-[#7ed957]" />
                        Sync Stack to My Teaching Skills
                      </button>
                    )}
                  </div>
                )}

                {/* Top Analyzed Repositories Breakdown */}
                {analyzedRepos.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/70 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Top Analyzed Repositories
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {analyzedRepos.map((repo) => (
                        <a
                          key={repo.name}
                          href={repo.html_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 rounded-xl bg-white border border-slate-200/70 hover:border-[#7ed957] transition block"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-800 truncate flex items-center gap-1">
                              <Code2 className="w-3 h-3 text-teal-600 shrink-0" />
                              {repo.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500">
                            {repo.language && <span>{repo.language}</span>}
                            <span className="inline-flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 text-[#ffcf40] fill-[#ffcf40]" />
                              {repo.stargazers_count}
                            </span>
                            <span className="inline-flex items-center gap-0.5">
                              <GitFork className="w-2.5 h-2.5" />
                              {repo.forks_count}
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Footer Actions */}
        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
          >
            Close
          </button>

          {!isOwnProfile && (
            <button
              onClick={() => onRequestSession(student)}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#7ed957] hover:bg-[#6ec847] text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              Request Learning Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
}