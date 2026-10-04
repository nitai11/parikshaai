'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import AuthModal from '@/components/AuthModal';
import FeedbackModal from '@/components/FeedbackModal';
import { LogOut, AlertTriangle } from 'lucide-react';
import { Quiz, QuizResult, Question } from '@/types/quiz';
import { UserProfile } from '@/types/auth';

export default function App() {
  const [screen, setScreen] = useState<'home' | 'quiz' | 'scorecard'>('home');
  const [currentTab, setCurrentTab] = useState<'home' | 'battle' | 'leaderboard' | 'pro' | 'profile'>('home');
  const [streakDays, setStreakDays] = useState<number>(4);
  const [isPro, setIsPro] = useState<boolean>(true); // 30-Day Early Bird Launch: All students get Free Unlimited Pro Pass!
  const [freeTestsUsed, setFreeTestsUsed] = useState<number>(0);
  const [lang, setLang] = useState<'hi' | 'en'>('hi');

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Modals & Navigation States
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

  // Exit Confirmation Dialogs (Back Button Handling)
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [isExitQuizDialogOpen, setIsExitQuizDialogOpen] = useState(false);

  // Load user from localStorage on client mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('pariksha_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser) as UserProfile;
        setCurrentUser(parsed);
        if (parsed.isPro) setIsPro(true);
        if (parsed.streakDays) setStreakDays(parsed.streakDays);
      }
    } catch (e) {
      console.error('Error reading saved user', e);
    }
  }, []);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.isPro) setIsPro(true);
    if (user.streakDays) setStreakDays(user.streakDays);
    try {
      localStorage.setItem('pariksha_user', JSON.stringify(user));
    } catch (e) {
      console.error('Error saving user', e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('pariksha_user');
    } catch (e) {
      console.error('Error clearing user', e);
    }
  };

  const handleUpdateTargetExam = (exam: string) => {
    if (currentUser) {
      const updated = { ...currentUser, targetExam: exam };
      setCurrentUser(updated);
      try {
        localStorage.setItem('pariksha_user', JSON.stringify(updated));
      } catch (e) {
        console.error('Error updating target exam', e);
      }
    }
  };

  // 🛡️ Mobile / Browser Back Button Interception with Ref
  const stateRef = useRef({
    isExitDialogOpen,
    isExitQuizDialogOpen,
    isFeedbackOpen,
    isAuthOpen,
    isLiveTestOpen,
    isProfileOpen,
    isLegalOpen,
    isMistakesOpen,
    isProOpen,
    isBattleOpen,
    isUploadOpen,
    screen
  });

  useEffect(() => {
    stateRef.current = {
      isExitDialogOpen,
      isExitQuizDialogOpen,
      isFeedbackOpen,
      isAuthOpen,
      isLiveTestOpen,
      isProfileOpen,
      isLegalOpen,
      isMistakesOpen,
      isProOpen,
      isBattleOpen,
      isUploadOpen,
      screen
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Push exactly once on initial load
    window.history.pushState({ page: 'pariksha_base' }, '');

    const handlePopState = () => {
      const cur = stateRef.current;

      // Always re-arm the history state so subsequent back presses are also caught
      window.history.pushState({ page: 'pariksha_base' }, '');

      // 1. If any modal is open, close that modal
      if (cur.isExitDialogOpen) {
        setIsExitDialogOpen(false);
        return;
      }
      if (cur.isExitQuizDialogOpen) {
        setIsExitQuizDialogOpen(false);
        return;
      }
      if (cur.isFeedbackOpen) {
        setIsFeedbackOpen(false);
        return;
      }
      if (cur.isAuthOpen) {
        setIsAuthOpen(false);
        return;
      }
      if (cur.isLiveTestOpen) {
        setIsLiveTestOpen(false);
        return;
      }
      if (cur.isProfileOpen) {
        setIsProfileOpen(false);
        return;
      }
      if (cur.isLegalOpen) {
        setIsLegalOpen(false);
        return;
      }
      if (cur.isMistakesOpen) {
        setIsMistakesOpen(false);
        return;
      }
      if (cur.isProOpen) {
        setIsProOpen(false);
        return;
      }
      if (cur.isBattleOpen) {
        setIsBattleOpen(false);
        return;
      }
      if (cur.isUploadOpen) {
        setIsUploadOpen(false);
        return;
      }

      // 2. If user is in Quiz, ask if they want to exit quiz
      if (cur.screen === 'quiz') {
        setIsExitQuizDialogOpen(true);
        return;
      }

      // 3. If in Scorecard, return safely to home screen
      if (cur.screen === 'scorecard') {
        setScreen('home');
        return;
      }

      // 4. On Home screen with no modal open, show confirmation dialog: "Do you want to close?"
      setIsExitDialogOpen(true);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Active Quiz State
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  // Mistakes List (Revision Locker)
  const [mistakes, setMistakes] = useState<Question[]>([]);

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
          onOpenFeedback={() => setIsFeedbackOpen(true)}
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
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
          />

          <HomeScreen
            onOpenUpload={handleOpenUpload}
            onOpenBattle={() => setIsBattleOpen(true)}
            onOpenPro={() => setIsProOpen(true)}
            onOpenMistakes={() => setIsMistakesOpen(true)}
            onOpenLegal={handleOpenLegal}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenLiveTest={() => setIsLiveTestOpen(true)}
            onOpenFeedback={() => setIsFeedbackOpen(true)}
            mistakesCount={mistakes.length}
            isPro={isPro}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthOpen(true)}
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
        onSuccess={() => {
          setIsPro(true);
          if (currentUser) {
            const updated = { ...currentUser, isPro: true };
            setCurrentUser(updated);
            try {
              localStorage.setItem('pariksha_user', JSON.stringify(updated));
            } catch (e) {}
          }
        }}
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
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onUpdateTargetExam={handleUpdateTargetExam}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
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

      {/* 🔐 Auth Modal (Google & Phone OTP) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 💬 Student Feedback & Suggestion Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        currentUser={currentUser}
      />

      {/* 📜 Legal & Compliance Modal (Razorpay Mandatory) */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        defaultTab={legalTab}
      />

      {/* 🚪 Exit App Confirmation Dialog (Back Button) */}
      {isExitDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl border border-gray-100 text-center animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
              <LogOut className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-gray-900">
              क्या आप ऐप बंद करना चाहते हैं?
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Do you want to exit ParikshaAI? आपकी आज की स्ट्रीक सुरक्षित है!
            </p>

            <div className="grid grid-cols-2 gap-2 mt-5">
              <button
                onClick={() => setIsExitDialogOpen(false)}
                className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                नहीं, रुकें (Stay)
              </button>
              <button
                onClick={() => {
                  setIsExitDialogOpen(false);
                  if (typeof window !== 'undefined') {
                    window.history.go(-2);
                    setTimeout(() => {
                      window.close();
                    }, 100);
                  }
                }}
                className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition"
              >
                हाँ, बाहर जाएं (Exit)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ⚠️ Exit Quiz Confirmation Dialog (Back Button during Quiz) */}
      {isExitQuizDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl border border-gray-100 text-center animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-gray-900">
              क्या आप परीक्षा छोड़ना चाहते हैं?
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              बीच में छोड़ने से आपका टेस्ट स्कोर सुरक्षित नहीं होगा।
            </p>

            <div className="grid grid-cols-2 gap-2 mt-5">
              <button
                onClick={() => setIsExitQuizDialogOpen(false)}
                className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                जारी रखें (Resume)
              </button>
              <button
                onClick={() => {
                  setIsExitQuizDialogOpen(false);
                  setScreen('home');
                }}
                className="py-2.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-bold text-xs rounded-xl transition"
              >
                छोड़ें (Quit)
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
