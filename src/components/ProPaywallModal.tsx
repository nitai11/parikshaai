'use client';

import React, { useState } from 'react';
import { Crown, Check, X, ShieldCheck, Zap } from 'lucide-react';

interface ProPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProPaywallModal({
  isOpen,
  onClose,
  onSuccess
}: ProPaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePayUPI = () => {
    setIsProcessing(true);
    // Simulating instant Razorpay/Cashfree UPI approval
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
      alert('🎉 बधाई हो! आपका ParikshaAI Unlimited Pro Pass एक्टिवेट हो गया है!');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-lg">ParikshaAI Pro Pass</h3>
              <p className="text-xs text-emerald-700 font-semibold">100% परीक्षा में सफलता का साथी</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feature List */}
        <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-2xl p-4 my-4 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-3 h-3" />
            </div>
            <span>अनलिमिटेड नोट्स व फोटो से AI टेस्ट बनाएं (No Limits)</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-3 h-3" />
            </div>
            <span>Khan Sir स्टाइल में देसी AI एक्सप्लेनेशन व समाधान</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-3 h-3" />
            </div>
            <span>All-India 9 PM Live Test में स्पेशल स्टेट रैंक बैज</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-3 h-3" />
            </div>
            <span>दोस्तों के साथ 1v1 चाय बैटल अनलिमिटेड</span>
          </div>
        </div>

        {/* 30 Days Free Launching Banner Card */}
        <div className="p-4 rounded-2xl border-2 border-emerald-600 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-xs mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              🎉 Launching Offer
            </span>
            <div className="text-right">
              <span className="text-xl font-black text-emerald-700">₹0 (FREE)</span>
              <span className="text-[11px] text-gray-400 line-through ml-1.5">₹49/mo</span>
            </div>
          </div>
          <h4 className="font-black text-gray-900 text-sm">30 Days Unlimited Pro Access</h4>
          <p className="text-xs text-emerald-800 font-medium mt-1">
            शुरुआती छात्रों के लिए पहले 30 दिन का पूरा प्रो पास 100% मुफ़्त है! जितने मर्जी चाहे टेस्ट बनाएं।
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            onSuccess();
            onClose();
          }}
          className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 hover:opacity-95 transition text-sm"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>✅ 30 Days Free Pass Active है • पढ़ाई शुरू करें</span>
        </button>

        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-gray-500 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>कोई क्रेडिट कार्ड या फीस नहीं • 100% मुफ़्त अर्ली एक्सेस</span>
        </div>
      </div>
    </div>
  );
}
