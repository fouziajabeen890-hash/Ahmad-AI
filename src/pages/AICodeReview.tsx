import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Code2, Sparkles, Loader2, AlertCircle, CheckCircle2, Terminal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'motion/react';

export default function AICodeReview({ addXP }: { addXP: (amount: number) => void }) {
  const [code, setCode] = useState('');
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const reviewEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (review && !isLoading) {
      reviewEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [review, isLoading]);

  const handleReview = async () => {
    if (!code.trim()) return;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      setReview('⚠️ **API Key Missing!** Please add `GEMINI_API_KEY` to your Vercel Environment Variables and redeploy.');
      setIsLoading(false);
      return;
    }
    const ai = new GoogleGenAI({ apiKey });

    setIsLoading(true);
    setReview('');
    
    try {
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
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setReview(response.text || 'No review generated.');
      addXP(50); // Earn 50 XP for a code review
    } catch (error) {
      console.error('Error generating review:', error);
      setReview('An error occurred while generating the review. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-transparent text-white p-6 custom-scrollbar">
      <div className="max-w-6xl mx-auto mt-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">AI Code Reviewer</h1>
            <p className="text-slate-400 text-sm">Paste your Python code for instant expert analysis and refactoring</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden flex flex-col h-[70vh]">
            <div className="bg-black/40 px-4 py-3 border-b border-white/10 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-slate-300">Your Python Code</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="# Paste your Python code here..."
              className="flex-1 w-full bg-transparent p-4 text-sm font-mono text-slate-300 focus:outline-none resize-none custom-scrollbar"
              spellCheck={false}
            />
            <div className="p-4 bg-black/40 border-t border-white/10">
              <button
                onClick={handleReview}
                disabled={isLoading || !code.trim()}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Code...
                  </>
                ) : (
                  <>
                    <Terminal className="w-5 h-5" />
                    Analyze & Refactor
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden flex flex-col h-[70vh]">
            <div className="bg-black/40 px-4 py-3 border-b border-white/10 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-slate-300">AI Analysis</span>
            </div>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
                    <Sparkles className="w-6 h-6 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <p className="text-sm font-medium animate-pulse">Running static analysis and AI review...</p>
                </div>
              ) : review ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose prose-invert prose-indigo max-w-none prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {review}
                  </ReactMarkdown>
                  <div ref={reviewEndRef} />
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
                  <Terminal className="w-12 h-12 opacity-20" />
                  <p className="text-sm text-center max-w-xs">Paste your code and click analyze to get instant feedback on bugs, performance, and best practices.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
