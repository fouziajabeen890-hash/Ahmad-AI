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
    const { code } = req.body;
    if (typeof code !== 'string' || code.length > 50000) {
      return res.status(400).json({ error: 'Invalid code provided.' });
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
      model: "gemini-3.5-flash",
      contents: `You are a Python interpreter. Execute or explain output of this code as if you were a real Python console. If there are errors, show them. Keep it concise. Code:\n\n${code}`,
      config: {
        systemInstruction: "You are a Python console. Output only what the code would print, or a brief explanation of the result. If it's a code snippet, simulate the output.",
      }
    });
    
    res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error('Playground API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate playground response' });
  }
}
