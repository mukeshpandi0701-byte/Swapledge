import { useState } from 'react';
import {
  Users,
  Plus,
  X,
  FileText,
  Link as LinkIcon,
  Code,
  StickyNote,
  ExternalLink,
  BookOpen,
  Terminal,
  Cpu,
  Globe,
  Cloud,
  Layers,
  Check,
} from 'lucide-react';
import type { StudyGroup, GroupResource } from '../types';

interface GroupCardProps {
  group: StudyGroup;
  isMember: boolean;
  onToggleMembership: (groupId: string) => void;
  onAddResource: (groupId: string, resource: GroupResource) => void;
}

const RESOURCE_ICONS: Record<GroupResource['type'], React.ReactNode> = {
  pdf: <FileText className="w-3.5 h-3.5 text-rose-500" />,
  link: <LinkIcon className="w-3.5 h-3.5 text-indigo-500" />,
  code: <Code className="w-3.5 h-3.5 text-emerald-500" />,
  note: <StickyNote className="w-3.5 h-3.5 text-amber-500" />,
};

function getGroupIcon(icon: string) {
  switch (icon.toLowerCase()) {
    case 'terminal':
      return <Terminal className="w-5 h-5 text-emerald-600" />;
    case 'cpu':
      return <Cpu className="w-5 h-5 text-indigo-600" />;
    case 'globe':
      return <Globe className="w-5 h-5 text-sky-600" />;
    case 'cloud':
      return <Cloud className="w-5 h-5 text-amber-600" />;
    case 'layers':
      return <Layers className="w-5 h-5 text-rose-600" />;
    default:
      return <BookOpen className="w-5 h-5 text-indigo-600" />;
  }
}

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
      title: title.trim(),
      url: url.trim(),
      type,
      addedBy: 'Alex Johnson',
      addedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl border border-slate-200/90 w-full max-w-sm overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Add Learning Resource</h3>
            <p className="text-[11px] text-slate-500">Shared to "{groupName}"</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleAdd} className="p-5 flex flex-col gap-3.5">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Resource Type
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['link', 'pdf', 'code', 'note'] as GroupResource['type'][]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl border text-[11px] font-semibold transition-all ${
                    type === t
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {RESOURCE_ICONS[t]}
                  <span className="capitalize">{t}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Stanford CS229 Lecture Notes"
              required
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/70 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              URL / Link
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
              required
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/70 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors"
            >
              Share Resource
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function GroupCard({
  group,
  isMember,
  onToggleMembership,
  onAddResource,
}: GroupCardProps) {
  const [showResources, setShowResources] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden text-slate-800">
        {/* Card Header */}
        <div className="p-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-3 bg-linear-to-b from-slate-50/70 to-white">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0">
              {getGroupIcon(group.icon)}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 leading-tight truncate">{group.name}</h3>
              <p className="text-[11px] font-semibold text-indigo-600 mt-0.5">{group.subject}</p>
            </div>
          </div>

          {/* Member count badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold shrink-0">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{group.memberCount + (isMember ? 1 : 0)}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between gap-4">
          <div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-2">{group.description}</p>

            {/* Subject Tags */}
            <div className="flex flex-wrap gap-1">
              {group.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => onToggleMembership(group.id)}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  isMember
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                }`}
              >
                {isMember ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Joined
                  </>
                ) : (
                  'Join Group'
                )}
              </button>

              <button
                onClick={() => setShowResources(!showResources)}
                className={`inline-flex items-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-colors ${
                  showResources
                    ? 'border-indigo-300 bg-indigo-50/60 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                aria-label={`Toggle resources, ${group.resources.length} available`}
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>{group.resources.length}</span>
              </button>

              {isMember && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="p-2 rounded-xl border border-indigo-200 bg-indigo-50/50 text-indigo-600 hover:bg-indigo-100/70 transition-colors"
                  title="Add learning resource"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Expandable Resource Feed */}
            {showResources && (
              <div className="mt-3 border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/50 animate-fade-in">
                <div className="bg-slate-100/80 px-3 py-2 border-b border-slate-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Shared Learning Material
                  </span>
                  <span className="text-[10px] text-slate-400">{group.resources.length} items</span>
                </div>

                {group.resources.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No resources yet. Be the first to share!</p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {group.resources.map((res) => (
                      <div
                        key={res.id}
                        className="p-2.5 px-3 hover:bg-white transition-colors flex items-center gap-2.5"
                      >
                        <span className="shrink-0">{RESOURCE_ICONS[res.type]}</span>
                        <div className="flex-1 min-w-0">
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-slate-800 hover:text-indigo-600 flex items-center gap-1 truncate"
                          >
                            <span className="truncate">{res.title}</span>
                            <ExternalLink className="w-3 h-3 shrink-0 text-slate-400" />
                          </a>
                          <p className="text-[10px] text-slate-400">Added by {res.addedBy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
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
