import { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Play, Square, Loader2, RotateCcw } from 'lucide-react';

export default function PythonTerminal({ addXP }: { addXP: (amount: number) => void }) {
  const [code, setCode] = useState('print("Hello from Python!")\n# Write your Python code here\n');
  const [output, setOutput] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const pyodideRef = useRef<any>(null);

  useEffect(() => {
    const initPyodide = async () => {
      try {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = async () => {
          pyodideRef.current = await (window as any).loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
          });
          
          pyodideRef.current.setStdout({ batched: (msg: string) => {
            setOutput(prev => [...prev, msg]);
          }});
          
          setIsReady(true);
        };
      } catch (error) {
        console.error("Failed to initialize Pyodide:", error);
      }
    };

    initPyodide();
  }, []);

  const runCode = async () => {
    if (!isReady || !pyodideRef.current) return;
    
    setIsRunning(true);
    setOutput([]);
    
    try {
      await pyodideRef.current.runPythonAsync(code);
      addXP(5);
    } catch (error: any) {
      setOutput(prev => [...prev, error.message || String(error)]);
    } finally {
      setIsRunning(false);
    }
  };

  const clearOutput = () => setOutput([]);

  return (
    <div className="flex-1 overflow-y-auto bg-transparent text-white p-6 custom-scrollbar flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col mt-4">
        <div className="flex items-center gap-3 mb-8 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            <TerminalIcon className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">Live Python Terminal</h1>
            <p className="text-slate-400 text-sm">Write and execute Python code directly in your browser</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 flex-1 min-h-[60vh]">
          {/* Editor */}
          <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden flex flex-col">
            <div className="bg-black/40 px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium text-slate-300">main.py</span>
              </div>
              <button
                onClick={runCode}
                disabled={!isReady || isRunning}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-sm font-medium transition-colors border border-emerald-500/30 disabled:opacity-50"
              >
                {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Run Code
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 w-full bg-transparent p-4 font-mono text-sm text-slate-300 focus:outline-none resize-none custom-scrollbar"
              spellCheck={false}
              placeholder="# Write your Python code here"
            />
          </div>

          {/* Console Output */}
          <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden flex flex-col">
            <div className="bg-black/40 px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-300">Console Output</span>
                {!isReady && (
                  <span className="flex items-center gap-2 text-xs text-slate-400 ml-4">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Initializing Python Engine...
                  </span>
                )}
              </div>
              <button
                onClick={clearOutput}
                className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 transition-colors"
                title="Clear Output"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 bg-[#0d0d12] p-4 font-mono text-sm overflow-y-auto custom-scrollbar">
              {output.length > 0 ? (
                output.map((line, i) => (
                  <div key={i} className="text-slate-300 whitespace-pre-wrap font-mono break-all mb-1">
                    {line}
                  </div>
                ))
              ) : (
                <div className="text-slate-500 italic">No output yet...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
