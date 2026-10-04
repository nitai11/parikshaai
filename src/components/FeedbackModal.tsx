'use client';

import React, { useState } from 'react';
import { X, MessageSquare, Star, Send, CheckCircle2, MessageCircle, Heart } from 'lucide-react';
import { UserProfile } from '@/types/auth';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile | null;
}

const FEEDBACK_TAGS = [
  { id: 'suggestion', label: '💡 नया फीचर सुझाव', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  { id: 'bug', label: '🐞 कोई समस्या / बग', color: 'bg-red-50 text-red-800 border-red-200' },
  { id: 'exam', label: '📚 नई परीक्षा / विषय', color: 'bg-blue-50 text-blue-800 border-blue-200' },
  { id: 'praise', label: '❤️ तारीफ / अनुभव', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' }
];

export default function FeedbackModal({
  isOpen,
  onClose,
  currentUser
}: FeedbackModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [selectedTag, setSelectedTag] = useState<string>('suggestion');
  const [message, setMessage] = useState<string>('');
  const [contactInfo, setContactInfo] = useState<string>(
    currentUser?.phone || currentUser?.email || ''
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      alert('कृपया अपना सुझाव या फीडबैक लिखें।');
      return;
    }

    // Save locally
    try {
      const existing = JSON.parse(localStorage.getItem('pariksha_feedback_list') || '[]');
      existing.push({
        id: Date.now(),
        rating,
        tag: selectedTag,
        message: message.trim(),
        contact: contactInfo,
        userName: currentUser?.name || 'Anonymous Student',
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('pariksha_feedback_list', JSON.stringify(existing));
    } catch (err) {
      console.error('Error saving feedback', err);
    }

    setIsSubmitted(true);
  };

  const handleWhatsAppSend = () => {
    const text = encodeURIComponent(
      `*ParikshaAI Feedback & Suggestion*\n\n` +
      `⭐ Rating: ${rating}/5 Stars\n` +
      `🏷️ Type: ${selectedTag}\n` +
      `👤 Name: ${currentUser?.name || 'विद्यार्थी'}\n` +
      `📞 Contact: ${contactInfo || 'N/A'}\n\n` +
      `💬 Message:\n${message || 'App bahut acchi hai!'}`
    );
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-600 flex items-center justify-center text-white shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-base">आपका फीडबैक व सुझाव</h3>
              <p className="text-[11px] text-gray-500">ParikshaAI को और बेहतर बनाने में मदद करें</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl font-black text-gray-900">बहुत-बहुत धन्यवाद! 🙏</h4>
              <p className="text-xs text-gray-600 mt-1 max-w-xs mx-auto">
                आपका सुझाव हमारी टीम के पास सुरक्षित पहुँच गया है। हम आपके सुझाव पर जल्द काम करेंगे!
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleReset}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                होम स्क्रीन पर लौटें
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {/* Star Rating */}
            <div className="text-center p-3 bg-gradient-to-r from-amber-50/60 to-orange-50/60 rounded-2xl border border-amber-200/50">
              <span className="text-xs font-bold text-gray-700 block mb-1.5">
                आपको ParikshaAI कैसा लगा?
              </span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-[11px] font-bold text-amber-700 mt-1">
                {rating === 5 && '🌟 बहुत शानदार! (Excellent)'}
                {rating === 4 && '👍 बहुत अच्छा लगा (Good)'}
                {rating === 3 && '🙂 ठीक है (Average)'}
                {rating <= 2 && '🛠️ सुधार की ज़रूरत है (Needs Improvement)'}
              </p>
            </div>

            {/* Tags / Categories */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                विषय चुनें (Topic):
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FEEDBACK_TAGS.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => setSelectedTag(tag.id)}
                    className={`text-xs font-bold p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                      selectedTag === tag.id
                        ? `${tag.color} ring-2 ring-emerald-500 shadow-xs`
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{tag.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Box */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                आपका सुझाव या समस्या लिखें:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="उदा. 'मुझे UP Police का अलग सेक्शन चाहिए', या 'प्रश्नों में टाइमर थोड़ा और बढ़ाएं'..."
                rows={3}
                required
                className="w-full text-xs font-medium rounded-xl border border-gray-200 p-3 bg-gray-50 focus:bg-white focus:outline-emerald-600"
              />
            </div>

            {/* Optional Contact info */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">
                मोबाइल नंबर या ईमेल (वैकल्पिक - यदि आप रिप्लाई चाहते हैं):
              </label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="उदा. 9876543210 या rahul@gmail.com"
                className="w-full text-xs font-semibold rounded-xl border border-gray-200 p-2.5 bg-gray-50 focus:bg-white focus:outline-emerald-600"
              />
            </div>

            {/* Submit Button */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition active:scale-[0.99]"
              >
                <Send className="w-4 h-4" />
                <span>फीडबैक सबमिट करें (Submit Feedback)</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppSend}
                className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>सीधे WhatsApp पर सुझाव भेजें</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
