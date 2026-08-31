import React, { useState } from 'react';
import { 
  Bookmark, 
  Flame, 
  Activity, 
  Leaf, 
  Laptop, 
  LandPlot, 
  Clock, 
  Lock, 
  Globe, 
  Building2, 
  FileText, 
  ChevronRight,
  LayoutGrid,
  List,
  CheckCircle2
} from 'lucide-react';
import { useSafetyBrain } from '../context/SafetyBrainContext';
import { SafetyDoc, SafetyCategory } from '../types';

export const DocumentList: React.FC = () => {
  const { 
    filteredDocs, 
    currentDocId, 
    setCurrentDocId, 
    toggleBookmark, 
    collaborators,
    setIsEditing
  } = useSafetyBrain();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getCategoryConfig = (cat: SafetyCategory) => {
    switch (cat) {
      case '지진안전':
        return { icon: LandPlot, emoji: '🏢', text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
      case '화재안전':
        return { icon: Flame, emoji: '🔥', text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
      case '응급처치':
        return { icon: Activity, emoji: '🚑', text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
      case '환경안전':
        return { icon: Leaf, emoji: '🌿', text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
      case '디지털안전':
        return { icon: Laptop, emoji: '💻', text: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' };
      default:
        return { icon: FileText, emoji: '📄', text: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' };
    }
  };

  const getAccessBadge = (level: string) => {
    switch (level) {
      case 'PUBLIC':
        return { label: 'Public', color: 'bg-blue-100 text-blue-700' };
      case 'ORG_WIDE':
        return { label: 'Org Wide', color: 'bg-slate-100 text-slate-700' };
      case 'RESTRICTED':
        return { label: 'Restricted', color: 'bg-indigo-100 text-indigo-700' };
      case 'PRIVATE':
        return { label: 'Admin Only', color: 'bg-green-100 text-green-700' };
      default:
        return { label: 'Standard', color: 'bg-slate-100 text-slate-600' };
    }
  };

  if (filteredDocs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">일치하는 안전 지침서가 없습니다</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          검색 키워드를 변경하거나 상단의 분야, 대상, 난이도 필터를 초기화해 보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* View switcher header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
          표준 지침서 목록 ({filteredDocs.length})
        </span>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            onClick={() => setViewMode('grid')}
            title="그리드 카드 뷰"
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'grid' ? 'bg-white shadow-xs text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            title="리스트 뷰"
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'list' ? 'bg-white shadow-xs text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid or List Layout */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}>
        {filteredDocs.map((doc: SafetyDoc) => {
          const catConfig = getCategoryConfig(doc.category);
          const CatIcon = catConfig.icon;
          const accessInfo = getAccessBadge(doc.accessLevel);
          const isSelected = currentDocId === doc.id;

          // Collaborators viewing/editing this doc
          const docCollaborators = collaborators.filter(c => c.currentDocId === doc.id);
          const isBeingEdited = docCollaborators.some(c => c.activeAction === 'editing');

          return (
            <div
              key={doc.id}
              id={`doc-card-${doc.id}`}
              onClick={() => {
                setCurrentDocId(doc.id);
                setIsEditing(false);
              }}
              className={`bg-white p-5 rounded-xl border shadow-xs hover:shadow-md transition-all cursor-pointer relative flex flex-col justify-between group ${
                isSelected
                  ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Absolute Top-Right Badges */}
              <div className="absolute top-4 right-4 flex items-center space-x-1.5">
                {doc.priority === 'CRITICAL' && (
                  <span className="bg-red-100 text-red-700 text-[10px] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider animate-pulse">
                    Critical
                  </span>
                )}
                <span className={`${accessInfo.color} text-[10px] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider`}>
                  {accessInfo.label}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(doc.id);
                  }}
                  title={doc.isBookmarked ? '북마크 해제' : '북마크 추가'}
                  className="p-0.5 text-slate-300 hover:text-amber-500 transition-colors"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${doc.isBookmarked ? 'fill-amber-400 text-amber-500' : ''}`} />
                </button>
              </div>

              <div>
                {/* Category Icon Box */}
                <div className={`w-10 h-10 ${catConfig.bg} ${catConfig.text} rounded-lg flex items-center justify-center mb-3 text-base shadow-2xs`}>
                  <CatIcon className="w-5 h-5" />
                </div>

                {/* Title */}
                <h3 className="font-bold text-slate-800 mb-1 leading-snug group-hover:text-blue-600 transition-colors text-sm sm:text-base">
                  {doc.title}
                </h3>

                {/* Summary */}
                <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-3">
                  {doc.summary}
                </p>

                {/* Golden time if present */}
                {doc.goldenTime && (
                  <div className="mb-2 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-200/60 flex items-center gap-1.5 text-[11px] text-amber-900 font-medium">
                    <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>골든타임: <strong className="font-bold text-amber-800">{doc.goldenTime}</strong></span>
                  </div>
                )}
              </div>

              {/* Card Footer Divider & Metadata */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-mono">
                  {doc.category} · {doc.targetAudience}
                </span>

                <div className="flex items-center space-x-2">
                  {/* Collaborator Avatars */}
                  {docCollaborators.length > 0 && (
                    <div className="flex -space-x-1 overflow-hidden" title="현재 열람/수정 중인 협업자">
                      {docCollaborators.map(collab => (
                        <img
                          key={collab.userId}
                          src={collab.userAvatar}
                          alt={collab.userName}
                          className="inline-block h-4 w-4 rounded-full ring-1 ring-white object-cover"
                        />
                      ))}
                    </div>
                  )}

                  {isBeingEdited ? (
                    <span className="text-blue-600 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                      실시간 편집 중
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      {doc.status === 'PUBLISHED' ? '최종 승인됨' : '검토 대기'}
                    </span>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
