export interface ParsedResume {
  name: string;
  email: string;
  skills: string[];
  experience: string[];
  projects: string[];
  education: string;
  targetRole: string;
}

export interface STARFeedback {
  overallScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  domainDepthScore: number;
  situation: string;
  strengths: string[];
  gaps: string[];
  suggestions: string;
}

export interface FeedbackScore {
  overall: number;
  clarity: number;
  confidence: number;
  technicalDepth: number;
  communication: number;
  integrity: number;
}

export interface GapAnalysisResult {
  matchedSkills: string[];
  missingSkills: string[];
  matchPercentage: number;
  studyTopics: Array<{ topic: string; resource: string; reason: string }>;
  sampleQuestions: string[];
}

export interface CodeEvaluationResult {
  success: boolean;
  score: number;
  correctness: string;
  timeComplexity: string;
  spaceComplexity: string;
  consoleOutput: string;
  testCases: Array<{ name: string; status: 'PASSED' | 'FAILED'; input: string; expected: string; actual: string }>;
  suggestions: string[];
}

const HR_QUESTIONS = [
  'Tell me about yourself and what drew you to the {role} position.',
  'What are your biggest strengths and how have they helped you in past roles?',
  'Describe a challenge you faced at work or in a project and how you overcame it. What did you learn?',
  'Where do you see yourself in 5 years, and how does this role align with your goals?',
  'How do you handle tight deadlines and competing priorities when working in a team?',
  'Describe your ideal work environment and team culture.',
];

const TECHNICAL_QUESTIONS_BY_ROLE: Record<string, string[]> = {
  default: [
    'Explain the difference between REST and GraphQL. When would you choose one over the other?',
    'Walk me through how you would design a scalable notification system for 10 million users.',
    'What is the difference between SQL and NoSQL databases? Give examples of when to use each.',
    'Explain the CAP theorem and its implications for distributed systems.',
    'How do you optimize memory usage and performance in your applications?',
    'Describe how you would implement secure authentication and authorization in a microservices architecture.',
  ],
  'Frontend Developer': [
    'Explain the React reconciliation algorithm and how the Virtual DOM works.',
    'What are the key differences between controlled and uncontrolled components in React?',
    'How do you optimize bundle size and Core Web Vitals for a production Next.js app?',
    'Explain the CSS box model and describe a tricky layout challenge you solved recently.',
    'How does browser rendering work, from parsing HTML to painting pixels?',
    'Describe how you would implement infinite scroll with Intersection Observer.',
  ],
  'Backend Developer': [
    'How do database indexes work internally? Explain the difference between clustered and non-clustered indexes.',
    'Explain the event loop in Node.js or concurrency mechanisms in Go/Python.',
    'How do you handle horizontal database scaling? Explain sharding, partitioning, and replication.',
    'Describe how you would design a distributed locking mechanism.',
    'What are cache stampede and cache penetration? How do you prevent them?',
    'Explain how you secure an API against standard web vulnerabilities like CSRF, XSS, and SQL Injection.',
  ],
  'Data Scientist': [
    'Explain the bias-variance tradeoff and how it affects model selection.',
    'How would you handle a highly imbalanced dataset in a classification problem?',
    'walkthrough your feature engineering process for a new machine learning project.',
    'Explain the difference between bagging and boosting. When would you use each?',
    'How do you validate a machine learning model and prevent data leakage?',
    'How do you explain a complex model decision (like a deep neural network) to a non-technical stakeholder?',
  ],
  'DevOps': [
    'Explain the difference between mutable and immutable infrastructure. What are the benefits of each?',
    'How would you set up a blue-green or canary deployment pipeline?',
    'What is GitOps and how does it compare to traditional CI/CD pipelines?',
    'How do you monitor and set up alerts for a high-availability Kubernetes cluster?',
    'Explain the concept of Infrastructure as Code (IaC) and how Terraform manages state.',
    'Describe how you would secure sensitive credentials and secrets in a cloud environment.',
  ]
};

const EVALUATOR_QUESTIONS = [
  'Looking back at your answers, which response do you feel could have been stronger and why?',
  'If you had to rate your technical depth today from 1-10, what score would you give and what would improve it?',
  'What is one thing you wish I had asked you that would better showcase your skills?',
];

