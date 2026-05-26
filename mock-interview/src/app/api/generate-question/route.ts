import { NextResponse } from 'next/server';

const HR_QUESTIONS = [
  'Tell me about yourself and what drew you to the {role} position.',
  'What are your biggest strengths and how have they helped you in past roles?',
  'Describe a challenge you faced at work and how you overcame it. What did you learn?',
  'Where do you see yourself in 5 years, and how does this role align with your goals?',
  'Why are you leaving your current position, and what excites you about this opportunity?',
  'Describe your ideal work environment and team culture.',
  'How do you handle tight deadlines and competing priorities?',
];

const TECHNICAL_QUESTIONS_BY_ROLE: Record<string, string[]> = {
  default: [
    'Explain the difference between REST and GraphQL. When would you choose one over the other?',
    'Walk me through how you would design a scalable notification system for 10 million users.',
    'What is the difference between SQL and NoSQL databases? Give examples of when to use each.',
    'Explain the CAP theorem and its implications for distributed systems.',
    'How does garbage collection work in your primary language? How do you optimize memory usage?',
    'Describe how you would implement authentication and authorization in a microservices architecture.',
    'What is your approach to writing testable, maintainable code? Share an example.',
  ],
  'Frontend Developer': [
    'Explain the React reconciliation algorithm and how the virtual DOM works.',
    'What are the key differences between controlled and uncontrolled components in React?',
    'How do you optimize bundle size and Core Web Vitals for a production Next.js app?',
    'Explain the CSS box model and describe a tricky CSS challenge you solved recently.',
    'How does browser rendering work, from parsing HTML to painting pixels?',
    'Describe how you would implement infinite scroll with intersection observer.',
    'What is your approach to accessibility (a11y) in frontend development?',
  ],
  'Data Scientist': [
    'Explain bias-variance tradeoff and how it affects model selection.',
    'How would you handle a highly imbalanced dataset in a classification problem?',
    'walkthrough your feature engineering process for a new ML project.',
    'Explain the difference between bagging and boosting. When would you use each?',
    'How do you validate a machine learning model and prevent data leakage?',
    'Describe an end-to-end ML pipeline you have built in production.',
    'How do you explain a complex model decision to a non-technical stakeholder?',
  ],
};

const EVALUATOR_QUESTIONS = [
  'Looking back at your answers, which response do you feel could have been stronger and why?',
  'If you had to rate your technical depth today from 1-10, what score would you give and what would improve it?',
  'What is one thing you wish I had asked you that would better showcase your skills?',
];

const FOLLOWUP_PATTERNS = [
  "That's an interesting answer. Can you give me a concrete example from your experience to illustrate that point?",
  "How would your approach change if you were working with a team 10x larger?",
  "What trade-offs did you consider when making that decision, and what would you do differently today?",
];

function getQuestionsForRole(role: string, agent: 'hr' | 'technical' | 'evaluator') {
  if (agent === 'hr') return HR_QUESTIONS;
  if (agent === 'evaluator') return EVALUATOR_QUESTIONS;
  return TECHNICAL_QUESTIONS_BY_ROLE[role] || TECHNICAL_QUESTIONS_BY_ROLE.default;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { agent, questionIndex, targetRole, skills, previousMessages } = body as {
    agent: 'hr' | 'technical' | 'evaluator';
    questionIndex: number;
    targetRole?: string;
    skills?: string[];
    previousMessages?: Array<{ role: string; content: string }>;
  };

  // Simulate AI thinking
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

  const questions = getQuestionsForRole(targetRole || 'Software Engineer', agent);

  // Check if should do a follow-up
  const isFollowUp = previousMessages && previousMessages.length > 0 && Math.random() < 0.35;

  let question: string;

  if (isFollowUp && previousMessages) {
    const followup = FOLLOWUP_PATTERNS[Math.floor(Math.random() * FOLLOWUP_PATTERNS.length)];
    question = followup;
  } else {
    const qIdx = questionIndex % questions.length;
    question = questions[qIdx].replace('{role}', targetRole || 'this role');

    // Personalize with skills if technical
    if (agent === 'technical' && skills && skills.length > 0) {
      const randomSkill = skills[Math.floor(Math.random() * Math.min(skills.length, 4))];
      if (Math.random() < 0.4 && questionIndex > 0) {
        question += ` Specifically considering your experience with ${randomSkill}.`;
      }
    }
  }

  return NextResponse.json({ question, agent }, { status: 200 });
}
