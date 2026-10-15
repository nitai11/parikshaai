'use client';

import React, { useState, useRef } from 'react';
import { Camera, FileText, X, Sparkles, Loader2, UploadCloud, Mic, MicOff, CheckCircle2 } from 'lucide-react';
import { extractPdfContent } from '@/lib/pdfExtractor';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuiz: (
    topicOrText: string,
    count: number,
    difficulty: string,
    base64Image?: string,
    quizTitle?: string
  ) => Promise<void>;
  isLoading: boolean;
  initialTopic?: string;
}

const TARGET_EXAMS = [
  { label: '🏆 SSC CGL / CHSL', query: 'SSC CGL Tier 1 GK & General Studies PYQ' },
  { label: '🇮🇳 UPSC / State PCS', query: 'UPSC Civil Services Prelims GS Paper 1' },
  { label: '🚂 Railway RRB', query: 'Railway RRB NTPC General Awareness' },
  { label: '👮 UP Police', query: 'UP Police Constable सामान्य ज्ञान व हिंदी' },
  { label: '🧬 NEET Biology', query: 'NEET UG Biology NCERT High Yield' },
  { label: '🏦 Banking IBPS/SBI', query: 'Banking Awareness & Quantitative Aptitude' },
  { label: '📰 Current Affairs', query: 'राष्ट्रीय व अंतर्राष्ट्रीय करेंट अफेयर्स 2024' }
];

