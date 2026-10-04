'use client';

import React, { useState } from 'react';
import { User, X, Flame, Target, Trophy, Crown, Check, BookOpen, MessageCircle, LogOut, LogIn } from 'lucide-react';
import { UserProfile } from '@/types/auth';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakDays: number;
  isPro: boolean;
  onOpenPro: () => void;
  onOpenMistakes: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onUpdateTargetExam?: (exam: string) => void;
  onOpenFeedback?: () => void;
}

const EXAM_GOALS = [
  'SSC CGL / CHSL',
  'UPSC / State PCS',
  'Railway RRB',
  'Banking (IBPS/SBI)',
  'NEET / JEE',
  'College / Other'
];

export default function ProfileModal({
  isOpen,
  onClose,
  streakDays,
  isPro,
  onOpenPro,
  onOpenMistakes,
  currentUser,
  onOpenAuth,
  onLogout,
  onUpdateTargetExam,
  onOpenFeedback
}: ProfileModalProps) {
  const [targetExam, setTargetExam] = useState(currentUser?.targetExam || 'SSC CGL / CHSL');

  if (!isOpen) return null;

  const displayName = currentUser?.name || 'गेस्ट विद्यार्थी (Guest)';
  const displayContact = currentUser?.email || currentUser?.phone || 'लॉगिन नहीं है';

  const handleSelectExam = (exam: string) => {
    setTargetExam(exam);
    if (onUpdateTargetExam) {
      onUpdateTargetExam(exam);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-base">विद्यार्थी प्रोफाइल (Profile)</h3>
              <p className="text-[11px] text-gray-500">Student Account & Progress</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Not Logged In Banner */}
        {!currentUser && (
          <div className="my-3 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-amber-900">आप गेस्ट मोड में हैं</div>
              <div className="text-[11px] text-amber-700">अपनी स्ट्रीक और स्कोर सुरक्षित रखें</div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1 transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>लॉगिन करें</span>
            </button>
          </div>
        )}

        {/* User Card */}
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/70 rounded-2xl my-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="font-black text-gray-900 text-base leading-tight">{displayName}</h4>
              <p className="text-[11px] text-gray-500 font-medium">{displayContact}</p>
              <div className="text-xs text-emerald-800 font-bold mt-0.5 flex items-center gap-1">
                <span>🎯 लक्ष्य: {targetExam}</span>
              </div>
            </div>
          </div>

          {/* Membership Badge */}
          {isPro ? (
            <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
              ⚡ PRO
            </span>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenPro();
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black px-2.5 py-1.5 rounded-xl shadow-xs flex items-center gap-1 transition"
            >
              <Crown className="w-3 h-3" />
              <span>₹49 Pass</span>
            </button>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 text-center mb-4">
          <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl">
            <div className="flex items-center justify-center text-red-500 mb-1">
              <Flame className="w-4 h-4 fill-red-500" />
            </div>
            <div className="text-sm font-black text-gray-900">{streakDays} Days</div>
            <div className="text-[10px] text-gray-500 font-medium">Daily Streak</div>
          </div>
          <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl">
            <div className="flex items-center justify-center text-blue-500 mb-1">
              <Target className="w-4 h-4" />
            </div>
            <div className="text-sm font-black text-gray-900">80%</div>
            <div className="text-[10px] text-gray-500 font-medium">Avg Accuracy</div>
          </div>
          <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl">
            <div className="flex items-center justify-center text-amber-500 mb-1">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="text-sm font-black text-gray-900">12</div>
            <div className="text-[10px] text-gray-500 font-medium">Tests Given</div>
          </div>
        </div>

        {/* Change Target Exam Selector */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            अपनी परीक्षा का लक्ष्य चुनें (Target Exam):
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {EXAM_GOALS.map((exam, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectExam(exam)}
                className={`py-2 px-2.5 rounded-xl text-left text-xs font-bold transition flex items-center justify-between border ${
                  targetExam === exam
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className="truncate">{exam}</span>
                {targetExam === exam && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Menu Actions */}
        <div className="space-y-2 mb-4">
          {/* Mistake Locker Action */}
          <button
            onClick={() => {
              onClose();
              onOpenMistakes();
            }}
            className="w-full p-3 rounded-2xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100/60 transition text-left flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-bold text-gray-900">मेरी गलतियाँ (Mistake Notebook)</span>
            </div>
            <span className="text-[11px] text-rose-700 font-bold">रिवीज़न ➔</span>
          </button>

          {/* WhatsApp Support Action */}
          <a
            href="https://api.whatsapp.com/send?phone=918558993896&text=Namaste!%20I%20have%20a%20query%20about%20ParikshaAI"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/60 transition text-left flex items-center justify-between block"
          >
            <div className="flex items-center gap-2.5">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-gray-900">24x7 WhatsApp सपोर्ट (Admin)</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-bold">मदद लें ➔</span>
          </a>

          {/* Feedback & Suggestions */}
          {onOpenFeedback && (
            <button
              onClick={() => {
                onClose();
                onOpenFeedback();
              }}
              className="w-full p-3 rounded-2xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100/70 transition text-left flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">💬</span>
                <span className="text-xs font-bold text-gray-900">फीडबैक या नया फीचर सुझाव दें</span>
              </div>
              <span className="text-[11px] text-amber-800 font-bold">सुझाव ➔</span>
            </button>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {currentUser ? (
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="py-3 border border-rose-200 bg-rose-50 text-rose-700 font-bold rounded-2xl text-xs hover:bg-rose-100 flex items-center justify-center gap-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>लॉग आउट</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="py-3 bg-emerald-600 text-white font-bold rounded-2xl text-xs hover:bg-emerald-700 flex items-center justify-center gap-1.5 transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>खाता बनाएं</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="py-3 bg-gray-900 text-white font-bold rounded-2xl text-xs hover:bg-black transition"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
}
