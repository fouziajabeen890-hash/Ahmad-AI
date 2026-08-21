import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Code2, CheckCircle2, AlertCircle, PlayCircle, Star, BrainCircuit } from 'lucide-react';
import { cn } from '../lib/utils';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

const CHALLENGES = [
  {
    id: 'ch-1',
    title: 'List Comprehension Magic',
    difficulty: 'Easy',
    points: 50,
    description: 'Create a list comprehension that generates a list of squares for all even numbers from 0 to 10.',
    initialCode: 'def generate_squares():\n    # Write your list comprehension here\n    result = []\n    return result\n\nprint(generate_squares())',
    expectedOutput: '[0, 4, 16, 36, 64, 100]',
    testCode: 'print(generate_squares())'
  },
  {
    id: 'ch-2',
    title: 'Dictionary Manipulation',
    difficulty: 'Medium',
    points: 100,
    description: 'Given a dictionary of item prices, create a new dictionary containing only items with a price greater than $10 using dictionary comprehension.',
    initialCode: 'prices = {"apple": 2, "banana": 1, "steak": 15, "wine": 25}\n\ndef filter_prices(p):\n    # Write your dict comprehension here\n    return {}\n\nprint(filter_prices(prices))',
    expectedOutput: "{'steak': 15, 'wine': 25}",
    testCode: 'print(filter_prices({"apple": 2, "banana": 1, "steak": 15, "wine": 25}))'
  },
  {
    id: 'ch-3',
    title: 'Fibonacci Generator',
    difficulty: 'Hard',
    points: 200,
    description: 'Write a generator function that yields the Fibonacci sequence up to a given number of terms n.',
    initialCode: 'def fibonacci(n):\n    # Write your generator here\n    pass\n\nprint(list(fibonacci(7)))',
    expectedOutput: '[0, 1, 1, 2, 3, 5, 8]',
    testCode: 'print(list(fibonacci(7)))'
  }
];

