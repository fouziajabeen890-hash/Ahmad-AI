import { GoogleGenAI } from '@google/genai';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    const { contents } = req.body;
    if (!contents || !Array.isArray(contents)) {
      return res.status(400).json({ error: 'Invalid contents format: expected an array.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not set on the server.' });
    }
    
    const ai = new GoogleGenAI({ 
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'vercel-serverless' } }
    });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: `You are "Mr Ahmad AI Ultra", the most advanced, world-class Python Architect and AI assistant in existence. You possess deep, expert-level knowledge of Python internals, advanced design patterns, performance optimization, and cutting-edge libraries.
CRITICAL RULES:
1. ONLY answer questions about Python programming. If asked about anything else, politely decline and state that your neural pathways are strictly optimized for Python.
2. Keep your answers STRICTLY to a maximum of 78 lines. Be highly informative, professional, and expert-level, but stay within this limit.
3. You can reply in English or Roman Urdu/Hindi. Maintain a highly professional, advanced AI persona.
4. If the user uploads a file or image, analyze it assuming it is related to Python (e.g., Python code, errors, flowcharts, datasets). If it's not related to Python, politely decline.`
      }
    });
    
    res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate chat response' });
  }
}