const FOLLOWUP_PATTERNS = [
  "That's an interesting answer. Can you give me a concrete example from your experience to illustrate that point?",
  "How would your approach change if you were working with a system scale that is 10x larger?",
  "What trade-offs did you consider when making that decision, and what would you do differently today?",
];

const CRITIQUES = [
  "Response was well-structured but lacked specific data points. Try to include percentages or scale where possible.",
  "Great use of the STAR method. Your action phase was particularly detailed and showed strong ownership.",
  "The technical explanation was accurate but could be simplified for non-technical stakeholders.",
  "Consider discussing the 'Result' of your actions more prominently to show business impact.",
  "Strong display of empathy and leadership. The conflict resolution example felt authentic and effective.",
  "You identified the core issue quickly, but the proposed solution could benefit from considering edge cases.",
];

export const mockApi = {
  // 1. Resume Parser
  async parseResume(fileName: string, targetRole: string): Promise<ParsedResume> {
    await new Promise((r) => setTimeout(r, 1500)); // Simulate parsing delay
    
    // Select skills based on role
    let skills = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL', 'Tailwind CSS'];
    if (targetRole.toLowerCase().includes('backend')) {
      skills = ['Node.js', 'Python', 'Go', 'SQL', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'gRPC'];
    } else if (targetRole.toLowerCase().includes('data') || targetRole.toLowerCase().includes('science')) {
      skills = ['Python', 'SQL', 'Pandas', 'PyTorch', 'TensorFlow', 'scikit-learn', 'Docker', 'Tableau'];
    } else if (targetRole.toLowerCase().includes('devops') || targetRole.toLowerCase().includes('cloud')) {
      skills = ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Terraform', 'Linux', 'Bash', 'Prometheus', 'Ansible'];
    } else if (targetRole.toLowerCase().includes('hr') || targetRole.toLowerCase().includes('people')) {
      skills = ['Recruiting', 'Talent Acquisition', 'Culture', 'HR Policies', 'Conflict Resolution', 'Onboarding'];
    }

    return {
      name: 'Alex Chen',
      email: 'alex.chen@mockmate.ai',
      skills,
      experience: [
        `2.5 years at TechCorp as Frontend Engineer — built responsive React dashboards, improved performance by 40% using code splitting and virtualization.`,
        `1 year at StartupXYZ as Full-Stack Engineer — designed REST APIs using Node.js, managed CI/CD pipelines on GitHub Actions, and migrated DB to PostgreSQL.`,
      ],
      projects: [
        'E-commerce Platform: Built with Next.js, Stripe, and Prisma. Serves 10K+ monthly active users.',
        'Real-time Collaboration Board: Implemented using WebSockets, Redis, and React Canvas. Handles 5K daily updates.',
      ],
      education: 'B.Tech in Computer Science & Engineering, IIT Delhi, 2023',
      targetRole: targetRole || 'Software Engineer',
    };
  },

  // 2. Generate Question
  async generateQuestion(
    agent: 'hr' | 'technical' | 'evaluator',
    questionIndex: number,
    targetRole?: string,
    skills?: string[],
    previousMessages?: Array<{ role: string; content: string }>
  ): Promise<string> {
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 600));

    const roleKey = Object.keys(TECHNICAL_QUESTIONS_BY_ROLE).find(
      (k) => targetRole && targetRole.toLowerCase().includes(k.toLowerCase().split(' ')[0])
    ) || 'default';

    const questions = agent === 'hr' 
      ? HR_QUESTIONS 
      : agent === 'evaluator' 
        ? EVALUATOR_QUESTIONS 
        : TECHNICAL_QUESTIONS_BY_ROLE[roleKey];

    // Check if should do a follow-up
    const isFollowUp = previousMessages && previousMessages.length > 0 && Math.random() < 0.3;

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
          question += ` Specifically, considering your background in ${randomSkill}, how would you approach this?`;
        }
      }
    }

    return question;
  },

  // 3. Feedback Generator
  async getFeedback(
    messages: Array<{ role: string; content: string; id: string }>,
    role?: string,
    integrityScore: number = 100,
    duration: number = 300
  ): Promise<{ scores: FeedbackScore; feedback: { strengths: string[]; weaknesses: string[]; suggestions: string[]; critiques: Record<string, string> } }> {
    await new Promise((r) => setTimeout(r, 1500));

    const userMessages = messages.filter((m) => m.role === 'user');
    
    // Average length helper
    const avgLen = userMessages.length > 0 
      ? userMessages.reduce((sum, m) => sum + m.content.length, 0) / userMessages.length 
      : 150;

    let baseScore = 60;
    if (avgLen < 50) baseScore = 45;
    else if (avgLen < 150) baseScore = 65;
    else if (avgLen < 350) baseScore = 80;
    else baseScore = 90;

    // Calculate score fields
    const clarity = Math.min(100, Math.round(baseScore * 0.95 + Math.random() * 8));
    const confidence = Math.min(100, Math.round(baseScore * 0.9 + Math.random() * 10));
    const technicalDepth = Math.min(100, Math.round(baseScore * 1.0 + Math.random() * 8));
    const communication = Math.min(100, Math.round(baseScore * 0.93 + Math.random() * 8));
    const integrity = Math.min(100, integrityScore);
    const overall = Math.min(100, Math.round(
      (clarity * 0.22 + confidence * 0.18 + technicalDepth * 0.30 + communication * 0.17 + integrity * 0.13)
    ));

    const tier: 'high' | 'medium' | 'low' = overall >= 75 ? 'high' : overall >= 55 ? 'medium' : 'low';

    const pick = <T>(arr: T[], n: number): T[] => [...arr].sort(() => Math.random() - 0.5).slice(0, n);

    const STRENGTHS = {
      high: [
        'Excellent application of the STAR framework (Situation, Task, Action, Result).',
        'Strong technical depth with explicit mention of performance metrics.',
        'Structured, clear communication with strong leadership markers.',
        'Articulated trade-offs clearly, showing senior engineering mature decision making.',
      ],
      medium: [
        'Good foundational knowledge demonstrated in core concepts.',
        'Communicated ideas with reasonable clarity and flow.',
        'Attempted to cover both technical and cultural aspects.',
        'Shared relevant project experience for situational questions.',
      ],
      low: [
        'Showed persistence in answering all questions.',
        'Basic familiarity with some elements of the stack.',
        'Cooperative and receptive attitude to the panel prompts.',
      ]
    };

    const WEAKNESSES = {
      high: [
        'Could dive deeper into alternative system design options.',
        'Briefly skipped detailed failure monitoring strategies in system questions.',
        'Could tighten speech velocity under pressure.',
      ],
      medium: [
        'Answers sometimes lacked quantifiable impact metrics.',
        'Technical depth was slightly inconsistent between HR and coding-adjacent prompts.',
        'Tendency to over-explain initial context, reducing time left for actions.',
      ],
      low: [
        'Answers were too brief, lacking appropriate technical depth.',
        'Communication struggled to maintain structure under technical prompts.',
        'Significant knowledge gaps in advanced design patterns.',
      ]
    };

    const SUGGESTIONS = {
      high: [
        'Prepare 2 additional high-impact metrics-rich project stories.',
        'Practice whiteboarding microservices patterns.',
        'Review latency figures (L1/L2 cache vs network) for quick reference.',
      ],
      medium: [
        'Use the STAR method actively by spending 50% of your time on Action/Result.',
        'Quantify results: include percentages, dollar values, or user scale.',
        'Practice mock coding under a timer (20-30 mins) regularly.',
      ],
      low: [
        'Spend 4-6 weeks studying core fundamentals of data structures & algorithms.',
        'Build a comprehensive side-project from scratch to end-to-end deployment.',
        'Do weekly recorded mocks and critique your own speech structure.',
      ]
    };

    const scores = { overall, clarity, confidence, technicalDepth, communication, integrity };

    // Critiques map per question
    const critiques: Record<string, string> = {};
    messages.filter(m => m.role === 'ai').forEach(msg => {
      critiques[msg.id] = pick(CRITIQUES, 1)[0];
    });

    return {
      scores,
      feedback: {
        strengths: pick(STRENGTHS[tier], 3),
        weaknesses: pick(WEAKNESSES[tier], 2),
        suggestions: pick(SUGGESTIONS[tier], 3),
        critiques,
      }
    };
  },

  // 4. Skill Gap Analyzer
  async analyzeSkillGap(resumeSkills: string[], jobDescription: string): Promise<GapAnalysisResult> {
    await new Promise((r) => setTimeout(r, 1200));

    // Simple keyword extraction from JD
    const jdClean = jobDescription.toLowerCase();
    const commonTechnicalKeywords = [
      'react', 'next.js', 'typescript', 'javascript', 'css', 'tailwind', 'html',
      'node.js', 'express', 'python', 'django', 'fastapi', 'flask', 'go', 'golang', 'java', 'spring boot', 'rust',
      'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'prisma', 'sequelize',
      'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'ci/cd', 'github actions', 'jenkins',
      'graphql', 'rest api', 'websockets', 'grpc', 'microservices', 'system design',
      'machine learning', 'pytorch', 'tensorflow', 'pandas', 'numpy', 'scikit-learn', 'data structures', 'algorithms'
    ];

    const jdRequiredSkills = commonTechnicalKeywords.filter(skill => jdClean.includes(skill));
    
    // If no skills detected, supply defaults based on context
    if (jdRequiredSkills.length === 0) {
      jdRequiredSkills.push('system design', 'data structures', 'git', 'ci/cd', 'rest api');
    }

    const resumeSkillsLower = resumeSkills.map(s => s.toLowerCase());

    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    jdRequiredSkills.forEach(req => {
      // Find matching skill in resume
      const found = resumeSkillsLower.some(resSkill => 
        resSkill.includes(req) || req.includes(resSkill)
      );

      // Capitalize properly
      const formattedName = req.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

      if (found) {
        matchedSkills.push(formattedName);
      } else {
        missingSkills.push(formattedName);
      }
    });

    // Make sure we have some matched/missing so layout looks filled
    if (matchedSkills.length === 0 && missingSkills.length === 0) {
      matchedSkills.push('JavaScript', 'Git');
      missingSkills.push('System Design', 'Docker');
    } else if (missingSkills.length === 0) {
      // Add a couple of stretch skills to make it interesting
      missingSkills.push('System Design', 'Kubernetes');
    }

    const matchPercentage = Math.round((matchedSkills.length / (matchedSkills.length + missingSkills.length)) * 100);

    const studyTopics = missingSkills.map(skill => {
      let resource = `https://www.youtube.com/results?search_query=learn+${skill.toLowerCase().replace(' ', '+')}`;
      let reason = `Required skill in job description. Mastering this will increase selection probability.`;
      
      if (skill === 'System Design') {
        resource = 'https://github.com/donnemartin/system-design-primer';
        reason = 'Crucial for scalable architecture design questions in technical rounds.';
      } else if (skill === 'Kubernetes' || skill === 'Docker') {
        resource = 'https://roadmap.sh/devops';
        reason = 'Required to containerize applications and manage automated deployments.';
      } else if (skill === 'React' || skill === 'Next.js') {
        resource = 'https://nextjs.org/docs';
        reason = 'Core framework requirement for building high-performance modern user interfaces.';
      } else if (skill === 'TypeScript') {
        resource = 'https://www.typescriptlang.org/docs/';
        reason = 'Enables strong typing, preventing runtime errors in collaborative codebases.';
      }

      return { topic: skill, resource, reason };
    });

    const sampleQuestions = [
      `How have you applied ${matchedSkills[0] || 'your core skills'} to optimize system load in past projects?`,
      missingSkills[0] ? `Explain the core concepts of ${missingSkills[0]} and how you would design a service utilizing it.` : `Walk us through the deployment layout of your latest project.`,
      `How do you handle testing, typing, and maintenance for a application using ${matchedSkills[1] || 'your key tech stack'}?`,
      `If forced to choose between efficiency and developer velocity with ${missingSkills[1] || 'advanced tools'}, which would you pick and why?`
    ];

    return {
      matchedSkills,
      missingSkills,
      matchPercentage,
      studyTopics,
      sampleQuestions
    };
  },

  // 5. Code Evaluator IDE Round
  async evaluateCode(code: string, problem: string, language: string): Promise<CodeEvaluationResult> {
    await new Promise((r) => setTimeout(r, 1800)); // Simulate test runner compilation

    const hasDoubleLoop = code.includes('for') && code.split('for').length > 2;
    const hasHashmap = code.toLowerCase().includes('map') || code.toLowerCase().includes('dict') || code.toLowerCase().includes('hash') || code.includes('{}') || code.includes('new Map');
    
    // Determine problem-specific evaluations
    let success = true;
    let score = 85;
    let correctness = 'All test cases passed successfully.';
    let timeComplexity = 'O(N)';
    let spaceComplexity = 'O(N)';
    let consoleOutput = '';
    let testCases: CodeEvaluationResult['testCases'] = [];

    if (problem.toLowerCase().includes('two sum')) {
      testCases = [
        { name: 'Case 1: Standard input', status: 'PASSED', input: 'nums = [2,7,11,15], target = 9', expected: '[0, 1]', actual: '[0, 1]' },
        { name: 'Case 2: Duplicate values', status: 'PASSED', input: 'nums = [3,2,4], target = 6', expected: '[1, 2]', actual: '[1, 2]' },
        { name: 'Case 3: Negative numbers', status: 'PASSED', input: 'nums = [3,3], target = 6', expected: '[0, 1]', actual: '[0, 1]' },
      ];

      if (hasDoubleLoop) {
        timeComplexity = 'O(N²)';
        spaceComplexity = 'O(1)';
        score = 70;
        consoleOutput = `Test Suite Ran. (3/3 Cases Passed)\nWarning: Quadratic Time Complexity detected. Try optimizing with a HashMap.`;
      } else if (hasHashmap) {
        timeComplexity = 'O(N)';
        spaceComplexity = 'O(N)';
        score = 95;
        consoleOutput = `Test Suite Ran. (3/3 Cases Passed)\nOptimization Check: Excellent linear O(N) complexity using a Hash lookup!`;
      } else {
        timeComplexity = 'O(N log N)';
        spaceComplexity = 'O(1)';
        score = 80;
        consoleOutput = `Test Suite Ran. (3/3 Cases Passed)\nCode executed successfully.`;
      }
    } else if (problem.toLowerCase().includes('parentheses')) {
      testCases = [
        { name: 'Case 1: Standard balanced', status: 'PASSED', input: 's = "()"', expected: 'true', actual: 'true' },
        { name: 'Case 2: Multiple structures', status: 'PASSED', input: 's = "()[]{}"', expected: 'true', actual: 'true' },
        { name: 'Case 3: Unbalanced nested', status: 'PASSED', input: 's = "(]"', expected: 'false', actual: 'false' },
      ];

      const hasStack = code.toLowerCase().includes('stack') || code.toLowerCase().includes('push') || code.toLowerCase().includes('pop') || code.toLowerCase().includes('append');

      if (hasStack) {
        timeComplexity = 'O(N)';
        spaceComplexity = 'O(N)';
        score = 95;
        consoleOutput = `Test Suite Ran. (3/3 Cases Passed)\nComplexity Check: Standard O(N) stack-based matching detected. Well structured!`;
      } else {
        success = false;
        score = 40;
        testCases[2].status = 'FAILED';
        testCases[2].actual = 'true';
        correctness = 'Failed on unbalanced nesting test case.';
        timeComplexity = 'O(N)';
        spaceComplexity = 'O(1)';
        consoleOutput = `Test Suite Failed. (2/3 Cases Passed)\nError: Expected false, but returned true for s = "(]".`;
      }
    } else {
      // Default problem
      testCases = [
        { name: 'Case 1: Standard input', status: 'PASSED', input: 'n = 5', expected: '120', actual: '120' },
        { name: 'Case 2: Base case zero', status: 'PASSED', input: 'n = 0', expected: '1', actual: '1' },
      ];
      consoleOutput = `Test Suite Ran. (2/2 Cases Passed)\nDefault problem executed successfully.`;
    }

    const suggestions: string[] = [];
    if (timeComplexity === 'O(N²)') {
      suggestions.push('Optimise the nested loop structure to linear time by mapping element positions in memory.');
    }
    if (spaceComplexity === 'O(N)' && problem.toLowerCase().includes('two sum')) {
      suggestions.push('Consider if sorting the list first and using two pointers could yield O(1) space, if allowed.');
    }
    suggestions.push('Write comprehensive docstrings describing edge cases (like empty arrays or null variables).');
    suggestions.push('Ensure your solution handles integer overflow constraints if inputs scale past 2^31 - 1.');

    return {
      success,
      score,
      correctness,
      timeComplexity,
      spaceComplexity,
      consoleOutput,
      testCases,
      suggestions,
    };
  }
};
