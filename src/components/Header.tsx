import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Sparkles, 
  Plus, 
  Users, 
  Network, 
  BookOpen, 
  Award, 
  Lock, 
  UserCheck, 
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import { useSafetyBrain } from '../context/SafetyBrainContext';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser, 
    users, 
    activeTab, 
    setActiveTab, 
    filters, 
    setFilters, 
    setIsAiModalOpen,
    setIsEditing,
    createDoc,
    collaborators,
    simulateActiveTeamCollaboration
  } = useSafetyBrain();

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-50 text-red-700 border-red-200';
      case 'INSTRUCTOR': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'EDITOR': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'VIEWER': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleCreateNew = () => {
    createDoc({
      title: '새로운 안전교육 표준 지침서',
      category: filters.categories[0] || '지진안전',
      status: 'DRAFT',
    });
    setActiveTab('docs');
    setIsEditing(true);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          
          {/* Left Brand Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base tracking-tight">
                  00:00 <span className="text-blue-600">Second Brain</span>
                </span>
                <span className="hidden lg:inline-flex text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                  Professional Polish
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                안전교육자 김은경 · 통합 지식 허브
              </p>
            </div>
          </div>

          {/* Search Pill Input Bar */}
          <div className="flex-1 max-w-md hidden md:flex items-center bg-slate-100 rounded-full px-4 py-1.5 border border-slate-200 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
            <span className="text-slate-400 mr-2 text-sm">🔍</span>
            <input
              id="header-global-search-input"
              type="text"
              value={filters.keyword}
              onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
              placeholder="지식 문서, 프로토콜, 매뉴얼 검색..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder-slate-400 text-slate-800"
            />
            {filters.keyword && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, keyword: '' }))}
                className="text-xs text-slate-400 hover:text-slate-600 ml-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Right Action Stack */}
          <div className="flex items-center space-x-3">
            
            {/* Live Collaborator Avatar Stack */}
            <div className="hidden sm:flex items-center -space-x-2 overflow-hidden" title="현재 접속 중인 협업자">
              <div className="w-8 h-8 rounded-full border-2 border-white bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold shadow-2xs">
                박
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shadow-2xs">
                이
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold shadow-2xs">
                +{collaborators.length}
              </div>
            </div>

            <div className="h-7 w-[1px] bg-slate-200 hidden sm:block"></div>

            {/* AI Assistant Button */}
            <button
              id="header-btn-ai-assistant"
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI 자문</span>
            </button>

            {/* Create Doc Button */}
            {(currentUser.role === 'ADMIN' || currentUser.role === 'INSTRUCTOR' || currentUser.role === 'EDITOR') && (
              <button
                id="header-btn-create-doc"
                onClick={handleCreateNew}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-md shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>신규 문서 작성</span>
              </button>
            )}

            {/* User Profile & Role Switcher */}
            <div className="relative">
              <button
                id="header-user-switcher-toggle"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-md hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-md object-cover border border-slate-300"
                />
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    {currentUser.name}
                    <span className={`text-[10px] px-1.5 py-0.2 rounded border ${getRoleBadgeColor(currentUser.role)} font-semibold`}>
                      {currentUser.role}
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      사용자 권한 전환 테스트
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      역할에 따른 열람/편집/관리자 권한을 즉시 체험할 수 있습니다.
                    </p>
                  </div>

                  <div className="py-1 max-h-64 overflow-y-auto">
                    {users.map(user => (
                      <button
                        key={user.id}
                        onClick={() => {
                          setCurrentUser(user);
                          setIsUserDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs hover:bg-slate-50 transition-colors ${
                          user.id === currentUser.id ? 'bg-blue-50/70 font-semibold' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="text-slate-800 font-medium flex items-center gap-1.5">
                              {user.name}
                              {user.id === currentUser.id && (
                                <span className="text-[10px] text-blue-600 font-bold">● 현재</span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate max-w-[130px]">
                              {user.roleTitle}
                            </div>
                          </div>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="px-3 py-2 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-[11px] text-slate-600">
                    <span>접근 권한 관리</span>
                    <button
                      onClick={() => {
                        setActiveTab('roles-matrix');
                        setIsUserDropdownOpen(false);
                      }}
                      className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      <Lock className="w-3 h-3" /> 매트릭스 보기
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Global Navigation Tabs */}
        <div className="flex items-center space-x-1 border-t border-slate-100 pt-1 pb-1.5 overflow-x-auto scrollbar-none">
          <button
            id="tab-btn-docs"
            onClick={() => setActiveTab('docs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'docs'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>통합 지식 대시보드</span>
          </button>

          <button
            id="tab-btn-graph"
            onClick={() => setActiveTab('graph')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'graph'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>지식망 그래프 (Knowledge Graph)</span>
          </button>

          <button
            id="tab-btn-collab-room"
            onClick={() => setActiveTab('collab-room')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'collab-room'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>실시간 협업룸</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          <button
            id="tab-btn-quiz-center"
            onClick={() => setActiveTab('quiz-center')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'quiz-center'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>실전 퀴즈 평가</span>
          </button>

          <button
            id="tab-btn-roles-matrix"
            onClick={() => setActiveTab('roles-matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'roles-matrix'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>권한 매트릭스 (RBAC)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
