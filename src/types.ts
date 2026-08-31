export type SafetyCategory = 
  | '지진안전' 
  | '화재안전' 
  | '응급처치' 
  | '환경안전' 
  | '디지털안전';

export type UserRole = 'ADMIN' | 'INSTRUCTOR' | 'EDITOR' | 'VIEWER' | 'GUEST';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  organization: string;
  avatarUrl: string;
  color: string;
  email: string;
  specialty?: SafetyCategory[];
}

export type AccessLevel = 'PUBLIC' | 'ORG_WIDE' | 'RESTRICTED' | 'PRIVATE';

export type DocStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type TargetAudience = '전체' | '초·중·고교' | '일반시민' | '사업장근로자' | '관리감독자' | '전문강사진';

export type DifficultyLevel = '기초(입문)' | '실무(표준)' | '심화(전문가)' | '비상대응훈련';

export interface DocComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  content: string;
  createdAt: string;
  resolved: boolean;
  replies?: Array<{
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    content: string;
    createdAt: string;
  }>;
}

export interface DocRevision {
  id: string;
  version: string;
  editorId: string;
  editorName: string;
  summary: string;
  timestamp: string;
  contentSnapshot: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  category?: string;
}

export interface SafetyDoc {
  id: string;
  slug: string;
  title: string;
  category: SafetyCategory;
  summary: string;
  content: string;
  keyActionPoints: string[];
  tags: string[];
  targetAudience: TargetAudience;
  difficulty: DifficultyLevel;
  status: DocStatus;
  priority: PriorityLevel;
  
  // Authoring & metadata
  authorId: string;
  authorName: string;
  lastEditedById: string;
  lastEditedByName: string;
  createdAt: string;
  updatedAt: string;
  version: string;
  viewCount: number;
  isBookmarked?: boolean;

  // Permissions & Access
  accessLevel: AccessLevel;
  allowedRoles: UserRole[];
  editRoles: UserRole[];
  allowedUserIds: string[];
  editUserIds: string[];

  // Second brain & Collaboration
  relatedDocIds: string[]; // for knowledge graph connections
  checklists: ChecklistItem[];
  quizzes: QuizQuestion[];
  comments: DocComment[];
  revisions: DocRevision[];
  
  // Golden time or emergency info
  goldenTime?: string;
  emergencyContact?: string;
}

export interface LiveCollaborator {
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  color: string;
  currentDocId: string | null;
  cursorPos?: { line: number; ch: number };
  activeAction?: string; // 'editing' | 'viewing' | 'commenting'
  lastActive: number;
}

export interface SearchFilterState {
  keyword: string;
  categories: SafetyCategory[];
  audiences: TargetAudience[];
  difficulties: DifficultyLevel[];
  statuses: DocStatus[];
  priority: PriorityLevel | 'ALL';
  authorId: string | 'ALL';
  sortBy: 'updatedAt' | 'createdAt' | 'title' | 'views' | 'priority';
  sortOrder: 'asc' | 'desc';
  onlyBookmarked: boolean;
  onlyMyDocs: boolean;
}
