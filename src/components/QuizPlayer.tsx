'use client';

import React, { useState, useEffect } from 'react';
import { Question, UserAnswer, QuizResult } from '@/types/quiz';
import { Clock, X, CheckCircle2, XCircle, Lightbulb, ArrowRight, ArrowLeft, Volume2, VolumeX } from 'lucide-react';

interface QuizPlayerProps {
  topic: string;
  questions: Question[];
  onFinishQuiz: (result: QuizResult) => void;
  onExit: () => void;
}

export default function QuizPlayer({
  topic,
  questions,
  onFinishQuiz,
  onExit
}: QuizPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(questions.length * 60); // 1 min per question
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isSpeaking, setIsSpeaking] = useState(false);

  const toggleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('आपके डिवाइस में ऑडियो रीडर सपोर्ट नहीं है।');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech
    const textToSpeak = `${currentQ.questionHi}. ऑप्शन ए: ${currentQ.options[0]}. ऑप्शन बी: ${currentQ.options[1]}. ऑप्शन सी: ${currentQ.options[2]}. ऑप्शन डी: ${currentQ.options[3]}.`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95; // Friendly, clear reading speed

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Stop speaking when question changes
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [currentIndex]);

  const currentQ = questions[currentIndex];
  const isAnswered = selectedOption !== null;

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, userAnswers]);

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return; // Prevent changing answer once selected
    setSelectedOption(idx);

    const isCorrect = idx === currentQ.correctAnswer;
    const answerRecord: UserAnswer = {
      questionId: currentQ.id,
      selectedOption: idx,
      isCorrect,
      timeSpentSeconds: Math.floor((Date.now() - startTime) / 1000)
    };

    setUserAnswers((prev) => [...prev, answerRecord]);
  };

  const finishTest = () => {
    const totalQ = questions.length;
    const correctCount = userAnswers.filter((a) => a.isCorrect).length + (selectedOption === currentQ.correctAnswer ? 0 : 0);
    const scorePct = Math.round((correctCount / totalQ) * 100);
    const totalTimeTakenSec = (questions.length * 60) - secondsRemaining;
    const mins = Math.floor(totalTimeTakenSec / 60);
    const secs = totalTimeTakenSec % 60;

    // Detect weak topics based on wrong answers
    const wrongQuestions = questions.filter((q, i) => {
      const ans = userAnswers.find((a) => a.questionId === q.id);
      return ans && !ans.isCorrect;
    });

    const weakTopics = wrongQuestions.length > 0 
      ? wrongQuestions.map((q) => q.questionHi.slice(0, 30) + '...')
      : ['कोई कमज़ोरी नहीं, सभी सवाल सही!'];

    const percentileRank = scorePct >= 80 ? 'Top 5% in State' : scorePct >= 60 ? 'Top 25%' : 'Top 50%';

    const finalResult: QuizResult = {
      quizId: `res_${Date.now()}`,
      topic,
      totalQuestions: totalQ,
      correctAnswers: correctCount,
      scorePercentage: scorePct,
      timeTakenFormatted: `${mins}m ${secs}s`,
      weakTopics,
      percentileRank,
      streakDays: 4 + 1,
      answers: userAnswers
    };

    onFinishQuiz(finalResult);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setStartTime(Date.now());
    } else {
      finishTest();
    }
  };

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between max-w-md mx-auto px-4 py-4">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-2xs hover:bg-gray-100 transition"
            title="क्विज़ से बाहर जाएं"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>वापस (Back)</span>
          </button>
          <div className="flex items-center gap-1 font-bold text-gray-900 text-sm">
            <span className="text-emerald-600 font-black">Pariksha</span>AI
          </div>
          <button
            onClick={onExit}
            className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full transition"
          >
            <span>Exit</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mb-3">
          <div
            className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Question Counter & Timer */}
        <div className="flex items-center justify-between text-xs font-bold text-gray-600 mb-4">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <div className="flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded-md font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>{mins < 10 ? `0${mins}` : mins}:{secs < 10 ? `0${secs}` : secs} left</span>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-gray-100 mb-4 relative">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
              {currentQ.questionHi}
            </h2>
            <button
              type="button"
              onClick={toggleSpeak}
              className={`p-2 rounded-xl border transition shrink-0 ${
                isSpeaking
                  ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
              title="बोलकर सुनाएं / Listen"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            {currentQ.questionEn}
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-2.5 mb-4">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctAnswer;

            let cardStyles = "border-gray-200 bg-white hover:bg-gray-50/80 text-gray-800";
            let badgeStyles = "bg-gray-100 text-gray-600";

            if (isAnswered) {
              if (isCorrect) {
                cardStyles = "border-emerald-500 bg-emerald-50 text-emerald-900 font-medium shadow-xs";
                badgeStyles = "bg-emerald-600 text-white";
              } else if (isSelected) {
                cardStyles = "border-rose-400 bg-rose-50 text-rose-900 shadow-xs";
                badgeStyles = "bg-rose-500 text-white";
              }
            }

            const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${cardStyles}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${badgeStyles}`}>
                    {optionLetter}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold">{opt}</span>
                </div>
                {isAnswered && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* AI Explanation Box (reveals upon answer) */}
        {isAnswered && (
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs animate-in fade-in-50 duration-200 mb-4">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
              <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>AI समाधान (Explanation):</span>
            </div>
            <p className="text-gray-800 mb-1 leading-relaxed font-medium">
              {currentQ.explanationHi}
            </p>
            <p className="text-gray-500 italic text-[11px]">
              {currentQ.explanationEn}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Button */}
      {isAnswered && (
        <div className="pt-2 sticky bottom-3">
          <button
            onClick={handleNext}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 hover:opacity-95 transition"
          >
            <span>{currentIndex + 1 < questions.length ? 'अगला सवाल (Next Question)' : 'टेस्ट समाप्त करें (Submit Test)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
