import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  Users2, 
  BarChart2, 
  FileCheck2, 
  ArrowUpDown,
  X,
  ChevronDown
} from 'lucide-react';
import { useSafetyBrain } from '../context/SafetyBrainContext';
import { TargetAudience, DifficultyLevel, DocStatus, PriorityLevel } from '../types';

export const FilterBar: React.FC = () => {
  const { filters, setFilters, resetFilters, filteredDocs, docs } = useSafetyBrain();
  const [isOpen, setIsOpen] = useState(false);

  const audiences: TargetAudience[] = ['전체', '초·중·고교', '일반시민', '사업장근로자', '관리감독자', '전문강사진'];
  const difficulties: DifficultyLevel[] = ['기초(입문)', '실무(표준)', '심화(전문가)', '비상대응훈련'];
  const statuses: DocStatus[] = ['PUBLISHED', 'REVIEW', 'DRAFT', 'ARCHIVED'];
  const priorities: Array<{ label: string; value: PriorityLevel | 'ALL' }> = [
    { label: '전체 우선순위', value: 'ALL' },
    { label: '🚨 긴급(Critical)', value: 'CRITICAL' },
    { label: '⚡ 높음(High)', value: 'HIGH' },
    { label: '일반(Medium)', value: 'MEDIUM' },
  ];

  const hasActiveFilters = 
    filters.keyword !== '' ||
    filters.categories.length > 0 ||
    filters.audiences.length > 0 ||
    filters.difficulties.length > 0 ||
    filters.statuses.length > 0 ||
    filters.priority !== 'ALL' ||
    filters.onlyBookmarked ||
    filters.onlyMyDocs;

  const toggleAudience = (aud: TargetAudience) => {
    setFilters(prev => ({
      ...prev,
      audiences: prev.audiences.includes(aud)
        ? prev.audiences.filter(a => a !== aud)
        : [...prev.audiences, aud],
    }));
  };

  const toggleDifficulty = (diff: DifficultyLevel) => {
    setFilters(prev => ({
      ...prev,
      difficulties: prev.difficulties.includes(diff)
        ? prev.difficulties.filter(d => d !== diff)
        : [...prev.difficulties, diff],
    }));
  };

  const toggleStatus = (st: DocStatus) => {
    setFilters(prev => ({
      ...prev,
      statuses: prev.statuses.includes(st)
        ? prev.statuses.filter(s => s !== st)
        : [...prev.statuses, st],
    }));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-3">
      
      {/* Top Filter Bar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        
        {/* Results summary count */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">
            총 <strong className="text-slate-900 font-bold">{filteredDocs.length}</strong>건의 안전 지침서
          </span>
          {docs.length !== filteredDocs.length && (
            <span className="text-[11px] text-slate-400">
              (전체 {docs.length}건 중 필터링됨)
            </span>
          )}
        </div>

        {/* Quick Filter buttons */}
        <div className="flex items-center gap-2">
          {/* Advanced Filters Expand Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isOpen || hasActiveFilters
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>상세 필터</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="bg-transparent text-xs font-medium text-slate-700 outline-none cursor-pointer"
            >
              <option value="updatedAt">최근 수정순</option>
              <option value="createdAt">최초 등록순</option>
              <option value="views">조회수 높은순</option>
              <option value="priority">우선순위 높은순</option>
              <option value="title">제목 가나다순</option>
            </select>
          </div>

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              title="모든 필터 초기화"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>초기화</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable Advanced Filter Drawer */}
      {isOpen && (
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs animate-in fade-in duration-150">
          
          {/* Target Audience */}
          <div>
            <span className="font-bold text-slate-600 flex items-center gap-1 mb-1.5">
              <Users2 className="w-3.5 h-3.5 text-blue-500" />
              교육 대상
            </span>
            <div className="flex flex-wrap gap-1">
              {audiences.map(aud => {
                const active = filters.audiences.includes(aud);
                return (
                  <button
                    key={aud}
                    onClick={() => toggleAudience(aud)}
                    className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                      active
                        ? 'bg-blue-600 text-white border-blue-600 font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {aud}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Level */}
          <div>
            <span className="font-bold text-slate-600 flex items-center gap-1 mb-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-emerald-500" />
              난이도 / 실무 수준
            </span>
            <div className="flex flex-wrap gap-1">
              {difficulties.map(diff => {
                const active = filters.difficulties.includes(diff);
                return (
                  <button
                    key={diff}
                    onClick={() => toggleDifficulty(diff)}
                    className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                      active
                        ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {diff}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Document Status */}
          <div>
            <span className="font-bold text-slate-600 flex items-center gap-1 mb-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-purple-500" />
              문서 발행 상태
            </span>
            <div className="flex flex-wrap gap-1">
              {statuses.map(st => {
                const active = filters.statuses.includes(st);
                const labels: Record<DocStatus, string> = {
                  PUBLISHED: '발행 완료',
                  REVIEW: '검토 중',
                  DRAFT: '초안',
                  ARCHIVED: '보관됨',
                };
                return (
                  <button
                    key={st}
                    onClick={() => toggleStatus(st)}
                    className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                      active
                        ? 'bg-purple-600 text-white border-purple-600 font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {labels[st]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <span className="font-bold text-slate-600 flex items-center gap-1 mb-1.5">
              우선순위 등급
            </span>
            <div className="flex flex-wrap gap-1">
              {priorities.map(p => {
                const active = filters.priority === p.value;
                return (
                  <button
                    key={p.value}
                    onClick={() => setFilters(prev => ({ ...prev, priority: p.value }))}
                    className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                      active
                        ? 'bg-slate-900 text-white border-slate-900 font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Active Filter Chips Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-400 font-medium">적용된 조건:</span>

          {filters.keyword && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">
              검색: "{filters.keyword}"
              <X 
                className="w-3 h-3 cursor-pointer hover:text-blue-900" 
                onClick={() => setFilters(prev => ({ ...prev, keyword: '' }))} 
              />
            </span>
          )}

          {filters.categories.map(cat => (
            <span key={cat} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-800 border border-amber-200">
              분야: {cat}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-amber-950" 
                onClick={() => setFilters(prev => ({ ...prev, categories: prev.categories.filter(c => c !== cat) }))} 
              />
            </span>
          ))}

          {filters.audiences.map(aud => (
            <span key={aud} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-800 border border-emerald-200">
              대상: {aud}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-emerald-950" 
                onClick={() => toggleAudience(aud)} 
              />
            </span>
          ))}

          {filters.difficulties.map(diff => (
            <span key={diff} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-purple-50 text-purple-800 border border-purple-200">
              난이도: {diff}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-purple-950" 
                onClick={() => toggleDifficulty(diff)} 
              />
            </span>
          ))}

          {filters.priority !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-rose-50 text-rose-800 border border-rose-200">
              우선순위: {filters.priority}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-rose-950" 
                onClick={() => setFilters(prev => ({ ...prev, priority: 'ALL' }))} 
              />
            </span>
          )}
        </div>
      )}

    </div>
  );
};