const POPULAR_SUGGESTIONS = [
  'भारतीय संविधान के मौलिक अधिकार',
  '1857 की क्रांति और स्वतंत्रता संग्राम',
  'सिंधु घाटी सभ्यता (Indus Valley)',
  'प्रतिशत व लाभ-हानि (Maths)',
  'मानव शरीर रचना व पाचन तंत्र'
];

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
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [isPdfFile, setIsPdfFile] = useState<boolean>(false);
  const [isExtractingPdf, setIsExtractingPdf] = useState<boolean>(false);
  const [pdfProgress, setPdfProgress] = useState<{ current: number; total: number } | null>(null);
  const [extractedPdfText, setExtractedPdfText] = useState<string | null>(null);
  const [pdfStats, setPdfStats] = useState<{
    numPages: number;
    fileSizeMb: string;
    isScanned: boolean;
  } | null>(null);

  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const resetUploadState = () => {
    setSelectedImage(null);
    setSelectedFileName('');
    setIsPdfFile(false);
    setIsExtractingPdf(false);
    setPdfProgress(null);
    setExtractedPdfText(null);
    setPdfStats(null);
  };

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

  // Compress image on client side to ensure <300KB size for instant upload and perfect OCR
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round(height * (MAX_WIDTH / width));
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round(width * (MAX_HEIGHT / height));
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context failed'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // 0.8 quality produces ~150-250KB high-res JPEG
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (isPdf) {
      // Allow up to 30MB PDFs
      if (file.size > 30 * 1024 * 1024) {
        alert('कृपया 30MB से छोटी PDF फाइल अपलोड करें।');
        return;
      }

      setIsPdfFile(true);
      setSelectedFileName(file.name);
      setIsExtractingPdf(true);
      setPdfProgress({ current: 0, total: 0 });
      setExtractedPdfText(null);
      setSelectedImage(null);

      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      if (!topic.trim()) {
        setTopic(cleanName ? `${cleanName} (PDF नोट्स)` : 'PDF नोट्स से AI टेस्ट');
      }

      try {
        const result = await extractPdfContent(file, 30, (curr, tot) => {
          setPdfProgress({ current: curr, total: tot });
        });

        if (!result.success) {
          alert('PDF पढ़ने में असमर्थ: ' + (result.error || 'कृपया दूसरी फाइल चुनें'));
          resetUploadState();
          return;
        }

        setPdfStats({
          numPages: result.numPages,
          fileSizeMb: (file.size / (1024 * 1024)).toFixed(1),
          isScanned: result.isScanned
        });

        if (result.isScanned && result.pageImageBase64) {
          setSelectedImage(result.pageImageBase64);
          setExtractedPdfText(null);
        } else if (result.text) {
          setSelectedImage(null);
          setExtractedPdfText(result.text);
        }
      } catch (err: any) {
        console.error('PDF parsing error:', err);
        alert('PDF पढ़ने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
        resetUploadState();
      } finally {
        setIsExtractingPdf(false);
      }
      return;
    }

    // It is an Image / Screenshot / Camera Photo
    try {
      const compressed = await compressImage(file);
      setSelectedImage(compressed);
      setSelectedFileName(file.name);
      setIsPdfFile(false);
      setExtractedPdfText(null);
      setPdfStats(null);
      if (!topic.trim()) {
        setTopic('फोटो / स्क्रीनशॉट नोट्स');
      }
    } catch (err) {
      console.error('Error compressing image:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setSelectedFileName(file.name);
        setIsPdfFile(false);
        setExtractedPdfText(null);
        setPdfStats(null);
        if (!topic.trim()) {
          setTopic('फोटो / स्क्रीनशॉट नोट्स');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isExtractingPdf) return;

    if (isPdfFile && extractedPdfText) {
      const cleanTitle = topic.trim() || selectedFileName.replace(/\.[^/.]+$/, '') || 'PDF नोट्स';
      const pdfHeader = `--- PDF DOCUMENT CONTENT: ${selectedFileName} (${pdfStats?.numPages || 1} Pages) ---\n`;
      // Send up to 50,000 characters of high-yield extracted text directly
      const fullText = `${pdfHeader}${extractedPdfText.slice(0, 50000)}`;
      await onStartQuiz(fullText, questionCount, difficulty, undefined, cleanTitle);
      return;
    }

    if (isPdfFile && selectedImage) {
      // Scanned PDF (single canvas snapshot)
      const cleanTitle = topic.trim() || selectedFileName.replace(/\.[^/.]+$/, '') || 'स्कैन PDF नोट्स';
      await onStartQuiz(topic.trim() || 'स्कैन PDF नोट्स', questionCount, difficulty, selectedImage, cleanTitle);
      return;
    }

    if (!topic.trim() && !selectedImage) return;
    const finalTopic = topic.trim() || 'स्क्रीनशॉट नोट्स से AI टेस्ट';
    await onStartQuiz(finalTopic, questionCount, difficulty, selectedImage || undefined, finalTopic);
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
            onClick={() => {
              if (!isLoading) {
                resetUploadState();
                onClose();
              }
            }}
            disabled={isLoading || isExtractingPdf}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition disabled:opacity-50"
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
            📄 PDF (30MB)
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
          {/* PDF Extracting Progress Indicator */}
          {isExtractingPdf && (
            <div className="relative rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 text-indigo-600 animate-spin shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    📄 PDF विश्लेषित की जा रही है... (30MB तक सपोर्टेड)
                  </p>
                  <p className="text-[11px] text-indigo-700 font-medium mt-0.5">
                    {pdfProgress && pdfProgress.total > 0
                      ? `पेज ${pdfProgress.current} / ${pdfProgress.total} पढ़े जा रहे हैं...`
                      : 'डॉक्यूमेंट लोड हो रहा है...'}
                  </p>
                </div>
              </div>
              {pdfProgress && pdfProgress.total > 0 && (
                <div className="w-full bg-indigo-200 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-200"
                    style={{
                      width: `${Math.max(5, Math.round((pdfProgress.current / pdfProgress.total) * 100))}%`
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* PDF Loaded State */}
          {!isExtractingPdf && isPdfFile && (extractedPdfText || selectedImage) && (
            <div className="relative rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 mb-2">
                <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  PDF सफलतापूर्वक लोड हो गई (30MB समर्थित)
                </span>
                <button
                  type="button"
                  onClick={resetUploadState}
                  className="text-red-500 hover:text-red-700 font-semibold text-xs hover:underline"
                >
                  हटाएं (Remove)
                </button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-emerald-100 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {selectedFileName || 'PDF Document'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {pdfStats?.fileSizeMb && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {pdfStats.fileSizeMb} MB
                      </span>
                    )}
                    {pdfStats?.numPages ? (
                      <span className="text-[11px] text-gray-600 font-medium">
                        कुल {pdfStats.numPages} पेज
                      </span>
                    ) : null}
                    {pdfStats?.isScanned && (
                      <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">
                        स्कैन प्रति
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-emerald-600 font-medium mt-1">
                    ✓ AI इस PDF सामग्री से सीधे प्रामाणिक सवाल तैयार करेगा
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Image / Photo Selected State */}
          {!isExtractingPdf && !isPdfFile && selectedImage && (
            <div className="relative rounded-2xl overflow-hidden border border-emerald-200 bg-emerald-50/50 p-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 mb-2">
                <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  फोटो / स्क्रीनशॉट नोट्स सेलेक्ट हो गया
                </span>
                <button
                  type="button"
                  onClick={resetUploadState}
                  className="text-red-500 hover:text-red-700 font-semibold text-xs hover:underline"
                >
                  हटाएं (Remove)
                </button>
              </div>
              <img
                src={selectedImage}
                alt="Selected notes preview"
                className="max-h-48 w-full object-contain rounded-xl border border-emerald-100 bg-white"
              />
              <p className="text-[11px] text-emerald-700 font-medium mt-2 text-center">
                ✓ AI इस फोटो / स्क्रीनशॉट नोट्स को पढ़कर सीधे सवाल बनाएगा
              </p>
            </div>
          )}

          {/* Standard Input when no file selected */}
          {!selectedImage && !isPdfFile && !isExtractingPdf && (
            <div className="space-y-2.5">
              {/* Quick Exam Selection Chips */}
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                  🎯 परीक्षा चुनें (अगर नोट्स नहीं हैं तो सीधे चुनें):
                </label>
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {TARGET_EXAMS.map((exam, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTopic(exam.query)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-xl whitespace-nowrap transition border ${
                        topic === exam.query
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-gray-50 hover:bg-emerald-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      {exam.label}
                    </button>
                  ))}
                </div>
              </div>

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

              {/* PDF & Material Capacity Highlight Banner */}
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <UploadCloud className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-950">
                      25MB - 30MB तक PDF बुक्स व नोट्स अपलोड करें
                    </p>
                    <p className="text-[10px] text-blue-700">
                      कोचिंग बुक्स, क्लासरूम नोट्स व PYQs तुरंत टेस्ट में बदलें
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold px-2.5 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shrink-0"
                >
                  फाइल चुनें
                </button>
              </div>

              {/* Popular Suggestions */}
              <div className="flex flex-wrap gap-1">
                {POPULAR_SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTopic(sug)}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-800 transition"
                  >
                    + {sug}
                  </button>
                ))}
              </div>

              {/* Verified Quality & No-Fake-Question Guarantee */}
              <div className="flex items-start gap-2 p-2.5 bg-emerald-50/90 border border-emerald-200/90 rounded-xl text-[11px] text-emerald-900 font-medium">
                <span className="text-sm shrink-0">🛡️</span>
                <span>
                  <strong>100% प्रामाणिक व सत्यापित:</strong> सभी प्रश्न UPSC, SSC, RRB के असली पिछले वर्षों के प्रश्न (PYQ) व NCERT से तैयार होंगे। कोई मनगढ़ंत या फर्जी प्रश्न नहीं!
                </span>
              </div>
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
                <option value={10}>10 सवाल (स्टैंडर्ड टेस्ट)</option>
                <option value={15}>15 सवाल (गहन अभ्यास - 15 Q)</option>
                <option value={20}>20 सवाल (फुल चैप्टर टेस्ट - 20 Q)</option>
                <option value={25}>25 सवाल (महा-अभ्यास - 25 Q)</option>
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
            disabled={
              isLoading ||
              isExtractingPdf ||
              (!topic.trim() && !selectedImage && !extractedPdfText)
            }
            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-600/20 hover:opacity-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>AI टेस्ट बना रहा है... (3 sec)</span>
              </>
            ) : isExtractingPdf ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>PDF पढ़ी जा रही है...</span>
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