export default function PythonChallenges({ user, addXP }: { user: any, addXP: (amount: number) => void }) {
  const [activeChallenge, setActiveChallenge] = useState<any>(CHALLENGES[0]);
  const [code, setCode] = useState(CHALLENGES[0].initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user || user.isDummy) {
        const localData = localStorage.getItem('ahmad_challenges_progress');
        if (localData) {
          setCompletedChallenges(JSON.parse(localData));
        }
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, 'userProgress', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCompletedChallenges(docSnap.data().completedChallenges || []);
        }
      } catch (err) {
        console.error("Error fetching progress:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [user]);

  const saveProgress = async (challengeId: string) => {
    if (completedChallenges.includes(challengeId)) return;
    
    const newCompleted = [...completedChallenges, challengeId];
    setCompletedChallenges(newCompleted);
    
    if (!user || user.isDummy) {
      localStorage.setItem('ahmad_challenges_progress', JSON.stringify(newCompleted));
      return;
    }

    try {
      const docRef = doc(db, 'userProgress', user.uid);
      await setDoc(docRef, { completedChallenges: newCompleted }, { merge: true });
    } catch (err) {
      console.error("Error saving progress:", err);
    }
  };

  const selectChallenge = (challenge: any) => {
    setActiveChallenge(challenge);
    setCode(challenge.initialCode);
    setOutput('');
    setStatus('idle');
  };

  const runCode = async () => {
    setIsRunning(true);
    setStatus('idle');
    setOutput('Running code...');

    try {
      const runResponse = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: 'python',
          version: '3.10.0',
          files: [{ content: code }]
        })
      });

      const data = await runResponse.json();
      
      if (data.run && data.run.output) {
        const outStr = data.run.output.trim();
        setOutput(outStr);
        
        // Simple verification
        if (outStr === activeChallenge.expectedOutput) {
          setStatus('success');
          if (!completedChallenges.includes(activeChallenge.id)) {
            addXP(activeChallenge.points);
            saveProgress(activeChallenge.id);
          }
        } else {
          setStatus('error');
        }
      } else {
        setOutput('Error executing code.');
        setStatus('error');
      }
    } catch (error) {
      setOutput('Failed to run code. Network error.');
      setStatus('error');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-mesh relative">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/50 pointer-events-none" />
      
      <div className="flex-1 flex flex-col lg:flex-row h-full max-w-[1920px] mx-auto w-full relative z-10">
        
        {/* Left Sidebar - Challenges List */}
        <div className="w-full lg:w-80 border-r border-white/5 bg-black/40 flex flex-col">
          <div className="p-6 border-b border-white/5 bg-white/5 backdrop-blur-md">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Daily Challenges
            </h2>
            <p className="text-sm text-slate-400 mt-2">Complete tasks to earn XP and rank up.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {CHALLENGES.map((ch) => {
              const isCompleted = completedChallenges.includes(ch.id);
              return (
                <button
                  key={ch.id}
                  onClick={() => selectChallenge(ch)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all relative overflow-hidden group",
                    activeChallenge.id === ch.id 
                      ? "bg-cyan-500/10 border-cyan-500/30" 
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                  )}
                >
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <span className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">{ch.title}</span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">
                        {ch.points} XP
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 relative z-10">
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium border",
                      ch.difficulty === 'Easy' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      ch.difficulty === 'Medium' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                      "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    )}>
                      {ch.difficulty}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side - Editor & Description */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          
          <div className="p-6 md:p-8 border-b border-white/5 bg-black/20 shrink-0">
            <h1 className="text-3xl font-bold text-white mb-3">{activeChallenge.title}</h1>
            <p className="text-slate-300 max-w-3xl leading-relaxed">{activeChallenge.description}</p>
            
            <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4 text-cyan-400" /> Expected Output: <code className="bg-white/10 px-2 py-0.5 rounded text-cyan-300">{activeChallenge.expectedOutput}</code>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row min-h-0 bg-black/60">
            {/* Code Editor */}
            <div className="flex-1 flex flex-col min-h-[400px] lg:min-h-0 border-r border-white/5 relative group">
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                 <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors border border-emerald-500/30 font-medium disabled:opacity-50"
                >
                  {isRunning ? <div className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" /> : <PlayCircle className="w-4 h-4" />}
                  {isRunning ? 'Running...' : 'Run Code'}
                </button>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 w-full p-6 bg-transparent text-slate-200 font-mono text-sm leading-relaxed resize-none focus:outline-none custom-scrollbar"
                spellCheck={false}
              />
            </div>

            {/* Output Panel */}
            <div className="w-full lg:w-[400px] flex flex-col bg-[#050505]/80 shrink-0">
              <div className="px-4 py-3 border-b border-white/5 bg-white/5 flex justify-between items-center">
                 <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Output Console</span>
                 {status === 'success' && <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Passed</span>}
                 {status === 'error' && <span className="text-xs font-bold text-rose-400 bg-rose-400/10 px-2 py-1 rounded-full flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Failed</span>}
              </div>
              <div className="flex-1 p-4 font-mono text-sm overflow-y-auto custom-scrollbar relative">
                <pre className={cn(
                  "whitespace-pre-wrap transition-colors duration-300",
                  status === 'error' ? "text-rose-400" : 
                  status === 'success' ? "text-emerald-400" : "text-slate-300"
                )}>
                  {output || 'Run your code to see the output here...'}
                </pre>
                
                <AnimatePresence>
                  {status === 'success' && !completedChallenges.includes(activeChallenge.id) && (
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                     >
                       <div className="bg-yellow-400/20 text-yellow-400 px-4 py-2 rounded-full font-bold border border-yellow-400/30 flex items-center gap-2 backdrop-blur-md shadow-lg shadow-yellow-500/20">
                         <Star className="w-5 h-5 fill-yellow-400" />
                         +{activeChallenge.points} XP Earned!
                       </div>
                     </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
