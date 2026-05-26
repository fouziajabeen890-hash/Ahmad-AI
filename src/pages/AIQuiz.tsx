import { useState } from 'react';
import { BrainCircuit, Loader2, Sparkles, CheckCircle2, XCircle, ArrowRight, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export default function AIQuiz({ addXP }: { addXP: (amount: number) => void }) {
  const [topic, setTopic] = useState('Python Basics');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [error, setError] = useState('');

  const generateQuiz = async () => {
    setIsLoading(true);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizCompleted(false);
    setError('');

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty })
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to generate quiz');
      
      setQuestions(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to connect to the quiz engine.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    if (index === questions[currentQuestionIndex].correctAnswerIndex) {
      setScore(prev => prev + 1);
      addXP(10);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
      // Bonus XP for completing quiz
      addXP(50);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex-1 overflow-y-auto bg-transparent text-white p-6 custom-scrollbar">
      <div className="max-w-4xl mx-auto mt-4 px-4">
        {/* Header section */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            <BrainCircuit className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">AI Python Quiz</h1>
            <p className="text-slate-400 text-sm">Test your Python knowledge with dynamically generated quizzes</p>
          </div>
        </div>

        {!questions.length && !isLoading && !quizCompleted && (
          <div className="glass-panel p-8 rounded-3xl border border-white/10 mb-8 max-w-2xl mx-auto shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="space-y-6 relative z-10">
              {error && (
                <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm">
                  {error}
                </div>
              )}
            
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Select Topic</label>
                <select 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all hover:bg-black/60"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                >
                  <option>Python Basics</option>
                  <option>Variables & Data Types</option>
                  <option>Control Flow (If/Else, Loops)</option>
                  <option>Functions & Modules</option>
                  <option>Object-Oriented Programming (OOP)</option>
                  <option>File Handling</option>
                  <option>Exception Handling</option>
                  <option>Advanced Python (Decorators, Generators)</option>
                  <option>Data Science (Pandas, NumPy)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Select Difficulty</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Beginner', 'Intermediate', 'Advanced'].map(diff => (
                    <button
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={cn(
                        "px-4 py-3 rounded-xl border text-sm font-medium transition-all text-center",
                        difficulty === diff 
                          ? "border-indigo-500 bg-indigo-500/20 text-indigo-300 shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                          : "border-white/10 bg-black/40 text-slate-400 hover:bg-white/5"
                      )}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generateQuiz}
                className="w-full py-4 mt-4 bg-gradient-to-r from-indigo-500/80 to-purple-600/80 hover:from-indigo-500 hover:to-purple-600 rounded-xl text-white font-semibold transition-all shadow-lg flex items-center justify-center gap-2 group backdrop-blur-md border border-white/10"
              >
                <Sparkles className="w-5 h-5 text-indigo-300 group-hover:scale-110 transition-transform" />
                Generate AI Quiz
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
              <Loader2 className="w-12 h-12 animate-spin text-indigo-400 relative z-10" />
            </div>
            <p className="mt-6 text-slate-400 font-medium animate-pulse">Consulting AI neural interface...</p>
            <p className="text-xs text-slate-500 mt-2">Generating personalized {difficulty.toLowerCase()} questions for {topic}</p>
          </div>
        )}

        {questions.length > 0 && !quizCompleted && (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm font-medium text-slate-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              <div className="flex gap-1.5">
                {questions.map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-8 h-1.5 rounded-full transition-all duration-500",
                      i === currentQuestionIndex ? "bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]" : 
                      i < currentQuestionIndex ? "bg-emerald-500/50" : "bg-white/10"
                    )}
                  />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-panel p-8 rounded-3xl border border-white/10"
              >
                <h2 className="text-xl md:text-2xl font-medium text-white mb-8 leading-relaxed">
                  {currentQuestion.question}
                </h2>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isCorrect = idx === currentQuestion.correctAnswerIndex;
                    const isSelected = selectedAnswer === idx;
                    
                    let bgClass = "bg-white/5 border-white/10 hover:bg-white/10";
                    let textClass = "text-slate-300";
                    
                    if (showExplanation) {
                      if (isCorrect) {
                        bgClass = "bg-emerald-500/20 border-emerald-500/50";
                        textClass = "text-emerald-300";
                      } else if (isSelected && !isCorrect) {
                        bgClass = "bg-red-500/20 border-red-500/50";
                        textClass = "text-red-300";
                      } else {
                        bgClass = "bg-black/40 border-white/5 opacity-50";
                      }
                    } else if (isSelected) {
                      bgClass = "bg-indigo-500/20 border-indigo-500/50";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSubmit(idx)}
                        disabled={showExplanation}
                        className={cn(
                          "w-full text-left px-5 py-4 rounded-xl border transition-all duration-300 flex items-center justify-between",
                          bgClass
                        )}
                      >
                        <span className={cn("font-medium", textClass)}>{option}</span>
                        {showExplanation && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                        {showExplanation && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            selectedAnswer === currentQuestion.correctAnswerIndex ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                          )}>
                            {selectedAnswer === currentQuestion.correctAnswerIndex ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-200 mb-1">
                              {selectedAnswer === currentQuestion.correctAnswerIndex ? 'Correct!' : 'Incorrect'}
                            </h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                              {currentQuestion.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleNextQuestion}
                        className="mt-6 w-full py-4 bg-white/10 hover:bg-white/15 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {quizCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto glass-panel p-10 rounded-[2rem] border border-white/10 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(52,211,153,0.2)]">
              <Trophy className="w-10 h-10 text-emerald-400" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-2">Quiz Completed!</h2>
            <p className="text-slate-400 mb-8">You've successfully finished the {topic} quiz.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 py-6 rounded-2xl border border-white/5">
                <div className="text-4xl font-bold text-indigo-400 mb-1">{score}/{questions.length}</div>
                <div className="text-sm text-slate-500 uppercase tracking-widest">Score</div>
              </div>
              <div className="bg-white/5 py-6 rounded-2xl border border-white/5">
                <div className="text-4xl font-bold text-emerald-400 mb-1">+{score * 10 + 50}</div>
                <div className="text-sm text-slate-500 uppercase tracking-widest">XP Earned</div>
              </div>
            </div>

            <button
              onClick={generateQuiz}
              className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold transition-colors mb-3"
            >
              Try Another Quiz
            </button>
            <button
              onClick={() => {
                setQuizCompleted(false);
                setQuestions([]);
              }}
              className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-medium transition-colors"
            >
              Change Topic
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
