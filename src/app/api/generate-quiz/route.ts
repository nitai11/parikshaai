import { NextRequest, NextResponse } from 'next/server';
import { generateQuizFromAI } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topicOrText, questionCount = 5, difficulty = 'medium', base64Image } = body;

    if (!topicOrText && !base64Image) {
      return NextResponse.json(
        { error: 'Topic, notes, or image is required' },
        { status: 400 }
      );
    }

    const questions = await generateQuizFromAI(
      topicOrText || 'General Knowledge and Indian History',
      Number(questionCount),
      difficulty,
      base64Image
    );

    return NextResponse.json({
      success: true,
      quiz: {
        id: `quiz_${Date.now()}`,
        topic: topicOrText || 'Uploaded Notes',
        questions,
        totalQuestions: questions.length,
        difficulty,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('API Error in generate-quiz:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}
