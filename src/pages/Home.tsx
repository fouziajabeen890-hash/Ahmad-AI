import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlayCircle, Code2, BrainCircuit, Sparkles, ChevronRight, Download, 
  Monitor, Smartphone, Laptop, CheckCircle2, Info, Trophy, Star, 
  Zap, Clock, Target, Rocket, Terminal, Play, RotateCcw, MessageSquare,
  BarChart3, Layers, BookOpen, Cpu, User, Mic
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { GoogleGenAI } from "@google/genai";

export default function Home({ user, addXP }: { user: any, addXP: (amount: number) => void }) {
  const [downloadMsg, setDownloadMsg] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showAutoModal, setShowAutoModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isInIframe, setIsInIframe] = useState(false);
  const [dailyChallengeSolved, setDailyChallengeSolved] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [playgroundCode, setPlaygroundCode] = useState('print("Hello, Python World!")\n\n# Try writing some code here\nfor i in range(5):\n    print(f"Learning Python is fun! Step {i+1}")');
  const [playgroundOutput, setPlaygroundOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [isVoiceSearching, setIsVoiceSearching] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          window.location.hash = `#/chatbot?q=${encodeURIComponent(transcript)}&auto=true`;
        };
        recognition.onend = () => setIsVoiceSearching(false);
        recognitionRef.current = recognition;
      }
    }
  }, []);

  const startVoiceSearch = () => {
    if (recognitionRef.current) {
      setIsVoiceSearching(true);
      recognitionRef.current.start();
    } else {
      alert("Voice recognition not supported in this browser.");
    }
  };

  const handlePlaygroundRun = async () => {
    setIsExecuting(true);
    setPlaygroundOutput('Executing code...\n');
    
    try {
      // Simulate execution with AI feedback
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a Python interpreter. Execute or explain the output of this code as if you were a real Python console. If there are errors, show them. Keep it concise. Code:\n\n${playgroundCode}`,
        config: {
          systemInstruction: "You are a Python console. Output only what the code would print, or a brief explanation of the result. If it's a code snippet, simulate the output.",
        }
      });
      
      setPlaygroundOutput(response.text || 'No output.');
      addXP(15); // Reward for using playground
    } catch (error) {
      setPlaygroundOutput('Error: Could not connect to the Python engine. Please try again.');
    } finally {
      setIsExecuting(false);
    }
  };

  const roadmapSteps = [
    { id: 1, title: "Foundations", desc: "Variables, Types, and Basic Syntax", status: "completed", icon: BookOpen },
    { id: 2, title: "Logic & Control", desc: "If-Else, Loops, and Conditions", status: "current", icon: Cpu },
    { id: 3, title: "Data Structures", desc: "Lists, Dicts, Tuples, and Sets", status: "locked", icon: Layers },
    { id: 4, title: "Functions & Modules", desc: "Reusable code and organization", status: "locked", icon: Code2 },
    { id: 5, title: "OOP Mastery", desc: "Classes, Objects, and Inheritance", status: "locked", icon: Target },
    { id: 6, title: "AI Integration", desc: "Building AI apps with Python", status: "locked", icon: BrainCircuit },
  ];

  const stats = [
    { label: "Hours Learned", value: "12.5", icon: Clock, color: "text-blue-400" },
    { label: "Lessons Done", value: "8/24", icon: BookOpen, color: "text-emerald-400" },
    { label: "Global Rank", value: "#1,240", icon: Trophy, color: "text-amber-400" },
    { label: "Streak", value: "5 Days", icon: Zap, color: "text-orange-400" },
  ];

  const dailyChallenge = {
    question: "What is the output of: print(type([]) is list)?",
    options: ["True", "False", "Error", "None"],
    correct: 0,
    xp: 25
  };

  useEffect(() => {
    setIsInIframe(window.self !== window.top);
    
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    if (isStandalone) {
      setDownloadMsg('Welcome back! You are using the MRS AHMAD SHAHID app.');
    }
  }, []);

  useEffect(() => {
    // Check if it's iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // If not installed, show modal when prompt is ready
      if (!isStandalone) {
        setShowAutoModal(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Backup: Show modal after 2 seconds if not installed
    const timer = setTimeout(() => {
      if (!isStandalone) {
        setShowAutoModal(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, [deferredPrompt]);

  const startDownloadSimulation = async (callback: () => Promise<void>) => {
    setIsDownloading(true);
    setProgress(0);
    setTimeLeft(5);

    const duration = 5000; // 5 seconds
    const interval = 100;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = (currentStep / steps) * 100;
      setProgress(newProgress);
      setTimeLeft(Math.ceil((duration - currentStep * interval) / 1000));

      if (currentStep >= steps) {
        clearInterval(timer);
        setIsDownloading(false);
        callback();
      }
    }, interval);
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsDownloading(true);
        setProgress(0);
        const duration = 2000;
        const interval = 100;
        const steps = duration / interval;
        let currentStep = 0;
        const timer = setInterval(() => {
          currentStep++;
          setProgress((currentStep / steps) * 100);
          if (currentStep >= steps) {
            clearInterval(timer);
            setIsDownloading(false);
            setShowAutoModal(false);
            setDownloadMsg("MRS AHMAD SHAHID PYTHON TUTORIAL AND AI is now on your home screen!");
          }
        }, interval);
      }
    } else {
      // If no prompt, it's likely a browser that needs manual steps or an in-app browser
      setShowAutoModal(true); // Keep modal open to show manual guide
    }
  };

  const handleDownload = async (platform: string) => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDownloadMsg(`MRS AHMAD SHAHID PYTHON TUTORIAL AND AI has been added to your home screen!`);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setDownloadMsg('iOS detected: 1. Tap "Share" icon (square with arrow) 2. Scroll down and tap "Add to Home Screen" 3. Tap "Add"');
    } else {
      setDownloadMsg(`To install on ${platform}: Click the "Install" icon in your browser's address bar or menu.`);
    }
    setTimeout(() => setDownloadMsg(''), 8000);
  };

  const handleChallengeSubmit = () => {
    if (selectedAnswer === dailyChallenge.correct) {
      setDailyChallengeSolved(true);
      addXP(dailyChallenge.xp);
    } else {
      alert("Wrong answer! Try again.");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-transparent text-white p-4 sm:p-8 custom-scrollbar relative">
      <div className="max-w-6xl mx-auto mt-8 relative z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-20 p-12 rounded-[3rem] overflow-hidden group"
        >
          {/* Animated Background for Hero */}
          <div className="absolute inset-0 bg-ai-core opacity-40 group-hover:opacity-60 transition-opacity" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-3/5 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold mb-6"
              >
                <Sparkles className="w-4 h-4" />
                Next-Gen Python Learning
              </motion.div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
                Master Python <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 neon-text">
                  With AI Intelligence
                </span>
              </h1>
              <p className="text-xl text-slate-300 mb-10 max-w-2xl font-light leading-relaxed">
                The most advanced platform to learn Python. Interactive playgrounds, AI-powered code reviews, and a gamified experience that makes coding addictive.
              </p>

              {/* Voice Search Bar */}
              <div className="relative max-w-md mx-auto lg:mx-0 mb-10 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative flex items-center bg-black/40 border border-white/10 rounded-2xl p-1 backdrop-blur-xl">
                  <div className="pl-4 text-slate-400">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Ask anything about Python..." 
                    className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 px-4 py-3 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        window.location.hash = `#/chatbot?q=${encodeURIComponent((e.target as HTMLInputElement).value)}`;
                      }
                    }}
                  />
                  <button 
                    onClick={startVoiceSearch}
                    className={cn(
                      "p-3 rounded-xl transition-all",
                      isVoiceSearching ? "bg-red-500/20 text-red-400 animate-pulse" : "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400"
                    )}
                  >
                    {isVoiceSearching ? <div className="voice-wave"><div className="voice-bar"></div><div className="voice-bar"></div><div className="voice-bar"></div></div> : <Mic className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link 
                  to="/course" 
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:scale-105 transition-all shadow-[0_0_30px_rgba(79,70,229,0.4)] flex items-center gap-2"
                >
                  Start Learning <Rocket className="w-5 h-5" />
                </Link>
                <button 
                  onClick={() => setShowRoadmap(true)}
                  className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  View Roadmap <BarChart3 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="lg:w-2/5 relative">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <div className="glass-panel p-6 rounded-[2.5rem] border-indigo-500/30 shadow-2xl relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.5rem] blur opacity-20" />
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <div className="ml-2 px-3 py-1 rounded-lg bg-white/5 text-[10px] text-slate-400 font-mono">python_tutor.py</div>
                  </div>
                  <div className="font-mono text-sm space-y-2">
                    <p className="text-purple-400">def <span className="text-indigo-300">learn_python</span>():</p>
                    <p className="pl-4 text-slate-300">skills = [<span className="text-emerald-400">"AI"</span>, <span className="text-emerald-400">"Data"</span>, <span className="text-emerald-400">"Web"</span>]</p>
                    <p className="pl-4 text-slate-300">for skill in skills:</p>
                    <p className="pl-8 text-slate-300">print(<span className="text-amber-400">f"Mastering {'{skill}'}..."</span>)</p>
                    <p className="pl-4 text-indigo-400">return <span className="text-pink-400">"Success!"</span></p>
                  </div>
                </div>
              </motion.div>
              {/* Floating elements */}
              <div className="absolute -top-10 -right-10 w-20 h-20 rounded-2xl bg-indigo-600/30 blur-xl animate-pulse" />
              <div className="absolute -bottom-10 -left-10 w-20 h-20 rounded-2xl bg-purple-600/30 blur-xl animate-pulse" />
            </div>
          </div>
        </motion.div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-3xl text-center"
            >
              <div className={cn("w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Python Playground */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-8 rounded-[2.5rem] border border-emerald-500/20"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                  <Terminal className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Python Playground</h2>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setPlaygroundCode('')}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-all"
                  title="Clear"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <textarea
                  value={playgroundCode}
                  onChange={(e) => setPlaygroundCode(e.target.value)}
                  className="w-full h-48 bg-black/40 border border-white/10 rounded-2xl p-4 font-mono text-sm text-emerald-300 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none shadow-inner"
                  placeholder="# Write your Python code here..."
                />
                <button
                  onClick={handlePlaygroundRun}
                  disabled={isExecuting}
                  className="absolute bottom-4 right-4 px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
                >
                  {isExecuting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play className="w-4 h-4" />}
                  Run Code
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/5 min-h-[100px]">
                <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <Monitor className="w-3 h-3" /> Console Output
                </div>
                <pre className="font-mono text-sm text-slate-300 whitespace-pre-wrap">
                  {playgroundOutput || 'Output will appear here after running...'}
                </pre>
              </div>
            </div>
          </motion.div>

          {/* Daily Challenge */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-8 rounded-[2.5rem] border border-indigo-500/20 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-32 h-32 text-indigo-400" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                    <Star className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Daily Challenge</h2>
                </div>
                <div className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold">
                  +{dailyChallenge.xp} XP
                </div>
              </div>

              {dailyChallengeSolved ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Challenge Completed!</h3>
                  <p className="text-slate-400">You've earned {dailyChallenge.xp} XP. Come back tomorrow for a new puzzle!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-black/40 border border-white/5 font-mono text-indigo-300">
                    {dailyChallenge.question}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {dailyChallenge.options.map((option, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedAnswer(i)}
                        className={cn(
                          "p-4 rounded-xl border text-left transition-all font-medium",
                          selectedAnswer === i 
                            ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/20" 
                            : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleChallengeSubmit}
                    disabled={selectedAnswer === null}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20"
                  >
                    Submit Answer
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: PlayCircle,
              color: "indigo",
              title: "Video Course",
              desc: "Complete Python A-Z lectures.",
              link: "/course"
            },
            {
              icon: BrainCircuit,
              color: "purple",
              title: "AI Chatbot",
              desc: "Ask Python questions 24/7.",
              link: "/chatbot"
            },
            {
              icon: Sparkles,
              color: "pink",
              title: "Code Review",
              desc: "Analyze & debug your code.",
              link: "/code-review"
            },
            {
              icon: MessageSquare,
              color: "emerald",
              title: "Reviews",
              desc: "See what others are saying.",
              link: "/reviews"
            }
          ].map((item, i) => (
            <Link 
              key={i}
              to={item.link}
              className="glass-panel p-6 rounded-[2rem] hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-${item.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              <div className={`w-12 h-12 bg-${item.color}-500/20 rounded-xl flex items-center justify-center mb-4 border border-${item.color}-500/30 group-hover:scale-110 transition-transform`}>
                <item.icon className={`w-6 h-6 text-${item.color}-400`} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white tracking-tight">{item.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>

        {/* Community Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 rounded-[2.5rem] border border-white/5 mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <User className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Recent Activity</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { user: "Ali Raza", action: "completed", target: "Functions Lecture", time: "2m ago" },
              { user: "Fatima", action: "earned", target: "Daily Challenge XP", time: "5m ago" },
              { user: "Usman", action: "started", target: "Object Oriented Programming", time: "12m ago" },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                  {activity.user.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-slate-200">
                    <span className="font-bold text-white">{activity.user}</span> {activity.action} <span className="text-indigo-400 font-medium">{activity.target}</span>
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Download Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 pb-20 max-w-3xl mx-auto"
        >
          <div className="glass-panel p-8 rounded-[2rem] border border-indigo-500/20 shadow-[0_0_30px_rgba(79,70,229,0.1)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 mb-4">
                <Download className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Download MRS AHMAD SHAHID</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">Take the power of advanced AI anywhere. Install it as a native app on your device.</p>
              
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button onClick={() => handleDownload('Windows')} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 hover:border-indigo-400 transition-all group shadow-lg">
                  <Monitor className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-200">Install for Windows</span>
                </button>
                <button onClick={() => handleDownload('Mac OS')} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-400 transition-all group shadow-lg">
                  <Laptop className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-200">Install for Mac OS</span>
                </button>
                <button onClick={() => handleDownload('Mobile')} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 hover:border-pink-400 transition-all group shadow-lg">
                  <Smartphone className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-slate-200">Install Mobile App</span>
                </button>
              </div>
              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest">
                <Info className="w-3 h-3" />
                <span>Progressive Web App Technology</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Roadmap Modal */}
        <AnimatePresence>
          {showRoadmap && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowRoadmap(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl glass-panel p-8 rounded-[3rem] border-indigo-500/30 shadow-2xl overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <BarChart3 className="w-64 h-64 text-indigo-400" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                        <Target className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Learning Roadmap</h2>
                        <p className="text-sm text-slate-400">Your path to Python mastery</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowRoadmap(false)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 transition-all"
                    >
                      <ChevronRight className="w-6 h-6 rotate-90" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {roadmapSteps.map((step, i) => (
                      <div key={i} className="flex items-start gap-4 group">
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center border transition-all",
                            step.status === 'completed' ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" :
                            step.status === 'current' ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-400 animate-pulse" :
                            "bg-white/5 border-white/10 text-slate-600"
                          )}>
                            <step.icon className="w-5 h-5" />
                          </div>
                          {i < roadmapSteps.length - 1 && (
                            <div className={cn(
                              "w-0.5 h-10 my-1",
                              step.status === 'completed' ? "bg-emerald-500/30" : "bg-white/10"
                            )} />
                          )}
                        </div>
                        <div className="pt-1">
                          <h3 className={cn(
                            "font-bold transition-colors",
                            step.status === 'locked' ? "text-slate-600" : "text-white"
                          )}>{step.title}</h3>
                          <p className="text-xs text-slate-500">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setShowRoadmap(false)}
                    className="w-full mt-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all"
                  >
                    Got it!
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Floating AI Assistant Trigger */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Link
            to="/chatbot"
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:scale-110 transition-all group"
          >
            <MessageSquare className="w-8 h-8 group-hover:scale-110 transition-transform" />
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-pink-500 border-4 border-[#0A0A0B] flex items-center justify-center text-[10px] font-bold">
              1
            </div>
          </Link>
        </motion.div>

        {/* Download Toast */}
        <AnimatePresence>
          {downloadMsg && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl bg-indigo-600 text-white shadow-[0_10px_40px_rgba(79,70,229,0.4)] border border-indigo-400/30"
            >
              <CheckCircle2 className={`w-5 h-5 ${downloadMsg.includes('cancelled') ? 'text-red-400' : 'text-indigo-200'}`} />
              <span className="font-medium">{downloadMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Automatic Install Modal */}
        <AnimatePresence>
          {showAutoModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-panel max-w-md w-full p-8 rounded-[2.5rem] border border-indigo-500/30 shadow-[0_0_50px_rgba(79,70,229,0.3)] text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg mb-6">
                    <BrainCircuit className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">Install MRS AHMAD SHAHID</h2>
                  
                  {isDownloading ? (
                    <div className="mb-8">
                      <p className="text-indigo-400 font-medium mb-4">Finalizing Setup...</p>
                      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                      <p className="text-slate-500 text-xs mt-2">MRS AHMAD SHAHID is being added to your apps.</p>
                    </div>
                  ) : !deferredPrompt && !isIOS ? (
                    <div className="text-left space-y-4 mb-8">
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-3 items-start">
                        <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-200/80">Browser prompt blocked. Please follow these simple steps to install manually:</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-slate-300">
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">1</div>
                          <p>Tap the <span className="text-white font-bold">Three Dots (⋮)</span> at the top right of Chrome.</p>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">2</div>
                          <p>Select <span className="text-white font-bold">"Install App"</span> or <span className="text-indigo-400 font-bold">"Add to Home Screen"</span>.</p>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">3</div>
                          <p>Confirm by tapping <span className="text-white font-bold">"Install"</span>.</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setShowAutoModal(false)}
                        className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all mt-4"
                      >
                        Got it!
                      </button>
                    </div>
                  ) : isIOS ? (
                    <div className="text-left space-y-4 mb-8">
                      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex gap-3 items-start">
                        <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-indigo-200/80">iOS (iPhone/iPad) requires a manual step for security:</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-slate-300">
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">1</div>
                          <p>Tap the <span className="text-white font-bold">Share</span> icon (square with arrow) at the bottom.</p>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">2</div>
                          <p>Scroll down and tap <span className="text-indigo-400 font-bold">"Add to Home Screen"</span>.</p>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">3</div>
                          <p>Tap <span className="text-white font-bold">"Add"</span> at the top right.</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setShowAutoModal(false)}
                        className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all mt-4"
                      >
                        Done!
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-slate-400 mb-8">Install MRS AHMAD SHAHID on your home screen instantly. It's fast, free, and works offline!</p>
                      
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={handleInstall}
                          className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                        >
                          Install Now
                        </button>
                        <p className="text-[10px] text-slate-500 mt-1 italic">* Browser security requires one final confirmation click.</p>
                        <button
                          onClick={() => setShowAutoModal(false)}
                          className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 font-medium transition-all"
                        >
                          Maybe Later
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
