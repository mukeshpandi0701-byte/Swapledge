// ─── Core Domain Types ───────────────────────────────────────────────────────

export type UserMode = 'learner' | 'trainer';

export type TrainerVerificationStatus = 'not_started' | 'pending' | 'verified' | 'rejected';

export interface TrainerApplication {
  status: TrainerVerificationStatus;
  appliedAt?: string;
  reviewedAt?: string;
  skills: string[];
  teachingBio: string;
  portfolioUrl?: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  availability: string;
  rejectionReason?: string;
}

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
  availability?: string;
  completedSessionsCount?: number;
  trainerVerificationStatus?: TrainerVerificationStatus;
  trainerApplication?: TrainerApplication;
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

// ─── Notification Types ───────────────────────────────────────────────────────

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'session' | 'badge' | 'group' | 'system' | 'trainer';
  read: boolean;
  targetTab?: ActiveTab;
}

// ─── Matching Explanation ─────────────────────────────────────────────────────

export interface MatchExplanation {
  score: number;
  directMatches: string[];     // skills peer teaches that active user wants
  reciprocalMatches: string[]; // skills active user teaches that peer wants
  sharedDepartment: boolean;
  summary: string;
}

// ─── UI / Filter State Types ──────────────────────────────────────────────────

export interface PeerFilters {
  keyword: string;
  department: string;
  skillOffered: string;
  skillWanted: string;
  verifiedOnly: boolean;
  availabilityFilter: string;
  sortOption: 'compatibility' | 'rating' | 'reviews' | 'name';
}

export type LearnerTab = 'explore' | 'sessions' | 'groups' | 'assessment' | 'progress';
export type TrainerTab =
  | 'trainer_dashboard'
  | 'teaching_skills'
  | 'incoming_requests'
  | 'teaching_sessions'
  | 'verification'
  | 'feedback';

export type ActiveTab = LearnerTab | TrainerTab;
export type SessionTab = 'upcoming' | 'pending' | 'completed' | 'declined';
