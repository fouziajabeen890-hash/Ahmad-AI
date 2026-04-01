import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Code2, BrainCircuit, Sparkles, ChevronRight, Download, Monitor, Smartphone, Laptop, CheckCircle2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Home() {
  const [downloadMsg, setDownloadMsg] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showAutoModal, setShowAutoModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isInIframe, setIsInIframe] = useState(false);

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

  return (
    <div className="flex-1 overflow-y-auto bg-transparent text-white p-8 custom-scrollbar relative">
      <div className="max-w-5xl mx-auto mt-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 mb-20"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative w-28 h-28 mx-auto rounded-[2rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.5)] mb-8 border border-white/20 overflow-hidden group glow-border"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
            <BrainCircuit className="w-14 h-14 text-white relative z-10 group-hover:scale-110 transition-transform duration-500" />
            <Sparkles className="w-6 h-6 text-indigo-200 absolute top-4 right-4 animate-pulse" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Master Python from <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">A to Z</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            The ultimate interactive learning experience. Watch practical video lectures and get instant help from our AI Python Tutor.
          </p>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/course" className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_40px_rgba(79,70,229,0.4)] border border-white/10 group relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <PlayCircle className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Start Learning Now</span>
              <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>

            {isInIframe && (
              <button 
                onClick={() => window.open(window.location.href, '_blank')}
                className="inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 text-slate-200 px-8 py-4 rounded-full font-bold text-lg transition-all border border-white/10 group"
              >
                <Sparkles className="w-6 h-6 text-indigo-400 group-hover:rotate-12 transition-transform" />
                <span>Open in New Tab</span>
              </button>
            )}
          </motion.div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 pb-12">
          {[
            {
              icon: PlayCircle,
              color: "indigo",
              title: "Full Video Course",
              desc: "Step-by-step video lectures covering everything from basic syntax to advanced OOP concepts."
            },
            {
              icon: BrainCircuit,
              color: "purple",
              title: "AI Tutor 24/7",
              desc: "Stuck on a concept? Ask the AI tutor in English or Roman Urdu/Hindi for instant, personalized help."
            },
            {
              icon: Code2,
              color: "emerald",
              title: "Practical Examples",
              desc: "Learn by doing with real-world code examples and practical exercises in every module."
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-panel p-8 rounded-[2rem] hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-${item.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              <div className={`w-14 h-14 bg-${item.color}-500/20 rounded-2xl flex items-center justify-center mb-6 border border-${item.color}-500/30 shadow-inner group-hover:scale-110 transition-transform`}>
                <item.icon className={`w-7 h-7 text-${item.color}-400`} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white tracking-tight relative z-10">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm relative z-10">{item.desc}</p>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to="/chatbot" className="block h-full glass-panel p-8 rounded-[2rem] hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:border-indigo-500/50 group relative overflow-hidden glow-border">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30 shadow-inner group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white tracking-tight group-hover:text-indigo-400 transition-colors relative z-10">Python Chatbot</h3>
              <p className="text-slate-400 leading-relaxed text-sm relative z-10">A dedicated AI assistant that answers only Python-related questions concisely in 3 lines.</p>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link to="/code-review" className="block h-full glass-panel p-8 rounded-[2rem] hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:border-indigo-500/50 group relative overflow-hidden glow-border">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/30 shadow-inner group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white tracking-tight group-hover:text-purple-400 transition-colors relative z-10">AI Code Reviewer</h3>
              <p className="text-slate-400 leading-relaxed text-sm relative z-10">Paste your Python code and get instant expert analysis, bug detection, and refactoring.</p>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col items-center justify-center"
        >
          <Link to="/foundation" className="glass-panel px-8 py-6 rounded-3xl border border-indigo-500/20 shadow-[0_0_30px_rgba(79,70,229,0.1)] flex flex-col items-center text-center hover:scale-105 transition-transform cursor-pointer group">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:from-indigo-300 group-hover:to-purple-300 transition-colors">Foundation of AI</h2>
          </Link>
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
