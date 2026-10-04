'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import HomeScreen from '@/components/HomeScreen';
import QuizPlayer from '@/components/QuizPlayer';
import ScorecardScreen from '@/components/ScorecardScreen';
import UploadModal from '@/components/UploadModal';
import BattleModal from '@/components/BattleModal';
import ProPaywallModal from '@/components/ProPaywallModal';
import MistakeLockerModal from '@/components/MistakeLockerModal';
import LegalModal from '@/components/LegalModal';
import ProfileModal from '@/components/ProfileModal';
import LiveTestModal from '@/components/LiveTestModal';
import BottomNav from '@/components/BottomNav';
import { Quiz, QuizResult, Question } from '@/types/quiz';

export default function App() {
  const [screen, setScreen] = useState<'home' | 'quiz' | 'scorecard'>('home');
  const [currentTab, setCurrentTab] = useState<'home' | 'battle' | 'leaderboard' | 'pro' | 'profile'>('home');
  const [streakDays, setStreakDays] = useState<number>(4);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [freeTestsUsed, setFreeTestsUsed] = useState<number>(0);
  const [lang, setLang] = useState<'hi' | 'en'>('hi');

  // Active Quiz State
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  // Mistakes List (Revision Locker)
  const [mistakes, setMistakes] = useState<Question[]>([]);

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isBattleOpen, setIsBattleOpen] = useState(false);
  const [isProOpen, setIsProOpen] = useState(false);
  const [isMistakesOpen, setIsMistakesOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLiveTestOpen, setIsLiveTestOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'terms' | 'privacy' | 'refund' | 'contact'>('terms');
  const [selectedInitialTopic, setSelectedInitialTopic] = useState<string>('');
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);

  // Handle generating and starting quiz
  const handleStartQuiz = async (
    topicOrText: string,
    questionCount: number,
    difficulty: string,
    base64Image?: string
  ) => {
    // Check free limit
    if (!isPro && freeTestsUsed >= 2) {
      setIsUploadOpen(false);
      setIsProOpen(true);
      return;
    }

    setIsLoadingQuiz(true);
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicOrText,
          questionCount,
          difficulty,
          base64Image
        })
      });

      const data = await res.json();
      if (data.success && data.quiz) {
        setCurrentQuiz(data.quiz);
        setFreeTestsUsed((prev) => prev + 1);
        setIsUploadOpen(false);
        setScreen('quiz');
      } else {
        alert('क्विज़ बनाने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
      }
    } catch (err) {
      console.error('Quiz creation error:', err);
      alert('सर्वर से कनेक्ट करने में समस्या हुई। कृपया इंटरनेट कनेक्शन जांचें।');
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  const handleFinishQuiz = (result: QuizResult) => {
    setQuizResult(result);
    setStreakDays((prev) => prev + 1);

    // Save incorrect questions into Mistakes Locker
    if (currentQuiz) {
      const wrongAnswers = result.answers.filter((a) => !a.isCorrect);
      const wrongQuestions = currentQuiz.questions.filter((q) =>
        wrongAnswers.some((a) => a.questionId === q.id)
      );

      if (wrongQuestions.length > 0) {
        setMistakes((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newUnique = wrongQuestions.filter((wq) => !existingIds.has(wq.id));
          return [...prev, ...newUnique];
        });
      }
    }

    setScreen('scorecard');
  };

  const handleStartRevisionQuiz = (revisionQuestions: Question[]) => {
    setCurrentQuiz({
      id: `rev_${Date.now()}`,
      topic: 'रिवीज़न: मेरी पुरानी गलतियाँ',
      questions: revisionQuestions,
      totalQuestions: revisionQuestions.length,
      difficulty: 'medium',
      createdAt: new Date().toISOString()
    });
    setScreen('quiz');
  };

  const handleOpenUpload = (initialTopic?: string) => {
    setSelectedInitialTopic(initialTopic || '');
    setIsUploadOpen(true);
  };

  const handleOpenLegal = (tab: 'terms' | 'privacy' | 'refund' | 'contact') => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

  const handleTabSelect = (tab: 'home' | 'battle' | 'leaderboard' | 'pro' | 'profile') => {
    setCurrentTab(tab);
    if (tab === 'home') {
      setScreen('home');
    } else if (tab === 'battle') {
      setIsBattleOpen(true);
    } else if (tab === 'leaderboard') {
      setIsLiveTestOpen(true);
    } else if (tab === 'pro') {
      setIsProOpen(true);
    } else if (tab === 'profile') {
      setIsProfileOpen(true);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-800">
      {/* Quiz Screen has its own full screen view */}
      {screen === 'quiz' && currentQuiz && (
        <QuizPlayer
          topic={currentQuiz.topic}
          questions={currentQuiz.questions}
          onFinishQuiz={handleFinishQuiz}
          onExit={() => setScreen('home')}
        />
      )}

      {/* Scorecard Screen */}
      {screen === 'scorecard' && quizResult && (
        <ScorecardScreen
          result={quizResult}
          onNewQuiz={() => {
            setScreen('home');
            setIsUploadOpen(true);
          }}
          onGoHome={() => setScreen('home')}
        />
      )}

      {/* Home Dashboard */}
      {screen === 'home' && (
        <>
          <Navbar
            streakDays={streakDays}
            isPro={isPro}
            onOpenPro={() => setIsProOpen(true)}
            lang={lang}
            setLang={setLang}
          />

          <HomeScreen
            onOpenUpload={handleOpenUpload}
            onOpenBattle={() => setIsBattleOpen(true)}
            onOpenPro={() => setIsProOpen(true)}
            onOpenMistakes={() => setIsMistakesOpen(true)}
            onOpenLegal={handleOpenLegal}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenLiveTest={() => setIsLiveTestOpen(true)}
            mistakesCount={mistakes.length}
            isPro={isPro}
          />

          <BottomNav currentTab={currentTab} onSelectTab={handleTabSelect} />
        </>
      )}

      {/* Upload & AI Generation Modal (With Voice Mic) */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onStartQuiz={handleStartQuiz}
        isLoading={isLoadingQuiz}
        initialTopic={selectedInitialTopic}
      />

      {/* 1v1 Chai Challenge Modal */}
      <BattleModal
        isOpen={isBattleOpen}
        onClose={() => setIsBattleOpen(false)}
        onSelectTopic={(topic) => {
          handleStartQuiz(topic, 5, 'medium');
        }}
      />

      {/* Pro Paywall Modal (UPI ₹49 Pass) */}
      <ProPaywallModal
        isOpen={isProOpen}
        onClose={() => setIsProOpen(false)}
        onSuccess={() => setIsPro(true)}
      />

      {/* 📕 Mistake Locker (Revision Notebook) Modal */}
      <MistakeLockerModal
        isOpen={isMistakesOpen}
        onClose={() => setIsMistakesOpen(false)}
        mistakes={mistakes}
        onStartRevisionQuiz={handleStartRevisionQuiz}
        onClearMistakes={() => setMistakes([])}
      />

      {/* 👤 Student Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        streakDays={streakDays}
        isPro={isPro}
        onOpenPro={() => setIsProOpen(true)}
        onOpenMistakes={() => setIsMistakesOpen(true)}
      />

      {/* 🏆 All-India 9 PM Live Test Modal */}
      <LiveTestModal
        isOpen={isLiveTestOpen}
        onClose={() => setIsLiveTestOpen(false)}
        onStartPractice={() => {
          setIsLiveTestOpen(false);
          handleStartQuiz('भारतीय इतिहास व संविधान All India Live PYQ', 10, 'medium');
        }}
      />

      {/* 📜 Legal & Compliance Modal (Razorpay Mandatory) */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        defaultTab={legalTab}
      />
    </main>
  );
}
