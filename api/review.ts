import { GoogleGenAI } from '@google/genai';

export const config = {
  runtime: 'edge', // Use Edge Runtime for streaming with no cold starts
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  
  try {
    const body = await req.json();
    const { code } = body;
    if (typeof code !== 'string' || !code.trim() || code.length > 50000) {
      return new Response(JSON.stringify({ error: 'Invalid code provided. Must be a non-empty string under 50,000 characters.' }), { status: 400 });
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
    
    const prompt = `You are an expert Python code reviewer. Analyze the following Python code.
Provide a concise review covering:
1. Potential Bugs or Errors
2. Performance Improvements
3. Best Practices & PEP 8 compliance
4. A refactored version of the code (if applicable)

Code to review:
\`\`\`python
${code}
\`\`\`
`;
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: prompt,
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
    console.error('Review API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to generate review' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
