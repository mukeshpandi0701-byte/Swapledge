import type { Student } from '../types';

/**
 * Calculates a compatibility score (0–100) between the active user and a peer.
 *
 * Scoring rules:
 * - Base match: For each skill the peer teaches that the user wants to learn → +20 pts
 * - Reciprocal match: For each skill the user teaches that the peer wants to learn → +10 pts bonus
 * - Result is capped at 100.
 */
export function calculateMatchScore(activeUser: Student, peer: Student): number {
  if (activeUser.id === peer.id) return 0;

  const userWants = new Set(activeUser.wantsToLearn.map((s) => s.toLowerCase()));
  const peerTeaches = new Set(peer.teaches.map((s) => s.toLowerCase()));
  const userTeaches = new Set(activeUser.teaches.map((s) => s.toLowerCase()));
  const peerWants = new Set(peer.wantsToLearn.map((s) => s.toLowerCase()));

  let score = 0;

  // Primary: peer teaches what user wants
  for (const skill of userWants) {
    if (peerTeaches.has(skill)) {
      score += 20;
    }
  }

  // Bonus: user teaches what peer wants (reciprocal)
  for (const skill of userTeaches) {
    if (peerWants.has(skill)) {
      score += 10;
    }
  }

  return Math.min(score, 100);
}

/**
 * Returns a label and color class for a given match score.
 */
export function getMatchLabel(score: number): { label: string; colorClass: string } {
  if (score >= 70) return { label: 'Excellent Match', colorClass: 'text-emerald-600 bg-emerald-50' };
  if (score >= 40) return { label: 'Good Match', colorClass: 'text-indigo-600 bg-indigo-50' };
  if (score >= 20) return { label: 'Fair Match', colorClass: 'text-amber-600 bg-amber-50' };
  return { label: 'Low Match', colorClass: 'text-slate-500 bg-slate-100' };
}
