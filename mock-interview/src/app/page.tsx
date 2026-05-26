'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Brain, Zap, Shield, BarChart2, ArrowRight, Star,
  CheckCircle, Mic, ChevronRight, Users, Trophy, Clock,
  MessageSquare, Layout, Sparkles, Target, Activity
} from 'lucide-react';

const typingPhrases = [
  'with AI Confidence.',
  'with Real-Time Feedback.',
  'with Multi-Agent AI.',
  'with Adaptive Interviews.',
];

const features = [
  {
    icon: Brain,
    title: 'Multi-Agent AI',
    desc: 'HR, Technical, and Evaluator agents collaborate dynamically to simulate a real-world panel.',
    color: '#818cf8',
  },
  {
    icon: Activity,
    title: 'Adaptive Difficulty',
    desc: 'Our proprietary algorithms adjust question complexity based on your live performance.',
    color: '#a78bfa',
  },
  {
    icon: Mic,
    title: 'Voice Intelligence',
    desc: 'Analyze your clarity, tone, and confidence levels with precision voice diagnostics.',
    color: '#34d399',
  },
  {
    icon: Layout,
    title: 'Resume Parsing',
    desc: 'Automatically extract skills and experience to build a personalized interview roadmap.',
    color: '#fbbf24',
  },
  {
    icon: Shield,
    title: 'Integrity Monitoring',
    desc: 'Maintain focus with tab-switch detection and inactivity alerts during sessions.',
    color: '#f87171',
  },
  {
    icon: BarChart2,
    title: 'Performance Reports',
    desc: 'Receive detailed analytics, score breakdowns, and actionable suggestions for growth.',
    color: '#38bdf8',
  },
];

const steps = [
  {
    n: '01',
    title: 'Upload or Select',
    desc: 'Upload your resume or select your target domain to get started instantly.',
    icon: Sparkles
  },
  {
    n: '02',
    title: 'Live AI Interview',
    desc: 'Face our adaptive AI panel in a realistic, voice-powered interview environment.',
    icon: Mic
  },
  {
    n: '03',
    title: 'Get Insights',
    desc: 'Review your detailed dashboard with scores, heatmaps, and peer benchmarks.',
    icon: Target
  },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'Frontend Engineer', text: 'The technical agent asked me system design questions that were exactly like my actual interview at Uber.', stars: 5 },
  { name: 'Marcus Miller', role: 'Backend Lead', text: 'The feedback on my speech clarity and confidence was eye-opening. Helped me land my current role.', stars: 5 },
  { name: 'Elena Rodriguez', role: 'HR Manager', text: 'I use it to help my team practice their interviewing skills. The multi-agent setup is incredibly realistic.', stars: 5 },
];

function TypewriterHeadline() {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = typingPhrases[index];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentPhrase.substring(0, displayText.length + 1));
        if (displayText.length === currentPhrase.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(currentPhrase.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % typingPhrases.length);
        }
      }
    }, isDeleting ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, index]);

  return (
    <span className="text-indigo-500 inline-block min-w-[300px]">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

function LiveDemoCard() {
  const [agent, setAgent] = useState('HR Agent');
  const [transcript, setTranscript] = useState('Tell me about yourself and your career goals.');

  useEffect(() => {
    const agents = ['HR Agent', 'Technical Agent', 'Evaluator Agent'];
    const transcripts = [
      'Tell me about yourself and your career goals.',
      'Explain the difference between REST and GraphQL.',
      'How would you handle a conflict within your team?'
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % agents.length;
      setAgent(agents[i]);
      setTranscript(transcripts[i]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card p-6 relative overflow-hidden group"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">Live Session</span>
        </div>
      </div>

      <div className="flex items-start gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center animate-pulse-soft flex-shrink-0">
          <Brain className="text-white" size={32} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-indigo-500 mb-1">{agent}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">Interviewer</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
          <p className="text-sm italic leading-relaxed text-gray-700 dark:text-gray-300">
            "{transcript}"
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="waveform-container">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="waveform-bar" style={{ height: `${8 + Math.random() * 20}px`, animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
          <div className="text-[10px] font-mono text-gray-400">00:42 / 10:00</div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-[var(--bg-primary)] pt-32">
      {/* Hero Section */}
      <section className="section-container pb-24 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-8 text-[var(--text-primary)]">
              Ace Every Interview <br />
              <TypewriterHeadline />
            </h1>
            <p className="text-lg lg:text-xl text-[var(--text-secondary)] mb-10 max-w-xl leading-relaxed">
              Practice with AI interviewers that adapt to your resume, speaking style, and confidence level in real time.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/upload" className="btn-primary text-base flex items-center gap-2">
                Start Interview Free <ArrowRight size={20} />
              </Link>
              <Link href="#demo" className="btn-secondary text-base">
                Watch Demo
              </Link>
            </div>
            
            <div className="mt-12 flex items-center gap-6 text-sm text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-500" />
                No Credit Card
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-500" />
                Instant Feedback
              </div>
            </div>
          </motion.div>

          <div className="relative">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full" />
            <LiveDemoCard />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-[var(--bg-secondary)] py-24 lg:py-32">
        <div className="section-container">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-[var(--text-primary)]">
              Why <span className="gradient-text">InterAI</span>?
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              Everything you need to go from nervous to hireable in weeks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="premium-card p-8 group"
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ background: `${feature.color}15`, color: feature.color }}
                >
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)]">{feature.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 lg:py-32">
        <div className="section-container">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-[var(--text-primary)]">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              A professional 3-step process to transform your performance.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative"
              >
                <div className="premium-card p-10 h-full">
                  <div className="flex items-center justify-between mb-8">
                    <div className="text-5xl font-bold text-indigo-500/10">{step.n}</div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                      <step.icon size={24} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">{step.title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                    <ChevronRight size={32} className="text-gray-200 dark:text-gray-800" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[var(--bg-secondary)] py-24 lg:py-32">
        <div className="section-container">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-[var(--text-primary)]">
              Real Stories from <span className="gradient-text">Real Users</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="premium-card p-8 flex flex-col justify-between"
              >
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={16} fill="#fbbf24" className="text-amber-400" />
                  ))}
                </div>
                <p className="text-lg italic text-[var(--text-secondary)] mb-8 leading-relaxed">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--text-primary)]">{t.name}</h4>
                    <p className="text-sm text-indigo-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32">
        <div className="section-container text-center">
          <div className="premium-card p-16 lg:p-24 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-6xl font-bold mb-8 text-[var(--text-primary)]">
                Ready to land your <br /> <span className="gradient-text">dream job?</span>
              </h2>
              <p className="text-xl text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto">
                Join hundreds of candidates who have aced their interviews with InterAI.
              </p>
              <Link href="/upload" className="btn-primary text-lg px-12 py-4 inline-flex items-center gap-2">
                Start for Free <ArrowRight size={24} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-12">
        <div className="section-container flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Brain size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-[var(--text-primary)]">
              Inter<span className="gradient-text">AI</span>
            </span>
          </div>
          
          <div className="flex gap-8 text-sm text-[var(--text-muted)]">
            <Link href="/" className="hover:text-indigo-500 transition-colors">Home</Link>
            <Link href="#features" className="hover:text-indigo-500 transition-colors">Features</Link>
            <Link href="/history" className="hover:text-indigo-500 transition-colors">History</Link>
            <Link href="https://github.com" className="hover:text-indigo-500 transition-colors">GitHub</Link>
          </div>
          
          <p className="text-sm text-[var(--text-muted)]">
            © 2026 InterAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
