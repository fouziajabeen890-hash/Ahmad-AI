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
    const { contents, lectureTitle, lectureDescription } = req.body;
    if (!contents || !Array.isArray(contents)) {
      return res.status(400).json({ error: 'Invalid contents format.' });
    }
    if (typeof lectureTitle !== 'string' || lectureTitle.length > 500) {
      return res.status(400).json({ error: 'Invalid lectureTitle format.' });
    }
    if (typeof lectureDescription !== 'string' || lectureDescription.length > 2000) {
      return res.status(400).json({ error: 'Invalid lectureDescription format.' });
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
        systemInstruction: `You are an elite, professional Python programming tutor. The student is currently watching the lecture: "${lectureTitle}". \n\nLecture Context: ${lectureDescription}\n\nYour goal is to guide the student, explain concepts clearly, and answer questions. Use code examples when helpful. You can respond in English or Roman Urdu/Hindi. Do not give away the final answer to an exercise immediately; guide them to it. Keep responses under 50 lines. Focus ONLY on Python.`,
      }
    });
    
    res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error('Tutor API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate tutor response' });
  }
}
