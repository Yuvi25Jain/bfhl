import { NextResponse } from 'next/server';

function scoreAnswer(content: string): number {
  const len = content.length;
  if (len < 30) return 30 + Math.floor(Math.random() * 15);
  if (len < 80) return 45 + Math.floor(Math.random() * 20);
  if (len < 200) return 60 + Math.floor(Math.random() * 20);
  return 72 + Math.floor(Math.random() * 23);
}

const CRITIQUES = [
  "Response was well-structured but lacked specific data points. Try to include percentages or scale where possible.",
  "Great use of the STAR method. Your action phase was particularly detailed and showed strong ownership.",
  "The technical explanation was accurate but could be simplified for non-technical stakeholders.",
  "Consider discussing the 'Result' of your actions more prominently to show business impact.",
  "Strong display of empathy and leadership. The conflict resolution example felt authentic and effective.",
  "You identified the core issue quickly, but the proposed solution could benefit from considering edge cases.",
];

const STRENGTHS_BY_SCORE = {
  high: [
    'Demonstrated strong technical depth and concrete examples',
    'Clear communication with structured, confident delivery',
    'Showed strong problem-solving methodology',
    'Excellent ability to connect experience to the role requirements',
    'Strong self-awareness and growth mindset throughout',
  ],
  medium: [
    'Good foundational knowledge demonstrated',
    'Communicated ideas with reasonable clarity',
    'Showed willingness to tackle challenging topics',
    'Relevant experience shared for key questions',
  ],
  low: [
    'Showed effort and persistence across questions',
    'Attempted to answer all questions',
    'Basic familiarity with the domain evident',
  ],
};

const WEAKNESSES_BY_SCORE = {
  high: [
    'Could dive deeper into edge cases and failure scenarios',
    'Some answers could benefit from more quantifiable results',
    'Occasional tendency to over-explain straightforward concepts',
  ],
  medium: [
    'Answers lacked specific examples and measurable outcomes',
    'Technical depth was inconsistent across topics',
    'Communication could be more concise and structured',
    'More preparation on system design patterns recommended',
  ],
  low: [
    'Significant gaps in technical knowledge for this role level',
    'Answers were too brief and lacked concrete examples',
    'Communication clarity needs improvement',
    'Core concepts require deeper study and practice',
    'Need more hands-on project experience for this role',
  ],
};

const SUGGESTIONS_BY_SCORE = {
  high: [
    'Practice STAR method to make already-strong answers even more impactful',
    'Prepare 2-3 additional failure stories to show vulnerability and growth',
    'Consider practicing with a mock system design board',
  ],
  medium: [
    'Build more projects to gather concrete examples for behavioral questions',
    'Study LeetCode medium problems daily for the next 3 weeks',
    'Practice using the STAR framework: Situation, Task, Action, Result',
    'Record yourself answering to improve delivery and confidence',
  ],
  low: [
    'Spend 2-3 months building foundational knowledge via structured courses',
    'Complete a personal project end-to-end to demonstrate real-world skills',
    'Practice mock interviews weekly with platforms like Pramp or peers',
    'Focus on depth over breadth — master 3 core topics first',
    'Improve answer structure: lead with the conclusion, then explain why',
  ],
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const {
    messages,
    role,
    integrityScore,
    duration,
  } = body as {
    messages: Array<{ role: string; content: string; id: string }>;
    role?: string;
    integrityScore: number;
    duration: number;
  };

  // Simulate processing
  await new Promise((r) => setTimeout(r, 1200));

  const userMessages = messages.filter((m) => m.role === 'user');
  const avgAnswerScore =
    userMessages.length > 0
      ? userMessages.reduce((sum, m) => sum + scoreAnswer(m.content), 0) / userMessages.length
      : 55;

  // Calculate scores
  const clarity = Math.min(100, Math.round(avgAnswerScore * 0.95 + Math.random() * 10));
  const confidence = Math.min(100, Math.round(avgAnswerScore * 0.9 + Math.random() * 15));
  const technicalDepth = Math.min(100, Math.round(avgAnswerScore * 1.0 + Math.random() * 12));
  const communication = Math.min(100, Math.round(avgAnswerScore * 0.92 + Math.random() * 10));
  const integrity = Math.min(100, integrityScore);
  const overall = Math.min(100, Math.round(
    (clarity * 0.22 + confidence * 0.18 + technicalDepth * 0.30 + communication * 0.17 + integrity * 0.13)
  ));

  const tier: 'high' | 'medium' | 'low' =
    overall >= 70 ? 'high' : overall >= 50 ? 'medium' : 'low';

  const pick = <T>(arr: T[], n: number): T[] => [...arr].sort(() => Math.random() - 0.5).slice(0, n);

  const scores = { overall, clarity, confidence, technicalDepth, communication, integrity };
  
  const feedback = {
    strengths: pick(STRENGTHS_BY_SCORE[tier], 3),
    weaknesses: pick(WEAKNESSES_BY_SCORE[tier], 3),
    suggestions: pick(SUGGESTIONS_BY_SCORE[tier], 3),
    // Per-message critique map
    critiques: messages
      .filter(m => m.role === 'ai')
      .reduce((acc, m) => ({
        ...acc,
        [m.id]: pick(CRITIQUES, 1)[0]
      }), {})
  };

  return NextResponse.json({ scores, feedback }, { status: 200 });
}
