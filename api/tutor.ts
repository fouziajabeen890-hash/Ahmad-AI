import { GoogleGenAI } from '@google/genai';

export const config = {
  runtime: 'edge', // Use Edge Runtime for streaming with no cold starts
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  
  try {
    const body = await req.json();
    const { contents, lectureTitle, lectureDescription } = body;
    if (!contents || !Array.isArray(contents)) {
      return new Response(JSON.stringify({ error: 'Invalid contents format.' }), { status: 400 });
    }
    if (typeof lectureTitle !== 'string' || lectureTitle.length > 500) {
      return new Response(JSON.stringify({ error: 'Invalid lectureTitle format.' }), { status: 400 });
    }
    if (typeof lectureDescription !== 'string' || lectureDescription.length > 2000) {
      return new Response(JSON.stringify({ error: 'Invalid lectureDescription format.' }), { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is not set on the server.' }), { status: 500 });
    }
    
    // Explicitly use native fetch to satisfy edge runtime
    const ai = new GoogleGenAI({ 
      apiKey,
      httpOptions: { 
        headers: { 'User-Agent': 'vercel-serverless' },
        fetch: fetch 
      }
    });
    
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: `You are an elite, professional Python programming tutor. The student is currently watching the lecture: "${lectureTitle}". \n\nLecture Context: ${lectureDescription}\n\nYour goal is to guide the student, explain concepts clearly, and answer questions. Use code examples when helpful. You can respond in English or Roman Urdu/Hindi. Do not give away the final answer to an exercise immediately; guide them to it. Keep responses under 50 lines. Focus ONLY on Python.`,
      }
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) {
              controller.enqueue(new TextEncoder().encode(chunk.text));
            }
          }
          controller.close();
        } catch (e: any) {
          controller.error(e);
        }
      }
    });
    
    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error: any) {
    console.error('Tutor API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to generate tutor response' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
