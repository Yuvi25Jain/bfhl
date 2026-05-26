'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, Message } from '@/store/useStore';
import { AgentAvatar } from '@/components/AgentAvatar';
import { Recorder } from '@/components/Recorder';
import { IntegrityMonitor } from '@/components/IntegrityMonitor';
import {
  Clock, ChevronRight, CheckCircle, AlertCircle, MessageSquare,
  Zap, BarChart2, LogOut, Brain, User, Shield, Activity, 
  Mic, Sparkles, Target, MoreHorizontal
} from 'lucide-react';

const AGENT_CONFIG = {
  hr: { label: 'HR Agent', icon: User, color: '#818cf8', subtitle: 'Behavioral & Culture' },
  technical: { label: 'Tech Lead', icon: Brain, color: '#a78bfa', subtitle: 'Technical & System Design' },
  evaluator: { label: 'Final Reviewer', icon: Shield, color: '#34d399', subtitle: 'Overall Assessment' },
};

const AGENT_SEQUENCE: Array<'hr' | 'technical' | 'evaluator'> = [
  'hr', 'hr', 'technical', 'technical', 'technical', 'evaluator',
];

export default function InterviewPage() {
  const router = useRouter();
  const {
    resumeData, messages, addMessage, currentQuestionIndex, setCurrentQuestionIndex,
    isInterviewActive, setInterviewActive, setInterviewStartTime, currentAgent, setCurrentAgent,
    integrityScore, setIntegrityScore, feedbackScore, setFeedbackScore, setFeedbackText,
    addToHistory,
  } = useStore();

  const [currentQuestion, setCurrentQuestion] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [interviewDone, setInterviewDone] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer
  useEffect(() => {
    if (isInterviewActive) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isInterviewActive]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentQuestion]);

  const fetchQuestion = useCallback(async (qIdx: number) => {
    if (qIdx >= AGENT_SEQUENCE.length) {
      finishInterview();
      return;
    }
    const agent = AGENT_SEQUENCE[qIdx];
    setCurrentAgent(agent);
    setAiTyping(true);

    try {
      const res = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent,
          questionIndex: qIdx,
          targetRole: resumeData?.targetRole,
          skills: resumeData?.skills,
          previousMessages: messages.slice(-4).map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setCurrentQuestion(data.question);
      setAiTyping(false);
    } catch {
      setCurrentQuestion("Could you elaborate on your experience with scaling high-traffic applications?");
      setAiTyping(false);
    }
  }, [resumeData, messages]);

  useEffect(() => {
    if (!resumeData) { router.push('/upload'); return; }
    if (messages.length === 0) {
      setInterviewActive(true);
      setInterviewStartTime(Date.now());
      fetchQuestion(0);
    }
  }, []);

  const handleSubmitAnswer = async (text: string) => {
    if (aiTyping || interviewDone) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    addMessage(userMsg);

    const aiMsg: Message = {
      id: (Date.now() - 1).toString(),
      role: 'ai',
      content: currentQuestion,
      timestamp: Date.now() - 1,
      agent: currentAgent,
      questionIndex: currentQuestionIndex,
    };
    addMessage(aiMsg);

    const nextIdx = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIdx);
    fetchQuestion(nextIdx);
  };

  const finishInterview = async () => {
    setInterviewDone(true);
    setInterviewActive(false);
    setAiTyping(true);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          role: resumeData?.targetRole,
          integrityScore,
          duration: elapsed,
        }),
      });
      const data = await res.json();
      setFeedbackScore(data.scores);
      setFeedbackText(data.feedback);

      addToHistory({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        role: resumeData?.targetRole || 'Unknown',
        scores: data.scores,
        messages,
        duration: elapsed,
        feedback: data.feedback,
      });

      router.push('/feedback');
    } catch {
      router.push('/feedback');
    }
  };

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (!resumeData) return null;

  const agentInfo = AGENT_CONFIG[currentAgent as keyof typeof AGENT_CONFIG] || AGENT_CONFIG.hr;

  return (
    <div className="bg-[var(--bg-primary)] h-screen flex flex-col pt-16">
      <IntegrityMonitor active={isInterviewActive} />
      
      {/* Real-time Diagnostics Bar */}
      <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 py-3 flex items-center justify-between z-40">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)]">Live Session</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Clock size={16} className="text-indigo-500" />
            <span className="font-mono">{formatTime(elapsed)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Target size={16} className="text-purple-500" />
            <span>Question {currentQuestionIndex + 1}/{AGENT_SEQUENCE.length}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Shield size={14} className="text-emerald-500" />
            <span className="text-xs font-bold text-emerald-500">{integrityScore}% Integrity</span>
          </div>
          <button 
            onClick={finishInterview}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 transition-all text-red-500"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat Flow (70%) */}
        <div className="flex-1 flex flex-col bg-[var(--bg-primary)] relative">
          <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-2' : ''}`}>
                  {msg.role === 'ai' && (
                    <div className="flex items-center gap-2 mb-2 ml-1">
                      <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                        <Brain size={12} className="text-white" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                        {msg.agent} agent
                      </span>
                    </div>
                  )}
                  <div className={`p-5 rounded-3xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-500/20' 
                      : 'bg-white dark:bg-gray-800 text-[var(--text-primary)] rounded-tl-none border border-white/10'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}

            {currentQuestion && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="max-w-[80%]">
                  <div className="flex items-center gap-2 mb-2 ml-1">
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                      <Brain size={12} className="text-white" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                      {currentAgent} agent
                    </span>
                  </div>
                  <div className="p-5 rounded-3xl bg-white dark:bg-gray-800 text-[var(--text-primary)] rounded-tl-none border border-white/10 text-sm leading-relaxed">
                    {currentQuestion}
                  </div>
                </div>
              </motion.div>
            )}

            {aiTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-white/10">
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-indigo-500"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Recorder Controls */}
          <div className="p-8 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)] to-transparent">
            <div className="max-w-2xl mx-auto">
              <Recorder onSubmit={handleSubmitAnswer} disabled={aiTyping || interviewDone} />
            </div>
          </div>
        </div>

        {/* Right: AI Panel (30%) */}
        <div className="w-[380px] bg-[var(--bg-secondary)] border-l border-white/10 p-8 flex flex-col gap-8 hidden lg:flex">
          {/* Active Agent Card */}
          <div className="premium-card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-20">
              <agentInfo.icon size={64} />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-6">
                <agentInfo.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">{agentInfo.label}</h3>
              <p className="text-xs text-[var(--text-muted)] mb-6">{agentInfo.subtitle}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-1 items-end h-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-indigo-500 rounded-full"
                      animate={{ height: aiTyping ? [8, 24, 8] : 8 }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-indigo-500 uppercase">Speaking...</span>
              </div>
            </div>
          </div>

          {/* Progress Path */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] px-1">Interview Timeline</h4>
            <div className="space-y-4">
              {AGENT_SEQUENCE.map((agent, i) => {
                const isActive = i === currentQuestionIndex;
                const isCompleted = i < currentQuestionIndex;
                const config = AGENT_CONFIG[agent];
                
                return (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        isActive ? 'bg-indigo-500 border-indigo-500 text-white' :
                        isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' :
                        'bg-white/5 border-white/10 text-[var(--text-muted)]'
                      }`}>
                        {isCompleted ? <CheckCircle size={14} /> : <span className="text-xs font-bold">{i + 1}</span>}
                      </div>
                      {i < AGENT_SEQUENCE.length - 1 && (
                        <div className={`w-0.5 flex-1 my-1 ${isCompleted ? 'bg-emerald-500' : 'bg-white/10'}`} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <h5 className={`text-sm font-bold ${isActive ? 'text-indigo-500' : 'text-[var(--text-primary)]'}`}>
                        {config.label}
                      </h5>
                      <p className="text-[10px] text-[var(--text-muted)]">{config.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tips Card */}
          <div className="premium-card p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
            <div className="flex items-center gap-2 mb-4 text-indigo-500">
              <Sparkles size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">AI Tip</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic">
              "Focus on using the STAR method for behavioral questions. Be concise and mention specific outcomes."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
