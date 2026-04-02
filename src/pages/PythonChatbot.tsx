import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Link } from 'react-router-dom';
import { Send, Bot, User, Loader2, Paperclip, X, FileText, Mic, MicOff, Sparkles, Cpu, Trash2, Info, Check, Copy, Terminal, Activity, Zap, Volume2, VolumeX, History } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-slate-300 hover:text-white transition-colors backdrop-blur-md border border-white/10" title="Copy code">
      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

interface SelectedFile {
  name: string;
  type: string;
  isImage: boolean;
  isPdf: boolean;
  isText: boolean;
  data?: string; // base64 for images and pdfs
  text?: string; // raw text for code files
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  file?: SelectedFile;
}

export default function PythonChatbot({ addXP }: { addXP: (amount: number) => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Greetings. I am **AhmadShahid AI Ultra**, the most advanced Python architecture and development assistant in existence. I possess world-class expertise in Python internals, design patterns, and optimization. I strictly answer Python-related queries within a 78-line limit. You may provide code, images, PDFs, or use voice input. How may I accelerate your development today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showFounder, setShowFounder] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: `Greetings. I am **AhmadShahid AI Ultra**, the most advanced Python architecture and development assistant in existence. I possess world-class expertise in Python internals, design patterns, and optimization. I strictly answer Python-related queries within a 78-line limit. You may provide code, images, PDFs, or use voice input. How may I accelerate your development today?`
      }
    ]);
    setCurrentChatId(null);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(prev => prev + (prev ? ' ' : '') + transcript);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      console.error("Voice recognition is not supported in your browser.");
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const toggleSpeech = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';
    const isText = !isImage && !isPdf; // Treat other files (.py, .txt, .csv, etc.) as text

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedFile({
        name: file.name,
        type: file.type,
        isImage,
        isPdf,
        isText,
        data: (isImage || isPdf) ? reader.result as string : undefined,
        text: isText ? reader.result as string : undefined
      });
    };

    if (isImage || isPdf) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const fetchChatHistory = async () => {
    if (!auth.currentUser) return;
    const path = 'chats';
    try {
      const q = query(
        collection(db, path),
        where('userId', '==', auth.currentUser.uid),
        orderBy('updatedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const history = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChatHistory(history);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  };

  useEffect(() => {
    if (showHistory) {
      fetchChatHistory();
    }
  }, [showHistory]);

  const saveChat = async (newMessages: ChatMessage[]) => {
    if (!auth.currentUser || newMessages.length <= 1) return;

    const path = 'chats';
    try {
      const chatData = {
        userId: auth.currentUser.uid,
        title: newMessages[1]?.text?.substring(0, 50) || "New Chat",
        messages: JSON.stringify(newMessages),
        updatedAt: serverTimestamp(),
      };

      if (currentChatId) {
        await updateDoc(doc(db, path, currentChatId), chatData);
      } else {
        const docRef = await addDoc(collection(db, path), {
          ...chatData,
          createdAt: serverTimestamp(),
        });
        setCurrentChatId(docRef.id);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const loadChat = (chat: any) => {
    try {
      const parsedMessages = JSON.parse(chat.messages);
      setMessages(parsedMessages);
      setCurrentChatId(chat.id);
      setShowHistory(false);
    } catch (error) {
      console.error("Error loading chat:", error);
    }
  };

  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const path = `chats/${chatId}`;
    try {
      await deleteDoc(doc(db, 'chats', chatId));
      if (currentChatId === chatId) {
        clearChat();
      }
      fetchChatHistory();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || isLoading) return;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing.");
      return;
    }
    const ai = new GoogleGenAI({ apiKey });

    const userMsg: ChatMessage = { 
      id: Date.now().toString(), 
      role: 'user', 
      text: input.trim(),
      file: selectedFile || undefined
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedFile(null);
    setIsLoading(true);

    try {
      const contents = messages.filter(m => m.id !== 'welcome').map(m => {
        const parts: any[] = [];
        if (m.text) parts.push({ text: m.text });
        if (m.file) {
          if (m.file.data) {
            const base64Data = m.file.data.split(',')[1];
            const mimeType = m.file.data.match(/data:(.*?);base64/)?.[1] || (m.file.isPdf ? 'application/pdf' : 'image/jpeg');
            parts.push({ inlineData: { data: base64Data, mimeType } });
          } else if (m.file.text) {
            parts.push({ text: `\n\n--- Attached File: ${m.file.name} ---\n${m.file.text}\n---` });
          }
        }
        return { role: m.role, parts };
      });

      const currentParts: any[] = [];
      if (userMsg.text) {
        currentParts.push({ text: userMsg.text });
      } else if (userMsg.file) {
        currentParts.push({ text: "Please analyze this attached file related to Python." });
      }
      
      if (userMsg.file) {
        if (userMsg.file.data) {
          const base64Data = userMsg.file.data.split(',')[1];
          const mimeType = userMsg.file.data.match(/data:(.*?);base64/)?.[1] || (userMsg.file.isPdf ? 'application/pdf' : 'image/jpeg');
          currentParts.push({ inlineData: { data: base64Data, mimeType } });
        } else if (userMsg.file.text) {
          currentParts.push({ text: `\n\n--- Attached File: ${userMsg.file.name} ---\n${userMsg.file.text}\n---` });
        }
      }

      contents.push({ role: 'user', parts: currentParts });

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: contents,
        config: {
          systemInstruction: `You are "AhmadShahid AI Ultra", the most advanced, world-class Python Architect and AI assistant in existence. You possess deep, expert-level knowledge of Python internals, advanced design patterns, performance optimization, and cutting-edge libraries.
CRITICAL RULES:
1. ONLY answer questions about Python programming. If asked about anything else, politely decline and state that your neural pathways are strictly optimized for Python.
2. Keep your answers STRICTLY to a maximum of 78 lines. Be highly informative, professional, and expert-level, but stay within this limit.
3. You can reply in English or Roman Urdu/Hindi. Maintain a highly professional, advanced AI persona.
4. If the user uploads a file or image, analyze it assuming it is related to Python (e.g., Python code, errors, flowcharts, datasets). If it's not related to Python, politely decline.`
        }
      });

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || 'Sorry, I could not generate a response.'
      };
      const updatedMessages = [...messages, userMsg, modelMsg];
      setMessages(updatedMessages);
      saveChat(updatedMessages);
      addXP(10); // Earn 10 XP for each AI interaction
    } catch (error) {
      console.error("AI Error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Oops! Something went wrong. Please try asking again.'
      };
      const updatedMessages = [...messages, userMsg, errorMsg];
      setMessages(updatedMessages);
      saveChat(updatedMessages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-ai-core relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 backdrop-blur-xl shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.2)] relative group overflow-hidden">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-xl blur-md group-hover:blur-lg transition-all"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50"></div>
            <Cpu className="w-5 h-5 text-indigo-400 relative z-10 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h2 className="font-bold text-slate-100 tracking-wide flex items-center gap-2">
              AhmadShahid AI <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] uppercase tracking-wider border border-indigo-500/30 font-bold shadow-[0_0_10px_rgba(79,70,229,0.3)] glow-border">Ultra</span>
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_5px_rgba(52,211,153,0.8)]"></span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Neural Core Online</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 border-l border-white/10 pl-3">
                <Activity className="w-3 h-3 text-indigo-400" />
                <span className="text-[10px] text-indigo-300/70 font-mono">Latency: 12ms</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 border-l border-white/10 pl-3">
                <Zap className="w-3 h-3 text-purple-400" />
                <span className="text-[10px] text-purple-300/70 font-mono">Power: Optimal</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowHistory(true)} className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 transition-colors shadow-[0_0_10px_rgba(79,70,229,0.2)]" title="Chat History">
            <History className="w-5 h-5" />
          </button>
          <button onClick={() => setShowFounder(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 transition-colors text-sm font-medium shadow-[0_0_10px_rgba(168,85,247,0.2)]">
            <Info className="w-4 h-4" />
            <span className="hidden sm:block">About Founder</span>
          </button>
          <button onClick={clearChat} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-colors shadow-[0_0_10px_rgba(239,68,68,0.2)]" title="Clear Memory">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar z-10">
        <div className="max-w-4xl mx-auto space-y-8 pb-32">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div 
                key={msg.id} 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={cn(
                  "flex gap-4", 
                  msg.role === 'user' ? "flex-row-reverse" : "",
                  index === 0 ? "mt-4" : ""
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden",
                  msg.role === 'user' 
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600" 
                    : "bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border border-indigo-500/40 shadow-[0_0_20px_rgba(79,70,229,0.2)] glow-border"
                )}>
                  {msg.role === 'model' && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>}
                  {msg.role === 'user' ? <User className="w-5 h-5 text-white relative z-10" /> : <Sparkles className="w-5 h-5 text-indigo-300 relative z-10" />}
                </div>
                <div className={cn(
                  "max-w-[85%] rounded-2xl px-6 py-5 text-sm shadow-2xl relative group",
                  msg.role === 'user' 
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none border border-indigo-400/20" 
                    : "glass-bubble text-slate-200 rounded-tl-none"
                )}>
                  {msg.role === 'model' && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
                      <button 
                        onClick={() => toggleSpeech(msg.text)}
                        className="absolute -right-10 top-2 p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-indigo-300 transition-colors opacity-0 group-hover:opacity-100"
                        title={isSpeaking ? "Stop Speaking" : "Read Aloud"}
                      >
                        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </>
                  )}
                {msg.file && (
                  <div className="mb-3">
                    {msg.file.isImage ? (
                      <img src={msg.file.data} alt="Uploaded" className="max-w-full rounded-lg border border-white/20 shadow-sm" />
                    ) : (
                      <div className="flex items-center gap-3 bg-black/20 p-3 rounded-lg border border-white/10">
                        <FileText className="w-6 h-6 text-indigo-300" />
                        <span className="text-sm font-medium text-slate-200 truncate">{msg.file.name}</span>
                      </div>
                    )}
                  </div>
                )}
                {msg.text && (
                  msg.role === 'user' ? (
                    <p className="leading-relaxed">{msg.text}</p>
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-[#0d0d12] prose-pre:border prose-pre:border-white/10 prose-code:text-indigo-300 prose-pre:p-0 prose-pre:overflow-hidden">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({node, inline, className, children, ...props}: any) {
                            const match = /language-(\w+)/.exec(className || '');
                            const codeString = String(children).replace(/\n$/, '');
                            return !inline ? (
                              <div className="relative group">
                                <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                                  <span className="text-xs font-mono text-slate-400">{match?.[1] || 'code'}</span>
                                  <CopyButton text={codeString} />
                                </div>
                                <div className="p-4 overflow-x-auto custom-scrollbar">
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                </div>
                              </div>
                            ) : (
                              <code className="bg-white/10 px-1.5 py-0.5 rounded-md text-indigo-300 font-mono text-[0.9em]" {...props}>
                                {children}
                              </code>
                            )
                          }
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  )
                )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border border-indigo-500/40 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(79,70,229,0.2)] relative overflow-hidden glow-border">
                <div className="absolute inset-0 bg-indigo-500/20 rounded-xl blur-sm animate-pulse"></div>
                <Sparkles className="w-5 h-5 text-indigo-300 relative z-10 animate-spin-slow" />
              </div>
              <div className="glass-bubble rounded-2xl rounded-tl-none px-6 py-5 flex items-center gap-4 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 animate-gradient-x"></div>
                <div className="flex gap-1.5 relative z-10">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 font-medium tracking-wide relative z-10">Neural pathways connecting...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 bg-gradient-to-t from-[#030305] via-[#030305]/95 to-transparent z-20">
        <div className="max-w-4xl mx-auto relative">
          
          {/* Quick Prompts */}
          {messages.length === 1 && !selectedFile && !input && (
            <div className="flex flex-wrap gap-2 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {[
                "Explain OOP concepts in Python",
                "How do decorators work?",
                "Write a binary search algorithm",
                "What are generators in Python?"
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setInput(prompt)}
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* File Preview */}
          {selectedFile && (
            <div className="absolute bottom-full mb-4 left-0 glass-bubble p-2 rounded-xl border border-indigo-500/30 shadow-[0_0_20px_rgba(79,70,229,0.15)] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
              {selectedFile.isImage ? (
                <img src={selectedFile.data} alt="Preview" className="h-16 w-auto rounded-lg border border-white/10 object-cover" />
              ) : (
                <div className="h-16 w-16 bg-indigo-500/20 rounded-lg border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <FileText className="w-8 h-8 text-indigo-400" />
                </div>
              )}
              <div className="flex flex-col pr-8">
                <span className="text-sm font-medium text-slate-200 truncate max-w-[200px]">{selectedFile.name}</span>
                <span className="text-xs text-slate-400">{selectedFile.isImage ? 'Image' : selectedFile.isPdf ? 'PDF Document' : 'Text/Code File'}</span>
              </div>
              <button 
                onClick={removeFile}
                className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-500/80 rounded-full text-white transition-colors backdrop-blur-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <div className="flex items-center relative">
            <input
              type="file"
              accept="image/*,.py,.txt,.csv,.json,.md,application/pdf"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="absolute left-2 flex items-center gap-1 z-10">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-slate-400 hover:text-indigo-400 p-2 transition-colors"
                title="Upload File or Image"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <button
                onClick={toggleRecording}
                className={cn(
                  "p-2 transition-colors rounded-full",
                  isRecording ? "text-red-400 bg-red-500/20 animate-pulse" : "text-slate-400 hover:text-indigo-400"
                )}
                title={isRecording ? "Stop Recording" : "Voice Input"}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
            
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={isRecording ? "Listening to voice input..." : "Initialize query or upload data..."}
              className="w-full bg-black/40 border border-indigo-500/30 rounded-2xl pl-24 pr-16 py-5 text-sm text-white focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all placeholder:text-slate-500 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-xl glow-border"
            />
            
            <button
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && !selectedFile)}
              className="absolute right-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:from-indigo-600 disabled:to-purple-600 text-white rounded-xl w-12 h-12 flex items-center justify-center transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] group overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <Send className="w-5 h-5 ml-0.5 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 mt-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-indigo-500/50" />
            <p className="text-[10px] text-center text-slate-500 font-medium tracking-widest uppercase">AhmadShahid AI Ultra • Max 78 Lines • Python Only</p>
            <Sparkles className="w-3 h-3 text-indigo-500/50" />
          </div>
          <p className="text-xs text-slate-400 text-center">
            Engineered with <span className="text-red-500">♥</span> by <button onClick={() => setShowFounder(true)} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Ahmad Shahid</button>
          </p>
          <Link to="/foundation" className="mt-2 flex flex-col items-center gap-1 hover:scale-105 transition-transform group">
            <h3 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:from-indigo-300 group-hover:to-purple-300 transition-colors">Foundation of AI</h3>
          </Link>
        </div>
      </div>

      {/* Founder Modal */}
      {showFounder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-bubble w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar rounded-3xl shadow-[0_0_50px_rgba(79,70,229,0.3)] border border-indigo-500/30 animate-in zoom-in-95 duration-300">
            <div className="relative h-32 bg-gradient-to-r from-indigo-600 to-purple-600">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
              <button onClick={() => setShowFounder(false)} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors backdrop-blur-md">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-8 pb-8 relative">
              <div className="w-24 h-24 rounded-2xl bg-[#030305] border-4 border-[#15151a] shadow-xl absolute -top-12 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20"></div>
                <Terminal className="w-10 h-10 text-indigo-400 relative z-10" />
              </div>
              <div className="mt-14">
                <h3 className="text-2xl font-bold text-white tracking-tight">Ahmad Shahid</h3>
                <p className="text-indigo-400 font-medium text-sm mt-1 uppercase tracking-wider">Visionary AI Architect & Founder</p>
                
                <div className="mt-6 space-y-4 text-slate-300 text-sm leading-relaxed">
                  <p>
                    Ahmad Shahid is a pioneering software engineer and AI specialist with a profound passion for Python and next-generation intelligent systems. 
                  </p>
                  <p>
                    With extensive experience in scalable architectures, machine learning, and full-stack development, Ahmad engineered <strong>AhmadShahid AI Ultra</strong> to revolutionize how developers interact with code. His vision is to bridge the gap between complex programming concepts and intuitive AI assistance.
                  </p>
                  <div className="pt-4 mt-4 border-t border-white/10 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs">Python Expert</span>
                    <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs">AI Architecture</span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">System Design</span>
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs">Innovation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-bubble w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl shadow-[0_0_50px_rgba(79,70,229,0.3)] border border-indigo-500/30 animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <History className="w-5 h-5 text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Chat History</h2>
              </div>
              <button onClick={() => setShowHistory(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 py-12">
                  <History className="w-12 h-12 opacity-20" />
                  <p>No chat history found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {chatHistory.map((chat) => (
                    <div 
                      key={chat.id}
                      onClick={() => loadChat(chat)}
                      className="group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <h4 className="text-slate-200 font-medium truncate group-hover:text-indigo-300 transition-colors">{chat.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          {chat.updatedAt?.toDate ? chat.updatedAt.toDate().toLocaleString() : 'Recently'}
                        </p>
                      </div>
                      <button 
                        onClick={(e) => deleteChat(chat.id, e)}
                        className="p-2 rounded-lg bg-red-500/0 hover:bg-red-500/20 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Chat"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
