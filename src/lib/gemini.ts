import { GoogleGenAI } from '@google/genai';
import { Question } from '@/types/quiz';

const fallbackQuestions: Record<string, Question[]> = {
  default: [
    {
      id: 1,
      questionHi: "1857 के प्रथम भारतीय स्वतंत्रता संग्राम के समय भारत का गवर्नर-जनरल कौन था?",
      questionEn: "Who was the Governor-General of India during the 1857 Revolt?",
      options: [
        "लॉर्ड कैनिंग (Lord Canning)",
        "लॉर्ड डलहौजी (Lord Dalhousie)",
        "लॉर्ड कर्जन (Lord Curzon)",
        "लॉर्ड विलियम बेंटिंक (Lord William Bentinck)"
      ],
      correctAnswer: 0,
      explanationHi: "1857 के विद्रोह के समय लॉर्ड कैनिंग भारत के गवर्नर जनरल थे। क्रांति के बाद 1858 के भारत सरकार अधिनियम द्वारा वे भारत के पहले वायसराय बने।",
      explanationEn: "Lord Canning was the Governor-General during the 1857 revolt (1856-1862). After the revolt, he became India's first Viceroy under the Government of India Act 1858."
    },
    {
      id: 2,
      questionHi: "भारतीय संविधान का कौन सा अनुच्छेद 'समानता का अधिकार' (Right to Equality) प्रदान करता है?",
      questionEn: "Which Article of the Indian Constitution provides the 'Right to Equality'?",
      options: [
        "अनुच्छेद 12 (Article 12)",
        "अनुच्छेद 14-18 (Articles 14-18)",
        "अनुच्छेद 19-22 (Articles 19-22)",
        "अनुच्छेद 21 (Article 21)"
      ],
      correctAnswer: 1,
      explanationHi: "भारतीय संविधान के अनुच्छेद 14 से 18 तक समानता के अधिकार का प्रावधान है। अनुच्छेद 14 विधि के समक्ष समानता सुनिश्चित करता है।",
      explanationEn: "Articles 14 to 18 of the Indian Constitution deal with the Right to Equality. Article 14 ensures equality before law."
    },
    {
      id: 3,
      questionHi: "भारत में 'हरित क्रांति' (Green Revolution) का जनक किसे माना जाता है?",
      questionEn: "Who is known as the Father of Green Revolution in India?",
      options: [
        "डॉ. वर्गीज कुरियन (Dr. Verghese Kurien)",
        "डॉ. एम. एस. स्वामीनाथन (Dr. M. S. Swaminathan)",
        "डॉ. होमी भाभा (Dr. Homi Bhabha)",
        "डॉ. ए. पी. जे. अब्दुल कलाम (Dr. APJ Abdul Kalam)"
      ],
      correctAnswer: 1,
      explanationHi: "डॉ. एम. एस. स्वामीनाथन को भारत में हरित क्रांति का जनक माना जाता है। उन्होंने उच्च उपज वाली गेहूँ की किस्मों का विकास किया।",
      explanationEn: "Dr. M. S. Swaminathan is considered the father of Green Revolution in India for introducing high-yielding wheat varieties."
    },
    {
      id: 4,
      questionHi: "भारतीय रिज़र्व बैंक (RBI) की स्थापना किस वर्ष हुई थी?",
      questionEn: "In which year was the Reserve Bank of India (RBI) established?",
      options: [
        "1935",
        "1947",
        "1950",
        "1969"
      ],
      correctAnswer: 0,
      explanationHi: "RBI की स्थापना 1 अप्रैल 1935 को भारतीय रिज़र्व बैंक अधिनियम, 1934 के प्रावधानों के अनुसार हिल्टन यंग कमीशन की सिफारिश पर हुई थी।",
      explanationEn: "The RBI was established on April 1, 1935, under the Reserve Bank of India Act 1934 on the recommendations of the Hilton Young Commission."
    },
    {
      id: 5,
      questionHi: "मानव शरीर में रक्त का शुद्धिकरण (Purification of Blood) किस अंग में होता है?",
      questionEn: "In which organ does the purification of blood take place in the human body?",
      options: [
        "हृदय (Heart)",
        "फेफड़े (Lungs)",
        "गुर्दा / वृक्क (Kidney)",
        "यकृत (Liver)"
      ],
      correctAnswer: 2,
      explanationHi: "गुर्दा (Kidney) रक्त से यूरिया और विषाक्त अपशिष्ट पदार्थों को छानकर मूत्र के रूप में बाहर निकालता है और रक्त को शुद्ध करता है।",
      explanationEn: "The kidneys filter blood to remove waste products and excess fluid, thereby purifying the blood."
    }
  ]
};

