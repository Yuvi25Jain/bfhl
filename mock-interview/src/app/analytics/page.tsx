'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, 
  Radar, BarChart, Bar, Legend
} from 'recharts';
import { 
  BarChart2, ArrowLeft, TrendingUp, Cpu, Calendar,
  Award, ShieldAlert, Sparkles, BookOpen, ChevronRight, CheckCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, history, gapAnalysis } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'skills'>('overview');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  if (!user) return null;

  // Generate mock history if empty for demonstration visual satisfaction
  const displayHistory = history.length > 0 ? history : [
    {
      id: 'mock-1',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      role: 'Software Engineer',
      scores: { overall: 65, clarity: 60, confidence: 70, technicalDepth: 55, communication: 68, integrity: 98 },
      duration: 320,
    },
    {
      id: 'mock-2',
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      role: 'Software Engineer',
      scores: { overall: 74, clarity: 72, confidence: 78, technicalDepth: 70, communication: 75, integrity: 100 },
      duration: 410,
    },
    {
      id: 'mock-3',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      role: 'Software Engineer',
      scores: { overall: 85, clarity: 80, confidence: 85, technicalDepth: 88, communication: 82, integrity: 95 },
      duration: 520,
    }
  ];

  const chartData = displayHistory.map((s, i) => ({
    name: `Mock #${i + 1}`,
    date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: s.scores.overall,
    technical: s.scores.technicalDepth,
    communication: s.scores.communication,
  }));

  const latestSession = displayHistory[displayHistory.length - 1];

  const radarData = [
    { subject: 'Clarity', score: latestSession.scores.clarity, fullMark: 100 },
    { subject: 'Confidence', score: latestSession.scores.confidence, fullMark: 100 },
    { subject: 'Technical Depth', score: latestSession.scores.technicalDepth, fullMark: 100 },
    { subject: 'Communication', score: latestSession.scores.communication, fullMark: 100 },
    { subject: 'Integrity', score: latestSession.scores.integrity, fullMark: 100 },
  ];

  const barData = [
    { name: 'Clarity', score: latestSession.scores.clarity },
    { name: 'Confidence', score: latestSession.scores.confidence },
    { name: 'Technical', score: latestSession.scores.technicalDepth },
    { name: 'Comm.', score: latestSession.scores.communication },
    { name: 'Integrity', score: latestSession.scores.integrity },
  ];

  const totalInterviews = displayHistory.length;
  const averageScore = Math.round(displayHistory.reduce((a, s) => a + s.scores.overall, 0) / totalInterviews);
  const highestScore = Math.max(...displayHistory.map(s => s.scores.overall));

  return (
    <div className="bg-[#030712] min-h-screen pt-32 pb-20 px-4 dark-grid">
      <div className="section-container max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/dashboard" className="text-slate-400 hover:text-indigo-400 text-sm flex items-center gap-1.5 transition-colors">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Performance <span className="gradient-text">Diagnostics</span>
            </h1>
            <p className="text-slate-400 mt-2">Comprehensive visual feedback and analytical progressions.</p>
          </div>

          <div className="flex bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Progression Chart
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'skills' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Competency Radar
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <div className="premium-card p-6 bg-slate-900/40 border border-indigo-500/10 flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Calendar size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mocks Tracked</p>
              <h3 className="text-2xl font-bold text-white mt-1">{totalInterviews}</h3>
            </div>
          </div>

          <div className="premium-card p-6 bg-slate-900/40 border border-purple-500/10 flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Award size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mean Score</p>
              <h3 className="text-2xl font-bold text-white mt-1">{averageScore}%</h3>
            </div>
          </div>

          <div className="premium-card p-6 bg-slate-900/40 border border-emerald-500/10 flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TrendingUp size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Peak overall Score</p>
              <h3 className="text-2xl font-bold text-white mt-1">{highestScore}%</h3>
            </div>
          </div>
        </div>

        {/* Charts Container */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Main Chart Card */}
          <div className="lg:col-span-2 premium-card p-8 bg-slate-900/40 border border-slate-800/80 flex flex-col justify-between">
            {activeTab === 'overview' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Score progression trend</h3>
                  <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
                    <Sparkles size={12} /> Linear Improvement
                  </span>
                </div>

                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.3} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#scoreGlow)" name="Overall Score" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Competency Profile Radar</h3>
                  <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
                    <Sparkles size={12} /> Latest diagnostics (Mock #{totalInterviews})
                  </span>
                </div>

                <div className="h-[320px] w-full flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#334155" opacity={0.5} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Radar name="Latest Session" dataKey="score" stroke="#818cf8" fill="#818cf8" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Bar metrics card */}
          <div className="premium-card p-8 bg-slate-900/40 border border-slate-800/80 flex flex-col justify-between">
            <h3 className="text-base font-bold text-white mb-6">Latest Score breakdown</h3>

            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
                  <Bar dataKey="score" fill="#818cf8" radius={[8, 8, 0, 0]}>
                    {barData.map((entry, idx) => (
                      <motion.div key={idx} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-4">
              {barData.map((b, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{b.name}</span>
                  <span className="font-bold text-indigo-400">{b.score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gap Analysis Summary & Learning links */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Skills match summary */}
          <div className="premium-card p-8 bg-slate-900/40 border border-slate-800/80 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="text-indigo-400" size={20} />
              <span>Skill gaps Matching</span>
            </h3>

            {gapAnalysis ? (
              <div className="space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Match score against post requirements</span>
                  <span className="font-bold text-emerald-400">{gapAnalysis.matchPercentage}%</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <div className="w-full text-xs font-bold text-slate-500 uppercase tracking-wider">Matched</div>
                  {gapAnalysis.matchedSkills.slice(0, 4).map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
                      {s}
                    </span>
                  ))}
                  
                  <div className="w-full text-xs font-bold text-slate-500 uppercase tracking-wider mt-2">Gaps to Study</div>
                  {gapAnalysis.missingSkills.slice(0, 4).map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 text-sm">
                <ShieldAlert className="mx-auto text-slate-600 mb-2" size={32} />
                <p>Run a <Link href="/job-description" className="text-indigo-400 hover:underline">Job Matching Analysis</Link> to show gap diagrams.</p>
              </div>
            )}
          </div>

          {/* Action modules */}
          <div className="premium-card p-8 bg-slate-900/40 border border-slate-800/80 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="text-indigo-400" size={20} />
              <span>Assigned roadmaps</span>
            </h3>

            <div className="space-y-4">
              {[
                { topic: 'System Design Scaling', desc: 'Focus on distributed caching, Redis sharding, and write-through patterns.', link: 'https://github.com/donnemartin/system-design-primer' },
                { topic: 'Data Structures: Tree & Graph Traversals', desc: 'Practice DFS/BFS node parsing algorithms.', link: 'https://roadmap.sh/computer-science' }
              ].map((rec, idx) => (
                <div key={idx} className="p-4 bg-slate-950/40 rounded-xl border border-slate-850 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-white">{rec.topic}</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-1">{rec.desc}</p>
                  </div>
                  <a href={rec.link} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 flex-shrink-0 mt-0.5">
                    <ChevronRight size={16} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
