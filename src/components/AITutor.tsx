import { useState, useRef, useEffect } from 'react';
import { Lecture, Message } from '../types';
import { GoogleGenAI } from '@google/genai';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../lib/utils';

interface AITutorProps {
  currentLecture: Lecture;
}

export default function AITutor({ currentLecture }: AITutorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello! I'm your AI Python Tutor. We are currently on **${currentLecture.title}**. Ask me any questions about this topic in English or Urdu/Hindi!`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reset chat when lecture changes
  useEffect(() => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'model',
        text: `We've moved to **${currentLecture.title}**. What would you like to learn about this topic?`
      }
    ]);
  }, [currentLecture.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is missing.');
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: 'Error: GEMINI_API_KEY is missing. Please configure it in the Secrets panel.'
      }]);
      return;
    }
    const ai = new GoogleGenAI({ apiKey });

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const contents = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      contents.push({ role: 'user', parts: [{ text: userMsg.text }] });

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: contents,
        config: {
          systemInstruction: `You are an elite, professional Python programming tutor. The student is currently watching the lecture: "${currentLecture.title}". 
          
Lecture Context: ${currentLecture.description}

Your responsibilities:
1. Act as a highly professional, encouraging, and expert mentor.
2. Explain concepts with extreme clarity, breaking down complex topics.
3. Always provide clean, well-commented, and practical Python code examples.
4. If the user speaks in Roman Urdu/Hindi (e.g., "python sikhao", "mujhe samajh nahi aaya"), you MUST reply in polite, professional Roman Urdu/Hindi mixed with English technical terms.
5. Format your responses beautifully using Markdown (use bolding, bullet points, and code blocks).
6. Directly address the user's query while keeping the context of the current lecture in mind.`
        }
      });

      const modelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || 'Sorry, I could not generate a response.'
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Oops! Something went wrong. Please try asking again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="p-6 border-b border-white/10 bg-black/20 flex items-center gap-3 shrink-0 backdrop-blur-md">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30 shadow-inner">
          <Bot className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="font-bold text-white tracking-tight">AI Python Tutor</h3>
          <p className="text-[11px] text-indigo-400/80 font-medium uppercase tracking-wider">Online & Ready</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map(msg => (
          <div key={msg.id} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "")}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg",
              msg.role === 'user' ? "bg-gradient-to-br from-indigo-500 to-purple-600" : "bg-slate-800 border border-white/10"
            )}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-indigo-400" />}
            </div>
            <div className={cn(
              "max-w-[85%] rounded-2xl px-5 py-4 text-sm shadow-xl",
              msg.role === 'user' 
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none" 
                : "glass-panel text-slate-200 rounded-tl-none"
            )}>
              {msg.role === 'user' ? (
                <p className="leading-relaxed">{msg.text}</p>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-code:text-indigo-300">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
              <Bot className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="glass-panel rounded-2xl rounded-tl-none px-5 py-4 flex items-center gap-3 shadow-xl">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span className="text-sm text-slate-300 font-medium">Analyzing lecture context...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t border-white/10 bg-black/20 shrink-0 backdrop-blur-md">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question about this lecture..."
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500 shadow-inner"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:from-indigo-600 disabled:to-purple-600 text-white rounded-lg w-8 h-8 flex items-center justify-center transition-all shadow-lg"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-500 mt-3 font-medium tracking-wide">AI can make mistakes. Verify code before running.</p>
      </div>
    </div>
  );
}
