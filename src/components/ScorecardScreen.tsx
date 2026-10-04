'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { QuizResult } from '@/types/quiz';
import { Trophy, Flame, Clock, Target, AlertTriangle, Share2, RotateCcw, Home } from 'lucide-react';

interface ScorecardScreenProps {
  result: QuizResult;
  onNewQuiz: () => void;
  onGoHome: () => void;
}

export default function ScorecardScreen({
  result,
  onNewQuiz,
  onGoHome
}: ScorecardScreenProps) {
  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.3 }
      });
    } catch {
      // Ignore if browser canvas fails
    }
  }, []);

  const shareToWhatsApp = () => {
    const liveUrl = typeof window !== 'undefined' ? window.location.origin : 'https://pariksha.nitaiitsolution.in';
    const shareText = `🎯 मैंने ParikshaAI पर "${result.topic}" टेस्ट में ${result.totalQuestions} में से ${result.correctAnswers} अंक हासिल किए! (${result.scorePercentage}% स्कोर)\n\n⚡ दम है तो मुझे खेलकर हराकर दिखाओ! यहाँ टेस्ट दो: ${liveUrl}\n#ParikshaAI #ExamPrep`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto px-4 py-6 flex flex-col justify-between">
      <div>
        {/* Celebration Header */}
        <div className="text-center mb-4">
          <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-md shadow-amber-500/20">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-gray-900">Test Complete! 🎉</h2>
          <p className="text-xs text-gray-500">शानदार प्रदर्शन, तैयारी जारी रखें!</p>
        </div>

        {/* Main Scorecard Banner (Emerald Green) */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 text-white text-center shadow-xl shadow-emerald-700/20 mb-4">
          <div className="text-5xl font-black tracking-tight mb-1">
            {result.correctAnswers} <span className="text-2xl font-bold text-emerald-200">/ {result.totalQuestions}</span>
          </div>
          <p className="text-sm font-bold text-emerald-100 mb-2">
            उत्कृष्ट तैयारी! ({result.percentileRank})
          </p>
          <div className="inline-block bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold">
            {result.scorePercentage >= 70 ? '🌟 परीक्षा पास करने योग्य स्कोर' : '💪 थोड़ा और अभ्यास आवश्यक'}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 grid grid-cols-3 gap-2 text-center mb-4">
          <div className="p-2 border-r border-gray-100">
            <div className="text-[11px] text-gray-500 font-medium flex items-center justify-center gap-1">
              <Target className="w-3.5 h-3.5 text-blue-500" />
              <span>Accuracy</span>
            </div>
            <div className="text-base font-black text-gray-900 mt-1">
              {result.scorePercentage}%
            </div>
          </div>
          <div className="p-2 border-r border-gray-100">
            <div className="text-[11px] text-gray-500 font-medium flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Time</span>
            </div>
            <div className="text-base font-black text-gray-900 mt-1">
              {result.timeTakenFormatted}
            </div>
          </div>
          <div className="p-2">
            <div className="text-[11px] text-gray-500 font-medium flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              <span>Streak</span>
            </div>
            <div className="text-base font-black text-emerald-600 mt-1">
              +{result.streakDays} Days
            </div>
          </div>
        </div>

        {/* Weak Topics to Revise Card */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>⚠️ इन कमज़ोर टॉपिक्स का रिवीज़न करें (Weak Topics):</span>
          </div>
          <ul className="space-y-1.5 text-xs text-gray-700">
            {result.weakTopics.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-500 font-bold">•</span>
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-2">
        {/* WhatsApp Share Button (Viral Loop) */}
        <button
          onClick={shareToWhatsApp}
          className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition text-sm"
        >
          <Share2 className="w-4 h-4" />
          <span>📲 दोस्तों को WhatsApp पर चैलेंज करो (1v1 Battle)</span>
        </button>

        {/* Retake and Home Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onNewQuiz}
            className="py-3 px-3 bg-white border border-gray-200 text-gray-800 font-bold text-xs rounded-xl shadow-2xs hover:bg-gray-50 flex items-center justify-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>नया टेस्ट दें</span>
          </button>
          <button
            onClick={onGoHome}
            className="py-3 px-3 bg-gray-900 text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-black flex items-center justify-center gap-1.5 transition"
          >
            <Home className="w-3.5 h-3.5" />
            <span>होम स्क्रीन</span>
          </button>
        </div>
      </div>
    </div>
  );
}
