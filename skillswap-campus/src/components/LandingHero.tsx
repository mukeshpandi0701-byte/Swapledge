import React, { useState } from 'react';
import {
  Menu,
  ArrowRight,
  Sparkles,
  BookOpen,
  Users,
  Award,
  X,
  CheckCircle2,
  Mail,
  MapPin,
  MessageSquare,
  Code2,
  Cpu,
  Palette,
  Database,
  Globe,
  ShieldCheck,
} from 'lucide-react';

interface LandingHeroProps {
  onEnterApp: (initialSearch?: string) => void;
  onOpenAuth?: () => void;
}

type LandingSection = 'home' | 'courses' | 'about' | 'contact';

const POPULAR_SKILLS = [
  { title: 'React & TypeScript', category: 'Web Dev', mentors: 14, icon: Code2, color: 'text-sky-600 bg-sky-50' },
  { title: 'Python & Machine Learning', category: 'AI / DS', mentors: 19, icon: Cpu, color: 'text-purple-600 bg-purple-50' },
  { title: 'UI/UX & Figma Systems', category: 'Design', mentors: 11, icon: Palette, color: 'text-pink-600 bg-pink-50' },
  { title: 'SQL & Backend Architecture', category: 'Database', mentors: 9, icon: Database, color: 'text-emerald-600 bg-emerald-50' },
  { title: 'Data Structures & DSA', category: 'Placements', mentors: 24, icon: Globe, color: 'text-amber-600 bg-amber-50' },
  { title: 'Cybersecurity Basics', category: 'Security', mentors: 7, icon: ShieldCheck, color: 'text-indigo-600 bg-indigo-50' },
];