export async function generateQuizFromAI(
  topicOrText: string,
  questionCount: number = 5,
  difficulty: string = 'medium',
  base64Image?: string
): Promise<Question[]> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log("No GEMINI_API_KEY found, returning curated mock exam questions.");
    return fallbackQuestions.default.slice(0, questionCount);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const isPdf = Boolean(base64Image && (base64Image.startsWith('data:application/pdf') || base64Image.includes('application/pdf')));
    const isImage = Boolean(base64Image && !isPdf);

    let taskInstruction = `Generate exactly ${questionCount} multiple choice questions (MCQs) for the topic or notes provided: "${topicOrText}".`;
    if (isPdf) {
      taskInstruction = `TASK: You are given an uploaded PDF study material/notes. Carefully read and analyze all pages, text, formulas, facts, and topics inside this PDF document.
Generate exactly ${questionCount} multiple choice questions (MCQs) STRICTLY AND DIRECTLY BASED on the content of this PDF document.
${topicOrText ? `Optional user focus hint: "${topicOrText}".` : ''}
Do not invent unrelated questions outside this document.`;
    } else if (isImage) {
      taskInstruction = `TASK: You are given an uploaded photo, screenshot, or handwritten notes. Carefully examine and READ ALL TEXT, notes, formulas, dates, diagrams, and concepts present in this uploaded image.
Generate exactly ${questionCount} multiple choice questions (MCQs) STRICTLY AND DIRECTLY BASED on the information written in this image/screenshot.
${topicOrText ? `Optional user focus hint: "${topicOrText}".` : ''}
Do not invent questions outside what is visible in this image.`;
    }

    const prompt = `You are ParikshaAI, an expert Indian competitive exam mentor (SSC CGL, UPSC, Railway, State PCS).
${taskInstruction}
Difficulty Level: ${difficulty}.

CRITICAL REQUIREMENTS:
1. Every question MUST directly test what is provided in the material. Do not invent unrelated topics.
2. Every question MUST be bilingual: Hindi first, followed by clear English translation.
3. Provide exactly 4 distinct options in the "options" array.
4. "correctAnswer" MUST BE A ZERO-BASED INTEGER INDEX (0 for 1st option, 1 for 2nd option, 2 for 3rd option, 3 for 4th option). DO NOT output string text for correctAnswer.
5. Provide a clear, friendly explanation in both Hindi and English based on the material content.
6. Return ONLY a valid JSON array matching this exact schema:

[
  {
    "id": 1,
    "questionHi": "दिए गए दस्तावेज़ / इमेज के आधार पर प्रश्न",
    "questionEn": "Question in English based on material",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanationHi": "हिंदी में आसान भाषा में समाधान",
    "explanationEn": "Clear explanation in English"
  }
]`;

    let response;
    if (base64Image) {
      let mimeType = 'image/jpeg';
      if (isPdf) {
        mimeType = 'application/pdf';
      } else if (base64Image.startsWith('data:image/png')) {
        mimeType = 'image/png';
      } else if (base64Image.startsWith('data:image/webp')) {
        mimeType = 'image/webp';
      }
      
      // Clean prefix for any mime type: data:image/png;base64,... or data:application/pdf;base64,...
      const cleanBase64 = base64Image.replace(/^data:[^;]+;base64,/, '').trim();
      
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: cleanBase64
                }
              }
            ]
          }
        ]
      });
    } else {
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
    }

    const text = response.text || '';
    // Strip markdown code fences if present
    const cleanedJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const firstBracket = cleanedJson.indexOf('[');
    const lastBracket = cleanedJson.lastIndexOf(']');
    let jsonToParse = cleanedJson;
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      jsonToParse = cleanedJson.substring(firstBracket, lastBracket + 1);
    }
    const parsed: Question[] = JSON.parse(jsonToParse);

    // Normalize correctAnswer to ensure it is always a valid 0-based integer index
    parsed.forEach((q, idx) => {
      q.id = idx + 1;
      if (typeof q.correctAnswer !== 'number') {
        const parsedNum = parseInt(String(q.correctAnswer), 10);
        if (!isNaN(parsedNum) && parsedNum >= 0 && parsedNum < q.options.length) {
          q.correctAnswer = parsedNum;
        } else {
          // If it returned option text like "1526" or "बाबर", find matching option
          const matchIdx = q.options.findIndex(
            (opt) => opt.toLowerCase().trim() === String(q.correctAnswer).toLowerCase().trim()
          );
          q.correctAnswer = matchIdx !== -1 ? matchIdx : 0;
        }
      }
    });
    
    return parsed.length > 0 ? parsed : fallbackQuestions.default.slice(0, questionCount);
  } catch (error) {
    console.error("Error generating quiz with Gemini API:", error);
    return fallbackQuestions.default.slice(0, questionCount);
  }
}
