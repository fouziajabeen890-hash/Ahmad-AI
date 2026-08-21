import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Network, ShieldAlert, FolderTree, Package, Code2, Loader2, Sparkles, Send, PlayCircle, Terminal, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

interface ArchitectureData {
  projectName: string;
  overview: string;
  fileTree: string[];
  dependencies: string[];
  coreLogic: string;
  securityAnalysis: string[];
}

export default function AIArchitect() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ArchitectureData | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'code' | 'security'>('overview');

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/architect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate architecture.');
      }

      const data = await response.json();
      setResult(data);
      setActiveTab('overview');
    } catch (err: any) {
      setError(err.message || 'An error occurred while analyzing.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-mesh relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/80 pointer-events-none" />
      
      <div className="flex-1 flex flex-col lg:flex-row h-full max-w-[1920px] mx-auto w-full relative z-10 p-4 lg:p-8 gap-6 overflow-hidden">
        
        {/* Left Panel: Input & Control Console */}
        <div className="w-full lg:w-[400px] flex flex-col gap-6 shrink-0 h-full overflow-y-auto custom-scrollbar pr-2">
          
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500" />
            <h1 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
              <Network className="w-6 h-6 text-cyan-400" />
              AI System Architect
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Describe your system concept, and the neural engine will generate a complete, secure Python project blueprint, file tree, and core logic.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="glass-panel p-1 rounded-2xl flex flex-col relative glow-border">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., A real-time face recognition attendance system using OpenCV and SQLite, with a secure REST API..."
              className="w-full h-40 bg-black/40 text-slate-200 p-4 rounded-xl resize-none focus:outline-none custom-scrollbar text-sm"
              disabled={isGenerating}
            />
            <div className="p-2 bg-black/40 rounded-b-xl flex justify-between items-center border-t border-white/5">
              <span className="text-xs text-slate-500 font-mono flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-cyan-500" /> Powered by Gemini
              </span>
              <button
                type="submit"
                disabled={!prompt.trim() || isGenerating}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white px-5 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4" /> Architect System
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-start gap-3 text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {!result && !isGenerating && (
             <div className="glass-panel p-6 rounded-2xl flex-1 flex flex-col items-center justify-center text-center opacity-60">
               <Network className="w-12 h-12 text-slate-600 mb-4" />
               <p className="text-slate-400 text-sm">Awaiting neural initialization.</p>
               <p className="text-slate-500 text-xs mt-2">Enter a prompt to begin deep-analysis.</p>
             </div>
          )}
          
          {isGenerating && (
             <div className="glass-panel p-8 rounded-2xl flex-1 flex flex-col items-center justify-center text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                  <Cpu className="w-6 h-6 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <h3 className="text-cyan-400 font-medium tracking-widest uppercase text-sm animate-pulse">Synthesizing Blueprint</h3>
                <div className="mt-4 flex flex-col gap-2 w-full max-w-[200px]">
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-cyan-500 rounded-full w-1/3 animate-[shimmer_2s_infinite]" />
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 rounded-full w-2/3 animate-[shimmer_2.5s_infinite]" />
                  </div>
                </div>
             </div>
          )}
        </div>

        {/* Right Panel: Rendered Blueprint Details */}
        <AnimatePresence mode="wait">
          {result && !isGenerating && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden relative"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-black/60 to-transparent">
                <h2 className="text-3xl font-bold text-white mb-2">{result.projectName}</h2>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setActiveTab('overview')}
                    className={cn("text-sm font-medium transition-colors pb-1 border-b-2", activeTab === 'overview' ? "border-cyan-400 text-cyan-300" : "border-transparent text-slate-400 hover:text-slate-200")}
                  >
                    Blueprint Overview
                  </button>
                  <button 
                    onClick={() => setActiveTab('code')}
                    className={cn("text-sm font-medium transition-colors pb-1 border-b-2", activeTab === 'code' ? "border-cyan-400 text-cyan-300" : "border-transparent text-slate-400 hover:text-slate-200")}
                  >
                    Core Logic Engine
                  </button>
                  <button 
                    onClick={() => setActiveTab('security')}
                    className={cn("text-sm font-medium transition-colors pb-1 border-b-2 flex items-center gap-1", activeTab === 'security' ? "border-rose-400 text-rose-400" : "border-transparent text-slate-400 hover:text-slate-200")}
                  >
                    <ShieldAlert className="w-3 h-3" /> SecOps Audit
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                
                {activeTab === 'overview' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                    <section>
                      <h3 className="text-lg font-semibold text-white mb-3">System Overview</h3>
                      <p className="text-slate-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">{result.overview}</p>
                    </section>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <section className="bg-black/40 rounded-xl border border-white/5 overflow-hidden">
                        <div className="p-3 bg-white/5 border-b border-white/5 flex items-center gap-2">
                          <FolderTree className="w-4 h-4 text-cyan-400" />
                          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Architecture Tree</h3>
                        </div>
                        <div className="p-4 font-mono text-sm text-slate-300 space-y-1">
                          {result.fileTree.map((file, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="text-slate-600">├─</span> {file}
                            </div>
                          ))}
                        </div>
                      </section>

                      <section className="bg-black/40 rounded-xl border border-white/5 overflow-hidden flex flex-col">
                        <div className="p-3 bg-white/5 border-b border-white/5 flex items-center gap-2">
                          <Package className="w-4 h-4 text-emerald-400" />
                          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Dependencies</h3>
                        </div>
                        <div className="p-4 flex-1">
                          <div className="flex flex-wrap gap-2">
                            {result.dependencies.map((pkg, i) => (
                              <span key={i} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-mono">
                                {pkg}
                              </span>
                            ))}
                          </div>
                          <div className="mt-4 bg-white/5 p-3 rounded-lg border border-white/10">
                            <span className="text-xs text-slate-500 uppercase block mb-1">Install Command:</span>
                            <code className="text-sm text-cyan-300 font-mono">
                              pip install {result.dependencies.join(' ')}
                            </code>
                          </div>
                        </div>
                      </section>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'code' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                     <div className="bg-[#0d1117] rounded-xl border border-white/10 flex-1 flex flex-col overflow-hidden">
                        <div className="flex items-center gap-2 p-3 bg-white/5 border-b border-white/10">
                          <Code2 className="w-4 h-4 text-cyan-400" />
                          <span className="text-sm text-slate-300 font-mono">core_engine.py</span>
                        </div>
                        <pre className="p-6 text-slate-300 font-mono text-sm overflow-auto custom-scrollbar flex-1">
                          <code>{result.coreLogic}</code>
                        </pre>
                     </div>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                     <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3">
                        <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0" />
                        <p className="text-rose-200 text-sm">
                          <strong>Automated Cyber-Audit Complete.</strong> Below are the critical security vulnerabilities and hardening requirements identified for this architecture.
                        </p>
                     </div>
                     <div className="grid gap-4 mt-6">
                        {result.securityAnalysis.map((tip, i) => (
                          <div key={i} className="bg-black/40 border border-white/5 p-5 rounded-xl flex items-start gap-4 hover:border-rose-500/30 transition-colors">
                            <div className="bg-white/5 p-2 rounded-lg text-rose-400 font-mono text-xs">VULN_{i+1}</div>
                            <p className="text-slate-300 text-sm leading-relaxed">{tip}</p>
                          </div>
                        ))}
                     </div>
                  </motion.div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
