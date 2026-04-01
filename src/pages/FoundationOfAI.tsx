import { motion } from 'motion/react';
import { Terminal, ArrowLeft, Sparkles, Code2, BrainCircuit, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FoundationOfAI() {
  return (
    <div className="flex-1 overflow-y-auto bg-transparent text-white p-8 custom-scrollbar relative">
      <div className="max-w-4xl mx-auto mt-12 relative z-10 pb-20">
        <Link to="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors mb-8 font-medium">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-panel p-8 md:p-12 rounded-[2rem] border border-indigo-500/30 shadow-[0_0_50px_rgba(79,70,229,0.2)] relative overflow-hidden glow-border"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-[#030305] border-4 border-indigo-500/20 shadow-[0_0_30px_rgba(79,70,229,0.3)] flex items-center justify-center shrink-0 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 group-hover:opacity-100 transition-opacity"></div>
              <Terminal className="w-16 h-16 md:w-20 md:h-20 text-indigo-400 relative z-10 group-hover:scale-110 transition-transform duration-500" />
            </motion.div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-4 shadow-[0_0_10px_rgba(79,70,229,0.2)]">
                <Sparkles className="w-3 h-3" />
                Foundation of AI
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2 animate-gradient-x">Ahmad Shahid</h1>
              <h2 className="text-xl text-indigo-300 font-medium tracking-wide mb-6">Visionary AI Architect & Founder</h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed text-lg font-light">
                <p>
                  Ahmad Shahid is a pioneering software engineer and AI specialist with a profound passion for Python and next-generation intelligent systems.
                </p>
                <p>
                  With extensive experience in scalable architectures, machine learning, and full-stack development, Ahmad engineered <strong>AhmadShahid AI Ultra</strong> to revolutionize how developers interact with code. His vision is to bridge the gap between complex programming concepts and intuitive AI assistance.
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div whileHover={{ y: -5 }} className="glass-bubble p-4 rounded-2xl flex flex-col items-center text-center gap-2 border border-indigo-500/20 shadow-lg">
                  <Code2 className="w-6 h-6 text-indigo-400" />
                  <span className="text-sm font-medium text-slate-200">Python Expert</span>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="glass-bubble p-4 rounded-2xl flex flex-col items-center text-center gap-2 border border-purple-500/20 shadow-lg">
                  <BrainCircuit className="w-6 h-6 text-purple-400" />
                  <span className="text-sm font-medium text-slate-200">AI Architecture</span>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="glass-bubble p-4 rounded-2xl flex flex-col items-center text-center gap-2 border border-emerald-500/20 shadow-lg">
                  <Terminal className="w-6 h-6 text-emerald-400" />
                  <span className="text-sm font-medium text-slate-200">System Design</span>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="glass-bubble p-4 rounded-2xl flex flex-col items-center text-center gap-2 border border-pink-500/20 shadow-lg">
                  <Rocket className="w-6 h-6 text-pink-400" />
                  <span className="text-sm font-medium text-slate-200">Innovation</span>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
