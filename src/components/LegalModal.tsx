'use client';

import React, { useState } from 'react';
import { Shield, FileText, RotateCcw, Phone, X, Check } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'terms' | 'privacy' | 'refund' | 'contact';
}

export default function LegalModal({
  isOpen,
  onClose,
  defaultTab = 'terms'
}: LegalModalProps) {
  const [tab, setTab] = useState<'terms' | 'privacy' | 'refund' | 'contact'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-base">नीति और शर्तें (Legal Policies)</h3>
              <p className="text-[11px] text-gray-500">100% पारदर्शी और सुरक्षित</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Pills */}
        <div className="grid grid-cols-4 gap-1 bg-gray-100 p-1 rounded-xl my-4 text-[10px] font-bold">
          <button
            onClick={() => setTab('terms')}
            className={`py-2 rounded-lg transition ${
              tab === 'terms' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-600'
            }`}
          >
            नियम (Terms)
          </button>
          <button
            onClick={() => setTab('privacy')}
            className={`py-2 rounded-lg transition ${
              tab === 'privacy' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-600'
            }`}
          >
            प्राइवेसी
          </button>
          <button
            onClick={() => setTab('refund')}
            className={`py-2 rounded-lg transition ${
              tab === 'refund' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-600'
            }`}
          >
            रिफंड नीति
          </button>
          <button
            onClick={() => setTab('contact')}
            className={`py-2 rounded-lg transition ${
              tab === 'contact' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-600'
            }`}
          >
            संपर्क करें
          </button>
        </div>

        {/* Tab Body */}
        <div className="text-xs text-gray-700 space-y-3 leading-relaxed">
          {tab === 'terms' && (
            <div>
              <h4 className="font-bold text-gray-900 mb-1">नियम और शर्तें (Terms & Conditions)</h4>
              <p>1. ParikshaAI एक शैक्षिक AI प्लेटफ़ॉर्म है जो छात्रों को परीक्षा की तैयारी में सहायता करता है।</p>
              <p>2. यूज़र प्लेटफ़ॉर्म का उपयोग केवल वैध शैक्षिक उद्देश्यों के लिए कर सकते हैं।</p>
              <p>3. हम किसी भी सरकारी निकाय से संबद्ध होने का दावा नहीं करते; सभी मॉक प्रश्न अभ्यास के लिए हैं।</p>
            </div>
          )}

          {tab === 'privacy' && (
            <div>
              <h4 className="font-bold text-gray-900 mb-1">गोपनीयता नीति (Privacy Policy)</h4>
              <p>1. हम आपकी व्यक्तिगत जानकारी (नाम, ईमेल, टेस्ट स्कोर) को कभी भी किसी तीसरे पक्ष को नहीं बेचते।</p>
              <p>2. आपके द्वारा अपलोड किए गए नोट्स केवल AI प्रश्न जनरेशन के लिए उपयोग किए जाते हैं।</p>
              <p>3. सभी भुगतानों को RBI द्वारा अनुमोदित भुगतान गेटवे (जैसे Razorpay) द्वारा सुरक्षित रूप से एन्क्रिप्ट किया जाता है।</p>
            </div>
          )}

          {tab === 'refund' && (
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 text-emerald-950">
              <h4 className="font-bold text-emerald-900 mb-1">💰 7-दिवसीय रिफंड गारंटी (Refund Policy)</h4>
              <p className="mb-2">
                यदि आप हमारे Pro Pass (₹49 या ₹299) से संतुष्ट नहीं हैं, तो आप खरीदारी के <strong>7 दिनों के भीतर</strong> बिना किसी शर्त के 100% रिफंड का दावा कर सकते हैं।
              </p>
              <p className="text-[11px] text-emerald-800">
                रिफंड प्राप्त करने के लिए बस हमारे WhatsApp सपोर्ट या ईमेल पर अपना ट्रांजैक्शन स्क्रीनशॉट भेजें। राशि 24 से 48 घंटे में आपके मूल बैंक खाते/UPI में वापस आ जाएगी।
              </p>
            </div>
          )}

          {tab === 'contact' && (
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 mb-1">संपर्क सूत्र (Contact Us & Support)</h4>
              <p>हम 24/7 छात्रों की सहायता के लिए उपलब्ध हैं:</p>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5 text-xs">
                <div>📧 <strong>ईमेल:</strong> support@nitaiitsolution.in</div>
                <div>💬 <strong>WhatsApp सहायता:</strong> +91 98765 43210</div>
                <div>🏢 <strong>कार्यालय:</strong> ParikshaAI EduTech, New Delhi, India</div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 pt-3 border-t border-gray-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl text-xs hover:bg-black transition"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
}
