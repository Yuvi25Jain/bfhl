'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { mockApi, GapAnalysisResult } from '@/services/mockApi';
import { 
  Briefcase, CheckCircle, AlertTriangle, Play, Sparkles,
  BookOpen, ChevronRight, Loader2, ArrowLeft, RefreshCw, FileText
} from 'lucide-react';
import Link from 'next/link';

export default function JobDescriptionPage() {
  const router = useRouter();
  const { user, resumeData, gapAnalysis, setGapAnalysis, jobDescription, setJobDescription } = useStore();

  const [jdText, setJdText] = useState(jobDescription || '');
  const [role, setRole] = useState(resumeData?.targetRole || user?.targetRole || 'Software Engineer');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  if (!user) return null;

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdText.trim()) return;

    setIsAnalyzing(true);
    setJobDescription(jdText);

    // Call mock API for matching skills
    const skills = resumeData?.skills || ['React', 'TypeScript', 'Node.js', 'PostgreSQL'];
    const result = await mockApi.analyzeSkillGap(skills, jdText);
    
    setGapAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setGapAnalysis(null);
    setJdText('');
  };

  return (
    <div className="bg-[#030712] min-h-screen pt-32 pb-20 px-4 dark-grid">
      <div className="section-container max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/dashboard" className="text-slate-400 hover:text-indigo-400 text-sm flex items-center gap-1.5 transition-colors">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-sm font-bold mb-4">
            <Sparkles size={16} /> Step 2: Skill Match Analyzer
          </div>
          <h1 className="text-4xl font-extrabold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Job Description <span className="gradient-text">Matching</span>
          </h1>
          <p className="text-slate-400 mt-2">
            Paste the job post description. We will map your resume skills and generate tailored questions.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!gapAnalysis ? (
            <motion.div
              key="input-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="premium-card p-8 bg-slate-900/40 border border-indigo-500/10 max-w-3xl mx-auto"
            >
              <form onSubmit={handleAnalyze} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-widest block">Target Job Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full px-4 py-3 bg-slate-950/40 border border-indigo-500/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-widest block">Paste Job Description</label>
                  <textarea
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    rows={8}
                    placeholder="Paste details about the job, requirements, responsibilities, or tech stack requirements..."
                    className="w-full px-4 py-3 bg-slate-950/40 border border-indigo-500/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white transition-all font-sans resize-none"
                  />
                </div>

                {resumeData ? (
                  <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-3 text-xs text-indigo-400">
                    <FileText size={16} />
                    <span>Loaded profile with {resumeData.skills.length} skills. We will match these against the JD requirements.</span>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center gap-3 text-xs text-amber-500">
                    <AlertTriangle size={16} />
                    <span>No resume loaded. We recommend <Link href="/upload" className="underline font-bold">uploading a resume</Link> first.</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAnalyzing || !jdText.trim()}
                  className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] duration-200 cursor-pointer disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Analyzing keywords & stacks...</span>
                    </>
                  ) : (
                    <>
                      <span>Run Match Diagnostics</span>
                      <ChevronRight size={20} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="analysis-results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8"
            >
              {/* Score and Badger grid */}
              <div className="grid md:grid-cols-3 gap-8">
                {/* Match percentage donut */}
                <div className="premium-card p-8 bg-slate-900/40 border border-indigo-500/10 flex flex-col items-center justify-center text-center">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Compatibility Score</h3>
                  
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    {/* SVG Circular progress */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="72" cy="72" r="62" stroke="rgba(255,255,255,0.03)" strokeWidth="10" fill="transparent" />
                      <circle 
                        cx="72" 
                        cy="72" 
                        r="62" 
                        stroke="url(#progressGradient)" 
                        strokeWidth="10" 
                        fill="transparent" 
                        strokeDasharray={389.5} 
                        strokeDashoffset={389.5 - (389.5 * gapAnalysis.matchPercentage) / 100}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute text-3xl font-extrabold text-white">{gapAnalysis.matchPercentage}%</div>
                  </div>

                  <p className="text-sm font-semibold text-indigo-400 mt-6">
                    {gapAnalysis.matchPercentage >= 75 ? 'Strong Match' : gapAnalysis.matchPercentage >= 50 ? 'Moderate Match' : 'Growth Opportunities'}
                  </p>
                </div>

                {/* Skills badges */}
                <div className="md:col-span-2 premium-card p-8 bg-slate-900/40 border border-indigo-500/10 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4 flex items-center gap-2">
                      <CheckCircle className="text-emerald-500" size={16} />
                      <span>Matched Competencies ({gapAnalysis.matchedSkills.length})</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {gapAnalysis.matchedSkills.map(skill => (
                        <span key={skill} className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <hr className="border-slate-800" />

                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4 flex items-center gap-2">
                      <AlertTriangle className="text-amber-500" size={16} />
                      <span>Identified Skill Gaps ({gapAnalysis.missingSkills.length})</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {gapAnalysis.missingSkills.map(skill => (
                        <span key={skill} className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400 animate-pulse-soft">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Study Recommendations */}
              <div className="premium-card p-8 bg-slate-900/40 border border-indigo-500/10">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <BookOpen className="text-indigo-400" size={22} />
                  <span>Targeted Learning Modules</span>
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {gapAnalysis.studyTopics.map((item, idx) => (
                    <div key={idx} className="p-5 bg-slate-950/40 border border-indigo-500/5 rounded-2xl flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm mb-2">{item.topic}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">{item.reason}</p>
                      </div>
                      <a 
                        href={item.resource}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-all mt-2"
                      >
                        <span>Open Syllabus</span>
                        <ChevronRight size={14} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleReset}
                  className="btn-secondary px-8 py-3.5 flex items-center gap-2 text-sm w-full sm:w-auto justify-center cursor-pointer"
                >
                  <RefreshCw size={16} />
                  <span>Edit Requirements</span>
                </button>

                <Link
                  href="/interview"
                  className="btn-primary px-10 py-3.5 flex items-center gap-2 text-sm w-full sm:w-auto justify-center hover:scale-105 active:scale-95 duration-200"
                >
                  <Play size={16} />
                  <span>Initiate AI Interview Room</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
