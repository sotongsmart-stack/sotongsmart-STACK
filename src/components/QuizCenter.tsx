import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  HelpCircle, 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Flame, 
  Activity, 
  Leaf, 
  Laptop, 
  LandPlot, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useSafetyBrain } from '../context/SafetyBrainContext';
import { SafetyCategory, QuizQuestion } from '../types';

export const QuizCenter: React.FC = () => {
  const { docs, setCurrentDocId, setActiveTab } = useSafetyBrain();
  const [selectedCategory, setSelectedCategory] = useState<SafetyCategory | 'ALL'>('ALL');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  // Gather all quizzes across documents
  const allQuizzes: Array<{ quiz: QuizQuestion; docTitle: string; docId: string; category: SafetyCategory }> = [];
  docs.forEach(doc => {
    doc.quizzes?.forEach(q => {
      allQuizzes.push({
        quiz: q,
        docTitle: doc.title,
        docId: doc.id,
        category: doc.category,
      });
    });
  });

  const filteredQuizzes = allQuizzes.filter(item => 
    selectedCategory === 'ALL' || item.category === selectedCategory
  );

  const handleSelect = (quizId: string, optionIdx: number) => {
    if (submitted) return;
    setUserAnswers(prev => ({ ...prev, [quizId]: optionIdx }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    let correct = 0;
    filteredQuizzes.forEach(item => {
      if (userAnswers[item.quiz.id] === item.quiz.correctIndex) {
        correct++;
      }
    });

    if (correct === filteredQuizzes.length && correct > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleReset = () => {
    setUserAnswers({});
    setSubmitted(false);
  };

  const correctCount = filteredQuizzes.filter(
    item => userAnswers[item.quiz.id] === item.quiz.correctIndex
  ).length;

  const scorePercentage = filteredQuizzes.length > 0 
    ? Math.round((correctCount / filteredQuizzes.length) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
              <Award className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              김은경 안전 평가 센터
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            5대 안전 분야 실전 역량 모의평가
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            지진, 화재, 응급처치, 환경, 디지털 안전 지침서에 수록된 실전 훈련 퀴즈를 풀고 개인 및 조직의 안전 준비도를 점검하세요.
          </p>
        </div>

        {submitted && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center min-w-36">
            <span className="text-[11px] text-emerald-200 block font-semibold">최종 평가 점수</span>
            <span className="text-3xl font-black text-white">{scorePercentage}점</span>
            <span className="text-xs text-slate-300 block mt-0.5">
              ({correctCount} / {filteredQuizzes.length} 정답)
            </span>
          </div>
        )}
      </div>

      {/* Filter Tabs & Reset */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          <button
            onClick={() => { setSelectedCategory('ALL'); handleReset(); }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            전체 분야 ({allQuizzes.length})
          </button>
          {(['지진안전', '화재안전', '응급처치', '환경안전', '디지털안전'] as SafetyCategory[]).map(cat => {
            const count = allQuizzes.filter(q => q.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); handleReset(); }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {submitted && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>다시 풀기</span>
            </button>
          )}

          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(userAnswers).length === 0}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
            >
              평가 제출 및 채점
            </button>
          ) : null}
        </div>
      </div>

      {/* Quiz Question Cards */}
      <div className="space-y-4">
        {filteredQuizzes.map((item, qIdx) => {
          const quiz = item.quiz;
          const selected = userAnswers[quiz.id];
          const isAnswered = selected !== undefined;
          const isCorrect = isAnswered && selected === quiz.correctIndex;

          return (
            <div
              key={quiz.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 transition-all hover:border-slate-300"
            >
              {/* Question Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-extrabold">
                    {qIdx + 1}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {item.category}
                  </span>
                  <button
                    onClick={() => {
                      setCurrentDocId(item.docId);
                      setActiveTab('docs');
                    }}
                    className="text-xs text-blue-600 hover:underline font-medium hidden sm:inline"
                  >
                    📄 {item.docTitle}
                  </button>
                </div>

                {submitted && (
                  <div>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 정답
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        <XCircle className="w-3.5 h-3.5" /> 오답
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Question text */}
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {quiz.question}
              </h3>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {quiz.options.map((opt, optIdx) => {
                  const isThisSelected = selected === optIdx;
                  const isThisCorrect = quiz.correctIndex === optIdx;

                  let style = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
                  if (submitted) {
                    if (isThisCorrect) {
                      style = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                    } else if (isThisSelected && !isThisCorrect) {
                      style = 'bg-red-50 border-red-300 text-red-950';
                    }
                  } else if (isThisSelected) {
                    style = 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-1 ring-blue-500';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={submitted}
                      onClick={() => handleSelect(quiz.id, optIdx)}
                      className={`text-left p-3 rounded-xl border text-xs transition-colors flex items-center justify-between ${style}`}
                    >
                      <span>{optIdx + 1}. {opt}</span>
                      {submitted && isThisCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submission */}
              {submitted && (
                <div className="mt-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                  💡 <strong>김은경 마스터 해설:</strong> {quiz.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
