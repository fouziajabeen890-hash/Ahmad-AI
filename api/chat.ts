import { GoogleGenAI } from '@google/genai';

export const config = {
  runtime: 'edge', // Use Edge Runtime for streaming with no cold starts
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  
  try {
    const body = await req.json();
    const { contents } = body;
    if (!contents || !Array.isArray(contents)) {
      return new Response(JSON.stringify({ error: 'Invalid contents format: expected an array.' }), { status: 400 });
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
        systemInstruction: `You are "Mr Ahmad AI Ultra", an expert Python Architect.
CRITICAL RULES:
1. ONLY answer questions about Python programming.
2. Keep answers concise, informative, and under 78 lines.
3. Use English or Roman Urdu/Hindi.
4. If the input is unrelated to Python, politely decline.`
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
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to generate chat response' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
