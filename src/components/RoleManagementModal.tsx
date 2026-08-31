import React from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  Check, 
  X, 
  Users, 
  Key, 
  Info,
  Building,
  Mail
} from 'lucide-react';
import { useSafetyBrain } from '../context/SafetyBrainContext';
import { UserRole } from '../types';

export const RoleManagementModal: React.FC = () => {
  const { users, currentUser, setCurrentUser } = useSafetyBrain();

  const roleCapabilities: Array<{
    capability: string;
    description: string;
    ADMIN: boolean;
    INSTRUCTOR: boolean;
    EDITOR: boolean;
    VIEWER: boolean;
    GUEST: boolean;
  }> = [
    {
      capability: '전체 안전 지침서 열람 (Read All Docs)',
      description: '비공개 및 권한 제한 문서를 포함한 모든 교안 열람',
      ADMIN: true,
      INSTRUCTOR: true,
      EDITOR: true,
      VIEWER: true,
      GUEST: false,
    },
    {
      capability: '공개 지침서 열람 (Read Public Docs)',
      description: '게스트 및 일반 대중 대상 안전 가이드라인 열람',
      ADMIN: true,
      INSTRUCTOR: true,
      EDITOR: true,
      VIEWER: true,
      GUEST: true,
    },
    {
      capability: '신규 지침서 생성 및 편집 (Create & Edit)',
      description: '새로운 표준 교안 작성 및 마크다운 편집기 사용',
      ADMIN: true,
      INSTRUCTOR: true,
      EDITOR: true,
      VIEWER: false,
      GUEST: false,
    },
    {
      capability: '공동 검토 코멘트 등록 및 피드백 (Comment)',
      description: '실시간 협업 및 지침서별 검토 코멘트 스레드 참여',
      ADMIN: true,
      INSTRUCTOR: true,
      EDITOR: true,
      VIEWER: true,
      GUEST: false,
    },
    {
      capability: '문서 공식 발행 및 상태 변경 (Publishing)',
      description: '초안/검토 중인 문서를 전사 표준(PUBLISHED)으로 승인',
      ADMIN: true,
      INSTRUCTOR: true,
      EDITOR: false,
      VIEWER: false,
      GUEST: false,
    },
    {
      capability: '문서별 세부 접근 권한 설정 (ACL Config)',
      description: '문서의 공개 범위(Public/Org/Restricted/Private) 제어',
      ADMIN: true,
      INSTRUCTOR: true,
      EDITOR: false,
      VIEWER: false,
      GUEST: false,
    },
    {
      capability: '버전 히스토리 롤백 복원 (Version Rollback)',
      description: '이전 수정 버전 스냅샷으로 문서를 안전하게 복원',
      ADMIN: true,
      INSTRUCTOR: false,
      EDITOR: false,
      VIEWER: false,
      GUEST: false,
    },
    {
      capability: '지침서 영구 삭제 (Delete Documents)',
      description: '오래되거나 폐기된 안전 교안의 영구 삭제',
      ADMIN: true,
      INSTRUCTOR: false,
      EDITOR: false,
      VIEWER: false,
      GUEST: false,
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-700 font-bold text-xs">
              <Lock className="w-4 h-4" />
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              사용자 역할 기반 권한 제어 매트릭스 (RBAC Matrix)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            조직 내 안전 전문가, 강사, 담당자, 교육생별 보안 권한과 승인 체계를 관리합니다.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span className="text-slate-500">현재 활성 사용자:</span>
          <span className="font-bold text-slate-900">{currentUser.name}</span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
            {currentUser.role}
          </span>
        </div>
      </div>

      {/* User Profiles with Quick Identity Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          등록된 조직 구성원 및 역할 전환 테스트
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(user => {
            const isCurrent = user.id === currentUser.id;

            return (
              <div
                key={user.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                  isCurrent
                    ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-300"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          {user.name}
                          {isCurrent && (
                            <span className="text-[10px] text-blue-600 font-bold">● 현재 로그인</span>
                          )}
                        </h4>
                        <span className="text-[11px] text-slate-500">{user.email}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      user.role === 'ADMIN' ? 'bg-red-50 text-red-700 border-red-200' :
                      user.role === 'INSTRUCTOR' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      user.role === 'EDITOR' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      user.role === 'VIEWER' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {user.role}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                    <div className="font-medium text-slate-800">{user.roleTitle}</div>
                    <div className="text-[11px] text-slate-500">{user.organization}</div>
                  </div>

                  {user.specialty && user.specialty.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap pt-2">
                      {user.specialty.map(s => (
                        <span key={s} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-700 font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setCurrentUser(user)}
                  disabled={isCurrent}
                  className={`w-full py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    isCurrent
                      ? 'bg-blue-600 text-white cursor-default'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isCurrent ? '현재 적용된 계정' : `${user.name} 계정으로 권한 전환`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed RBAC Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Key className="w-4 h-4 text-amber-600" />
          기능별 역할 권한 대조표 (Permission Capabilities Matrix)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="p-3 font-bold">주요 기능 및 권한 항목</th>
                <th className="p-3 font-bold text-center">ADMIN<br/><span className="text-[10px] text-slate-400 font-normal">총괄 관리자</span></th>
                <th className="p-3 font-bold text-center">INSTRUCTOR<br/><span className="text-[10px] text-slate-400 font-normal">전문 강사</span></th>
                <th className="p-3 font-bold text-center">EDITOR<br/><span className="text-[10px] text-slate-400 font-normal">편집자</span></th>
                <th className="p-3 font-bold text-center">VIEWER<br/><span className="text-[10px] text-slate-400 font-normal">교육생/직원</span></th>
                <th className="p-3 font-bold text-center">GUEST<br/><span className="text-[10px] text-slate-400 font-normal">참관자</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {roleCapabilities.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-slate-800">{row.capability}</div>
                    <div className="text-[11px] text-slate-500">{row.description}</div>
                  </td>

                  {/* ADMIN */}
                  <td className="p-3 text-center">
                    {row.ADMIN ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>

                  {/* INSTRUCTOR */}
                  <td className="p-3 text-center">
                    {row.INSTRUCTOR ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>

                  {/* EDITOR */}
                  <td className="p-3 text-center">
                    {row.EDITOR ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>

                  {/* VIEWER */}
                  <td className="p-3 text-center">
                    {row.VIEWER ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>

                  {/* GUEST */}
                  <td className="p-3 text-center">
                    {row.GUEST ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
