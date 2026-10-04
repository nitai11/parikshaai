'use client';

import { Camera, FileText, Sparkles, Swords, Trophy, Clock, Users, ArrowRight, BookOpen, MessageCircle, Shield } from 'lucide-react';

interface HomeScreenProps {
  onOpenUpload: (initialTopic?: string) => void;
  onOpenBattle: () => void;
  onOpenPro: () => void;
  onOpenMistakes: () => void;
  onOpenLegal: (tab: 'terms' | 'privacy' | 'refund' | 'contact') => void;
  onOpenProfile: () => void;
  mistakesCount: number;
  isPro: boolean;
}

const POPULAR_TOPICS = [
  { label: '1857 Kranti', icon: '🇮🇳' },
  { label: 'Indian Polity (संविधान)', icon: '📖' },
  { label: 'SSC GK PYQ', icon: '📚' },
  { label: 'Percentage (Maths)', icon: '➗' },
  { label: 'Modern History', icon: '📈' },
  { label: 'General Science (जीव विज्ञान)', icon: '🔬' }
];

export default function HomeScreen({
  onOpenUpload,
  onOpenBattle,
  onOpenPro,
  onOpenMistakes,
  onOpenLegal,
  onOpenProfile,
  mistakesCount,
  isPro
}: HomeScreenProps) {
  return (
    <div className="max-w-md mx-auto px-4 pt-4 pb-24 space-y-5 relative">
      {/* Greeting Header */}
      <div className="flex items-center justify-between">
        <div onClick={onOpenProfile} className="cursor-pointer group">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-emerald-700 transition">
            Namaste, <span className="text-emerald-600">Rahul!</span>
          </h2>
          <p className="text-xs text-gray-500 font-medium">आज आपकी तैयारी का 5वाँ दिन है 🎯 (प्रोफाइल देखें)</p>
        </div>
        <div
          onClick={onOpenProfile}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md cursor-pointer hover:scale-105 active:scale-95 transition"
          title="प्रोफाइल खोलें"
        >
          R
        </div>
      </div>

      {/* Hero Card: AI se Mock Test Banao */}
      <div className="bg-gradient-to-br from-emerald-700 via-teal-800 to-indigo-900 rounded-3xl p-5 text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl" />

        <div className="relative z-10 mb-4 text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase text-emerald-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Powered Personalized Tests</span>
          </div>
          <h3 className="text-xl font-black tracking-tight">AI se Mock Test Banao</h3>
          <p className="text-xs text-emerald-100 font-medium mt-0.5">
            किताब या नोट्स की फोटो खींचो, 5 सेकंड में टेस्ट तैयार!
          </p>
        </div>

        {/* 2 Big Action Touch Cards */}
        <div className="grid grid-cols-2 gap-3 relative z-10">
          {/* Scan Notes / Camera */}
          <button
            onClick={() => onOpenUpload()}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-left transition active:scale-95 group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/80 flex items-center justify-center text-white mb-2 shadow-sm group-hover:scale-110 transition">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-sm text-white">Scan Notes</div>
              <div className="text-[10px] text-emerald-200 font-medium">Take photos of notes</div>
            </div>
          </button>

          {/* Upload PDF / Notes */}
          <button
            onClick={() => onOpenUpload()}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-left transition active:scale-95 group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/80 flex items-center justify-center text-white mb-2 shadow-sm group-hover:scale-110 transition">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-sm text-white">Upload PDF</div>
              <div className="text-[10px] text-indigo-200 font-medium">Coaching materials</div>
            </div>
          </button>
        </div>
      </div>

      {/* 📕 मेरी गलतियाँ (Mistake Locker) Card */}
      <div
        onClick={onOpenMistakes}
        className="bg-white rounded-3xl p-4 border border-rose-200 shadow-xs cursor-pointer hover:border-rose-400 transition flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm text-gray-900">मेरी गलतियाँ (Mistake Locker)</span>
              <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded-md">
                {mistakesCount} सवाल पेंडिंग
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              अपनी पिछली गलतियों का रिवीज़न टेस्ट देकर कमजोरियों को दूर करें!
            </p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-rose-600 group-hover:translate-x-1 transition" />
      </div>

      {/* Popular Topics Section */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-sm font-black text-gray-900">Popular Topics (लोकप्रिय विषय)</h4>
          <span className="text-[11px] text-gray-400 font-semibold">1-Click Test</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {POPULAR_TOPICS.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => onOpenUpload(topic.label)}
              className="p-3 bg-white rounded-xl border border-gray-100 shadow-2xs hover:border-emerald-300 hover:bg-emerald-50/30 transition text-left flex items-center gap-2 group"
            >
              <span className="text-base">{topic.icon}</span>
              <span className="text-xs font-bold text-gray-800 group-hover:text-emerald-700 truncate">
                {topic.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 🏆 All-India 9 PM Live Event Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-4 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            Live Event
          </span>
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>9:00 PM Tonight</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h5 className="font-black text-sm text-gray-900">All-India 9 PM Live Test</h5>
            <p className="text-xs text-gray-600 font-medium">
              पूरे भारत के छात्रों के साथ लाइव टेस्ट दें और अपनी State Rank देखें!
            </p>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-1">
              <Users className="w-3 h-3" />
              <span>12,450 students registered</span>
            </div>
          </div>
        </div>
      </div>

      {/* ⚔️ 1v1 Chai Challenge Callout */}
      <div
        onClick={onOpenBattle}
        className="bg-white rounded-3xl p-4 border border-orange-200 shadow-xs cursor-pointer hover:border-orange-400 transition flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm text-gray-900">1v1 Chai Challenge</span>
              <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-1.5 py-0.5 rounded-md">
                Viral ☕
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              दोस्त को WhatsApp पर इनवाइट करो, हारने वाला चाय पिलाएगा!
            </p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition" />
      </div>

      {/* Pro Pass Callout Banner (if not pro) */}
      {!isPro && (
        <div
          onClick={onOpenPro}
          className="bg-gradient-to-r from-emerald-600 to-indigo-600 rounded-2xl p-3.5 text-white flex items-center justify-between cursor-pointer hover:opacity-95 transition shadow-md shadow-emerald-600/20"
        >
          <div>
            <div className="font-black text-xs">⚡ ParikshaAI Pro Pass सिर्फ ₹49 में</div>
            <div className="text-[11px] text-emerald-100">अनलिमिटेड टेस्ट और नोट्स स्कैनिंग अनलॉक करें</div>
          </div>
          <button className="bg-white text-emerald-700 text-xs font-black px-3 py-1.5 rounded-xl shadow-xs">
            Unlock
          </button>
        </div>
      )}

      {/* Legal Footer Links (Razorpay Mandatory Compliance) */}
      <div className="pt-4 border-t border-gray-200 text-center space-y-2">
        <div className="flex items-center justify-center gap-3 text-[11px] text-gray-500 font-medium flex-wrap">
          <button onClick={() => onOpenLegal('terms')} className="hover:text-emerald-700 underline">
            नियम और शर्तें (Terms)
          </button>
          <span>•</span>
          <button onClick={() => onOpenLegal('privacy')} className="hover:text-emerald-700 underline">
            गोपनीयता नीति (Privacy)
          </button>
          <span>•</span>
          <button onClick={() => onOpenLegal('refund')} className="hover:text-emerald-700 underline">
            रिफंड नीति (Refund)
          </button>
          <span>•</span>
          <button onClick={() => onOpenLegal('contact')} className="hover:text-emerald-700 underline">
            संपर्क (Contact Us)
          </button>
        </div>
        <p className="text-[10px] text-gray-400">
          © 2026 ParikshaAI. All rights reserved. 100% Made in India 🇮🇳
        </p>
      </div>

      {/* Floating WhatsApp Support Button */}
      <a
        href="https://api.whatsapp.com/send?phone=919876543210&text=Namaste!%20I%20need%20help%20with%20ParikshaAI"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-18 right-4 z-30 w-12 h-12 rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-500/30 flex items-center justify-center hover:scale-105 transition"
        title="WhatsApp सहायता / Need Help?"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
      </a>
    </div>
  );
}
