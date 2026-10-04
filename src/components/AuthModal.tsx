'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types/auth';
import { X, Smartphone, ArrowRight, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess
}: AuthModalProps) {
  const [authMethod, setAuthMethod] = useState<'google' | 'phone'>('google');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Handle Google Login Simulation (or One-Tap)
  const handleGoogleLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const name = userName.trim() || 'राहुल सैनी';
      const user: UserProfile = {
        id: `usr_${Date.now()}`,
        name: name,
        email: `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        avatarUrl: '',
        targetExam: 'SSC CGL / CHSL',
        isPro: false,
        streakDays: 4,
        testsGiven: 12,
        createdAt: new Date().toISOString()
      };
      setIsSubmitting(false);
      onLoginSuccess(user);
      onClose();
    }, 800);
  };

  // Handle Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      alert('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।');
      return;
    }
    setOtpSent(true);
  };

  // Handle Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4 && otp.length !== 6) {
      alert('कृपया 4 अंकों का OTP दर्ज करें।');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      const name = userName.trim() || 'विद्यार्थी';
      const user: UserProfile = {
        id: `usr_ph_${phoneNumber}`,
        name: name,
        phone: `+91 ${phoneNumber}`,
        targetExam: 'SSC CGL / CHSL',
        isPro: false,
        streakDays: 4,
        testsGiven: 12,
        createdAt: new Date().toISOString()
      };
      setIsSubmitting(false);
      onLoginSuccess(user);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-base">खाता बनाएं / लॉगिन करें</h3>
              <p className="text-[11px] text-gray-500">अपना स्कोर और स्ट्रीक सुरक्षित रखें</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 gap-1 bg-gray-100 p-1 rounded-xl my-4 text-xs font-bold">
          <button
            onClick={() => {
              setAuthMethod('google');
              setOtpSent(false);
            }}
            className={`py-2.5 rounded-lg transition flex items-center justify-center gap-1.5 ${
              authMethod === 'google' ? 'bg-white text-emerald-800 shadow-xs' : 'text-gray-600'
            }`}
          >
            <span>🔴 Google One-Tap</span>
          </button>
          <button
            onClick={() => setAuthMethod('phone')}
            className={`py-2.5 rounded-lg transition flex items-center justify-center gap-1.5 ${
              authMethod === 'phone' ? 'bg-white text-emerald-800 shadow-xs' : 'text-gray-600'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>मोबाइल OTP</span>
          </button>
        </div>

        {/* Student Name Input */}
        <div className="mb-3">
          <label className="block text-xs font-bold text-gray-700 mb-1">
            आपका शुभ नाम (Student Name):
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="उदा. राहुल सैनी, पूजा वर्मा..."
            className="w-full text-xs font-semibold rounded-xl border border-gray-200 p-3 bg-gray-50 focus:outline-emerald-600"
          />
        </div>

        {/* Google Method */}
        {authMethod === 'google' && (
          <div className="space-y-3 pt-1">
            <button
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-white border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 text-gray-800 font-bold rounded-2xl shadow-xs flex items-center justify-center gap-3 transition text-sm disabled:opacity-50"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isSubmitting ? 'लॉगिन हो रहा है...' : 'Continue with Google'}</span>
            </button>

            <p className="text-[11px] text-gray-500 text-center">
              पासवर्ड याद रखने की कोई ज़रूरत नहीं। 1-क्लिक में शुरू करें।
            </p>
          </div>
        )}

        {/* Phone OTP Method */}
        {authMethod === 'phone' && (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    मोबाइल नंबर (Phone Number):
                  </label>
                  <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-gray-50 focus-within:border-emerald-600">
                    <span className="px-3 py-3 bg-gray-100 text-xs font-bold text-gray-600 border-r border-gray-200">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className="w-full text-xs font-bold p-3 bg-transparent focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={phoneNumber.length !== 10}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 text-xs hover:opacity-95 transition disabled:opacity-50"
                >
                  <span>OTP भेजें (Get OTP)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-center justify-between">
                  <span>+91 {phoneNumber} पर OTP भेजा गया</span>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-emerald-700 font-bold underline text-[11px]"
                  >
                    नंबर बदलें
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    4-अंकों का OTP दर्ज करें:
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="1 2 3 4"
                    className="w-full text-center text-lg tracking-widest font-black rounded-xl border border-gray-200 p-3 bg-gray-50 focus:outline-emerald-600"
                    required
                  />
                  <p className="text-[10px] text-gray-400 mt-1 text-center">डेमो के लिए कोई भी 4 अंक (उदा. 1234) दर्ज करें</p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || otp.length < 4}
                  className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 text-xs hover:opacity-95 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'सत्यापन हो रहा है...' : 'सत्यापित करें और लॉगिन करें ➔'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Benefits Footnote */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-2 text-[11px] text-gray-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% सुरक्षित • कोई पासवर्ड याद रखने की झंझट नहीं</span>
        </div>
      </div>
    </div>
  );
}