export const LandingHero: React.FC<LandingHeroProps> = ({ onEnterApp }) => {
  const [activeSection, setActiveSection] = useState<LandingSection>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [contactSent, setContactSent] = useState(false);

  const handleQuickAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() || email.trim()) {
      localStorage.setItem(
        'swapledge_user_auth',
        JSON.stringify({
          name: name.trim() || 'Campus Student',
          email: email.trim() || 'student@campus.edu',
          department,
        })
      );
    }
    setShowAuthModal(false);
    onEnterApp();
  };

  return (
    <div className="min-h-screen w-full bg-white font-sans">
      {/* Full-Screen Container */}
      <div className="relative w-full bg-white overflow-hidden min-h-screen flex flex-col justify-between">
        
        {/* Soft Blue Curved Background Shape on Right */}
        <div
          className="hidden lg:block absolute top-0 right-0 w-[55%] h-full bg-gradient-to-br from-[#dceeff] via-[#eaf5ff] to-[#ffffff] pointer-events-none"
          style={{
            borderTopLeftRadius: '55% 85%',
            borderBottomLeftRadius: '35% 45%',
          }}
        />

        {/* Top Navbar */}
        <header className="relative z-10 flex items-center justify-between px-8 md:px-14 pt-8 pb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSideMenu(true)}
              className="text-slate-600 hover:text-slate-900 transition p-1 rounded-lg hover:bg-slate-100"
              title="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => setActiveSection('home')}
              className="text-lg font-bold tracking-tight text-slate-700 hover:text-slate-900 transition"
            >
              Swapledge
            </button>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider text-slate-500 uppercase">
            <button
              onClick={() => setActiveSection('home')}
              className={`pb-1 transition ${
                activeSection === 'home'
                  ? 'text-slate-800 border-b-2 border-slate-800 font-bold'
                  : 'hover:text-slate-800'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveSection('courses')}
              className={`pb-1 transition ${
                activeSection === 'courses'
                  ? 'text-slate-800 border-b-2 border-slate-800 font-bold'
                  : 'hover:text-slate-800'
              }`}
            >
              Courses
            </button>
            <button
              onClick={() => setActiveSection('about')}
              className={`pb-1 transition ${
                activeSection === 'about'
                  ? 'text-slate-800 border-b-2 border-slate-800 font-bold'
                  : 'hover:text-slate-800'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveSection('contact')}
              className={`pb-1 transition ${
                activeSection === 'contact'
                  ? 'text-slate-800 border-b-2 border-slate-800 font-bold'
                  : 'hover:text-slate-800'
              }`}
            >
              Contact
            </button>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-[#7ed957] hover:bg-[#6ec847] text-white font-bold px-6 py-2 rounded-full shadow-md hover:shadow-lg transition normal-case text-sm cursor-pointer"
            >
              Sign up
            </button>
          </nav>

          {/* Mobile Sign Up Button */}
          <button
            onClick={() => setShowAuthModal(true)}
            className="md:hidden bg-[#7ed957] text-white font-bold px-4 py-1.5 rounded-full text-xs shadow"
          >
            Sign up
          </button>
        </header>

        {/* ===================================================================== */}
        {/* SECTION 1: HOME HERO VIEW (Clean without search bar/tags/dots)        */}
        {/* ===================================================================== */}
        {activeSection === 'home' && (
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center px-8 md:px-14 py-8 gap-8 flex-1">
            {/* Left Column: Text + Clean Action Button */}
            <div className="lg:col-span-5 space-y-6">
              <p className="text-slate-500 text-base md:text-lg font-medium">
                Campus peer education
              </p>

              <h1 className="text-4xl md:text-6xl font-light text-slate-700 leading-tight">
                Start learning <br />
                <span className="font-extrabold text-slate-800">at campus</span>
              </h1>

              <p className="text-sm text-slate-500 leading-relaxed max-w-md">
                Connect with verified student mentors across departments, join collaborative study groups, and exchange skills 100% free.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onEnterApp()}
                  className="inline-flex items-center gap-3 bg-[#7ed957] hover:bg-[#6ec847] text-white font-bold px-7 py-3.5 rounded-full shadow-md hover:shadow-lg transition text-sm cursor-pointer"
                >
                  <span>Explore Campus Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Flat Vector Illustration (Laptop, Books, Mug, Plant) */}
            <div className="lg:col-span-7 flex items-center justify-center relative">
              <svg
                viewBox="0 0 650 450"
                className="w-full max-w-[560px] h-auto drop-shadow-sm"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Ground Shadow */}
                <ellipse cx="340" cy="405" rx="250" ry="12" fill="#E2E8F0" />

                {/* Decorative Clouds */}
                <path
                  d="M90 120H165C175 120 182 112 182 103C182 94 175 87 166 87C164 72 151 60 135 60C117 60 103 74 103 91C94 93 88 101 88 110"
                  stroke="#475569"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M530 110H595C603 110 610 103 610 95C610 87 603 81 595 81C593 69 583 60 570 60C556 60 545 71 545 85"
                  fill="white"
                />
                <path
                  d="M525 185H580C587 185 593 179 593 172C593 165 587 160 580 160C578 150 569 142 558 142C546 142 536 152 536 164"
                  fill="white"
                  stroke="#475569"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                {/* Lean Green Folder/Book on Left */}
                <g transform="rotate(7 185 300)">
                  <rect
                    x="160"
                    y="195"
                    width="46"
                    height="195"
                    rx="3"
                    fill="#7ED957"
                    stroke="#334155"
                    strokeWidth="2"
                  />
                  <rect
                    x="160"
                    y="218"
                    width="46"
                    height="12"
                    fill="white"
                    stroke="#334155"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="160"
                    y="355"
                    width="46"
                    height="14"
                    fill="white"
                    stroke="#334155"
                    strokeWidth="1.5"
                  />
                </g>

                {/* Bottom Blue Book */}
                <path
                  d="M250 320H475C490 320 500 332 500 350C500 368 490 380 475 380H250V320Z"
                  fill="#70A1FF"
                  stroke="#334155"
                  strokeWidth="2"
                />
                <path
                  d="M260 328H472C482 328 490 337 490 350C490 363 482 372 472 372H260V328Z"
                  fill="white"
                  stroke="#334155"
                  strokeWidth="1.5"
                />
                <line x1="275" y1="342" x2="465" y2="342" stroke="#94A3B8" strokeWidth="1.5" />
                <line x1="275" y1="356" x2="450" y2="356" stroke="#94A3B8" strokeWidth="1.5" />
                <path
                  d="M420 328V368L430 360L440 368V328H420Z"
                  fill="#7ED957"
                  stroke="#334155"
                  strokeWidth="1.5"
                />

                {/* Middle Yellow Book */}
                <path
                  d="M225 250H465C448 250 448 320 465 320H225C205 320 195 305 195 285C195 265 205 250 225 250Z"
                  fill="#FFCF40"
                  stroke="#334155"
                  strokeWidth="2"
                />
                <path
                  d="M228 260H455C442 260 442 310 455 310H228C214 310 206 299 206 285C206 271 214 260 228 260Z"
                  fill="white"
                  stroke="#334155"
                  strokeWidth="1.5"
                />
                <line x1="225" y1="276" x2="435" y2="276" stroke="#94A3B8" strokeWidth="1.5" />
                <line x1="225" y1="292" x2="430" y2="292" stroke="#94A3B8" strokeWidth="1.5" />
                <path
                  d="M395 260V298L405 290L415 298V260H395Z"
                  fill="#FF6B9D"
                  stroke="#334155"
                  strokeWidth="1.5"
                />

                {/* Laptop sitting on top of Books */}
                <rect
                  x="235"
                  y="110"
                  width="200"
                  height="130"
                  rx="10"
                  fill="#E2E8F0"
                  stroke="#334155"
                  strokeWidth="2"
                />
                <rect
                  x="245"
                  y="122"
                  width="180"
                  height="106"
                  fill="white"
                  stroke="#334155"
                  strokeWidth="1.5"
                />
                <line x1="245" y1="135" x2="425" y2="135" stroke="#CBD5E1" strokeWidth="1.5" />
                <circle cx="400" cy="128.5" r="2.5" fill="#FF6B9D" />
                <circle cx="408" cy="128.5" r="2.5" fill="#FFCF40" />
                <circle cx="416" cy="128.5" r="2.5" fill="#7ED957" />

                {/* Idea Lightbulb Inside Laptop Screen */}
                <path
                  d="M335 150C321 150 310 161 310 175C310 184 315 192 322 196V204H348V196C355 192 360 184 360 175C360 161 349 150 335 150Z"
                  fill="#FFE066"
                  stroke="#334155"
                  strokeWidth="2"
                />
                <rect x="325" y="204" width="20" height="5" fill="#CBD5E1" stroke="#334155" strokeWidth="1.5" />
                <rect x="328" y="209" width="14" height="4" fill="#94A3B8" stroke="#334155" strokeWidth="1.5" />
                <line x1="292" y1="162" x2="300" y2="166" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                <line x1="288" y1="176" x2="298" y2="176" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                <line x1="292" y1="190" x2="300" y2="186" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                <line x1="378" y1="162" x2="370" y2="166" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                <line x1="382" y1="176" x2="372" y2="176" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                <line x1="378" y1="190" x2="370" y2="186" stroke="#334155" strokeWidth="2" strokeLinecap="round" />

                {/* Laptop Base */}
                <path
                  d="M215 240H455L445 250H225L215 240Z"
                  fill="#E2E8F0"
                  stroke="#334155"
                  strokeWidth="2"
                />

                {/* Pink Coffee Mug in Foreground */}
                <rect
                  x="220"
                  y="340"
                  width="46"
                  height="58"
                  rx="4"
                  fill="#FF6B9D"
                  stroke="#334155"
                  strokeWidth="2"
                />
                <path
                  d="M266 352H274C281 352 286 357 286 364V372C286 379 281 384 274 384H266"
                  stroke="#FF6B9D"
                  strokeWidth="6"
                />
                <path
                  d="M266 350H275C283 350 288 356 288 364V372C288 380 283 386 275 386H266"
                  stroke="#334155"
                  strokeWidth="2"
                />

                {/* Potted Plant on Right */}
                <path
                  d="M545 335C520 315 510 280 518 255C540 265 552 295 545 335Z"
                  fill="#7ED957"
                  stroke="#334155"
                  strokeWidth="2"
                />
                <line x1="518" y1="255" x2="544" y2="330" stroke="#334155" strokeWidth="1.5" />
                <path
                  d="M550 335C542 295 548 255 562 235C576 260 572 300 550 335Z"
                  fill="#7ED957"
                  stroke="#334155"
                  strokeWidth="2"
                />
                <line x1="562" y1="235" x2="550" y2="335" stroke="#334155" strokeWidth="1.5" />
                <path
                  d="M555 335C575 305 605 280 625 275C618 305 590 328 555 335Z"
                  fill="#7ED957"
                  stroke="#334155"
                  strokeWidth="2"
                />
                <line x1="625" y1="275" x2="555" y2="335" stroke="#334155" strokeWidth="1.5" />

                {/* Yellow Plant Pot */}
                <path
                  d="M520 345H585L576 398H529L520 345Z"
                  fill="#FFCF40"
                  stroke="#334155"
                  strokeWidth="2"
                />
                <rect
                  x="514"
                  y="333"
                  width="77"
                  height="12"
                  rx="2"
                  fill="#FFCF40"
                  stroke="#334155"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* SECTION 2: COURSES PREVIEW                                            */}
        {/* ===================================================================== */}
        {activeSection === 'courses' && (
          <div className="relative z-10 px-8 md:px-14 py-6 flex-1 flex flex-col justify-center">
            <div className="max-w-xl mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                Peer-Taught Tracks
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-1">
                Popular Campus Skill Tracks
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Click any skill track below to search for verified campus trainers offering free 1-on-1 sessions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {POPULAR_SKILLS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-white/90 backdrop-blur border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.color}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {item.mentors} active student trainers available this week
                      </p>
                    </div>
                    <button
                      onClick={() => onEnterApp(item.title.split(' ')[0])}
                      className="mt-4 text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 cursor-pointer"
                    >
                      Find Mentors for this Skill →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* SECTION 3: ABOUT SWAPLEDGE                                            */}
        {/* ===================================================================== */}
        {activeSection === 'about' && (
          <div className="relative z-10 px-8 md:px-14 py-6 flex-1 flex flex-col justify-center">
            <div className="max-w-2xl mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                How Swapledge Works
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-1">
                By Students, For Students — 100% Free
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Swapledge transforms your college campus into a collaborative skill-exchange network.
                Students can switch between Learner Mode and Trainer Mode anytime.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white/90 border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#ffcf40]/20 text-amber-700 font-bold flex items-center justify-center text-sm mb-3">
                  1
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Discover & Match</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Our compatibility algorithm matches you with campus peers based on the skills you want to learn and the skills you offer.
                </p>
              </div>

              <div className="bg-white/90 border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#7ed957]/20 text-emerald-700 font-bold flex items-center justify-center text-sm mb-3">
                  2
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Verify Skills via MCQ Quiz</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Pass built-in skill assessments to earn Verified Trainer badges on your profile and build campus credibility.
                </p>
              </div>

              <div className="bg-white/90 border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-sm mb-3">
                  3
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Book 1-on-1 & Join Guilds</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Schedule free mentoring sessions, share study notes in Study Groups, and grow your GitHub portfolio together.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* SECTION 4: CONTACT US                                                 */}
        {/* ===================================================================== */}
        {activeSection === 'contact' && (
          <div className="relative z-10 px-8 md:px-14 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                Campus Support
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">
                Get in Touch with the Swapledge Team
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Want to onboard your college department or start a new campus study guild? Drop us a message!
              </p>

              <div className="space-y-3 pt-2 text-xs text-slate-600">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-teal-600" />
                  <span>support@swapledge.campus.edu</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span>Innovation Lab, Student Activity Center</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-teal-600" />
                  <span>24/7 Student Community Discord & Guilds</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-md max-w-md mx-auto">
                {contactSent ? (
                  <div className="text-center py-8 space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <h3 className="text-base font-bold text-slate-800">Message Sent!</h3>
                    <p className="text-xs text-slate-500">
                      Our campus coordinators will reach out to your college email shortly.
                    </p>
                    <button
                      onClick={() => setContactSent(false)}
                      className="text-xs font-bold text-teal-700 underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setContactSent(true);
                    }}
                    className="space-y-3.5"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Student Name"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        College Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@campus.edu"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Message
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="How can we help you?"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#7ed957] hover:bg-[#6ec847] text-white font-bold py-2.5 rounded-xl text-xs shadow transition cursor-pointer"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Feature Strip */}
        <div className="relative z-10 border-t border-slate-100 bg-slate-50/70 px-8 md:px-14 py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveSection('courses')}
              className="flex items-center gap-2 font-medium text-slate-700 hover:text-teal-700 transition"
            >
              <Users className="w-4 h-4 text-teal-600" /> Verified Campus Mentors
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('about')}
              className="flex items-center gap-2 font-medium text-slate-700 hover:text-teal-700 transition"
            >
              <BookOpen className="w-4 h-4 text-amber-500" /> Interactive Study Groups
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('about')}
              className="flex items-center gap-2 font-medium text-slate-700 hover:text-teal-700 transition"
            >
              <Award className="w-4 h-4 text-emerald-600" /> MCQ Skill Verification Badges
            </button>
          </div>
          <button
            onClick={() => onEnterApp()}
            className="inline-flex items-center gap-1.5 text-teal-700 font-bold hover:underline cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Enter Dashboard →
          </button>
        </div>
      </div>

      {/* Left Hamburger Side Drawer */}
      {showSideMenu && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex">
          <div className="bg-white w-72 h-full p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <span className="font-extrabold text-lg text-slate-800">Swapledge</span>
                <button
                  onClick={() => setShowSideMenu(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 space-y-2">
                {(['home', 'courses', 'about', 'contact'] as LandingSection[]).map((sec) => (
                  <button
                    key={sec}
                    onClick={() => {
                      setActiveSection(sec);
                      setShowSideMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold capitalize transition ${
                      activeSection === sec
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {sec}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  setShowSideMenu(false);
                  setShowAuthModal(true);
                }}
                className="w-full bg-[#7ed957] hover:bg-[#6ec847] text-white font-bold py-2.5 rounded-xl text-xs shadow transition"
              >
                Sign Up / Login
              </button>
              <button
                onClick={() => {
                  setShowSideMenu(false);
                  onEnterApp();
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs transition"
              >
                Open Live Dashboard →
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setShowSideMenu(false)} />
        </div>
      )}

      {/* Sign Up / Login Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-slate-800 mb-1">
              {isLogin ? 'Welcome Back!' : 'Join Swapledge Campus'}
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Connect with campus peers to learn and teach skills for free.
            </p>

            <form onSubmit={handleQuickAuth} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maheswaran B"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  College Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@campus.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option>Computer Science</option>
                    <option>Information Technology</option>
                    <option>AI & Data Science</option>
                    <option>Electronics & Communication</option>
                    <option>Mechanical Engineering</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#7ed957] hover:bg-[#6ec847] text-white font-bold py-2.5 rounded-xl shadow-md transition cursor-pointer"
              >
                {isLogin ? 'Login to Dashboard' : 'Create Free Account'}
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-teal-700 font-semibold hover:underline"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
              </button>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingHero;