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
    if (typeof code !== 'string' || !code.trim() || code.length > 50000) {
      return res.status(400).json({ error: 'Invalid code provided. Must be a non-empty string under 50,000 characters.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not set on the server.' });
    }
    
    const ai = new GoogleGenAI({ 
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'vercel-serverless' } }
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
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });
    
    res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error('Review API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate review' });
  }
}
