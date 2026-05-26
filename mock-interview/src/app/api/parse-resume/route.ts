import { NextResponse } from 'next/server';

const MOCK_RESUMES: Record<string, object> = {
  default: {
    name: 'Alex Chen',
    email: 'alex.chen@email.com',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL'],
    experience: [
      '2 years at TechCorp as Frontend Developer — built React dashboards, improved performance by 40%',
      '1 year at StartupXYZ as Full-Stack Engineer — designed REST APIs, managed CI/CD pipelines',
    ],
    projects: [
      'E-commerce platform with Next.js, Stripe, and Prisma — 10K+ users',
      'Real-time chat app with WebSockets, Redis, and Docker — 5K daily active users',
      'ML pipeline for anomaly detection using Python and TensorFlow',
    ],
    education: 'B.Tech Computer Science, IIT Bombay, 2022',
  },
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { fileName, targetRole } = body as { fileName?: string; targetRole?: string };

  // Simulate processing delay
  await new Promise((r) => setTimeout(r, 600));

  const resume = { ...MOCK_RESUMES.default, targetRole: targetRole || 'Software Engineer' };

  return NextResponse.json(resume, { status: 200 });
}
