'use client';

import React from 'react';
import { Question } from '@/types/quiz';
import { BookOpen, X, Play, Trash2, CheckCircle2 } from 'lucide-react';

interface MistakeLockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mistakes: Question[];
  onStartRevisionQuiz: (questions: Question[]) => void;
  onClearMistakes: () => void;
  isFromProfile?: boolean;
}

export default function MistakeLockerModal({
  isOpen,
  onClose,
  mistakes,
  onStartRevisionQuiz,
  onClearMistakes,
  isFromProfile = false
}: MistakeLockerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-base">मेरी गलतियाँ (Mistake Locker)</h3>
              <p className="text-xs text-rose-600 font-bold">{mistakes.length} सवाल रिवीज़न के लिए</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {mistakes.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">शानदार! कोई गलती पेंडिंग नहीं है</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              जब भी आप किसी टेस्ट में गलत जवाब देंगे, वो सवाल यहाँ सेव हो जाएगा ताकि आप उसका रिवीज़न कर सकें।
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition"
            >
              {isFromProfile ? '← प्रोफाइल पर वापस जाएँ' : 'बंद करें'}
            </button>
          </div>
        ) : (
          <div className="py-4 space-y-3">
            <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-3 text-xs text-rose-900">
              💡 <strong>टॉपर टिप:</strong> इन गलतियों को 24 घंटे के अंदर दोबारा हल करने से यह स्थायी रूप से याद हो जाती हैं।
            </div>

            {/* List of mistakes */}
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {mistakes.map((q, idx) => (
                <div key={idx} className="p-3 rounded-2xl border border-gray-100 bg-gray-50/80 text-left">
                  <div className="font-bold text-xs text-gray-900 mb-1">
                    {idx + 1}. {q.questionHi}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded-lg inline-block">
                    ✓ सही उत्तर: {q.options[q.correctAnswer]}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  onClose();
                  onStartRevisionQuiz(mistakes);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 text-xs hover:opacity-95 transition"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>🚀 सिर्फ गलत सवालों का रिवीज़न टेस्ट दें ({mistakes.length})</span>
              </button>

              <button
                onClick={onClearMistakes}
                className="w-full py-2.5 bg-white border border-gray-200 text-gray-600 font-semibold rounded-xl text-xs hover:bg-gray-50 flex items-center justify-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5 text-gray-400" />
                <span>डायरी खाली करें (Clear All)</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition"
              >
                {isFromProfile ? '← प्रोफाइल पर वापस जाएँ (Back to Profile)' : 'बंद करें (Close)'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
