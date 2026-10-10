// ─── Core Domain Types ───────────────────────────────────────────────────────

export interface GitHubStats {
  username: string;
  publicRepos: number;
  totalStars: number;
  topLanguages: string[];
  avatarUrl?: string;
}

export interface AssessmentBadge {
  skill: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  verified: boolean;
  earnedAt: string; // ISO date string
}

export interface Student {
  id: string;
  name: string;
  email: string;
  department: string;
  year: number;
  avatar: string;
  teaches: string[];
  wantsToLearn: string[];
  bio: string;
  rating: number;
  reviewCount: number;
  github: GitHubStats;
  badges: AssessmentBadge[];
  isVerified: boolean;
  joinedAt: string;
}

// ─── Session Booking Types ────────────────────────────────────────────────────

export type SessionStatus = 'pending' | 'accepted' | 'declined' | 'completed';

export interface SessionRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  peerId: string;
  peerName: string;
  peerAvatar: string;
  skill: string;
  date: string;
  timeSlot: string;
  note: string;
  status: SessionStatus;
  createdAt: string;
  review?: SessionReview;
}

export interface SessionReview {
  rating: number;
  comment: string;
  reviewedAt: string;
}

// ─── Study Group Types ────────────────────────────────────────────────────────

export interface GroupResource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'code' | 'note';
  url: string;
  addedBy: string;
  addedAt: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  description: string;
  icon: string;
  color: string;
  memberCount: number;
  members: string[]; // Student IDs
  resources: GroupResource[];
  createdAt: string;
  tags: string[];
}

// ─── Quiz / Assessment Types ──────────────────────────────────────────────────

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

export interface Quiz {
  id: string;
  skill: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  questions: QuizQuestion[];
  passingScore: number; // e.g. 2 out of 3
  badgeLabel: string;
}

export interface QuizResult {
  quizId: string;
  skill: string;
  score: number;
  total: number;
  passed: boolean;
  completedAt: string;
}

// ─── UI / Filter State Types ──────────────────────────────────────────────────

export interface PeerFilters {
  keyword: string;
  department: string;
  skillOffered: string;
  skillWanted: string;
  verifiedOnly: boolean;
}

export type ActiveTab = 'explore' | 'sessions' | 'groups' | 'assessment';
export type SessionTab = 'upcoming' | 'pending' | 'completed';
