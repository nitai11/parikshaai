'use client';

import React, { useState, useRef } from 'react';
import { Camera, FileText, X, Sparkles, Loader2, UploadCloud, Mic, MicOff } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuiz: (topicOrText: string, count: number, difficulty: string, base64Image?: string) => Promise<void>;
  isLoading: boolean;
  initialTopic?: string;
}

export default function UploadModal({
  isOpen,
  onClose,
  onStartQuiz,
  isLoading,
  initialTopic = ''
}: UploadModalProps) {
  const [activeTab, setActiveTab] = useState<'topic' | 'camera' | 'file'>('topic');
  const [topic, setTopic] = useState(initialTopic);
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<string>('medium');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('आपके ब्राउज़र में वॉइस रिकॉग्निशन सपोर्ट नहीं है। कृपया लिखकर टॉपिक दर्ज करें।');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN'; // Hindi & Indian English
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setTopic((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() && !selectedImage) return;
    await onStartQuiz(topic, questionCount, difficulty, selectedImage || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">नया AI टेस्ट बनाएं</h3>
              <p className="text-xs text-gray-500">Create AI Exam Mock Test</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-xl mt-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('topic')}
            className={`py-2 rounded-lg transition ${
              activeTab === 'topic' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-600'
            }`}
          >
            ✍️ टॉपिक लिखो
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('camera');
              cameraInputRef.current?.click();
            }}
            className={`py-2 rounded-lg transition ${
              activeTab === 'camera' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-600'
            }`}
          >
            📸 फोटो खींचो
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('file');
              fileInputRef.current?.click();
            }}
            className={`py-2 rounded-lg transition ${
              activeTab === 'file' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-600'
            }`}
          >
            📄 PDF / फाइल
          </button>
        </div>

        {/* Hidden File Inputs */}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={cameraInputRef}
          onChange={handleImageUpload}
          className="hidden"
        />
        <input
          type="file"
          accept="image/*,application/pdf"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
        />

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Content Input or Preview */}
          {selectedImage ? (
            <div className="relative rounded-2xl overflow-hidden border border-emerald-200 bg-emerald-50/50 p-3">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 mb-2">
                <span>✓ नोट्स की फोटो सेलेक्ट हो गई</span>
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="text-red-500 hover:underline"
                >
                  हटाएं (Remove)
                </button>
              </div>
              <img
                src={selectedImage}
                alt="Selected notes preview"
                className="max-h-40 w-full object-cover rounded-xl border border-emerald-100"
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-700">
                  विषय या नोट्स का टॉपिक (Topic / Notes):
                </label>
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition shadow-xs ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                  title="बोलकर लिखें / Speak topic"
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      <span>सुन रहा हूँ... बोलिए</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-emerald-600" />
                      <span>🎙️ बोलकर लिखें</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="उदा. 1857 की क्रांति, भारत का संविधान अनुच्छेद 1-50, Percentage Maths, या कोई भी चैप्टर..."
                rows={3}
                className="w-full text-sm rounded-xl border border-gray-200 p-3 focus:outline-emerald-600 focus:border-emerald-600 bg-gray-50/50"
              />
            </div>
          )}

          {/* Question Count and Difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">सवालों की संख्या:</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full text-xs font-semibold rounded-xl border border-gray-200 p-2.5 bg-gray-50 focus:outline-emerald-600"
              >
                <option value={5}>5 सवाल (क्विक 2-min)</option>
                <option value={10}>10 सवाल (फुल टेस्ट)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">कठिनाई (Level):</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full text-xs font-semibold rounded-xl border border-gray-200 p-2.5 bg-gray-50 focus:outline-emerald-600"
              >
                <option value="easy">सरल (Easy / Basic)</option>
                <option value="medium">परीक्षा स्तर (Exam Level)</option>
                <option value="hard">कठिन (Tough / Ranker)</option>
              </select>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading || (!topic.trim() && !selectedImage)}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-600/20 hover:opacity-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>AI टेस्ट बना रहा है... (3 sec)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>🚀 AI मॉक टेस्ट शुरू करें</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
