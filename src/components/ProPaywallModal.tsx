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
            <span>Khan Sir स्टाइल में देसी AI एक्सप्लेनेशन व डाउट सॉल्विंग</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-3 h-3" />
            </div>
            <span>All-India 9 PM Live Test में स्पेशल State Rank बैज</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-3 h-3" />
            </div>
            <span>कोचिंग और दोस्तों के साथ 1v1 बैटल अनलिमिटेड</span>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="space-y-2.5 mb-5">
          {/* Monthly Plan */}
          <div
            onClick={() => setSelectedPlan('monthly')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
              selectedPlan === 'monthly'
                ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-gray-900 text-sm">1 Month Unlimited Pass</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  लोकप्रिय
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">सिर्फ़ एक समोसे के बराबर कीमत!</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-black text-emerald-700">₹49</div>
              <div className="text-[10px] text-gray-400 line-through">₹199</div>
            </div>
          </div>

          {/* Yearly Plan */}
          <div
            onClick={() => setSelectedPlan('yearly')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
              selectedPlan === 'yearly'
                ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-gray-900 text-sm">Full Year (12 Months) Pass</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  60% OFF
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">पूरे साल किसी भी परीक्षा के लिए</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-black text-emerald-700">₹299</div>
              <div className="text-[10px] text-gray-400 line-through">₹799</div>
            </div>
          </div>
        </div>

        {/* UPI Checkout Button */}
        <button
          onClick={handlePayUPI}
          disabled={isProcessing}
          className="w-full py-4 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 hover:opacity-95 transition text-sm disabled:opacity-50"
        >
          {isProcessing ? (
            <span>UPI पेमेंट कनेक्ट हो रहा है...</span>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-white" />
              <span>
                {selectedPlan === 'monthly' ? '₹49 देकर Unlock करें (GPay / PhonePe / Paytm)' : '₹299 देकर Unlock करें'}
              </span>
            </>
          )}
        </button>

        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-gray-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% सुरक्षित UPI पेमेंट • 7-Day Money Back Guarantee</span>
        </div>
      </div>
    </div>
  );
}
