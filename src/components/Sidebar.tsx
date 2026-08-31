import React from 'react';
import { 
  Flame, 
  Activity, 
  Leaf, 
  Laptop, 
  LandPlot, 
  Bookmark, 
  FileText, 
  AlertTriangle, 
  Clock, 
  PhoneCall, 
  Users, 
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Award,
  Network,
  Lock,
  Radio
} from 'lucide-react';
import { useSafetyBrain } from '../context/SafetyBrainContext';
import { SafetyCategory } from '../types';

export const Sidebar: React.FC = () => {
  const { 
    filters, 
    setFilters, 
    toggleCategoryFilter, 
    categoryCounts, 
    docs, 
    currentUser, 
    collaborators, 
    setCurrentDocId,
    setActiveTab,
    setIsAiModalOpen
  } = useSafetyBrain();

  const categories: Array<{ 
    name: SafetyCategory; 
    enName: string;
    dotColor: string; 
    icon: React.ComponentType<any>;
  }> = [
    { name: '지진안전', enName: 'Earthquake', dotColor: 'bg-blue-500', icon: LandPlot },
    { name: '화재안전', enName: 'Fire', dotColor: 'bg-orange-500', icon: Flame },
    { name: '응급처치', enName: 'First Aid', dotColor: 'bg-red-500', icon: Activity },
    { name: '환경안전', enName: 'Environmental', dotColor: 'bg-green-500', icon: Leaf },
    { name: '디지털안전', enName: 'Digital', dotColor: 'bg-indigo-500', icon: Laptop },
  ];

  const bookmarkedCount = docs.filter(d => d.isBookmarked).length;
  const myDocsCount = docs.filter(d => d.authorId === currentUser.id || d.lastEditedById === currentUser.id).length;
  const criticalCount = docs.filter(d => d.priority === 'CRITICAL').length;
  const reviewCount = docs.filter(d => d.status === 'REVIEW' || d.status === 'DRAFT').length;

  return (
    <aside className="w-full lg:w-72 shrink-0 bg-slate-900 text-slate-300 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between">
      
      <div>
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-base tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
              Second Brain OS
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-widest font-semibold">
              안전교육자 김은경
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            v2.6 Pro
          </span>
        </div>

        {/* 5 Major Knowledge Categories */}
        <div className="p-4 space-y-1 border-b border-slate-800">
          <div className="flex items-center justify-between px-3 py-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Knowledge Categories
            </span>
            {filters.categories.length > 0 && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, categories: [] }))}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
              >
                전체 해제
              </button>
            )}
          </div>

          <div className="space-y-1 mt-1">
            {categories.map(({ name, enName, dotColor, icon: Icon }) => {
              const isSelected = filters.categories.includes(name);
              const count = categoryCounts[name] || 0;

              return (
                <button
                  key={name}
                  id={`sidebar-cat-${name}`}
                  onClick={() => {
                    toggleCategoryFilter(name);
                    setActiveTab('docs');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-slate-800 text-white font-semibold shadow-xs ring-1 ring-slate-700'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`}></div>
                    <span className="truncate">{name} ({enName})</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1 shrink-0 ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Management & Smart Filter Views */}
        <div className="p-4 space-y-1 border-b border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
            Management & Views
          </div>

          <button
            onClick={() => {
              setFilters(prev => ({ ...prev, onlyBookmarked: false, onlyMyDocs: false, priority: 'ALL', statuses: [] }));
              setActiveTab('docs');
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              !filters.onlyBookmarked && !filters.onlyMyDocs && filters.priority === 'ALL' && filters.statuses.length === 0
                ? 'bg-slate-800 text-white font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>전체 지침서 목록</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">{docs.length}</span>
          </button>

          <button
            onClick={() => {
              setFilters(prev => ({ ...prev, onlyBookmarked: !prev.onlyBookmarked }));
              setActiveTab('docs');
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              filters.onlyBookmarked
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>북마크 지침서</span>
            </div>
            <span className="text-[10px] text-amber-400 font-bold font-mono">{bookmarkedCount}</span>
          </button>

          <button
            onClick={() => {
              setFilters(prev => ({ ...prev, priority: prev.priority === 'CRITICAL' ? 'ALL' : 'CRITICAL' }));
              setActiveTab('docs');
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              filters.priority === 'CRITICAL'
                ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>긴급(Critical) 우선순위</span>
            </div>
            <span className="text-[10px] text-red-400 font-bold font-mono">{criticalCount}</span>
          </button>

          <button
            onClick={() => setActiveTab('roles-matrix')}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>사용자 권한 설정 (RBAC)</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz-center')}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Award className="w-3.5 h-3.5 text-slate-400" />
            <span>안전 자격 평가 센터</span>
          </button>
        </div>

        {/* Real-time Online Collaborators */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                실시간 접속 ({collaborators.length}명)
              </span>
            </div>
            <button
              onClick={() => setActiveTab('collab-room')}
              className="text-[10px] text-blue-400 hover:underline"
            >
              협업룸
            </button>
          </div>

          <div className="space-y-1.5">
            {collaborators.map(c => {
              const isMe = c.userId === currentUser.id;
              return (
                <div 
                  key={c.userId}
                  onClick={() => {
                    if (c.currentDocId) {
                      setCurrentDocId(c.currentDocId);
                      setActiveTab('docs');
                    }
                  }}
                  className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-800/80 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <img
                      src={c.userAvatar}
                      alt={c.userName}
                      className="w-6 h-6 rounded-full object-cover border border-slate-700 shrink-0"
                    />
                    <div className="truncate">
                      <span className="text-xs text-slate-200 font-medium truncate block">
                        {c.userName} {isMe && <span className="text-blue-400">(나)</span>}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                    {c.activeAction === 'editing' ? '수정중' : '열람중'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Profile Footer in Sidebar */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
            {currentUser.name.slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-white font-medium truncate">{currentUser.name}</p>
            <p className="text-xs text-slate-500 truncate">{currentUser.roleTitle} ({currentUser.role})</p>
          </div>
        </div>
      </div>

    </aside>
  );
};
