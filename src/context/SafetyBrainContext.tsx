import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  SafetyDoc, 
  UserProfile, 
  SearchFilterState, 
  SafetyCategory, 
  UserRole, 
  AccessLevel, 
  LiveCollaborator,
  DocComment,
  DocRevision,
  DocStatus,
  ChecklistItem
} from '../types';
import { INITIAL_DOCS, INITIAL_USERS } from '../data/initialData';

interface SafetyBrainContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  users: UserProfile[];
  
  docs: SafetyDoc[];
  currentDoc: SafetyDoc | null;
  currentDocId: string | null;
  setCurrentDocId: (id: string | null) => void;
  
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  
  activeTab: 'docs' | 'graph' | 'collab-room' | 'quiz-center' | 'roles-matrix';
  setActiveTab: (tab: 'docs' | 'graph' | 'collab-room' | 'quiz-center' | 'roles-matrix') => void;
  
  filters: SearchFilterState;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilterState>>;
  resetFilters: () => void;
  toggleCategoryFilter: (category: SafetyCategory) => void;
  filteredDocs: SafetyDoc[];
  categoryCounts: Record<SafetyCategory, number>;

  // Permission Checks
  canViewDoc: (doc: SafetyDoc, user?: UserProfile) => boolean;
  canEditDoc: (doc: SafetyDoc, user?: UserProfile) => boolean;
  canDeleteDoc: (doc: SafetyDoc, user?: UserProfile) => boolean;
  canManagePermissions: (doc: SafetyDoc, user?: UserProfile) => boolean;
  canPublishDoc: (doc: SafetyDoc, user?: UserProfile) => boolean;

  // Actions
  createDoc: (docData: Partial<SafetyDoc>) => string;
  updateDoc: (docId: string, updates: Partial<SafetyDoc>, changeSummary?: string) => void;
  deleteDoc: (docId: string) => void;
  toggleBookmark: (docId: string) => void;
  addComment: (docId: string, content: string) => void;
  toggleCommentResolved: (docId: string, commentId: string) => void;
  toggleChecklistItem: (docId: string, itemId: string) => void;
  updateDocPermissions: (
    docId: string, 
    accessLevel: AccessLevel, 
    allowedRoles: UserRole[], 
    editRoles: UserRole[], 
    allowedUserIds: string[], 
    editUserIds: string[]
  ) => void;
  restoreRevision: (docId: string, revisionId: string) => void;

  // Real-time Collaboration & Presence
  collaborators: LiveCollaborator[];
  activeCollaboratorsOnDoc: LiveCollaborator[];
  simulateActiveTeamCollaboration: () => void;
  broadcastPresence: (action?: string) => void;

  // AI Assistant Modal
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  aiQuickPrompt: string;
  setAiQuickPrompt: (prompt: string) => void;
}

const STORAGE_KEY_DOCS = 'safety_second_brain_docs_v1';
const STORAGE_KEY_USER = 'safety_second_brain_active_user_v1';

const defaultFilters: SearchFilterState = {
  keyword: '',
  categories: [],
  audiences: [],
  difficulties: [],
  statuses: [],
  priority: 'ALL',
  authorId: 'ALL',
  sortBy: 'updatedAt',
  sortOrder: 'desc',
  onlyBookmarked: false,
  onlyMyDocs: false,
};

const SafetyBrainContext = createContext<SafetyBrainContextType | null>(null);

