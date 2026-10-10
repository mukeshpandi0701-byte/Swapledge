import { Search, Bell, BookOpen, Users, Star, Cpu, Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { ActiveTab, Student } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  activeUser: Student;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const TABS: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'explore', label: 'Explore Peers', icon: Users },
  { id: 'sessions', label: 'My Sessions', icon: BookOpen },
  { id: 'groups', label: 'Study Groups', icon: Star },
  { id: 'assessment', label: 'Skill Assessment', icon: Cpu },
];

export default function Navbar({ activeTab, onTabChange, activeUser, searchQuery, onSearchChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div 
            onClick={() => onTabChange('explore')}
            className="flex items-center gap-2.5 shrink-0 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-lg tracking-tight block leading-none">
                Swap<span className="text-indigo-600">Ledge</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block mt-0.5">
                Campus P2P
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-xs lg:max-w-sm hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search peers, skills, departments…"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 bg-slate-50/70 hover:bg-slate-50 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition shadow-xs text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-100/60 p-1 rounded-xl border border-slate-200/60">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  activeTab === id
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${activeTab === id ? 'text-indigo-600' : 'text-slate-400'}`} />
                {label}
              </button>
            ))}
          </div>

          {/* Right Side: Notification & User Profile */}
          <div className="flex items-center gap-3 shrink-0">
            <button className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 rounded-xl transition">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>

            {/* User Profile Badge */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200/80">
              <div className="relative">
                <img
                  src={activeUser.avatar}
                  alt={activeUser.name}
                  className="w-8 h-8 rounded-full border border-indigo-200 bg-slate-100 object-cover shadow-2xs"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-1.5 ring-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-none">{activeUser.name.split(' ')[0]}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{activeUser.department}</p>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search peers, skills…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-3 border-t border-slate-100 pt-3 flex flex-col gap-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { onTabChange(id); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                  activeTab === id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}