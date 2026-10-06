'use client';

import React, { useState } from 'react';
import { Swords, X, Coffee, Share2, Copy, Check } from 'lucide-react';

interface BattleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topic: string) => void;
}

export default function BattleModal({
  isOpen,
  onClose,
  onSelectTopic
}: BattleModalProps) {
  const [battleTopic, setBattleTopic] = useState('1857 की क्रांति और आधुनिक इतिहास');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const challengeUrl = typeof window !== 'undefined' ? `${window.location.origin}?battle=true` : 'https://pariksha.nitaiitsolution.in';

  const shareText = `⚔️ 1v1 Chai Challenge!\n\nमैंने ParikshaAI पर "${battleTopic}" का क्विज़ बैटल शुरू किया है!\n☕ हारने वाला शाम की चाय पिलाएगा!\n\n👇 अभी लिंक पर क्लिक करके मुझे हराओ:\n${challengeUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleStartDuel = () => {
    onClose();
    onSelectTopic(battleTopic);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-xs">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-lg">1v1 Chai Challenge</h3>
              <p className="text-xs text-orange-600 font-bold">दोस्तों को चैलेंज करो, चाय जीतो!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Fun Chai Banner */}
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 my-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-amber-900">चाय की बाज़ी (Chai Rule):</h4>
            <p className="text-[11px] text-amber-800 font-medium">
              5 सवालों का रैपिड फायर टेस्ट। जिसके कम नंबर आए, शाम को वही चाय पिलाएगा! ☕
            </p>
          </div>
        </div>

        {/* Battle Topic Input */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-700 mb-1">
            बैटल का विषय (Battle Topic):
          </label>
          <input
            type="text"
            value={battleTopic}
            onChange={(e) => setBattleTopic(e.target.value)}
            className="w-full text-xs font-semibold rounded-xl border border-gray-200 p-3 bg-gray-50 focus:outline-emerald-600"
          />
        </div>

        {/* Quick Topic Presets */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {['1857 क्रांति', 'संविधान अनुच्छेद', 'Static GK', 'Maths Speed Test'].map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setBattleTopic(t)}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 transition"
            >
              {t}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            onClick={handleWhatsApp}
            className="w-full py-3.5 bg-[#25D366] text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-xs transition"
          >
            <Share2 className="w-4 h-4" />
            <span>📲 WhatsApp ग्रुप या दोस्त को इनवाइट भेजें</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopy}
              className="py-2.5 border border-gray-200 bg-white font-bold text-xs text-gray-700 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'कॉपी हो गया!' : 'लिंक कॉपी करें'}</span>
            </button>
            <button
              onClick={handleStartDuel}
              className="py-2.5 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-black flex items-center justify-center gap-1.5 transition"
            >
              <span>पहले खुद खेलें ➔</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
