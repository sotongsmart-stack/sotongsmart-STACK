import React, { useState } from 'react';
import Markdown from 'react-markdown';
import confetti from 'canvas-confetti';
import { 
  Edit3, 
  Trash2, 
  Share2, 
  History, 
  MessageSquare, 
  HelpCircle, 
  Clock, 
  ShieldAlert, 
  Bookmark, 
  CheckSquare, 
  Sparkles, 
  Lock, 
  Globe, 
  Building2, 
  Users, 
  ArrowLeft, 
  CornerDownRight, 
  Download, 
  CheckCircle2, 
  Send, 
  Check, 
  Flame, 
  Activity, 
  Leaf, 
  Laptop, 
  LandPlot, 
  FileText,
  UserPlus
} from 'lucide-react';
import { useSafetyBrain } from '../context/SafetyBrainContext';
import { SafetyCategory, UserRole, AccessLevel } from '../types';

export const DocumentDetail: React.FC = () => {
  const { 
    currentDoc, 
    setCurrentDocId, 
    isEditing, 
    setIsEditing, 
    currentUser, 
    docs, 
    canEditDoc, 
    canDeleteDoc, 
    canManagePermissions, 
    toggleBookmark, 
    deleteDoc, 
    toggleChecklistItem, 
    addComment, 
    toggleCommentResolved, 
    updateDocPermissions, 
    restoreRevision,
    activeCollaboratorsOnDoc,
    simulateActiveTeamCollaboration,
    setIsAiModalOpen,
    setAiQuickPrompt
  } = useSafetyBrain();

  // Modals & Panels state
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPermissionOpen, setIsPermissionOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  // New Comment input
  const [commentInput, setCommentInput] = useState('');

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!currentDoc) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-2xs">
        <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <h3 className="text-base font-bold text-slate-700">선택된 안전 지침서가 없습니다</h3>
        <p className="text-xs text-slate-400 mt-1">왼쪽 지침서 목록에서 문서를 선택하거나 새로 작성해보세요.</p>
      </div>
    );
  }

  const hasEditPermission = canEditDoc(currentDoc, currentUser);
  const hasDeletePermission = canDeleteDoc(currentDoc, currentUser);
  const hasManagePermPermission = canManagePermissions(currentDoc, currentUser);

  // Category styling
  const getCategoryConfig = (cat: SafetyCategory) => {
    switch (cat) {
      case '지진안전': return { icon: LandPlot, text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
      case '화재안전': return { icon: Flame, text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' };
      case '응급처치': return { icon: Activity, text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' };
      case '환경안전': return { icon: Leaf, text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
      case '디지털안전': return { icon: Laptop, text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' };
      default: return { icon: FileText, text: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' };
    }
  };

  const catConfig = getCategoryConfig(currentDoc.category);
  const CatIcon = catConfig.icon;

  // Connected/Related Documents for Second Brain backlinks
  const relatedDocs = docs.filter(d => 
    currentDoc.relatedDocIds?.includes(d.id) || d.relatedDocIds?.includes(currentDoc.id)
  );

  // Handle Comment Submission
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(currentDoc.id, commentInput.trim());
    setCommentInput('');
  };

  // Handle Quiz Submission
  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    let correctCount = 0;
    currentDoc.quizzes?.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    if (correctCount === currentDoc.quizzes?.length && correctCount > 0) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  // Export to Markdown file
  const handleExportMarkdown = () => {
    const blob = new Blob([currentDoc.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentDoc.title}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col min-h-[700px] relative">
      
      {/* Top Action & Presence Bar */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        
        {/* Left: Category & Live Presence */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${catConfig.bg} ${catConfig.text} ${catConfig.border}`}>
            <CatIcon className="w-3.5 h-3.5" />
            {currentDoc.category}
          </span>

          <span className="text-xs text-slate-400 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
            {currentDoc.version}
          </span>

          {/* Active Collaborators Presence Bubble */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-500 hidden sm:inline">협업자:</span>
            <div className="flex -space-x-1.5 overflow-hidden">
              {activeCollaboratorsOnDoc.map(c => (
                <img
                  key={c.userId}
                  src={c.userAvatar}
                  alt={c.userName}
                  title={`${c.userName} (${c.userRole}) - ${c.activeAction === 'editing' ? '편집 중' : '열람 중'}`}
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover border border-slate-200 cursor-help"
                />
              ))}
            </div>
            <button
              onClick={simulateActiveTeamCollaboration}
              className="text-[10px] text-blue-600 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded font-semibold transition-colors"
              title="동료 강사 실시간 코멘트 및 공동 검토 시뮬레이션"
            >
              + 협업 시뮬레이션
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 flex-wrap">
          
          {/* Bookmark */}
          <button
            onClick={() => toggleBookmark(currentDoc.id)}
            title="북마크"
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <Bookmark className={`w-4 h-4 ${currentDoc.isBookmarked ? 'fill-amber-400 text-amber-500' : ''}`} />
          </button>

          {/* Comments Panel Toggle */}
          <button
            id="btn-doc-comments"
            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              isCommentsOpen 
                ? 'bg-blue-50 text-blue-700 border-blue-300' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>의견 ({currentDoc.comments?.length || 0})</span>
          </button>

          {/* History Revision Modal */}
          <button
            id="btn-doc-history"
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span>이력 ({currentDoc.revisions?.length || 1})</span>
          </button>

          {/* Safety Quiz Button */}
          {currentDoc.quizzes && currentDoc.quizzes.length > 0 && (
            <button
              id="btn-doc-quiz"
              onClick={() => {
                setQuizSubmitted(false);
                setSelectedAnswers({});
                setIsQuizModalOpen(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>안전 퀴즈 ({currentDoc.quizzes.length})</span>
            </button>
          )}

          {/* Permissions Settings (Admin or Instructor only) */}
          {hasManagePermPermission && (
            <button
              id="btn-doc-permissions"
              onClick={() => setIsPermissionOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
              title="문서별 권한 설정"
            >
              <Lock className="w-3.5 h-3.5 text-purple-600" />
              <span>권한</span>
            </button>
          )}

          {/* Export Markdown */}
          <button
            onClick={handleExportMarkdown}
            title="마크다운 다운로드"
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Edit Button with Permission Check */}
          {hasEditPermission ? (
            <button
              id="btn-doc-edit-mode"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>문서 수정</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-400 text-xs font-medium cursor-not-allowed" title="현재 계정 역할(VIEWER/GUEST)은 열람 전용입니다. 상단에서 강사 또는 관리자로 전환하여 수정 권한을 테스트할 수 있습니다.">
              <Lock className="w-3 h-3" />
              <span>열람 전용</span>
            </div>
          )}

          {/* Delete Button */}
          {hasDeletePermission && (
            <button
              id="btn-doc-delete"
              onClick={() => {
                if (window.confirm(`'${currentDoc.title}' 지침서를 삭제하시겠습니까?`)) {
                  deleteDoc(currentDoc.id);
                }
              }}
              title="문서 삭제"
              className="p-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Document Body */}
      <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6">
        
        {/* Title & Metadata Banner */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span>작성자: <strong className="text-slate-800 font-semibold">{currentDoc.authorName}</strong></span>
            <span>·</span>
            <span>최종 수정: <strong className="text-slate-800 font-semibold">{currentDoc.lastEditedByName}</strong></span>
            <span>·</span>
            <span>대상: <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-medium">{currentDoc.targetAudience}</span></span>
            <span>·</span>
            <span>난이도: <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-medium">{currentDoc.difficulty}</span></span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {currentDoc.title}
          </h1>

          {currentDoc.summary && (
            <p className="mt-3 text-sm text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 leading-relaxed">
              💡 <strong>개요 요약:</strong> {currentDoc.summary}
            </p>
          )}
        </div>

        {/* Emergency Callout Card (Golden Time & Emergency Hotline) */}
        {(currentDoc.goldenTime || currentDoc.emergencyContact) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentDoc.goldenTime && (
              <div className="bg-amber-500/10 border border-amber-300/80 rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
                    ⏱️ 생명 구조 골든타임
                  </span>
                  <p className="text-sm font-extrabold text-amber-950">
                    {currentDoc.goldenTime}
                  </p>
                </div>
              </div>
            )}

            {currentDoc.emergencyContact && (
              <div className="bg-rose-500/10 border border-rose-300/80 rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-500/20 text-rose-700 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wide">
                    🚨 긴급 상황 신고망
                  </span>
                  <p className="text-sm font-extrabold text-rose-950">
                    {currentDoc.emergencyContact}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Key Action Points Box */}
        {currentDoc.keyActionPoints && currentDoc.keyActionPoints.length > 0 && (
          <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/70 border border-blue-200/80 rounded-xl p-4 space-y-2">
            <div className="text-xs font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              김은경 마스터의 핵심 행동요령 (Core Action Points)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {currentDoc.keyActionPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-blue-100 text-xs text-slate-800">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="font-medium leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Checklist Section */}
        {currentDoc.checklists && currentDoc.checklists.length > 0 && (
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                현장 실전 안전 점검표 (Checklist)
              </span>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {currentDoc.checklists.filter(c => c.checked).length} / {currentDoc.checklists.length} 완료
              </span>
            </div>
            <div className="space-y-1.5">
              {currentDoc.checklists.map(item => (
                <label
                  key={item.id}
                  className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors border border-transparent hover:border-slate-200"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleChecklistItem(currentDoc.id, item.id)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 mt-0.5 cursor-pointer"
                  />
                  <span className={`text-xs ${item.checked ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Render Rich Markdown Content */}
        <div className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed border-t border-slate-100 pt-6">
          <Markdown>{currentDoc.content}</Markdown>
        </div>

        {/* Tags */}
        {currentDoc.tags && currentDoc.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-400 font-medium">연관 태그:</span>
            {currentDoc.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium hover:bg-slate-200 cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Second Brain Knowledge Network / Connected Backlinks */}
        {relatedDocs.length > 0 && (
          <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-xl border border-indigo-100 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <CornerDownRight className="w-4 h-4 text-indigo-600" />
                세컨드 브레인 상호 연결 지식 (Connected Safety Protocols)
              </span>
              <span className="text-[11px] text-indigo-600 font-medium">연계 지침서 {relatedDocs.length}건</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {relatedDocs.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => setCurrentDocId(rel.id)}
                  className="bg-white p-3 rounded-lg border border-indigo-100/80 hover:border-indigo-300 hover:shadow-xs cursor-pointer transition-all flex items-start justify-between gap-2 group"
                >
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                      {rel.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 mt-1 line-clamp-1">
                      {rel.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {rel.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Slide-over Comments Drawer */}
      {isCommentsOpen && (
        <div className="border-t border-slate-200 bg-slate-50 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              협업자 코멘트 및 의견 토론 ({currentDoc.comments?.length || 0})
            </h4>
            <button
              onClick={() => setIsCommentsOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              ✕ 닫기
            </button>
          </div>

          {/* Comments List */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {(!currentDoc.comments || currentDoc.comments.length === 0) ? (
              <p className="text-xs text-slate-400 py-3 text-center">등록된 의견이 없습니다. 첫 번째 검토 의견을 남겨보세요.</p>
            ) : (
              currentDoc.comments.map(comm => (
                <div key={comm.id} className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={comm.userAvatar} alt={comm.userName} className="w-5 h-5 rounded-full object-cover" />
                      <span className="font-bold text-slate-800">{comm.userName}</span>
                      <span className="text-[10px] px-1 py-0.2 rounded bg-slate-100 text-slate-500 font-mono">{comm.userRole}</span>
                    </div>
                    <button
                      onClick={() => toggleCommentResolved(currentDoc.id, comm.id)}
                      className={`text-[11px] flex items-center gap-1 px-1.5 py-0.5 rounded font-medium ${
                        comm.resolved ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      {comm.resolved ? '해결됨' : '미해결'}
                    </button>
                  </div>
                  <p className="text-slate-700 pl-7 leading-relaxed">{comm.content}</p>
                </div>
              ))
            )}
          </div>

          {/* New Comment Input */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="문서 검토 의견, 수정 제안 또는 현장 피드백 입력..."
              className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>등록</span>
            </button>
          </form>
        </div>
      )}

      {/* Version History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">문서 수정 이력 및 버전 관리</h3>
              </div>
              <button onClick={() => setIsHistoryOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {currentDoc.revisions?.map((rev, idx) => (
                <div key={rev.id || idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {rev.version}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{rev.editorName}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(rev.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{rev.summary}</p>
                  
                  {rev.contentSnapshot && currentUser.role === 'ADMIN' && (
                    <button
                      onClick={() => {
                        if (window.confirm(`'${rev.version}' 버전 내용으로 롤백 복원하시겠습니까?`)) {
                          restoreRevision(currentDoc.id, rev.id);
                          setIsHistoryOpen(false);
                        }
                      }}
                      className="text-[11px] text-blue-600 hover:underline font-semibold"
                    >
                      이 버전으로 롤백 복원
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t text-right">
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Settings Modal */}
      {isPermissionOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">문서별 권한 설정</h3>
              </div>
              <button onClick={() => setIsPermissionOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">문서 공개 수준 (Access Level)</label>
                <select
                  value={currentDoc.accessLevel}
                  onChange={(e) => updateDocPermissions(
                    currentDoc.id,
                    e.target.value as AccessLevel,
                    currentDoc.allowedRoles,
                    currentDoc.editRoles,
                    currentDoc.allowedUserIds,
                    currentDoc.editUserIds
                  )}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none"
                >
                  <option value="PUBLIC">🌐 전체 공개 (게스트 포함 누구나 열람 가능)</option>
                  <option value="ORG_WIDE">🏢 조직 내부 (조직원 전체 열람, 게스트 제외)</option>
                  <option value="RESTRICTED">🔒 지정 역할 제한 (선택된 역할만 열람)</option>
                  <option value="PRIVATE">👤 비공개 (작성자 및 지정된 사용자만 열람)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">수정 가능 역할 (Edit Roles)</label>
                <div className="flex flex-wrap gap-2">
                  {(['ADMIN', 'INSTRUCTOR', 'EDITOR'] as UserRole[]).map(role => {
                    const hasRole = currentDoc.editRoles?.includes(role);
                    return (
                      <button
                        key={role}
                        onClick={() => {
                          const nextRoles = hasRole 
                            ? currentDoc.editRoles.filter(r => r !== role)
                            : [...currentDoc.editRoles, role];
                          updateDocPermissions(
                            currentDoc.id,
                            currentDoc.accessLevel,
                            currentDoc.allowedRoles,
                            nextRoles,
                            currentDoc.allowedUserIds,
                            currentDoc.editUserIds
                          );
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors ${
                          hasRole ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t text-right">
              <button
                onClick={() => setIsPermissionOpen(false)}
                className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                설정 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safety Quiz Modal */}
      {isQuizModalOpen && currentDoc.quizzes && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{currentDoc.title}</h3>
                  <p className="text-xs text-slate-500">실전 상황 대처 안전 평가 퀴즈</p>
                </div>
              </div>
              <button onClick={() => setIsQuizModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-6">
              {currentDoc.quizzes.map((quiz, qIdx) => (
                <div key={quiz.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      Q{qIdx + 1}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {quiz.question}
                    </h4>
                  </div>

                  {/* Options */}
                  <div className="space-y-1.5 pl-7">
                    {quiz.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[quiz.id] === optIdx;
                      const isCorrect = quiz.correctIndex === optIdx;

                      let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50';
                      if (quizSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-red-50 border-red-300 text-red-900';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-1 ring-blue-500';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => setSelectedAnswers(prev => ({ ...prev, [quiz.id]: optIdx }))}
                          className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{optIdx + 1}. {opt}</span>
                          {quizSubmitted && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {quizSubmitted && (
                    <div className="pl-7 pt-2 text-[11px] text-slate-600 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-200/60 leading-relaxed">
                      💡 <strong>김은경 강사 해설:</strong> {quiz.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quiz Footer */}
            <div className="flex items-center justify-between pt-3 border-t">
              <span className="text-xs text-slate-500">
                {Object.keys(selectedAnswers).length} / {currentDoc.quizzes.length} 문제 선택됨
              </span>
              <div className="flex items-center gap-2">
                {!quizSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(selectedAnswers).length < currentDoc.quizzes.length}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    정답 확인 및 채점
                  </button>
                ) : (
                  <button
                    onClick={() => setIsQuizModalOpen(false)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    완료 및 닫기
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
