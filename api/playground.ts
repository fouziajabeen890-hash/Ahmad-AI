import { GoogleGenAI } from '@google/genai';

export const config = {
  runtime: 'edge', // Use Edge Runtime for streaming with no cold starts
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  
  try {
    const body = await req.json();
    const { code } = body;
    if (typeof code !== 'string' || code.length > 50000) {
      return new Response(JSON.stringify({ error: 'Invalid code provided.' }), { status: 400 });
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
      model: "gemini-2.5-flash",
      contents: `You are a Python interpreter. Execute or explain output of this code as if you were a real Python console. If there are errors, show them. Keep it concise. Code:\n\n${code}`,
      config: {
        systemInstruction: "You are a Python console. Output only what the code would print, or a brief explanation of the result. If it's a code snippet, simulate the output.",
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
    console.error('Playground API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to generate playground response' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
