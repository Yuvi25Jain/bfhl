'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useStore } from '@/store/useStore';
import { mockApi } from '@/services/mockApi';
import { 
  Upload, FileText, X, CheckCircle, ChevronRight, 
  Briefcase, Loader2, Sparkles, User, Database, 
  Globe, Server, Shield, Smartphone, Terminal, Code2
} from 'lucide-react';

const DOMAINS = [
  { id: 'frontend', label: 'Frontend Developer', icon: Globe, skills: ['React', 'Next.js', 'Tailwind', 'TypeScript', 'CSS'] },
  { id: 'backend', label: 'Backend Developer', icon: Server, skills: ['Node.js', 'Python', 'Go', 'SQL', 'PostgreSQL'] },
  { id: 'fullstack', label: 'Full Stack Developer', icon: Code2, skills: ['MERN', 'T3 Stack', 'Serverless', 'APIs'] },
  { id: 'data-science', label: 'Data Scientist', icon: Database, skills: ['Python', 'Pandas', 'PyTorch', 'SQL'] },
  { id: 'devops', label: 'DevOps Engineer', icon: Terminal, skills: ['Docker', 'K8s', 'CI/CD', 'AWS', 'Terraform'] },
];

export default function UploadPage() {
  const router = useRouter();
  const { setResumeData, clearMessages, setCurrentQuestionIndex, setInterviewActive, setIntegrityScore } = useStore();

  const [file, setFile] = useState<File | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [step, setStep] = useState<'method' | 'upload' | 'manual' | 'processing'>('method');

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) {
      setFile(accepted[0]);
      handleStartProcessing(accepted[0]);
    }
  }, [selectedDomain]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/msword': ['.doc', '.docx'], 'text/plain': ['.txt'] },
    maxFiles: 1,
  });

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleStartProcessing = async (targetFile?: File) => {
    setStep('processing');
    
    // Reset state
    clearMessages();
    setCurrentQuestionIndex(0);
    setInterviewActive(false);
    setIntegrityScore(100);

    try {
      if (targetFile) {
        const data = await mockApi.parseResume(targetFile.name, selectedDomain || 'General Developer');
        setResumeData(data);
      } else {
        // Manual entry
        setResumeData({
          name: 'Candidate',
          email: 'candidate@mockmate.ai',
          skills: selectedSkills,
          experience: ['Entry Level Candidate — manual skills entry profile.'],
          projects: ['Personal Portfolio site'],
          education: 'N/A',
          targetRole: selectedDomain || 'General Developer',
        });
      }
      
      router.push('/job-description');
    } catch {
      setStep('method');
    }
  };

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen pt-32 pb-20 px-4">
      <div className="section-container max-w-3xl">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-sm font-bold mb-6"
          >
            <Sparkles size={16} /> Setup Your Session
          </motion.div>
          <h1 className="text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-6">
            Let's prepare your <span className="gradient-text">Interview</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Upload your resume for a tailored experience or select your domain manually.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* Method Selection */}
          {step === 'method' && (
            <motion.div
              key="method"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <div 
                onClick={() => setStep('upload')}
                className="premium-card p-10 cursor-pointer group hover:border-indigo-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-8 group-hover:scale-110 transition-transform">
                  <Upload size={32} />
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Upload Resume</h3>
                <p className="text-[var(--text-secondary)] mb-8">
                  AI will parse your skills, experience, and projects automatically.
                </p>
                <div className="flex items-center gap-2 text-indigo-500 font-bold">
                  Select File <ChevronRight size={18} />
                </div>
              </div>

              <div 
                onClick={() => setStep('manual')}
                className="premium-card p-10 cursor-pointer group hover:border-purple-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-8 group-hover:scale-110 transition-transform">
                  <Code2 size={32} />
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Select Role</h3>
                <p className="text-[var(--text-secondary)] mb-8">
                  Choose your domain and skills manually to start instantly.
                </p>
                <div className="flex items-center gap-2 text-purple-500 font-bold">
                  Browse Roles <ChevronRight size={18} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Upload Step */}
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div
                {...getRootProps()}
                className={`premium-card p-20 text-center border-2 border-dashed transition-all ${
                  isDragActive ? 'border-indigo-500 bg-indigo-500/5' : 'border-[var(--border-color)]'
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mx-auto mb-8 animate-bounce">
                  <Upload size={40} />
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                  {isDragActive ? 'Drop your resume here' : 'Drag & Drop Resume'}
                </h3>
                <p className="text-[var(--text-secondary)] mb-10">
                  Supported formats: PDF, DOCX, TXT (Max 5MB)
                </p>
                <button className="btn-primary">Browse Files</button>
              </div>
              <button 
                onClick={() => setStep('method')}
                className="mt-8 text-[var(--text-muted)] hover:text-indigo-500 transition-colors flex items-center gap-2 mx-auto"
              >
                Go Back
              </button>
            </motion.div>
          )}

          {/* Manual Step */}
          {step === 'manual' && (
            <motion.div
              key="manual"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {DOMAINS.map((domain) => (
                  <div
                    key={domain.id}
                    onClick={() => {
                      setSelectedDomain(domain.label);
                      setSelectedSkills([]);
                    }}
                    className={`premium-card p-6 cursor-pointer transition-all ${
                      selectedDomain === domain.label ? 'border-indigo-500 bg-indigo-500/5' : ''
                    }`}
                  >
                    <domain.icon size={24} className="mb-4 text-indigo-500" />
                    <h4 className="font-bold text-sm text-[var(--text-primary)]">{domain.label}</h4>
                  </div>
                ))}
              </div>

              {selectedDomain && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="premium-card p-8"
                >
                  <h4 className="font-bold text-[var(--text-primary)] mb-6">Select Specific Skills</h4>
                  <div className="flex flex-wrap gap-3">
                    {DOMAINS.find(d => d.label === selectedDomain)?.skills.map(skill => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedSkills.includes(skill)
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="flex flex-col gap-4">
                <button
                  disabled={!selectedDomain || selectedSkills.length === 0}
                  onClick={() => handleStartProcessing()}
                  className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Interview
                </button>
                <button 
                  onClick={() => setStep('method')}
                  className="text-[var(--text-muted)] hover:text-indigo-500 transition-colors flex items-center gap-2 mx-auto"
                >
                  Go Back
                </button>
              </div>
            </motion.div>
          )}

          {/* Processing Step */}
          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="premium-card p-20 text-center"
            >
              <div className="w-24 h-24 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mx-auto mb-10 animate-spin">
                <Loader2 size={48} />
              </div>
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
                Initializing <span className="gradient-text">AI Agents</span>
              </h2>
              <p className="text-[var(--text-secondary)] text-lg mb-12">
                Setting up the technical and HR panel based on your profile.
              </p>
              <div className="max-w-xs mx-auto space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-indigo-500"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
