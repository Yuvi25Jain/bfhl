'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, InterviewSession } from '@/store/useStore';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  History, Calendar, Briefcase, Trophy, ChevronRight, 
  Trash2, MessageSquare, X, Target, Zap, Activity,
  Search, Filter, Download, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

const COLORS = ['#818cf8', '#a78bfa', '#34d399', '#fbbf24', '#f87171'];

export default function HistoryPage() {
  const { history, clearHistory, addToHistory } = useStore();
  const [selectedSession, setSelectedSession] = useState<InterviewSession | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (history.length === 0) {
      const mockSessions: InterviewSession[] = [
        {
          id: 'session-1',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          role: 'Frontend Developer',
          scores: { overall: 65, clarity: 60, confidence: 70, technicalDepth: 55, communication: 68, integrity: 98 },
          duration: 320,
          messages: [
            { id: '1', role: 'ai', content: 'What is code splitting in Next.js?', agent: 'technical', timestamp: 1 },
            { id: '2', role: 'user', content: 'Code splitting is a technique that splits bundles to load components dynamically, lowering initial bundle download weights.', timestamp: 2 }
          ],
          feedback: {
            strengths: ['Understood React code bundle layout.'],
            weaknesses: ['Vague on dynamic routing mechanics.'],
            suggestions: ['Read dynamic imports docs.'],
            critiques: { '1': 'Good description but could benefit from listing next/dynamic usage.' }
          }
        },
        {
          id: 'session-2',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          role: 'Full Stack Engineer',
          scores: { overall: 82, clarity: 80, confidence: 85, technicalDepth: 84, communication: 78, integrity: 100 },
          duration: 512,
          messages: [
            { id: '3', role: 'ai', content: 'Explain Node.js Event Loop.', agent: 'technical', timestamp: 3 },
            { id: '4', role: 'user', content: 'The event loop delegates async system kernel calls and manages executing handlers across phases (timers, poll, check).', timestamp: 4 }
          ],
          feedback: {
            strengths: ['Clear explanation of phase ordering.'],
            weaknesses: ['Could elaborate on microtask queue priority.'],
            suggestions: ['Research process.nextTick priority queues.'],
            critiques: { '3': 'Excellent breakdown of Event Loop mechanics.' }
          }
        }
      ];
      mockSessions.forEach(session => addToHistory(session));
    }
  }, []);

  const stats = [
    { label: 'Total Interviews', value: history.length, icon: History, color: 'text-indigo-500' },
    { label: 'Average Score', value: history.length ? Math.round(history.reduce((a, s) => a + s.scores.overall, 0) / history.length) : 0, icon: Trophy, color: 'text-purple-500' },
    { label: 'Best Performance', value: history.length ? Math.max(...history.map(s => s.scores.overall)) : 0, icon: Target, color: 'text-emerald-500' },
  ];

  const chartData = history.slice(-10).map((s, i) => ({
    date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: s.scores.overall,
  }));

  const pieData = [
    { name: 'Technical', value: history.reduce((a, s) => a + s.scores.technicalDepth, 0) / (history.length || 1) },
    { name: 'Comm.', value: history.reduce((a, s) => a + s.scores.communication, 0) / (history.length || 1) },
    { name: 'Confidence', value: history.reduce((a, s) => a + s.scores.confidence, 0) / (history.length || 1) },
  ];

  const filteredHistory = history.filter(s => 
    s.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen pt-32 pb-20 px-4">
      <div className="section-container max-w-7xl">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">
              Performance <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-[var(--text-secondary)]">Track your interview journey and growth metrics.</p>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary flex items-center gap-2 text-sm">
              <Download size={16} /> Export Data
            </button>
            <button 
              onClick={clearHistory}
              className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold hover:bg-red-500/20 transition-all"
            >
              Reset History
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="premium-card p-8 flex items-center gap-6"
            >
              <div className={`w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center ${stat.color}`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">{stat.label}</p>
                <div className="text-3xl font-bold text-[var(--text-primary)]">{stat.value}{stat.label.includes('Score') ? '%' : ''}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Analytics Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Trend Chart */}
          <div className="lg:col-span-2 premium-card p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Score Progression</h3>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
                <ArrowUpRight size={14} /> +12% this week
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.1} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Competency Distribution */}
          <div className="premium-card p-8 flex flex-col items-center">
            <h3 className="text-lg font-bold text-[var(--text-primary)] w-full mb-8">Skill Distribution</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 w-full space-y-3">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="text-sm text-[var(--text-secondary)]">{d.name}</span>
                  </div>
                  <span className="text-sm font-bold">{Math.round(d.value)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <h3 className="text-2xl font-bold text-[var(--text-primary)]">Session History</h3>
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
              <input 
                type="text"
                placeholder="Search by role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[var(--bg-secondary)] border border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>

          {history.length === 0 ? (
            <div className="premium-card p-20 text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-3xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-6">
                <History size={40} />
              </div>
              <h4 className="text-xl font-bold text-[var(--text-primary)] mb-2">No data yet</h4>
              <p className="text-[var(--text-secondary)] mb-8">Complete your first interview to see performance metrics here.</p>
              <Link href="/upload" className="btn-primary px-8 py-3">Start First Session</Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredHistory.map((session, i) => (
                <motion.div 
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="premium-card p-6 flex items-center justify-between hover:border-indigo-500/50 transition-all cursor-pointer group"
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[var(--text-primary)] mb-1">{session.role}</h4>
                      <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(session.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5"><Activity size={14} /> {Math.floor(session.duration / 60)}m duration</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-500">{session.scores.overall}%</div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Overall</p>
                    </div>
                    <ChevronRight className="text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
