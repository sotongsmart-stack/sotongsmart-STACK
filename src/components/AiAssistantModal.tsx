import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { 
  Sparkles, 
  Send, 
  X, 
  HelpCircle, 
  FilePlus, 
  Flame, 
  Activity, 
  Leaf, 
  Laptop, 
  LandPlot, 
  Bot, 
  User, 
  Copy, 
  Check,
  RefreshCcw,
  Zap
} from 'lucide-react';
import { useSafetyBrain } from '../context/SafetyBrainContext';
import { SafetyCategory } from '../types';

export const AiAssistantModal: React.FC = () => {
  const { 
    isAiModalOpen, 
    setIsAiModalOpen, 
    aiQuickPrompt, 
    setAiQuickPrompt,
    createDoc,
    setCurrentDocId,
    setActiveTab,
    setIsEditing
  } = useSafetyBrain();

  const [input, setInput] = useState('');
  const [category, setCategory] = useState<SafetyCategory>('응급처치');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; data?: any }>>([
    {
      role: 'assistant',
      text: `안녕하세요! **안전교육자 김은경의 세컨드 브레인 AI 어드바이저**입니다. 
지진안전, 화재안전, 응급처치, 환경안전, 디지털안전 5대 분야의 표준 지침서 생성, 비상 상황별 골든타임 행동요령 자문, 훈련 퀴즈 출제 등을 도와드립니다. 무엇을 도와드릴까요?`,
    },
  ]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (aiQuickPrompt && isAiModalOpen) {
      setInput(aiQuickPrompt);
      setAiQuickPrompt('');
    }
  }, [aiQuickPrompt, isAiModalOpen, setAiQuickPrompt]);

  if (!isAiModalOpen) return null;

  const quickPrompts = [
    { label: '🧯 리튬 배터리 화재 대응법', text: '전기차 및 전동 킥보드 리튬 배터리 열폭주 화재 시 질식소화포 및 특수 D급 소화기 대응 지침을 정리해줘.', cat: '화재안전' as SafetyCategory },
    { label: '❤️ 영유아 기도폐쇄 응급처치', text: '영유아(1세 미만) 기도폐쇄 발생 시 5회 등 두드리기 및 5회 가슴 압박 하임리히법 절차를 알려줘.', cat: '응급처치' as SafetyCategory },
    { label: '🏢 지진 발생 시 실내 대피 3원칙', text: '규모 6.0 이상 지진 발생 시 사무실/교실 내 3대 행동요령(몸 보호, 출구 확보, 화재 차단)을 체계화해줘.', cat: '지진안전' as SafetyCategory },
    { label: '☣️ 불산 누출 시 비상 방재', text: '공장 내 불산(HF) 누출 시 화학보호복 착용, 풍상 대피, 석회수 중화 처리 절차를 알려줘.', cat: '환경안전' as SafetyCategory },
    { label: '💻 랜섬웨어 감염 즉시 대응', text: '사내 PC 랜섬웨어 의심 감염 시 LAN선 분리, 비상 연락망 가동, KISA 118 신고 절차를 가이드해줘.', cat: '디지털안전' as SafetyCategory },
  ];

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = { role: 'user' as const, text: textToSend.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/safety-consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend.trim(),
          category,
        }),
      });
      const data = await res.json();
      if (data.success && data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: `⚠️ AI 응답 생성 중 문제가 발생했습니다: ${data.error || '응답 없음'}` }]);
      }
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'assistant', text: `⚠️ 서버 통신 에러: ${e.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert AI reply into a real SafetyDoc in the second brain
  const handleConvertToDoc = (text: string) => {
    const newDocId = createDoc({
      title: `${category} 실전 대응 표준 지침서 (AI 김은경 세컨드 브레인)`,
      category,
      summary: text.slice(0, 140) + '...',
      content: text,
      targetAudience: '사업장근로자',
      difficulty: '실무(표준)',
      priority: 'HIGH',
      status: 'DRAFT',
      accessLevel: 'ORG_WIDE',
      tags: ['AI지침서', category, '김은경세컨드브레인'],
      keyActionPoints: [
        '현장 상황 파악 및 비상 연락망 즉각 가동',
        '표준 방재 및 응급처치 수칙에 따른 단계별 대처',
      ],
      checklists: [
        { id: `chk-${Date.now()}-1`, text: '현장 1차 비상 신고 완료', checked: false },
        { id: `chk-${Date.now()}-2`, text: '대피 경로 확보 및 2차 피해 방지', checked: false },
      ],
    });

    setIsAiModalOpen(false);
    setCurrentDocId(newDocId);
    setActiveTab('docs');
    setIsEditing(true);
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold flex items-center gap-1.5">
                김은경 안전 어드바이저 AI (Gemini 2.5)
              </h3>
              <p className="text-[11px] text-blue-200">
                조직 맞춤형 안전 지침서 작성 및 실시간 위기 대응 프로토콜 자문
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAiModalOpen(false)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Category Selector */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          <span className="text-slate-500 font-semibold shrink-0">전문 상담 분야:</span>
          {(['지진안전', '화재안전', '응급처치', '환경안전', '디지털안전'] as SafetyCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                category === cat
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 font-bold">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3.5 rounded-2xl space-y-2 shadow-2xs ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none'
                }`}
              >
                <div className="prose prose-slate max-w-none text-xs leading-relaxed">
                  <Markdown>{msg.text}</Markdown>
                </div>

                {/* Assistant actions: Copy & Convert to Document */}
                {msg.role === 'assistant' && idx !== 0 && (
                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleCopy(msg.text, idx)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
                    >
                      {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIdx === idx ? '복사됨' : '내용 복사'}</span>
                    </button>

                    <button
                      onClick={() => handleConvertToDoc(msg.text)}
                      className="text-[11px] text-blue-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <FilePlus className="w-3.5 h-3.5" />
                      <span>이 내용으로 신규 지침서 생성</span>
                    </button>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-blue-700 text-white flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 text-xs justify-start animate-pulse">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 rounded-tl-none">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                  김은경 세컨드 브레인 지식베이스를 분석하여 전문 지침을 작성 중입니다...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
          <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="text-slate-400 text-[11px] shrink-0 font-medium">추천 질문:</span>
          {quickPrompts.map((q, i) => (
            <button
              key={i}
              onClick={() => {
                setCategory(q.cat);
                handleSend(q.text);
              }}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600 text-xs shrink-0 whitespace-nowrap transition-colors"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="예: 지진 발생 시 영유아 대피 요령, 전기화재 소화 방법, 피싱 예방 수칙 질의..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-blue-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>전송</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
