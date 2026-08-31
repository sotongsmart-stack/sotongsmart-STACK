import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { 
  Save, 
  X, 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  PhoneCall, 
  CheckSquare, 
  Plus, 
  Trash2, 
  Flame, 
  Activity, 
  Leaf, 
  Laptop, 
  LandPlot, 
  Eye, 
  Code2, 
  Columns,
  Lock,
  Layers
} from 'lucide-react';
import { useSafetyBrain } from '../context/SafetyBrainContext';
import { SafetyCategory, TargetAudience, DifficultyLevel, PriorityLevel, AccessLevel, DocStatus } from '../types';

export const DocumentEditor: React.FC = () => {
  const { currentDoc, updateDoc, setIsEditing, currentUser } = useSafetyBrain();

  if (!currentDoc) return null;

  // Form State
  const [title, setTitle] = useState(currentDoc.title);
  const [category, setCategory] = useState<SafetyCategory>(currentDoc.category);
  const [summary, setSummary] = useState(currentDoc.summary);
  const [content, setContent] = useState(currentDoc.content);
  const [goldenTime, setGoldenTime] = useState(currentDoc.goldenTime || '');
  const [emergencyContact, setEmergencyContact] = useState(currentDoc.emergencyContact || '');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>(currentDoc.targetAudience);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(currentDoc.difficulty);
  const [priority, setPriority] = useState<PriorityLevel>(currentDoc.priority);
  const [status, setStatus] = useState<DocStatus>(currentDoc.status);
  const [accessLevel, setAccessLevel] = useState<AccessLevel>(currentDoc.accessLevel);
  const [tagsInput, setTagsInput] = useState(currentDoc.tags?.join(', ') || '');
  const [keyActions, setKeyActions] = useState<string[]>(currentDoc.keyActionPoints || []);
  const [checklists, setChecklists] = useState(currentDoc.checklists || []);
  const [changeLog, setChangeLog] = useState('');
  
  // Editor view mode (split, editor only, preview only)
  const [editorMode, setEditorMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const categories: SafetyCategory[] = ['지진안전', '화재안전', '응급처치', '환경안전', '디지털안전'];
  const audiences: TargetAudience[] = ['전체', '초·중·고교', '일반시민', '사업장근로자', '관리감독자', '전문강사진'];
  const difficulties: DifficultyLevel[] = ['기초(입문)', '실무(표준)', '심화(전문가)', '비상대응훈련'];
  const priorities: PriorityLevel[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

  // Quick Snippet Inserter
  const insertSnippet = (snippet: string) => {
    setContent(prev => prev + '\n\n' + snippet);
  };

  // AI Auto-completion / Enrichment
  const handleAiEnrich = async () => {
    if (!title.trim()) {
      alert('AI가 교안을 생성할 수 있도록 제목이나 주제를 먼저 입력해 주세요.');
      return;
    }
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/gemini/generate-safety-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: title,
          category,
          targetAudience,
          difficulty,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const d = data.data;
        if (d.title) setTitle(d.title);
        if (d.summary) setSummary(d.summary);
        if (d.content) setContent(d.content);
        if (Array.isArray(d.keyActionPoints) && d.keyActionPoints.length > 0) {
          setKeyActions(d.keyActionPoints);
        }
        if (Array.isArray(d.checklist) && d.checklist.length > 0) {
          setChecklists(d.checklist.map((c: string, idx: number) => ({
            id: `chk-${Date.now()}-${idx}`,
            text: c,
            checked: false,
          })));
        }
        if (Array.isArray(d.tags) && d.tags.length > 0) {
          setTagsInput(d.tags.join(', '));
        }
        setChangeLog('AI 김은경 세컨드 브레인 교안 자동 생성 및 표준 지침 적용');
      } else {
        alert('AI 생성 중 오류가 발생했습니다: ' + (data.error || '응답 오류'));
      }
    } catch (e: any) {
      console.error(e);
      alert('AI 서버 연결에 실패했습니다: ' + e.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Save Document
  const handleSave = () => {
    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    updateDoc(
      currentDoc.id,
      {
        title,
        category,
        summary,
        content,
        goldenTime,
        emergencyContact,
        targetAudience,
        difficulty,
        priority,
        status,
        accessLevel,
        tags: parsedTags,
        keyActionPoints: keyActions.filter(Boolean),
        checklists: checklists.filter(c => c.text.trim() !== ''),
      },
      changeLog || '지침서 내용 및 행동요령 수정 업데이트'
    );

    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-[750px] relative">
      
      {/* Top Header Controls */}
      <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
          <span className="text-xs font-bold text-slate-800">
            실시간 교안 편집 모드 ({currentUser.name} {currentUser.role})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Enrich Button */}
          <button
            onClick={handleAiEnrich}
            disabled={isAiLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg text-xs font-bold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-xs disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : 'text-amber-300'}`} />
            <span>{isAiLoading ? 'AI 지침서 생성 중...' : 'AI 표준 교안 자동 완성'}</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg p-0.5">
            <button
              onClick={() => setEditorMode('edit')}
              className={`p-1.5 rounded text-xs ${editorMode === 'edit' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600'}`}
              title="편집기만 보기"
            >
              <Code2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setEditorMode('split')}
              className={`p-1.5 rounded text-xs ${editorMode === 'split' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600'}`}
              title="분할 화면"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setEditorMode('preview')}
              className={`p-1.5 rounded text-xs ${editorMode === 'preview' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600'}`}
              title="미리보기만"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cancel */}
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
          >
            취소
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>저장 및 배포</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="p-6 space-y-5 flex-1 overflow-y-auto">
        
        {/* Title Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">지침서 제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 4분 골든타임: 표준 심폐소생술(CPR) 및 AED 실전 가이드"
            className="w-full text-base sm:text-lg font-bold px-3.5 py-2 border border-slate-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Metadata Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Category */}
          <div>
            <label className="block font-bold text-slate-600 mb-1">안전 분야 분류</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as SafetyCategory)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none font-semibold text-slate-800"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block font-bold text-slate-600 mb-1">교육 대상</label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value as TargetAudience)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
            >
              {audiences.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block font-bold text-slate-600 mb-1">난이도</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
            >
              {difficulties.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block font-bold text-slate-600 mb-1">우선순위</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as PriorityLevel)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
            >
              <option value="CRITICAL">🚨 CRITICAL (긴급)</option>
              <option value="HIGH">⚡ HIGH (높음)</option>
              <option value="MEDIUM">MEDIUM (보통)</option>
              <option value="LOW">LOW (낮음)</option>
            </select>
          </div>

          {/* Golden Time */}
          <div>
            <label className="block font-bold text-slate-600 mb-1">골든타임 (선택)</label>
            <input
              type="text"
              value={goldenTime}
              onChange={(e) => setGoldenTime(e.target.value)}
              placeholder="예: 4분 (뇌손상 방지)"
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none text-xs"
            />
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block font-bold text-slate-600 mb-1">비상 연락망</label>
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="예: 119 구급상황관리센터"
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none text-xs"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block font-bold text-slate-600 mb-1">문서 상태</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as DocStatus)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
            >
              <option value="PUBLISHED">최종 발행 (PUBLISHED)</option>
              <option value="REVIEW">검토 중 (REVIEW)</option>
              <option value="DRAFT">초안 (DRAFT)</option>
              <option value="ARCHIVED">보관됨 (ARCHIVED)</option>
            </select>
          </div>

          {/* Access Level */}
          <div>
            <label className="block font-bold text-slate-600 mb-1">공개 범위</label>
            <select
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value as AccessLevel)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
            >
              <option value="PUBLIC">전체 공개 (PUBLIC)</option>
              <option value="ORG_WIDE">조직 내부 (ORG_WIDE)</option>
              <option value="RESTRICTED">역할 제한 (RESTRICTED)</option>
              <option value="PRIVATE">비공개 (PRIVATE)</option>
            </select>
          </div>

        </div>

        {/* Summary Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">핵심 요약 (Summary)</label>
          <textarea
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="지침서의 핵심 요지와 긴급 대처 목표를 간략히 기술하세요."
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:border-blue-500"
          />
        </div>

        {/* Quick Safety Snippet Palette */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500">안전 템플릿 삽입:</span>
          <button
            onClick={() => insertSnippet('## 🚨 1. 비상 골든타임 행동 프로토콜\n- **1단계**: \n- **2단계**: \n- **3단계**: ')}
            className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-xs text-slate-700"
          >
            🚨 비상 프로토콜
          </button>
          <button
            onClick={() => insertSnippet('> ⚠️ **주의사항 (Caution)**: 위험 요소를 확인하기 전 무단 진입을 엄금합니다.')}
            className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-xs text-amber-700"
          >
            ⚠️ 주의 경고 콜아웃
          </button>
          <button
            onClick={() => insertSnippet('```\n[단계 1: 신속 인지] -> [단계 2: 119 신고 및 차단] -> [단계 3: 안전 대피]\n```')}
            className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-xs text-blue-700"
          >
            🔄 흐름 다이어그램
          </button>
          <button
            onClick={() => insertSnippet('| 점검 항목 | 점검 주기 | 담당자 |\n|---|---|---|\n| 소화기 압력 게이지 | 매월 1회 | 안전관리자 |')}
            className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-xs text-emerald-700"
          >
            📊 안전 점검표 표
          </button>
        </div>

        {/* Editor Main Canvas (Split / Edit / Preview) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[420px]">
          {/* Markdown Input Area */}
          {(editorMode === 'edit' || editorMode === 'split') && (
            <div className={`flex flex-col ${editorMode === 'edit' ? 'md:col-span-2' : ''}`}>
              <div className="text-xs font-bold text-slate-500 mb-1 flex items-center justify-between">
                <span>마크다운 교안 본문 (Markdown Source)</span>
                <span className="text-[11px] text-slate-400 font-mono">{content.length} 글자</span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="지침서 본문을 마크다운 형식으로 작성하세요."
                className="w-full flex-1 p-3.5 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl outline-none resize-none border border-slate-800 focus:ring-1 focus:ring-blue-500 leading-relaxed"
              />
            </div>
          )}

          {/* Live Preview Area */}
          {(editorMode === 'preview' || editorMode === 'split') && (
            <div className={`flex flex-col ${editorMode === 'preview' ? 'md:col-span-2' : ''}`}>
              <div className="text-xs font-bold text-slate-500 mb-1">
                실시간 렌더링 미리보기 (Live Preview)
              </div>
              <div className="w-full flex-1 p-4 bg-slate-50 rounded-xl border border-slate-200 overflow-y-auto text-xs prose prose-slate max-w-none">
                <Markdown>{content || '*내용이 없습니다.*'}</Markdown>
              </div>
            </div>
          )}
        </div>

        {/* Key Action Points Builder */}
        <div className="space-y-2 pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
              핵심 행동요령 리스트 (Key Action Points)
            </span>
            <button
              onClick={() => setKeyActions(prev => [...prev, ''])}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <Plus className="w-3 h-3" /> 항목 추가
            </button>
          </div>

          <div className="space-y-2">
            {keyActions.map((action, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={action}
                  onChange={(e) => {
                    const next = [...keyActions];
                    next[idx] = e.target.value;
                    setKeyActions(next);
                  }}
                  placeholder="예: 젖은 수건으로 코와 입을 막고 자세를 낮춰 비상구로 이동"
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none"
                />
                <button
                  onClick={() => setKeyActions(prev => prev.filter((_, i) => i !== idx))}
                  className="text-slate-400 hover:text-red-600 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tags & Change Log */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">태그 (쉼표로 구분)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="예: 심폐소생술, 골든타임, AED, 응급구조"
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">이번 버전 수정 사유 (Change Log)</label>
            <input
              type="text"
              value={changeLog}
              onChange={(e) => setChangeLog(e.target.value)}
              placeholder="예: 2026 최신 소방 방재 기준 반영 및 완강기 착용 가이드 보완"
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none"
            />
          </div>
        </div>

      </div>

    </div>
  );
};
