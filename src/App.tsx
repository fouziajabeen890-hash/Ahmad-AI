import { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Trophy, Menu, X, Home as HomeIcon, BookOpen, LogOut, Loader2, MessageSquare, PlayCircle, Bot, BrainCircuit, Sparkles, AlertTriangle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Home from './pages/Home';
import Course from './pages/Course';
import Auth from './pages/Auth';
import Reviews from './pages/Reviews';
import VideoLectures from './pages/VideoLectures';
import PythonChatbot from './pages/PythonChatbot';
import FoundationOfAI from './pages/FoundationOfAI';
import AICodeReview from './pages/AICodeReview';
import { cn } from './lib/utils';
import { auth } from './firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
          <p className="text-slate-400 max-w-md mb-8">
            The application encountered an unexpected error. This might be due to a connection issue or a temporary glitch.
          </p>
          <div className="bg-black/40 border border-white/5 rounded-2xl p-4 mb-8 w-full max-w-lg text-left overflow-auto max-h-40 custom-scrollbar">
            <code className="text-xs text-red-400 font-mono">
              {this.state.error?.toString()}
            </code>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            <RefreshCw className="w-5 h-5" />
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
}

function Layout({ children, user }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-mesh text-slate-200 overflow-hidden font-sans">
      {/* Top Navigation Bar */}
      <nav className="h-16 glass-border bg-black/40 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-50 relative">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)] overflow-hidden group-hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] transition-all duration-300">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
              <BrainCircuit className="w-6 h-6 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
              <Sparkles className="w-3 h-3 text-indigo-200 absolute top-1 right-1 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 tracking-tight hidden sm:block leading-none">
                AhmadShahid
              </h1>
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest hidden sm:block mt-0.5">
                Tutorial & AI
              </span>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-sm font-medium text-amber-400">
            <Trophy className="w-4 h-4" />
            <span>0% Completed</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center text-sm font-bold text-indigo-200 overflow-hidden shadow-inner">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-colors text-slate-400 hidden sm:flex"
              title="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute top-16 left-0 w-72 glass-panel border-r border-b border-white/10 shadow-2xl flex flex-col py-4 z-50 animate-in slide-in-from-left-4 duration-200 rounded-br-2xl">
            <div className="px-6 pb-4 mb-2 border-b border-white/5">
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Navigation</p>
            </div>
            <Link 
              to="/" 
              onClick={() => setMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-6 py-4 hover:bg-white/5 transition-colors",
                location.pathname === '/' ? "text-indigo-400 border-l-2 border-indigo-500 bg-indigo-500/10" : "text-slate-300 border-l-2 border-transparent"
              )}
            >
              <HomeIcon className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </Link>
            <Link 
              to="/videos" 
              onClick={() => setMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-6 py-4 hover:bg-white/5 transition-colors",
                location.pathname === '/videos' ? "text-indigo-400 border-l-2 border-indigo-500 bg-indigo-500/10" : "text-slate-300 border-l-2 border-transparent"
              )}
            >
              <PlayCircle className="w-5 h-5" />
              <div className="flex flex-col">
                <span className="font-medium">Python Course Video Lecture</span>
                <span className="text-xs text-slate-500">Only Videos</span>
              </div>
            </Link>
            <Link 
              to="/course" 
              onClick={() => setMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-6 py-4 hover:bg-white/5 transition-colors",
                location.pathname === '/course' ? "text-indigo-400 border-l-2 border-indigo-500 bg-indigo-500/10" : "text-slate-300 border-l-2 border-transparent"
              )}
            >
              <BookOpen className="w-5 h-5" />
              <div className="flex flex-col">
                <span className="font-medium">Python Full Course</span>
                <span className="text-xs text-slate-500">A to Z Video Lectures</span>
              </div>
            </Link>
            <Link 
              to="/reviews" 
              onClick={() => setMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-6 py-4 hover:bg-white/5 transition-colors",
                location.pathname === '/reviews' ? "text-indigo-400 border-l-2 border-indigo-500 bg-indigo-500/10" : "text-slate-300 border-l-2 border-transparent"
              )}
            >
              <MessageSquare className="w-5 h-5" />
              <div className="flex flex-col">
                <span className="font-medium">Course Reviews</span>
                <span className="text-xs text-slate-500">Read & Write Reviews</span>
              </div>
            </Link>
            <Link 
              to="/chatbot" 
              onClick={() => setMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-6 py-4 hover:bg-white/5 transition-colors",
                location.pathname === '/chatbot' ? "text-indigo-400 border-l-2 border-indigo-500 bg-indigo-500/10" : "text-slate-300 border-l-2 border-transparent"
              )}
            >
              <Bot className="w-5 h-5" />
              <div className="flex flex-col">
                <span className="font-medium">Python Chatbot</span>
                <span className="text-xs text-slate-500">Ask Python Questions</span>
              </div>
            </Link>
            <Link 
              to="/code-review" 
              onClick={() => setMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-6 py-4 hover:bg-white/5 transition-colors",
                location.pathname === '/code-review' ? "text-indigo-400 border-l-2 border-indigo-500 bg-indigo-500/10" : "text-slate-300 border-l-2 border-transparent"
              )}
            >
              <Sparkles className="w-5 h-5" />
              <div className="flex flex-col">
                <span className="font-medium">AI Code Review</span>
                <span className="text-xs text-slate-500">Analyze & Debug Code</span>
              </div>
            </Link>
            
            <div className="mt-auto pt-4 border-t border-white/5 sm:hidden">
              <button 
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-6 py-4 hover:bg-red-500/10 hover:text-red-400 transition-colors text-slate-300"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Log Out</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {children}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <ErrorBoundary>
        <Auth />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <Layout user={user}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/videos" element={<VideoLectures />} />
            <Route path="/course" element={<Course />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/chatbot" element={<PythonChatbot />} />
            <Route path="/code-review" element={<AICodeReview />} />
            <Route path="/foundation" element={<FoundationOfAI />} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}