export const SafetyBrainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Users state
  const [users] = useState<UserProfile[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      const found = INITIAL_USERS.find(u => u.id === saved);
      if (found) return found;
    }
    return INITIAL_USERS[0]; // 김은경 (ADMIN)
  });

  // Docs state
  const [docs, setDocs] = useState<SafetyDoc[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DOCS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved docs', e);
      }
    }
    return INITIAL_DOCS;
  });

  // Navigation & UI state
  const [currentDocId, setCurrentDocId] = useState<string | null>(INITIAL_DOCS[0].id);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'docs' | 'graph' | 'collab-room' | 'quiz-center' | 'roles-matrix'>('docs');
  const [filters, setFilters] = useState<SearchFilterState>(defaultFilters);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiQuickPrompt, setAiQuickPrompt] = useState('');

  // Collaborators presence state
  const [collaborators, setCollaborators] = useState<LiveCollaborator[]>([
    {
      userId: 'user-kim',
      userName: '김은경',
      userAvatar: INITIAL_USERS[0].avatarUrl,
      userRole: 'ADMIN',
      color: '#2563eb',
      currentDocId: 'doc-cpr-aed',
      activeAction: 'editing',
      lastActive: Date.now(),
    },
    {
      userId: 'user-park',
      userName: '박준호',
      userAvatar: INITIAL_USERS[1].avatarUrl,
      userRole: 'INSTRUCTOR',
      color: '#059669',
      currentDocId: 'doc-cpr-aed',
      activeAction: 'viewing',
      lastActive: Date.now() - 30000,
    },
    {
      userId: 'user-lee',
      userName: '이서연',
      userAvatar: INITIAL_USERS[2].avatarUrl,
      userRole: 'EDITOR',
      color: '#7c3aed',
      currentDocId: 'doc-hazmat-leak',
      activeAction: 'editing',
      lastActive: Date.now() - 60000,
    },
    {
      userId: 'user-choi',
      userName: '최유진',
      userAvatar: INITIAL_USERS[3].avatarUrl,
      userRole: 'VIEWER',
      color: '#d97706',
      currentDocId: 'doc-fire-extinguisher',
      activeAction: 'viewing',
      lastActive: Date.now() - 120000,
    },
  ]);

  // Persist Docs
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(docs));
  }, [docs]);

  // Persist Active User
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER, currentUser.id);
  }, [currentUser]);

  // Multi-tab BroadcastChannel sync for real-time collaboration
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('safety_second_brain_channel');
      
      channel.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'DOCS_UPDATED') {
          setDocs(payload);
        } else if (type === 'USER_PRESENCE') {
          setCollaborators(prev => {
            const exists = prev.find(c => c.userId === payload.userId);
            if (exists) {
              return prev.map(c => c.userId === payload.userId ? { ...c, ...payload, lastActive: Date.now() } : c);
            }
            return [...prev, { ...payload, lastActive: Date.now() }];
          });
        }
      };

      return () => {
        channel.close();
      };
    }
  }, []);

  // Broadcast presence on current doc change
  const broadcastPresence = useCallback((action: string = isEditing ? 'editing' : 'viewing') => {
    const presenceInfo: LiveCollaborator = {
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatarUrl,
      userRole: currentUser.role,
      color: currentUser.color,
      currentDocId,
      activeAction: action,
      lastActive: Date.now(),
    };

    setCollaborators(prev => {
      const filtered = prev.filter(c => c.userId !== currentUser.id);
      return [...filtered, presenceInfo];
    });

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('safety_second_brain_channel');
      channel.postMessage({ type: 'USER_PRESENCE', payload: presenceInfo });
      channel.close();
    }
  }, [currentUser, currentDocId, isEditing]);

  useEffect(() => {
    broadcastPresence();
  }, [broadcastPresence, currentDocId, isEditing]);

  // Current selected document
  const currentDoc = useMemo(() => {
    return docs.find(d => d.id === currentDocId) || null;
  }, [docs, currentDocId]);

  // Active collaborators on the open doc
  const activeCollaboratorsOnDoc = useMemo(() => {
    if (!currentDocId) return [];
    return collaborators.filter(c => c.currentDocId === currentDocId);
  }, [collaborators, currentDocId]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<SafetyCategory, number> = {
      '지진안전': 0,
      '화재안전': 0,
      '응급처치': 0,
      '환경안전': 0,
      '디지털안전': 0,
    };
    docs.forEach(doc => {
      if (counts[doc.category] !== undefined) {
        counts[doc.category] += 1;
      }
    });
    return counts;
  }, [docs]);

  // ================= PERMISSIONS LOGIC =================
  const canViewDoc = useCallback((doc: SafetyDoc, user: UserProfile = currentUser): boolean => {
    if (user.role === 'ADMIN') return true;
    if (doc.authorId === user.id) return true;
    if (doc.allowedUserIds?.includes(user.id)) return true;

    if (doc.accessLevel === 'PUBLIC') return true;
    if (doc.accessLevel === 'ORG_WIDE' && user.role !== 'GUEST') return true;
    if (doc.accessLevel === 'RESTRICTED') {
      return doc.allowedRoles?.includes(user.role) || false;
    }
    if (doc.accessLevel === 'PRIVATE') {
      return doc.authorId === user.id || doc.allowedUserIds?.includes(user.id) || false;
    }
    return false;
  }, [currentUser]);

  const canEditDoc = useCallback((doc: SafetyDoc, user: UserProfile = currentUser): boolean => {
    if (user.role === 'ADMIN') return true;
    if (user.role === 'GUEST' || user.role === 'VIEWER') return false;
    if (doc.authorId === user.id) return true;
    if (doc.editUserIds?.includes(user.id)) return true;
    if (doc.editRoles?.includes(user.role)) return true;
    return false;
  }, [currentUser]);

  const canDeleteDoc = useCallback((doc: SafetyDoc, user: UserProfile = currentUser): boolean => {
    if (user.role === 'ADMIN') return true;
    if (doc.authorId === user.id && (user.role === 'INSTRUCTOR' || user.role === 'EDITOR')) return true;
    return false;
  }, [currentUser]);

  const canManagePermissions = useCallback((doc: SafetyDoc, user: UserProfile = currentUser): boolean => {
    if (user.role === 'ADMIN') return true;
    if (doc.authorId === user.id && user.role === 'INSTRUCTOR') return true;
    return false;
  }, [currentUser]);

  const canPublishDoc = useCallback((doc: SafetyDoc, user: UserProfile = currentUser): boolean => {
    return user.role === 'ADMIN' || user.role === 'INSTRUCTOR';
  }, [currentUser]);

  // ================= FILTERING LOGIC =================
  const filteredDocs = useMemo(() => {
    return docs.filter(doc => {
      // Access check
      if (!canViewDoc(doc, currentUser)) return false;

      // Keyword search (title, summary, content, tags, keyActionPoints)
      if (filters.keyword.trim()) {
        const q = filters.keyword.toLowerCase().trim();
        const matchTitle = doc.title.toLowerCase().includes(q);
        const matchSummary = doc.summary.toLowerCase().includes(q);
        const matchContent = doc.content.toLowerCase().includes(q);
        const matchTags = doc.tags.some(t => t.toLowerCase().includes(q));
        const matchActions = doc.keyActionPoints.some(a => a.toLowerCase().includes(q));
        if (!matchTitle && !matchSummary && !matchContent && !matchTags && !matchActions) {
          return false;
        }
      }

      // Categories filter
      if (filters.categories.length > 0) {
        if (!filters.categories.includes(doc.category)) return false;
      }

      // Audience filter
      if (filters.audiences.length > 0) {
        if (!filters.audiences.includes(doc.targetAudience)) return false;
      }

      // Difficulty filter
      if (filters.difficulties.length > 0) {
        if (!filters.difficulties.includes(doc.difficulty)) return false;
      }

      // Status filter
      if (filters.statuses.length > 0) {
        if (!filters.statuses.includes(doc.status)) return false;
      }

      // Priority filter
      if (filters.priority !== 'ALL') {
        if (doc.priority !== filters.priority) return false;
      }

      // Author filter
      if (filters.authorId !== 'ALL') {
        if (doc.authorId !== filters.authorId) return false;
      }

      // Bookmarked only
      if (filters.onlyBookmarked && !doc.isBookmarked) return false;

      // My docs only
      if (filters.onlyMyDocs && doc.authorId !== currentUser.id && doc.lastEditedById !== currentUser.id) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const order = filters.sortOrder === 'asc' ? 1 : -1;
      if (filters.sortBy === 'updatedAt') {
        return (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) * order;
      }
      if (filters.sortBy === 'createdAt') {
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * order;
      }
      if (filters.sortBy === 'title') {
        return a.title.localeCompare(b.title) * order;
      }
      if (filters.sortBy === 'views') {
        return (a.viewCount - b.viewCount) * order;
      }
      if (filters.sortBy === 'priority') {
        const pMap = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        return (pMap[a.priority] - pMap[b.priority]) * order;
      }
      return 0;
    });
  }, [docs, filters, currentUser, canViewDoc]);

  const toggleCategoryFilter = (category: SafetyCategory) => {
    setFilters(prev => {
      const exists = prev.categories.includes(category);
      return {
        ...prev,
        categories: exists ? prev.categories.filter(c => c !== category) : [...prev.categories, category]
      };
    });
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // ================= CRUD & MUTATIONS =================
  const broadcastDocsChange = (newDocs: SafetyDoc[]) => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('safety_second_brain_channel');
      channel.postMessage({ type: 'DOCS_UPDATED', payload: newDocs });
      channel.close();
    }
  };

  const createDoc = (docData: Partial<SafetyDoc>): string => {
    const newId = `doc-${Date.now()}`;
    const newDoc: SafetyDoc = {
      id: newId,
      slug: docData.slug || `safety-doc-${Date.now()}`,
      title: docData.title || '새로운 안전 교육 지침서',
      category: docData.category || '지진안전',
      summary: docData.summary || '지침서 요약 내용을 입력하세요.',
      content: docData.content || '## 1. 개요\n\n내용을 작성해주세요.',
      keyActionPoints: docData.keyActionPoints || ['핵심 수칙 1', '핵심 수칙 2'],
      tags: docData.tags || ['안전교육'],
      targetAudience: docData.targetAudience || '전체',
      difficulty: docData.difficulty || '실무(표준)',
      status: (docData.status as DocStatus) || 'DRAFT',
      priority: docData.priority || 'HIGH',
      authorId: currentUser.id,
      authorName: currentUser.name,
      lastEditedById: currentUser.id,
      lastEditedByName: currentUser.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 'v1.0',
      viewCount: 1,
      isBookmarked: false,
      accessLevel: docData.accessLevel || 'ORG_WIDE',
      allowedRoles: docData.allowedRoles || ['ADMIN', 'INSTRUCTOR', 'EDITOR', 'VIEWER'],
      editRoles: docData.editRoles || ['ADMIN', 'INSTRUCTOR', 'EDITOR'],
      allowedUserIds: [],
      editUserIds: [currentUser.id],
      relatedDocIds: docData.relatedDocIds || [],
      checklists: docData.checklists || [],
      quizzes: docData.quizzes || [],
      comments: [],
      revisions: [
        {
          id: `rev-${Date.now()}`,
          version: 'v1.0',
          editorId: currentUser.id,
          editorName: currentUser.name,
          summary: '문서 최초 생성',
          timestamp: new Date().toISOString(),
          contentSnapshot: docData.content || '',
        }
      ],
      goldenTime: docData.goldenTime,
      emergencyContact: docData.emergencyContact,
    };

    const updated = [newDoc, ...docs];
    setDocs(updated);
    broadcastDocsChange(updated);
    setCurrentDocId(newId);
    return newId;
  };

  const updateDoc = (docId: string, updates: Partial<SafetyDoc>, changeSummary?: string) => {
    setDocs(prev => {
      const next = prev.map(doc => {
        if (doc.id !== docId) return doc;

        const currentVerNum = parseFloat(doc.version.replace('v', '')) || 1.0;
        const newVersion = `v${(currentVerNum + 0.1).toFixed(1)}`;

        const newRevision: DocRevision | null = changeSummary ? {
          id: `rev-${Date.now()}`,
          version: newVersion,
          editorId: currentUser.id,
          editorName: currentUser.name,
          summary: changeSummary,
          timestamp: new Date().toISOString(),
          contentSnapshot: updates.content || doc.content,
        } : null;

        return {
          ...doc,
          ...updates,
          lastEditedById: currentUser.id,
          lastEditedByName: currentUser.name,
          updatedAt: new Date().toISOString(),
          version: newVersion,
          revisions: newRevision ? [newRevision, ...(doc.revisions || [])] : (doc.revisions || []),
        };
      });
      broadcastDocsChange(next);
      return next;
    });
  };

  const deleteDoc = (docId: string) => {
    setDocs(prev => {
      const next = prev.filter(d => d.id !== docId);
      broadcastDocsChange(next);
      return next;
    });
    if (currentDocId === docId) {
      setCurrentDocId(docs.find(d => d.id !== docId)?.id || null);
    }
  };

  const toggleBookmark = (docId: string) => {
    setDocs(prev => prev.map(d => d.id === docId ? { ...d, isBookmarked: !d.isBookmarked } : d));
  };

  const addComment = (docId: string, content: string) => {
    const newComment: DocComment = {
      id: `comm-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatarUrl,
      userRole: currentUser.role,
      content,
      createdAt: new Date().toISOString(),
      resolved: false,
    };

    setDocs(prev => {
      const next = prev.map(d => d.id === docId ? { ...d, comments: [...(d.comments || []), newComment] } : d);
      broadcastDocsChange(next);
      return next;
    });
  };

  const toggleCommentResolved = (docId: string, commentId: string) => {
    setDocs(prev => {
      const next = prev.map(d => {
        if (d.id !== docId) return d;
        return {
          ...d,
          comments: d.comments.map(c => c.id === commentId ? { ...c, resolved: !c.resolved } : c),
        };
      });
      broadcastDocsChange(next);
      return next;
    });
  };

  const toggleChecklistItem = (docId: string, itemId: string) => {
    setDocs(prev => {
      const next = prev.map(d => {
        if (d.id !== docId) return d;
        return {
          ...d,
          checklists: (d.checklists || []).map(item => item.id === itemId ? { ...item, checked: !item.checked } : item),
        };
      });
      broadcastDocsChange(next);
      return next;
    });
  };

  const updateDocPermissions = (
    docId: string, 
    accessLevel: AccessLevel, 
    allowedRoles: UserRole[], 
    editRoles: UserRole[], 
    allowedUserIds: string[], 
    editUserIds: string[]
  ) => {
    setDocs(prev => {
      const next = prev.map(d => {
        if (d.id !== docId) return d;
        return {
          ...d,
          accessLevel,
          allowedRoles,
          editRoles,
          allowedUserIds,
          editUserIds,
          updatedAt: new Date().toISOString(),
        };
      });
      broadcastDocsChange(next);
      return next;
    });
  };

  const restoreRevision = (docId: string, revisionId: string) => {
    setDocs(prev => {
      const next = prev.map(d => {
        if (d.id !== docId) return d;
        const targetRev = d.revisions?.find(r => r.id === revisionId);
        if (!targetRev || !targetRev.contentSnapshot) return d;
        return {
          ...d,
          content: targetRev.contentSnapshot,
          updatedAt: new Date().toISOString(),
          lastEditedById: currentUser.id,
          lastEditedByName: currentUser.name,
        };
      });
      broadcastDocsChange(next);
      return next;
    });
  };

  // Simulation: Trigger real-time collaborator action for demonstration
  const simulateActiveTeamCollaboration = () => {
    if (!currentDocId) return;
    const otherUser = users.find(u => u.id !== currentUser.id) || users[1];
    
    // 1. Add other user to doc
    setCollaborators(prev => {
      const filtered = prev.filter(c => c.userId !== otherUser.id);
      return [
        ...filtered,
        {
          userId: otherUser.id,
          userName: otherUser.name,
          userAvatar: otherUser.avatarUrl,
          userRole: otherUser.role,
          color: otherUser.color,
          currentDocId,
          activeAction: 'editing',
          lastActive: Date.now(),
        }
      ];
    });

    // 2. Add an automatic peer review comment
    setTimeout(() => {
      addComment(currentDocId, `${otherUser.name} 강사: "김은경 마스터님, 이 문서의 2단계 긴급 프로토콜을 현장 실습 과정에 맞춰 실시간으로 검토 중입니다!"`);
    }, 1200);
  };

  return (
    <SafetyBrainContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        docs,
        currentDoc,
        currentDocId,
        setCurrentDocId,
        isEditing,
        setIsEditing,
        activeTab,
        setActiveTab,
        filters,
        setFilters,
        resetFilters,
        toggleCategoryFilter,
        filteredDocs,
        categoryCounts,

        canViewDoc,
        canEditDoc,
        canDeleteDoc,
        canManagePermissions,
        canPublishDoc,

        createDoc,
        updateDoc,
        deleteDoc,
        toggleBookmark,
        addComment,
        toggleCommentResolved,
        toggleChecklistItem,
        updateDocPermissions,
        restoreRevision,

        collaborators,
        activeCollaboratorsOnDoc,
        simulateActiveTeamCollaboration,
        broadcastPresence,

        isAiModalOpen,
        setIsAiModalOpen,
        aiQuickPrompt,
        setAiQuickPrompt,
      }}
    >
      {children}
    </SafetyBrainContext.Provider>
  );
};

export const useSafetyBrain = () => {
  const context = useContext(SafetyBrainContext);
  if (!context) {
    throw new Error('useSafetyBrain must be used within a SafetyBrainProvider');
  }
  return context;
};
