import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Send, 
  Flame, 
  Activity, 
  RefreshCw,
  Eye,
  Edit3,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { useSafetyBrain } from '../context/SafetyBrainContext';

export const CollaborativeRoom: React.FC = () => {
  const { 
    currentUser, 
    users, 
    docs, 
    collaborators, 
    setCurrentDocId, 
    setActiveTab, 
    setIsEditing,
    simulateActiveTeamCollaboration,
    addComment
  } = useSafetyBrain();

  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [messages, setMessages] = useState<Array<{ id: string; user: any; text: string; time: string }>>([
    {
      id: 'm-1',
      user: users[0], // 김은경
      text: '안전팀 전원: 2026년도 신규 심폐소생술 가이드라인 및 사업장 소방시설 점검표를 개정 중입니다. 각 담당 강사님들은 실시간 검토를 부탁드립니다.',
      time: '10분 전',
    },
    {
      id: 'm-2',
      user: users[1], // 박준호
      text: '박준호 강사: 응급처치 4분 골든타임 섹션에 AED 음성 지시 관련 2026 개정 내용을 반영 완료했습니다.',
      time: '5분 전',
    },
    {
      id: 'm-3',
      user: users[2], // 이서연
      text: '이서연 연구원: 유해화학물질 방재 매뉴얼의 풍상 대피 경로 다이어그램 검토 완료했습니다.',
      time: '방금 전',
    },
  ]);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;

    setMessages(prev => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        user: currentUser,
        text: broadcastMsg.trim(),
        time: '방금',
      }
    ]);
    setBroadcastMsg('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                실시간 협업 채널 온라인
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {collaborators.length}명 참여 중
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              안전교육자 김은경 세컨드 브레인 <span className="text-blue-400">실시간 협업룸</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              조직 내 전문 강사진 및 안전관리자가 표준 지침서를 공동 집필하고, 변경 사항을 실시간으로 상호 검토 및 배포하는 통합 협업 공간입니다.
            </p>
          </div>

          <button
            onClick={simulateActiveTeamCollaboration}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20"
          >
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
            <span>협업 시뮬레이션 발동</span>
          </button>
        </div>
      </div>

      {/* Grid: Active Workspaces & Live Team Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Active Collaborative Documents */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-blue-600" />
              현재 팀원들이 동시 열람/수정 중인 안전 지침서
            </h3>
            <span className="text-xs text-slate-400 font-medium">실시간 동기화 상태</span>
          </div>

          <div className="space-y-3">
            {docs.map(doc => {
              const activeOnDoc = collaborators.filter(c => c.currentDocId === doc.id);

              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 transition-all shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {doc.category}
                      </span>
                      <span className="text-xs font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {doc.version}
                      </span>
                    </div>

                    {/* Active collaborators badge */}
                    <div className="flex items-center gap-2">
                      {activeOnDoc.length > 0 ? (
                        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{activeOnDoc.length}명 작업 중</span>
                          <div className="flex -space-x-1 ml-1">
                            {activeOnDoc.map(c => (
                              <img
                                key={c.userId}
                                src={c.userAvatar}
                                alt={c.userName}
                                title={c.userName}
                                className="w-4 h-4 rounded-full ring-1 ring-white object-cover"
                              />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">대기 상태</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{doc.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">{doc.summary}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <span>최종 수정: <strong>{doc.lastEditedByName}</strong></span>
                      <span>·</span>
                      <span>코멘트 {doc.comments?.length || 0}건</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setCurrentDocId(doc.id);
                          setIsEditing(false);
                          setActiveTab('docs');
                        }}
                        className="flex items-center gap-1 text-blue-600 hover:underline font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" /> 열람
                      </button>
                      <button
                        onClick={() => {
                          setCurrentDocId(doc.id);
                          setIsEditing(true);
                          setActiveTab('docs');
                        }}
                        className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1 rounded text-xs font-bold transition-colors"
                      >
                        <Edit3 className="w-3 h-3" /> 공동 편집 진입
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Live Peer Discussion & Activity Log */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              팀 안전 피드백 & 공지
            </h3>
            <span className="text-xs text-slate-400">실시간 피드</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col h-[560px] justify-between">
            
            {/* Message Stream */}
            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {messages.map(msg => (
                <div key={msg.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <img src={msg.user.avatarUrl} alt={msg.user.name} className="w-5 h-5 rounded-full object-cover" />
                      <span className="font-bold text-slate-800">{msg.user.name}</span>
                      <span className="text-[10px] px-1 rounded bg-slate-200 text-slate-600 font-mono">
                        {msg.user.role}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{msg.time}</span>
                  </div>
                  <p className="text-slate-700 pl-6 leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Broadcast input */}
            <form onSubmit={handleSendBroadcast} className="pt-3 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                placeholder="팀원들에게 공유할 안전 피드백 작성..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>

      </div>

    </div>
  );
};
