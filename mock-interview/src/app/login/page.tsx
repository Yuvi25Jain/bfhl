'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Brain, Mail, Lock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    // Simulate login delay
    await new Promise((r) => setTimeout(r, 1000));
    
    // Log in user mock
    const mockName = email.split('@')[0];
    const capitalizedName = mockName.charAt(0).toUpperCase() + mockName.slice(1);
    login(capitalizedName, email, 'Software Engineer');
    
    setIsLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="bg-[#030712] min-h-screen pt-32 pb-20 px-4 dark-grid flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[130px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 mb-4">
            <Sparkles size={14} />
            <span>Welcome back to MockMate AI</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Account <span className="gradient-text">Sign In</span>
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Practice interviews, review diagnostics and tracking metrics.
          </p>
        </div>

        {/* Card */}
        <div className="premium-card p-8 bg-slate-900/60 border border-indigo-500/10 glass-panel shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3"
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-widest block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-indigo-500/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-widest block">Password</label>
                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-all">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-indigo-500/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] duration-200 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-indigo-500/5 pt-6 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-bold transition-all">
              Create free account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
