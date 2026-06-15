import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ParsedResume, GapAnalysisResult, CodeEvaluationResult } from '@/services/mockApi';

export interface ResumeData {
  name: string;
  email: string;
  skills: string[];
  experience: string[];
  projects: string[];
  education: string;
  targetRole: string;
}

export interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: number;
  agent?: 'hr' | 'technical' | 'evaluator';
  questionIndex?: number;
}

export interface IntegrityEvent {
  type: 'tab_switch' | 'focus_loss' | 'inactivity';
  timestamp: number;
  count: number;
}

export interface FeedbackScore {
  overall: number;
  clarity: number;
  confidence: number;
  technicalDepth: number;
  communication: number;
  integrity: number;
}

export interface InterviewSession {
  id: string;
  date: string;
  role: string;
  scores: FeedbackScore;
  messages: Message[];
  duration: number;
  feedback: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    critiques: Record<string, string>;
  };
}

export interface User {
  name: string;
  email: string;
  targetRole?: string;
}

interface AppState {
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // User Auth
  user: User | null;
  login: (name: string, email: string, targetRole?: string) => void;
  logout: () => void;

  // Resume
  resumeData: ResumeData | null;
  setResumeData: (data: ResumeData) => void;
  clearResume: () => void;

  // Job Description & Gap Analysis
  jobDescription: string;
  setJobDescription: (jd: string) => void;
  gapAnalysis: GapAnalysisResult | null;
  setGapAnalysis: (analysis: GapAnalysisResult | null) => void;

  // Coding Round
  codingProblem: string;
  codingLanguage: string;
  codingCode: string;
  codingResult: CodeEvaluationResult | null;
  setCodingProblem: (p: string) => void;
  setCodingLanguage: (l: string) => void;
  setCodingCode: (c: string) => void;
  setCodingResult: (r: CodeEvaluationResult | null) => void;

  // Interview
  messages: Message[];
  addMessage: (msg: Message) => void;
  clearMessages: () => void;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (idx: number) => void;
  isInterviewActive: boolean;
  setInterviewActive: (v: boolean) => void;
  interviewStartTime: number | null;
  setInterviewStartTime: (t: number) => void;
  currentAgent: 'hr' | 'technical' | 'evaluator';
  setCurrentAgent: (agent: 'hr' | 'technical' | 'evaluator') => void;

  // Integrity
  integrityEvents: IntegrityEvent[];
  addIntegrityEvent: (event: Omit<IntegrityEvent, 'count'>) => void;
  integrityScore: number;
  setIntegrityScore: (score: number) => void;

  // Feedback
  feedbackScore: FeedbackScore | null;
  setFeedbackScore: (score: FeedbackScore) => void;
  feedbackText: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    critiques: Record<string, string>;
  } | null;
  setFeedbackText: (text: { strengths: string[]; weaknesses: string[]; suggestions: string[]; critiques: Record<string, string> }) => void;

  // History
  history: InterviewSession[];
  addToHistory: (session: InterviewSession) => void;
  clearHistory: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      // User Auth
      user: null,
      login: (name, email, targetRole) => set({ user: { name, email, targetRole } }),
      logout: () => set({ user: null, resumeData: null, gapAnalysis: null, codingResult: null, messages: [] }),

      // Resume
      resumeData: null,
      setResumeData: (data) => set({ resumeData: data }),
      clearResume: () => set({ resumeData: null }),

      // Job Description & Gap Analysis
      jobDescription: '',
      setJobDescription: (jobDescription) => set({ jobDescription }),
      gapAnalysis: null,
      setGapAnalysis: (gapAnalysis) => set({ gapAnalysis }),

      // Coding Round
      codingProblem: 'Two Sum',
      codingLanguage: 'javascript',
      codingCode: `// Given an array of integers nums and an integer target,
// return indices of the two numbers such that they add up to target.

function twoSum(nums, target) {
  // Write your code here
  
}`,
      codingResult: null,
      setCodingProblem: (codingProblem) => set({ codingProblem }),
      setCodingLanguage: (codingLanguage) => set({ codingLanguage }),
      setCodingCode: (codingCode) => set({ codingCode }),
      setCodingResult: (codingResult) => set({ codingResult }),

      // Interview
      messages: [],
      addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
      clearMessages: () => set({ messages: [] }),
      currentQuestionIndex: 0,
      setCurrentQuestionIndex: (idx) => set({ currentQuestionIndex: idx }),
      isInterviewActive: false,
      setInterviewActive: (v) => set({ isInterviewActive: v }),
      interviewStartTime: null,
      setInterviewStartTime: (t) => set({ interviewStartTime: t }),
      currentAgent: 'hr',
      setCurrentAgent: (agent) => set({ currentAgent: agent }),

      // Integrity
      integrityEvents: [],
      addIntegrityEvent: (event) => {
        const existing = get().integrityEvents.find((e) => e.type === event.type);
        if (existing) {
          set((s) => ({
            integrityEvents: s.integrityEvents.map((e) =>
              e.type === event.type ? { ...e, count: e.count + 1, timestamp: event.timestamp } : e
            ),
          }));
        } else {
          set((s) => ({ integrityEvents: [...s.integrityEvents, { ...event, count: 1 }] }));
        }
      },
      integrityScore: 100,
      setIntegrityScore: (score) => set({ integrityScore: score }),

      // Feedback
      feedbackScore: null,
      setFeedbackScore: (score) => set({ feedbackScore: score }),
      feedbackText: null,
      setFeedbackText: (text) => set({ feedbackText: text }),

      // History
      history: [],
      addToHistory: (session) =>
        set((s) => ({ history: [session, ...s.history].slice(0, 20) })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'mock-interview-store',
      partialize: (s) => ({
        theme: s.theme,
        user: s.user,
        history: s.history,
      }),
    }
  )
);
