import type { Student, MatchExplanation } from '../types';

/**
 * Calculates a transparent compatibility score (0–100) between the active user and a peer.
 *
 * Scoring rules:
 * - Direct match: For each skill the peer teaches that the user wants to learn → +25 pts
 * - Reciprocal bonus: For each skill the user teaches that the peer wants to learn → +15 pts
 * - Same department synergy bonus: +10 pts
 * - Capped cleanly at 100%.
 */
export function calculateMatchScore(activeUser: Student, peer: Student): number {
  if (activeUser.id === peer.id) return 0;

  const userWants = new Set(activeUser.wantsToLearn.map((s) => s.toLowerCase()));
  const peerTeaches = new Set(peer.teaches.map((s) => s.toLowerCase()));
  const userTeaches = new Set(activeUser.teaches.map((s) => s.toLowerCase()));
  const peerWants = new Set(peer.wantsToLearn.map((s) => s.toLowerCase()));

  let score = 0;

  // Primary: peer teaches what user wants (+25 pts each)
  for (const skill of userWants) {
    if (peerTeaches.has(skill)) {
      score += 25;
    }
  }

  // Bonus: user teaches what peer wants (reciprocal +15 pts each)
  for (const skill of userTeaches) {
    if (peerWants.has(skill)) {
      score += 15;
    }
  }

  // Department bonus (+10 pts)
  if (activeUser.department && peer.department && activeUser.department.toLowerCase() === peer.department.toLowerCase()) {
    score += 10;
  }

  return Math.min(Math.max(score, 0), 100);
}

/**
 * Provides an explainable, data-backed breakdown of why this peer matched.
 */
export function getMatchExplanation(activeUser: Student, peer: Student): MatchExplanation {
  const userWants = new Set(activeUser.wantsToLearn.map((s) => s.toLowerCase()));
  const peerTeaches = peer.teaches.filter((s) => userWants.has(s.toLowerCase()));

  const peerWants = new Set(peer.wantsToLearn.map((s) => s.toLowerCase()));
  const userTeaches = activeUser.teaches.filter((s) => peerWants.has(s.toLowerCase()));

  const sharedDepartment =
    Boolean(activeUser.department) &&
    Boolean(peer.department) &&
    activeUser.department.toLowerCase() === peer.department.toLowerCase();

  const score = calculateMatchScore(activeUser, peer);

  let summary = '';
  if (peerTeaches.length > 0 && userTeaches.length > 0) {
    summary = `Two-way match: ${peer.name.split(' ')[0]} can teach you ${peerTeaches.join(', ')}, and you can teach ${userTeaches.join(', ')}.`;
  } else if (peerTeaches.length > 0) {
    summary = `${peer.name.split(' ')[0]} teaches ${peerTeaches.join(', ')}, which is on your wishlist.`;
  } else if (userTeaches.length > 0) {
    summary = `You teach ${userTeaches.join(', ')}, which ${peer.name.split(' ')[0]} wants to learn.`;
  } else if (sharedDepartment) {
    summary = `Both study in ${activeUser.department}. Connect to share coursework and campus insights.`;
  } else {
    summary = `Explore common learning goals and connect for collaborative study.`;
  }

  return {
    score,
    directMatches: peerTeaches,
    reciprocalMatches: userTeaches,
    sharedDepartment,
    summary,
  };
}

/**
 * Returns accessible labels, color tokens, and progress bar hues for match score tiers.
 */
export function getMatchLabel(score: number): {
  label: string;
  badgeClass: string;
  barColor: string;
  textColor: string;
} {
  if (score >= 70) {
    return {
      label: 'Strong Match',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      barColor: 'bg-emerald-500',
      textColor: 'text-emerald-700',
    };
  }
  if (score >= 40) {
    return {
      label: 'Good Match',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      barColor: 'bg-indigo-600',
      textColor: 'text-indigo-700',
    };
  }
  if (score >= 20) {
    return {
      label: 'Moderate Match',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/80',
      barColor: 'bg-amber-500',
      textColor: 'text-amber-800',
    };
  }
  return {
    label: 'Campus Peer',
    badgeClass: 'bg-slate-50 text-slate-600 border-slate-200',
    barColor: 'bg-slate-400',
    textColor: 'text-slate-600',
  };
}
