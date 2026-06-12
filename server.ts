import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

dotenv.config();

const app = express();
app.set('trust proxy', 1); // Trust first proxy for rate limiting behind Cloud Run/Nginx
const PORT = 3000;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for Vite development
}));
app.use(cors());

// Rate limiting to prevent DoS attacks
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true, 
  legacyHeaders: false, 
  validate: { xForwardedForHeader: false } // Disable Forwarded header validation
});

app.use('/api/', apiLimiter);

app.use(express.json({ limit: '10mb' })); // Reduced limit from 50mb to 10mb for security

// API Routes for proxying Gemini API requests securely

app.post('/api/chat', async (req, res) => {
  try {
    const { contents } = req.body;
    
    // Strict input validation
    if (!contents || !Array.isArray(contents)) {
      return res.status(400).json({ error: 'Invalid contents format: expected an array.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not set on the server.' });
    }
    
    const ai = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
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

    // Strict input validation
    if (typeof code !== 'string' || !code.trim() || code.length > 50000) {
      return res.status(400).json({ error: 'Invalid code provided. Must be a non-empty string under 50,000 characters.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not set on the server.' });
    }
    
    const ai = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
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

app.post('/api/playground', async (req, res) => {
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
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-preview",
      contents: `You are a Python interpreter. Execute or explain the output of this code as if you were a real Python console. If there are errors, show them. Keep it concise. Code:\n\n${code}`,
      config: {
        systemInstruction: "You are a Python console. Output only what the code would print, or a brief explanation of the result. If it's a code snippet, simulate the output.",
      }
    });
    
    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Playground API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate playground response' });
  }
});

app.post('/api/tutor', async (req, res) => {
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
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: contents,
      config: {
        systemInstruction: `You are an elite, professional Python programming tutor. The student is currently watching the lecture: "${lectureTitle}". \n\nLecture Context: ${lectureDescription}\n\nYour goal is to guide the student, explain concepts clearly, and answer questions. Use code examples when helpful. You can respond in English or Roman Urdu/Hindi. Do not give away the final answer to an exercise immediately; guide them to it. Keep responses under 50 lines. Focus ONLY on Python.`,
      }
    });
    
    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Tutor API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate tutor response' });
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
