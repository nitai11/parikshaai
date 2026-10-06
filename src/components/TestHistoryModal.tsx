'use client';

import React from 'react';
import { X, Trophy, Target, Clock, RotateCcw, Trash2, BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';
import { TestHistoryItem } from '@/types/quiz';

interface TestHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: TestHistoryItem[];
  onRetestTopic: (topic: string) => void;
  onClearHistory: () => void;
  onOpenUpload: () => void;
  isFromProfile?: boolean;
}

export default function TestHistoryModal({
  isOpen,
  onClose,
  history,
  onRetestTopic,
  onClearHistory,
  onOpenUpload,
  isFromProfile = false
}: TestHistoryModalProps) {
  if (!isOpen) return null;

  // Calculate high-level aggregate stats
  const totalTests = history.length;
  const totalQuestionsSolved = history.reduce((sum, item) => sum + item.totalQuestions, 0);
  const totalCorrectSolved = history.reduce((sum, item) => sum + item.correctAnswers, 0);
  const avgAccuracy = totalTests > 0
    ? Math.round(history.reduce((sum, item) => sum + item.scorePercentage, 0) / totalTests)
    : 0;

  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString('hi-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'हाल ही में';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-base">टेस्ट इतिहास व रिपोर्ट (History)</h3>
              <p className="text-[11px] text-gray-500">आपके दिए गए सभी टेस्ट और सवालों का ब्यौरा</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-4 gap-2 my-4 text-center">
          <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
            <div className="text-sm font-black text-indigo-900">{totalTests}</div>
            <div className="text-[10px] text-indigo-700 font-semibold leading-tight mt-0.5">कुल टेस्ट</div>
          </div>
          <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
            <div className="text-sm font-black text-emerald-900">{totalQuestionsSolved}</div>
            <div className="text-[10px] text-emerald-700 font-semibold leading-tight mt-0.5">कुल सवाल</div>
          </div>
          <div className="p-2.5 bg-amber-50/70 border border-amber-100 rounded-2xl">
            <div className="text-sm font-black text-amber-900">{totalCorrectSolved}</div>
            <div className="text-[10px] text-amber-700 font-semibold leading-tight mt-0.5">सही उत्तर</div>
          </div>
          <div className="p-2.5 bg-teal-50/70 border border-teal-100 rounded-2xl">
            <div className="text-sm font-black text-teal-900">{avgAccuracy}%</div>
            <div className="text-[10px] text-teal-700 font-semibold leading-tight mt-0.5">सटीकता</div>
          </div>
        </div>

        {/* Tests List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 min-h-[220px]">
          {history.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-14 h-14 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mx-auto">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-black text-gray-800 text-sm">अभी तक कोई टेस्ट नहीं दिया गया</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                  जैसे ही आप कोई टेस्ट पूरा करेंगे, उसका पूरा रिकॉर्ड, स्कोर और सवाल यहाँ सुरक्षित हो जाएंगे।
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenUpload();
                }}
                className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                पहला टेस्ट अभी शुरू करें ➔
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs font-bold text-gray-500 px-1">
                <span>हालिया टेस्ट ({history.length})</span>
                <button
                  onClick={onClearHistory}
                  className="text-[11px] text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 transition"
                  title="हिस्ट्री साफ़ करें"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>इतिहास मिटाएं</span>
                </button>
              </div>

              {history.map((test) => {
                const isPassed = test.scorePercentage >= 60;
                return (
                  <div
                    key={test.id}
                    className="p-3.5 bg-gray-50/80 hover:bg-gray-100/80 rounded-2xl border border-gray-200 transition space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="text-xs font-black text-gray-900 line-clamp-2">
                          {test.topic}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500 font-medium">
                          <span>📅 {formatDate(test.completedAt)}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3 h-3" /> {test.timeTakenFormatted}
                          </span>
                        </div>
                      </div>

                      {/* Score Badge */}
                      <div
                        className={`px-2.5 py-1 rounded-xl text-center shrink-0 border ${
                          isPassed
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <div className="text-xs font-black">
                          {test.correctAnswers}/{test.totalQuestions}
                        </div>
                        <div className="text-[10px] font-bold">{test.scorePercentage}%</div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-200/60 text-xs">
                      <span className="text-[11px] text-gray-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {test.correctAnswers} सही • {test.totalQuestions - test.correctAnswers} गलत
                      </span>

                      <button
                        onClick={() => {
                          onClose();
                          onRetestTopic(test.topic);
                        }}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-100/70 hover:bg-emerald-200/70 px-2.5 py-1 rounded-lg transition"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>दोबारा दें</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
          >
            {isFromProfile ? (
              <span>← प्रोफाइल पर वापस जाएँ (Back to Profile)</span>
            ) : (
              <span>बंद करें (Close)</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
