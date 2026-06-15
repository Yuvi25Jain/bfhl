'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Zap, Shield, BarChart2, ArrowRight, 
  CheckCircle, Mic, Globe, Server, Code2, 
  Sparkles, Target, Activity, Layout, Clock, Play
} from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';

const TYPING_PHRASES = [
  'with AI Confidence.',
  'with Real-Time STAR Feedback.',
  'with Adaptive Panel AI.',
  'with Seamless Resume Matching.',
];

export default function MockMatePage() {
  const { user } = useStore();
  const [typingIndex, setTypingIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = TYPING_PHRASES[typingIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentPhrase.substring(0, displayText.length + 1));
        if (displayText.length === currentPhrase.length) {
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        setDisplayText(currentPhrase.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setTypingIndex((prev) => (prev + 1) % TYPING_PHRASES.length);
        }
      }
    }, isDeleting ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, typingIndex]);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 dark-grid pt-16 flex flex-col justify-between overflow-x-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] bg-indigo-500/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[70%] bg-purple-500/10 blur-[130px] rounded-full pointer-events-none" />
      </div>

      <main className="flex-1 w-full relative z-10 flex flex-col">
        {/* Hero Section */}
        <section className="section-container pt-16 pb-20 md:py-28">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Copywriting & CTA */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
                <Sparkles size={14} />
                <span>The Gold Standard of Interview Prep</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Prepare. Practice. Perfect.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                  MockMate AI
                </span>
              </h1>

              <h2 className="text-xl md:text-2xl font-bold text-slate-300 h-10">
                Land your dream job <span className="text-indigo-400">{displayText}</span>
              </h2>

              <p className="text-lg text-slate-400 font-medium max-w-xl leading-relaxed">
                Practice with adaptive AI panels that analyze your resume, speaking clarity, and structured STAR answers in real time.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href={user ? '/dashboard' : '/register'}
                  className="btn-primary flex items-center gap-2 group cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Start Mock Session Free</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="btn-secondary flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  Sign In to Dashboard
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500" />
                  <span>Adaptive Panel Interview Simulation</span>
                </div>
              </div>
            </div>

            {/* Right Column: Floating high-fidelity dashboard preview */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-pink-500/10 blur-[100px] rounded-full pointer-events-none" />
              
              {/* Simulated Floating App Card */}
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                className="premium-card p-6 border border-indigo-500/10 relative overflow-hidden glass-panel shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-indigo-500/10 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Live AI Panel</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 flex-shrink-0 animate-pulse">
                    <Brain size={24} className="text-white" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-200">Tech Lead Agent</h4>
                    <p className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">Systems & Code</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/10 text-xs italic leading-relaxed text-slate-300">
                    "How do you manage performance bottlenecks and optimize virtual memory layers when working with multi-gigabyte files?"
                  </div>

                  {/* Soundwave animation */}
                  <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-indigo-500/5">
                    <div className="flex items-end gap-1.5 h-6">
                      {[12, 24, 16, 28, 10, 22, 18, 26, 14, 8].map((h, i) => (
                        <div
                          key={i}
                          className="w-1 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-full"
                          style={{ height: `${h}px` }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 tracking-wider">00:48 / 15:00</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Advanced Features Grid */}
        <section id="features" className="bg-slate-950/50 border-y border-indigo-500/5 py-20">
          <div className="section-container text-center space-y-16">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Why Candidates Trust <span className="text-indigo-400 font-black">MockMate AI</span>
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto text-base">
                A complete adaptive evaluation laboratory designed to simulate high-pressure tech panel interviews.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  color: 'text-indigo-400',
                  bg: 'bg-indigo-500/5 border-indigo-500/10',
                  title: 'Adaptive Agent Panel',
                  desc: 'The AI mimics multiple real-world roles: HR checks culture, Tech Lead tests design, and the Reviewer scores context.'
                },
                {
                  icon: Target,
                  color: 'text-purple-400',
                  bg: 'bg-purple-500/5 border-purple-500/10',
                  title: 'STAR Methodology Scoring',
                  desc: 'Receive comprehensive breakdowns scoring your Situation, Task, Action, and Results directly against enterprise metrics.'
                },
                {
                  icon: Mic,
                  color: 'text-emerald-400',
                  bg: 'bg-emerald-500/5 border-emerald-500/10',
                  title: 'Voice Mode Dictation',
                  desc: 'Toggle speech-to-text dictation with active visual soundwaves, letting you practice speaking naturally.'
                },
                {
                  icon: Layout,
                  color: 'text-amber-400',
                  bg: 'bg-amber-500/5 border-amber-500/10',
                  title: 'High-Fidelity Resume Parsing',
                  desc: 'Drop in your PDF and watch our extractor scan and tailor dynamic technical scenarios suited specifically to your track record.'
                },
                {
                  icon: Clock,
                  color: 'text-pink-400',
                  bg: 'bg-pink-500/5 border-pink-500/10',
                  title: 'Live Pressure Timer',
                  desc: 'Simulate the fast-paced stress of real coding interviews with continuous active timelines and indicators.'
                },
                {
                  icon: BarChart2,
                  color: 'text-sky-400',
                  bg: 'bg-sky-500/5 border-sky-500/10',
                  title: 'Interactive Metrics Portal',
                  desc: 'Review scores out of 10, strengths, gaps, and precise action items to master your weaknesses rapidly.'
                }
              ].map((feat, idx) => (
                <div
                  key={idx}
                  className={`premium-card p-8 border text-left space-y-4 hover:border-indigo-500/35 hover:-translate-y-1 transition-all duration-300 glass-panel ${feat.bg}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${feat.color} bg-black/30 border border-current/15`}>
                    <feat.icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">{feat.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 section-container text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              How <span className="gradient-text font-black">MockMate</span> Works
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              Follow our structural stepper to go from profile matching to scoring diagnostics.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload & Match', desc: 'Upload your resume and copy target job descriptions to analyze your skill match score.' },
              { step: '02', title: 'Mock Simulation', desc: 'Face our real-time AI panel with speech-to-text dictation and continuous integrity logs.' },
              { step: '03', title: 'IDE Coding & Review', desc: 'Complete algorithm execution tests in our code editor and check STAR scores.' }
            ].map((step, idx) => (
              <div key={idx} className="premium-card p-8 bg-slate-900/40 border border-indigo-500/10 text-left space-y-4">
                <span className="text-4xl font-black text-indigo-500/30 font-mono block">{step.step}</span>
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="section-container py-20 text-center">
          <div className="premium-card p-12 md:p-20 relative overflow-hidden glass-panel border border-indigo-500/10 shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Ready to land your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">dream job?</span>
              </h2>
              <p className="text-slate-400 text-base md:text-lg">
                Practice adaptively, analyze missing skills, write sandboxed code, and secure offers.
              </p>
              <div className="pt-4">
                <Link
                  href={user ? '/dashboard' : '/register'}
                  className="btn-primary inline-flex items-center gap-2 text-lg hover:scale-105 active:scale-95 duration-200 cursor-pointer"
                >
                  <span>Practice Now - Completely Free</span>
                  <ArrowRight size={22} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
