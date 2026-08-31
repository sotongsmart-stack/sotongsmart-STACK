/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SafetyBrainProvider, useSafetyBrain } from './context/SafetyBrainContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { FilterBar } from './components/FilterBar';
import { DocumentList } from './components/DocumentList';
import { DocumentDetail } from './components/DocumentDetail';
import { DocumentEditor } from './components/DocumentEditor';
import { KnowledgeGraph } from './components/KnowledgeGraph';
import { CollaborativeRoom } from './components/CollaborativeRoom';
import { RoleManagementModal } from './components/RoleManagementModal';
import { QuizCenter } from './components/QuizCenter';
import { AiAssistantModal } from './components/AiAssistantModal';
import { PlusCircle, Sparkles, BookOpen, Shield } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    activeTab, 
    isEditing, 
    setIsEditing, 
    currentDoc, 
    createDoc, 
    currentUser, 
    canEditDoc,
    setIsAiModalOpen
  } = useSafetyBrain();

  const handleCreateNewDoc = () => {
    createDoc({
      title: '새로운 안전 지침서 (초안)',
      category: '화재안전',
      summary: '지침서의 핵심 요약 및 긴급 행동 수칙을 입력하세요.',
      content: '## 🚨 1. 비상 골든타임 행동 프로토콜\n- **1단계**: 신속 상황 전파 및 119 신고\n- **2단계**: 초기 방재 조치 및 방화문 폐쇄\n- **3단계**: 안전 집결지로 신속 대피\n\n## 📋 2. 현장 핵심 안전 점검 사항\n- 비상구 유도등 점등 여부 점검\n- 소화기 충약 압력 게이지 녹색 정상 범위 확인',
      targetAudience: '사업장근로자',
      difficulty: '실무(표준)',
      priority: 'HIGH',
      status: 'DRAFT',
      accessLevel: 'ORG_WIDE',
      tags: ['신규교안', '김은경안전'],
      keyActionPoints: [
        '상황 발생 즉시 육성 전파 및 비상벨 작동',
        '유도등을 따라 낮은 자세로 피난 계단 이동',
      ],
      checklists: [
        { id: `chk-${Date.now()}-1`, text: '현장 비상 연락망 정상 작동 확인', checked: false },
        { id: `chk-${Date.now()}-2`, text: '소방 방재 장비 및 방호복 상태 점검', checked: false },
      ],
    });
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans antialiased">
      {/* Global Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col space-y-6">
        
        {/* TAB 1: Documents & Second Brain Knowledge Base */}
        {activeTab === 'docs' && (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Left Sidebar (5 Categories & Smart Filters) */}
            <Sidebar />

            {/* Right Main Content Area */}
            <div className="flex-1 w-full space-y-5">
              
              {/* Dashboard Section Title */}
              {!isEditing && (
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-slate-800">통합 지식 대시보드</h2>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                        Second Brain
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm mt-0.5">
                      모든 안전 교육 자료와 협업 현황을 한눈에 관리합니다.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAiModalOpen(true)}
                      className="px-3.5 py-2 border border-slate-300 rounded-lg bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>AI 교안 자문</span>
                    </button>

                    <button
                      onClick={handleCreateNewDoc}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>신규 문서 작성</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Multi-Criteria Filter Bar */}
              {!isEditing && <FilterBar />}

              {/* Document List & Active Viewer / Editor */}
              {isEditing ? (
                <DocumentEditor />
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                  {/* Document Grid/List column */}
                  <div className="xl:col-span-5 space-y-4">
                    <DocumentList />
                  </div>

                  {/* Document Full Detail Reader column */}
                  <div className="xl:col-span-7">
                    <DocumentDetail />
                  </div>
                </div>
              )}

              {/* Real-Time Collaboration Active Callout Banner */}
              {!isEditing && (
                <div className="bg-slate-900 rounded-xl p-4 text-white flex flex-wrap items-center justify-between gap-4 shadow-lg mt-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 absolute -right-0.5 -bottom-0.5 animate-pulse"></div>
                      <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-lg">💬</div>
                    </div>
                    <div>
                      <p className="text-sm font-bold italic">
                        "{currentUser.name}님, 현재 지진·화재·응급처치 문서에서 {currentUser.role === 'ADMIN' ? '팀원들이' : '강사진이'} 협업 중입니다."
                      </p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">
                        Real-time Collaboration Active
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (activeTab === 'docs') {
                        // Switch or open collab room
                        const elem = document.getElementById('btn-doc-comments');
                        if (elem) elem.click();
                      }
                    }}
                    className="bg-slate-700 hover:bg-slate-600 text-xs px-4 py-2 rounded-lg font-bold transition-colors text-white shadow-xs"
                  >
                    참여하기
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 2: Second Brain Knowledge Graph */}
        {activeTab === 'graph' && <KnowledgeGraph />}

        {/* TAB 3: Real-Time Collaborative Room */}
        {activeTab === 'collab-room' && <CollaborativeRoom />}

        {/* TAB 4: Safety Quiz Assessment Center */}
        {activeTab === 'quiz-center' && <QuizCenter />}

        {/* TAB 5: Role-based Access Control (RBAC) */}
        {activeTab === 'roles-matrix' && <RoleManagementModal />}

      </main>

      {/* Global AI Assistant Modal */}
      <AiAssistantModal />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>© 2026 안전교육자 김은경의 세컨드 브레인 (Safety Education Second Brain) · Professional Polish Edition</span>
          <div className="flex items-center gap-3 text-slate-400 font-medium">
            <span>지진안전</span> · 
            <span>화재안전</span> · 
            <span>응급처치</span> · 
            <span>환경안전</span> · 
            <span>디지털안전</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <SafetyBrainProvider>
      <MainLayout />
    </SafetyBrainProvider>
  );
}

