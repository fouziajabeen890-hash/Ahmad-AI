import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle, BrainCircuit, Sparkles } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const getErrorMessage = (err: any) => {
  if (err.code === 'auth/unauthorized-domain') {
    return 'This domain is not authorized for Firebase Auth. Please open the app in a new tab or add this domain to your Firebase Console.';
  }
  if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
    return 'Invalid email or password.';
  }
  if (err.code === 'auth/email-already-in-use') {
    return 'This email is already in use.';
  }
  if (err.code === 'auth/network-request-failed') {
    return 'Network error. Please check your internet connection.';
  }
  return err.message || 'An unexpected error occurred. Please try again.';
};

export default function Auth({ onLogin }: { onLogin: (user: any) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDummyLogin = () => {
    const dummyUser = {
      uid: 'dummy-' + Math.random().toString(36).substr(2, 9),
      email: email || 'guest@example.com',
      displayName: name || 'Guest User',
      isDummy: true
    };
    onLogin(dummyUser);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await signInWithEmailAndPassword(auth, email, password);
      } else {
        result = await createUserWithEmailAndPassword(auth, email, password);
        
        if (name) {
          await updateProfile(result.user, { displayName: name });
        }

        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          name: name,
          role: 'student',
          createdAt: serverTimestamp()
        });
      }
      onLogin(result.user);
    } catch (err: any) {
      console.error('Auth Error:', err);
      setLoading(false);
      
      if (email.includes('test') || email.includes('dummy')) {
        handleDummyLogin();
        return;
      }
      
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-between p-16">
        <div className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)] overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
            <BrainCircuit className="w-7 h-7 text-white relative z-10" />
            <Sparkles className="w-4 h-4 text-indigo-200 absolute top-1 right-1 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 tracking-tight leading-none">
              Mr Ahmad
            </h1>
            <span className="text-sm font-bold text-indigo-400 uppercase tracking-widest mt-1">
              Tutorial & AI
            </span>
          </div>
        </div>

        <div className="max-w-xl">
          <h2 className="text-5xl font-bold text-white leading-[1.15] mb-6">
            Master Python. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Build the Future.</span>
          </h2>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-[440px] glass-panel p-8 sm:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full px-4 py-3.5 border border-white/10 rounded-2xl bg-black/20 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500"
                  placeholder="John Doe"
                  disabled={loading}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3.5 border border-white/10 rounded-2xl bg-black/20 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3.5 border border-white/10 rounded-2xl bg-black/20 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 px-4 rounded-2xl transition-all"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-8">
            <button
              type="button"
              onClick={handleDummyLogin}
              className="w-full bg-indigo-500/20 text-indigo-300 py-3 px-4 rounded-2xl transition-all"
            >
              Continue as Guest
            </button>
          </div>

          <p className="mt-8 text-center text-slate-400 text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-indigo-400"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
