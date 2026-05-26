'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip 
} from 'recharts';
import {
  Trophy, TrendingUp, TrendingDown, Lightbulb, Shield,
  Star, ArrowRight, RotateCcw, ChevronRight, CheckCircle,
  MessageSquare, Brain, User, AlertCircle, ChevronDown, 
  ChevronUp, Download, Share2
} from 'lucide-react';
import Link from 'next/link';

const AGENT_CONFIG = {
  hr: { label: 'HR Agent', icon: User, color: '#818cf8' },
  technical: { label: 'Tech Lead', icon: Brain, color: '#a78bfa' },
  evaluator: { label: 'Final Reviewer', icon: Shield, color: '#34d399' },
};

export default function FeedbackPage() {
  const router = useRouter();
  const { feedbackScore, feedbackText, resumeData, integrityScore, messages } = useStore();
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!feedbackScore) { router.push('/'); }
  }, []);

  if (!feedbackScore || !feedbackText) return null;

  const radarData = [
    { subject: 'Clarity', A: feedbackScore.clarity, fullMark: 100 },
    { subject: 'Confidence', A: feedbackScore.confidence, fullMark: 100 },
    { subject: 'Technical', A: feedbackScore.technicalDepth, fullMark: 100 },
    { subject: 'Comm.', A: feedbackScore.communication, fullMark: 100 },
    { subject: 'Integrity', A: integrityScore, fullMark: 100 },
  ];

  const overallColor = feedbackScore.overall >= 75 ? '#34d399' : feedbackScore.overall >= 50 ? '#fbbf24' : '#f87171';

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen pt-32 pb-20 px-4">
      <div className="section-container max-w-6xl">
        {/* Header Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Overall Score Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-1 premium-card p-10 flex flex-col items-center justify-center text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
            <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-6">
              <Trophy size={40} />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">Overall Performance</h2>
            <div className="text-7xl font-bold gradient-text mb-4">{feedbackScore.overall}%</div>
            <p className="text-lg font-bold" style={{ color: overallColor }}>
              {feedbackScore.overall >= 75 ? 'Exceptional' : feedbackScore.overall >= 50 ? 'Steady Growth' : 'Needs Focus'}
            </p>
          </motion.div>

          {/* Radar Insights */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 premium-card p-10 flex flex-col md:flex-row items-center gap-10"
          >
            <div className="w-full h-[240px] md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="var(--border-color)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                  <Radar
                    name="Performance"
                    dataKey="A"
                    stroke="#818cf8"
                    fill="#818cf8"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Key Competencies</h3>
              <div className="space-y-4">
                {radarData.map((d) => (
                  <div key={d.subject} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--text-secondary)]">{d.subject}</span>
                      <span className="font-bold text-indigo-500">{d.A}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-indigo-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${d.A}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Detailed Feedback Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="premium-card p-8">
            <div className="flex items-center gap-3 mb-6 text-emerald-500">
              <TrendingUp size={24} />
              <h4 className="font-bold">Core Strengths</h4>
            </div>
            <ul className="space-y-4">
              {feedbackText.strengths.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                  <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="premium-card p-8">
            <div className="flex items-center gap-3 mb-6 text-red-500">
              <TrendingDown size={24} />
              <h4 className="font-bold">Growth Areas</h4>
            </div>
            <ul className="space-y-4">
              {feedbackText.weaknesses.map((w, i) => (
                <li key={i} className="flex gap-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                  <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                  {w}
                </li>
              ))}
            </ul>
          </div>

          <div className="premium-card p-8">
            <div className="flex items-center gap-3 mb-6 text-amber-500">
              <Lightbulb size={24} />
              <h4 className="font-bold">Actionable Tips</h4>
            </div>
            <ul className="space-y-4">
              {feedbackText.suggestions.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                  <Star size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Transcript Critique Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-[var(--text-primary)]">Transcript & <span className="gradient-text">Critique</span></h3>
            <div className="flex gap-3">
              <button className="btn-secondary text-sm flex items-center gap-2">
                <Download size={16} /> Export
              </button>
              <button className="btn-secondary text-sm flex items-center gap-2">
                <Share2 size={16} /> Share
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {messages.filter(m => m.role === 'ai').map((msg, i) => {
              const userReply = messages.find(m => m.timestamp > msg.timestamp && m.role === 'user');
              const agent = AGENT_CONFIG[msg.agent as keyof typeof AGENT_CONFIG] || AGENT_CONFIG.hr;
              
              return (
                <div key={msg.id} className="premium-card overflow-hidden">
                  <div 
                    className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all flex items-center justify-between"
                    onClick={() => setExpandedMessage(expandedMessage === msg.id ? null : msg.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <agent.icon size={20} />
                      </div>
                      <div>
                        <h5 className="font-bold text-[var(--text-primary)] text-sm">Question {i + 1}</h5>
                        <p className="text-xs text-[var(--text-muted)] truncate max-w-md">{msg.content}</p>
                      </div>
                    </div>
                    {expandedMessage === msg.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  
                  <AnimatePresence>
                    {expandedMessage === msg.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-6 border-t border-white/5"
                      >
                        <div className="pt-6 grid md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h6 className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">Your Response</h6>
                            <p className="text-sm text-[var(--text-secondary)] italic leading-relaxed">
                              "{userReply?.content || 'No response recorded'}"
                            </p>
                          </div>
                          <div className="space-y-4 bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/10">
                            <h6 className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">AI Critique</h6>
                            <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                              {feedbackText.critiques?.[msg.id] || "The response was structurally sound but could benefit from more quantitative results. Mention specific percentages or time-savings where applicable."}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Final CTA */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/upload" className="btn-primary px-10 py-4 flex items-center gap-2 text-lg">
            <RotateCcw size={20} /> Try Again
          </Link>
          <Link href="/history" className="btn-secondary px-10 py-4 flex items-center gap-2 text-lg">
            Dashboard <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
