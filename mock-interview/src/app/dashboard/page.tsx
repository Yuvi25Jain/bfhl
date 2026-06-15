'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { 
  Briefcase, FileText, CheckCircle, Brain, Code, 
  BarChart2, History, ArrowRight, ShieldCheck, Zap,
  Sparkles, Award, UserCheck, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user, resumeData, gapAnalysis, codingResult, history } = useStore();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  if (!user) return null;

  // Stepper preparation progress calculation
  const steps = [
    {
      id: 'upload',
      title: 'Upload Resume',
      desc: 'Let AI analyze your core competencies.',
      status: resumeData ? 'complete' : 'pending',
      href: '/upload',
      icon: FileText,
      color: 'indigo',
    },
    {
      id: 'gap',
      title: 'Analyze Job Match',
      desc: 'Compare profile against a Job Description.',
      status: gapAnalysis ? 'complete' : resumeData ? 'ready' : 'locked',
      href: '/job-description',
      icon: Briefcase,
      color: 'purple',
    },
    {
      id: 'interview',
      title: 'AI Behavioral & Tech Interview',
      desc: 'Face our adaptive mock interview panel.',
      status: history.length > 0 ? 'complete' : gapAnalysis ? 'ready' : 'locked',
      href: '/interview',
      icon: Brain,
      color: 'emerald',
    },
    {
      id: 'coding',
      title: 'Coding Round Practice',
      desc: 'Simulate full programming rounds in our IDE.',
      status: codingResult ? 'complete' : history.length > 0 ? 'ready' : 'locked',
      href: '/coding',
      icon: Code,
      color: 'amber',
    },
    {
      id: 'analytics',
      title: 'Performance Diagnostics',
      desc: 'Review extensive progression statistics.',
      status: history.length > 0 ? 'complete' : 'locked',
      href: '/analytics',
      icon: BarChart2,
      color: 'pink',
    }
  ];

  const completedStepsCount = steps.filter(s => s.status === 'complete').length;
  const progressPercent = Math.round((completedStepsCount / steps.length) * 100);

  const averageScore = history.length 
    ? Math.round(history.reduce((acc, s) => acc + s.scores.overall, 0) / history.length) 
    : 0;

  const bestScore = history.length 
    ? Math.max(...history.map(s => s.scores.overall)) 
    : 0;

  return (
    <div className="bg-[#030712] min-h-screen pt-32 pb-20 px-4 dark-grid">
      <div className="section-container max-w-7xl">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400 mb-3">
              <Sparkles size={12} className="animate-pulse" />
              <span>Preparedness Index: {progressPercent}%</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Welcome back, <span className="gradient-text">{user.name}</span>
            </h1>
            <p className="text-slate-400 mt-1">
              Target Track: <strong className="text-indigo-400">{user.targetRole || 'Software Engineer'}</strong>
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/upload" className="btn-primary flex items-center gap-2 text-sm">
              <span>Quick Mock Session</span>
              <Zap size={16} />
            </Link>
          </div>
        </div>

        {/* Dashboard Overview Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Mocks */}
          <div className="premium-card p-6 bg-slate-900/40 border border-indigo-500/10 flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <History size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Interviews</p>
              <h3 className="text-2xl font-bold text-white mt-1">{history.length}</h3>
            </div>
          </div>

          {/* Average Score */}
          <div className="premium-card p-6 bg-slate-900/40 border border-purple-500/10 flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Award size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Average Score</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {history.length ? `${averageScore}%` : 'N/A'}
              </h3>
            </div>
          </div>

          {/* High Score */}
          <div className="premium-card p-6 bg-slate-900/40 border border-emerald-500/10 flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Best Performance</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {history.length ? `${bestScore}%` : 'N/A'}
              </h3>
            </div>
          </div>

          {/* Code Submissions */}
          <div className="premium-card p-6 bg-slate-900/40 border border-amber-500/10 flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Code size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Coding Score</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {codingResult ? `${codingResult.score}%` : 'Not Attempted'}
              </h3>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Preparation Stepper Checklist */}
          <div className="lg:col-span-2 space-y-6">
            <div className="premium-card p-8 bg-slate-900/40 border border-indigo-500/10">
              <h2 className="text-xl font-bold text-white mb-6">Preparation Pathway</h2>
              
              <div className="space-y-6 relative">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isLocked = step.status === 'locked';
                  const isComplete = step.status === 'complete';
                  const isReady = step.status === 'ready';

                  return (
                    <div key={step.id} className="flex gap-4 items-start group">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          isComplete ? 'bg-indigo-600 border-indigo-600 text-white' :
                          isReady ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' :
                          'bg-slate-950 border-slate-800 text-slate-600'
                        }`}>
                          {isComplete ? <CheckCircle size={18} /> : <Icon size={18} />}
                        </div>
                        {idx < steps.length - 1 && (
                          <div className={`w-0.5 h-12 my-1 ${
                            isComplete ? 'bg-indigo-600' : 'bg-slate-800'
                          }`} />
                        )}
                      </div>

                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-base font-bold transition-colors ${
                            isLocked ? 'text-slate-600' : 'text-slate-100'
                          }`}>
                            {step.title}
                          </h4>
                          {!isLocked && (
                            <Link href={step.href} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-all">
                              <span>{isComplete ? 'Retake' : 'Start'}</span>
                              <ArrowRight size={12} />
                            </Link>
                          )}
                        </div>
                        <p className={`text-xs mt-1 leading-relaxed ${
                          isLocked ? 'text-slate-700' : 'text-slate-400'
                        }`}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Resume & Recent Mocks Side Panel */}
          <div className="space-y-6">
            {/* Resume Status Card */}
            <div className="premium-card p-6 bg-slate-900/40 border border-indigo-500/10">
              <h3 className="font-bold text-white mb-4">Resume Integrity</h3>
              {resumeData ? (
                <div className="space-y-4">
                  <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 flex items-center gap-3">
                    <FileText className="text-indigo-400" size={20} />
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-200">Alex Chen (Uploaded)</p>
                      <p className="text-[10px] text-indigo-400">{resumeData.skills.length} skills identified</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.skills.slice(0, 5).map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-slate-950 text-[10px] text-slate-400 border border-slate-800">
                        {s}
                      </span>
                    ))}
                    {resumeData.skills.length > 5 && (
                      <span className="text-[10px] text-indigo-400 font-bold self-center ml-1">+{resumeData.skills.length - 5} more</span>
                    )}
                  </div>
                  <Link href="/upload" className="block text-center text-xs font-bold text-indigo-400 hover:underline pt-2">
                    Upload another resume
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <AlertTriangle className="mx-auto text-amber-500/70 mb-2" size={28} />
                  <p className="text-xs text-slate-400 mb-4">No resume uploaded yet. Complete this step to optimize questions.</p>
                  <Link href="/upload" className="btn-secondary w-full py-2 text-xs flex justify-center items-center gap-2">
                    <span>Upload Now</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Link Card to history */}
            <div className="premium-card p-6 bg-slate-900/40 border border-indigo-500/10 text-center">
              <h3 className="font-bold text-white mb-2">History Overview</h3>
              <p className="text-xs text-slate-400 mb-4">Access detailed feedback reports, STAR answers, and metrics.</p>
              <Link href="/history" className="btn-secondary w-full py-2.5 text-xs flex justify-center items-center gap-2">
                <span>View Session Logs ({history.length})</span>
                <History size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
