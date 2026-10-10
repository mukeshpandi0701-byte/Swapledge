import { useState } from 'react';
import { Users, Plus, X, FileText, Link, Code, StickyNote, ExternalLink } from 'lucide-react';
import type { StudyGroup, GroupResource } from '../types';

interface GroupCardProps {
  group: StudyGroup;
  isMember: boolean;
  onToggleMembership: (groupId: string) => void;
  onAddResource: (groupId: string, resource: GroupResource) => void;
}

const RESOURCE_ICONS = {
  pdf: <FileText className="w-4 h-4 text-rose-500" />,
  link: <Link className="w-4 h-4 text-indigo-500" />,
  code: <Code className="w-4 h-4 text-emerald-500" />,
  note: <StickyNote className="w-4 h-4 text-amber-500" />,
};

function AddResourceModal({
  groupName,
  onClose,
  onAdd,
}: {
  groupName: string;
  onClose: () => void;
  onAdd: (r: GroupResource) => void;
}) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<GroupResource['type']>('link');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    onAdd({
      id: `res-${Date.now()}`,
      title,
      url,
      type,
      addedBy: 'Alex Johnson',
      addedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 text-sm">Add Resource to "{groupName}"</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleAdd} className="p-5 flex flex-col gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Resource Type</label>
            <div className="grid grid-cols-4 gap-2">
              {(['link', 'pdf', 'code', 'note'] as GroupResource['type'][]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex flex-col items-center gap-1 py-2 rounded-lg border text-xs font-medium transition ${
                    type === t ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {RESOURCE_ICONS[t]}
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Python Cheat Sheet"
              required
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
              required
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition active:scale-95"
          >
            Add Resource
          </button>
        </form>
      </div>
    </div>
  );
}

export default function GroupCard({ group, isMember, onToggleMembership, onAddResource }: GroupCardProps) {
  const [showResources, setShowResources] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200">
        {/* Gradient Header */}
        <div className={`bg-gradient-to-r ${group.color} p-5`}>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-3xl mb-2 block">{group.icon}</span>
              <h3 className="text-white font-bold text-base leading-tight">{group.name}</h3>
              <p className="text-white/80 text-xs mt-0.5">{group.subject}</p>
            </div>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2.5 py-1.5 rounded-xl">
              <Users className="w-3.5 h-3.5 text-white" />
              <span className="text-white text-xs font-semibold">{group.memberCount + (isMember ? 1 : 0)}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-3">
          <p className="text-sm text-slate-500 leading-relaxed">{group.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {group.tags.map((tag) => (
              <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => onToggleMembership(group.id)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                isMember
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isMember ? '✓ Joined' : 'Join Group'}
            </button>

            <button
              onClick={() => setShowResources(!showResources)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm transition"
            >
              📚 {group.resources.length}
            </button>

            {isMember && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 py-2 rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-sm transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Resource Feed */}
          {showResources && (
            <div className="border border-slate-100 rounded-xl overflow-hidden mt-1">
              <div className="bg-slate-50 px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-600">Resources ({group.resources.length})</p>
              </div>
              {group.resources.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No resources yet. Be the first!</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {group.resources.map((res) => (
                    <div key={res.id} className="flex items-center gap-2 px-3 py-2.5 hover:bg-slate-50 transition">
                      {RESOURCE_ICONS[res.type]}
                      <div className="flex-1 min-w-0">
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-slate-700 hover:text-indigo-600 flex items-center gap-1 truncate"
                        >
                          {res.title}
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                        <p className="text-[10px] text-slate-400">by {res.addedBy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddResourceModal
          groupName={group.name}
          onClose={() => setShowAddModal(false)}
          onAdd={(r) => onAddResource(group.id, r)}
        />
      )}
    </>
  );
}
