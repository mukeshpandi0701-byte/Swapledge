import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Plus, ExternalLink, CheckCircle } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  type: string;
  url: string;
  author: string;
}

interface Group {
  id: string;
  name: string;
  category: string;
  description: string;
  members: number;
  isJoined: boolean;
  resources: Resource[];
}

const INITIAL_GROUPS: Group[] = [
  {
    id: '1',
    name: 'Python & AI Learners',
    category: 'AI / Data Science',
    description: 'Campus group for hands-on ML projects, Python scripting, and Kaggle prep.',
    members: 24,
    isJoined: false,
    resources: [
      { id: 'r1', title: 'Python Cheat Sheet (OOP & Standard Lib)', type: 'Notes', url: 'https://github.com', author: 'Mahesh' },
      { id: 'r2', title: 'Intro to NumPy & Pandas Notebooks', type: 'Code', url: 'https://github.com', author: 'Dinesh' }
    ]
  },
  {
    id: '2',
    name: 'Full-Stack Web Dev Hub',
    category: 'Web Development',
    description: 'React, Node.js, Tailwind, and Supabase peer learning and project builds.',
    members: 31,
    isJoined: true,
    resources: [
      { id: 'r3', title: 'React + TypeScript Best Practices Guide', type: 'Article', url: 'https://github.com', author: 'Abinash' }
    ]
  },
  {
    id: '3',
    name: 'DSA & Competitive Programming',
    category: 'Algorithms',
    description: 'Daily LeetCode solving, algorithmic logic reviews, and placement preparation.',
    members: 42,
    isJoined: false,
    resources: [
      { id: 'r4', title: '75 Essential Blind LeetCode Problems PDF', type: 'PDF', url: 'https://github.com', author: 'Aadhithya' }
    ]
  }
];

export const StudyGroupsView: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem('skillswap_groups');
    return saved ? JSON.parse(saved) : INITIAL_GROUPS;
  });
  const [selectedGroup, setSelectedGroup] = useState<Group>(groups[0]);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Notes');
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    localStorage.setItem('skillswap_groups', JSON.stringify(groups));
  }, [groups]);

  const toggleJoin = (groupId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        const updated = {
          ...g,
          isJoined: !g.isJoined,
          members: g.isJoined ? g.members - 1 : g.members + 1
        };
        if (selectedGroup.id === groupId) setSelectedGroup(updated);
        return updated;
      }
      return g;
    }));
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newRes: Resource = {
      id: Date.now().toString(),
      title: newTitle,
      type: newType,
      url: newUrl || 'https://github.com',
      author: 'You (Lead)'
    };

    const updatedGroups = groups.map(g => {
      if (g.id === selectedGroup.id) {
        const updated = { ...g, resources: [newRes, ...g.resources] };
        setSelectedGroup(updated);
        return updated;
      }
      return g;
    });

    setGroups(updatedGroups);
    setNewTitle('');
    setNewUrl('');
    setShowModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Interest-Based Study Groups</h2>
        <p className="text-slate-500 text-sm">Join campus peer groups, discuss concepts, and exchange learning resources.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Groups Column */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Active Campus Communities
          </h3>

          <div className="space-y-3">
            {groups.map(g => (
              <div 
                key={g.id} 
                onClick={() => setSelectedGroup(g)}
                className={`p-4 rounded-xl border transition cursor-pointer ${
                  selectedGroup.id === g.id 
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-sm' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{g.category}</span>
                    <h4 className="font-bold text-slate-800 mt-1">{g.name}</h4>
                  </div>
                  <span className="text-xs text-slate-500">{g.members} peers</span>
                </div>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2">{g.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-indigo-600 font-medium">{g.resources.length} Shared Resources</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleJoin(g.id); }}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${
                      g.isJoined 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {g.isJoined ? 'Joined ✓' : 'Join Group'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Group Resources Hub */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 flex flex-col h-[580px]">
          <div className="flex items-start justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-800">{selectedGroup.name}</h3>
                {selectedGroup.isJoined && (
                  <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                    <CheckCircle className="w-3.5 h-3.5" /> Member
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-1">{selectedGroup.description}</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition shrink-0"
            >
              <Plus className="w-4 h-4" /> Share Resource
            </button>
          </div>

          {/* Resources List */}
          <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Shared Notes & Materials</h4>
            {selectedGroup.resources.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-10">No resources shared yet. Be the first to post!</p>
            ) : (
              selectedGroup.resources.map(res => (
                <div key={res.id} className="flex items-center justify-between p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-slate-800">{res.title}</h5>
                      <span className="text-xs text-slate-500">Shared by {res.author} • <span className="font-medium text-slate-600">{res.type}</span></span>
                    </div>
                  </div>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-400 hover:text-indigo-600 transition"
                    title="Open link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Resource Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-800">Share Learning Resource</h3>
            <p className="text-xs text-slate-500 mt-1">Add notes, cheat sheets, or GitHub repo links for {selectedGroup.name}.</p>
            <form onSubmit={handleAddResource} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700">Resource Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master React Hooks Notes"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Category Type</label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value)}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Notes">Notes / Document</option>
                  <option value="Code">GitHub Repo / Code</option>
                  <option value="PDF">PDF / Cheatsheet</option>
                  <option value="Article">Tutorial / Article</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Link URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Publish Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};