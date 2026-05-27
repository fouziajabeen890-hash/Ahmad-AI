import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// API Routes for proxying Gemini API requests securely

app.post('/api/chat', async (req, res) => {
  try {
    const { contents } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not set on the server.' });
    }
    
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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
    
    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate chat response' });
  }
});

app.post('/api/review', async (req, res) => {
  try {
    const { code } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not set on the server.' });
    }
    
    const ai = new GoogleGenAI({ apiKey });
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
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Review API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate review' });
  }
});

app.post('/api/quiz', async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not set on the server.' });
    }
    
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Generate a 5-question multiple choice quiz about Python programming, specifically covering the topic: "${topic}" with difficulty: "${difficulty}".
Output the quiz strictly in JSON format as an array of objects. Each object must have:
- "question": string (the question text)
- "options": array of 4 strings (the possible answers)
- "correctAnswerIndex": number (0-3, index of the correct option)
- "explanation": string (brief explanation of why the answer is correct)

Return ONLY valid JSON and no other text or markdown block formatting.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    
    let jsonContent = response.text || "[]";
    // Strip markdown JSON block if present
    jsonContent = jsonContent.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(jsonContent);
    res.json(parsed);
  } catch (error: any) {
    console.error('Quiz API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate quiz' });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
