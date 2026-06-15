'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { mockApi, CodeEvaluationResult } from '@/services/mockApi';
import { 
  Code2, Play, CheckCircle2, XCircle, Terminal, 
  ChevronRight, ArrowLeft, Loader2, Sparkles, Trophy,
  Cpu, Award, MessageSquareCode
} from 'lucide-react';
import Link from 'next/link';

const PROBLEMS = [
  {
    id: 'two-sum',
    title: '1. Two Sum',
    difficulty: 'Easy',
    desc: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    boilerplates: {
      javascript: `function twoSum(nums, target) {
  // Create a map to store values and their indices
  const numMap = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (numMap.has(complement)) {
      return [numMap.get(complement), i];
    }
    numMap.set(nums[i], i);
  }
  return [];
}`,
      python: `def twoSum(nums: List[int], target: int) -> List[int]:
    # Write your python code here
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your java code here
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int diff = target - nums[i];
            if (map.containsKey(diff)) {
                return new int[] { map.get(diff), i };
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`
    }
  },
  {
    id: 'valid-parentheses',
    title: '20. Valid Parentheses',
    difficulty: 'Easy',
    desc: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        output: 'true',
        explanation: 'The brackets match in correct order.'
      },
      {
        input: 's = "()[]{}"',
        output: 'true',
        explanation: 'Each open bracket is closed by its corresponding matching bracket.'
      },
      {
        input: 's = "(]"',
        output: 'false',
        explanation: 'The closing bracket "]" does not match open bracket "(".'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      "s consists of parentheses only: '()[]{}'"
    ],
    boilerplates: {
      javascript: `function isValid(s) {
  const stack = [];
  const map = {
    ')': '(',
    '}': '{',
    ']': '['
  };
  
  for (let char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}`,
      python: `def isValid(s: str) -> bool:
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping.values():
            stack.append(char)
        elif char in mapping.keys():
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            return False
    return len(stack) == 0`,
      java: `class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if (c == ')' && top != '(') return false;
                if (c == '}' && top != '{') return false;
                if (c == ']' && top != '[') return false;
            }
        }
        return stack.isEmpty();
    }
}`
    }
  }
];

export default function CodingPage() {
  const router = useRouter();
  const { user, codingProblem, codingLanguage, codingCode, codingResult, setCodingProblem, setCodingLanguage, setCodingCode, setCodingResult } = useStore();

  const [activeProblem, setActiveProblem] = useState(PROBLEMS[0]);
  const [lang, setLang] = useState('javascript');
  const [editorCode, setEditorCode] = useState('');
  
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState('Terminal Idle. Click Run Code to validate.');
  const [showResultModal, setShowResultModal] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  // Sync boilerplate when problem or language changes
  useEffect(() => {
    const problem = PROBLEMS.find(p => p.id === codingProblem) || PROBLEMS[0];
    setActiveProblem(problem);
    setLang(codingLanguage);
    
    // Default to store code if present, else boilerplate
    setEditorCode(codingCode);
  }, [codingProblem, codingLanguage]);

  if (!user) return null;

  const handleProblemChange = (probId: string) => {
    const prob = PROBLEMS.find(p => p.id === probId) || PROBLEMS[0];
    setCodingProblem(prob.id);
    setCodingCode(prob.boilerplates[lang as keyof typeof prob.boilerplates]);
  };

  const handleLanguageChange = (newLang: string) => {
    setCodingLanguage(newLang);
    setCodingCode(activeProblem.boilerplates[newLang as keyof typeof activeProblem.boilerplates]);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setTerminalLogs(`Compiling and running on test environment...\nLoading sandboxed ${lang} virtual node...\n`);
    
    await new Promise(r => setTimeout(r, 1200));

    // Simple test case results
    setTerminalLogs(prev => prev + `\nTest Case 1: PASSED\nTest Case 2: PASSED\n\nAll basic assertions completed successfully (Stdout: OK).`);
    setIsRunning(false);
  };

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setTerminalLogs(`Submitting to grading server...\nRunning advanced edge cases...`);
    
    const evalResult = await mockApi.evaluateCode(editorCode, activeProblem.title, lang);
    
    setCodingResult(evalResult);
    setTerminalLogs(prev => prev + `\nExecution completed.\nOverall Score: ${evalResult.score}/100\nTime Complexity: ${evalResult.timeComplexity}\nSpace Complexity: ${evalResult.spaceComplexity}`);
    setIsSubmitting(false);
    setShowResultModal(true);
  };

  return (
    <div className="bg-[#030712] min-h-screen pt-20 pb-12 px-4 dark-grid">
      <div className="section-container max-w-7xl h-[calc(100vh-120px)] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-slate-400 hover:text-indigo-400 text-sm flex items-center gap-1.5 transition-colors">
              <ArrowLeft size={16} /> Dashboard
            </Link>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-2">
              <Code2 className="text-indigo-400" size={18} />
              <span className="text-sm font-bold text-white uppercase tracking-widest">Coding Round Practice</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Problem selector */}
            <select
              value={activeProblem.id}
              onChange={(e) => handleProblemChange(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
            >
              {PROBLEMS.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>

            {/* Language selector */}
            <select
              value={lang}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="javascript">JavaScript (Node v18)</option>
              <option value="python">Python 3.10</option>
              <option value="java">Java (OpenJDK 17)</option>
            </select>
          </div>
        </div>

        {/* Workspace Split Layout */}
        <div className="flex-1 grid lg:grid-cols-2 gap-6 min-h-0">
          {/* Left Panel: Description */}
          <div className="premium-card bg-slate-900/40 border border-slate-800/80 p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{activeProblem.title}</h2>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
                  {activeProblem.difficulty}
                </span>
              </div>

              <div className="text-sm text-slate-300 leading-relaxed space-y-4 whitespace-pre-line">
                {activeProblem.desc}
              </div>

              {/* Examples */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Examples</h4>
                {activeProblem.examples.map((ex, idx) => (
                  <div key={idx} className="p-4 bg-slate-950/40 rounded-xl border border-slate-800/50 space-y-2 text-xs font-mono">
                    <p><strong className="text-slate-400">Input:</strong> <span className="text-slate-300">{ex.input}</span></p>
                    <p><strong className="text-slate-400">Output:</strong> <span className="text-slate-300">{ex.output}</span></p>
                    {ex.explanation && (
                      <p className="mt-1 leading-relaxed"><strong className="text-slate-500">Explanation:</strong> <span className="text-slate-500">{ex.explanation}</span></p>
                    )}
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Constraints</h4>
                <ul className="list-disc list-inside text-xs text-slate-500 font-mono space-y-1">
                  {activeProblem.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 mt-6 flex items-center gap-2 text-xs text-slate-500 italic">
              <Sparkles size={14} className="text-indigo-400 flex-shrink-0" />
              <span>Submit your solution to get a granular analysis of your complexity tradeoffs.</span>
            </div>
          </div>

          {/* Right Panel: Editor + Console */}
          <div className="flex flex-col gap-4 min-h-0">
            {/* Code Editor Mock */}
            <div className="flex-1 premium-card bg-slate-950 border border-slate-800 flex flex-col overflow-hidden min-h-0">
              <div className="px-4 py-2 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 flex-shrink-0">
                <span className="text-xs font-mono text-slate-500">editor.tsx</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                </div>
              </div>

              <div className="flex-1 relative overflow-auto font-mono text-xs flex">
                {/* Line numbers gutter */}
                <div className="w-10 bg-slate-900/30 text-slate-600 border-r border-slate-800 text-right pr-2 select-none py-4 space-y-1">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                {/* Textarea */}
                <textarea
                  value={editorCode}
                  onChange={(e) => {
                    setEditorCode(e.target.value);
                    setCodingCode(e.target.value);
                  }}
                  className="flex-1 p-4 bg-transparent outline-none border-none text-indigo-200 resize-none font-mono text-xs leading-5 focus:ring-0 overflow-auto whitespace-pre h-full"
                  spellCheck="false"
                />
              </div>

              {/* Action Buttons footer */}
              <div className="px-4 py-3 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/30 flex-shrink-0">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning || isSubmitting}
                  className="btn-secondary px-5 py-2 text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                  <span>Run Code</span>
                </button>
                <button
                  onClick={handleSubmitCode}
                  disabled={isRunning || isSubmitting || !editorCode}
                  className="btn-primary px-6 py-2 text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  <span>Submit Answer</span>
                </button>
              </div>
            </div>

            {/* Console Output Logs */}
            <div className="h-44 premium-card bg-slate-900/20 border border-slate-800 p-4 flex flex-col min-h-0">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2 flex-shrink-0">
                <Terminal size={14} className="text-slate-500" />
                <span>Execution Console</span>
              </div>
              <div className="flex-1 bg-black/40 rounded-xl p-3 border border-slate-800/40 overflow-y-auto font-mono text-[10px] text-slate-400 whitespace-pre-wrap leading-relaxed select-text">
                {terminalLogs}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code evaluation result overlay modal */}
      <AnimatePresence>
        {showResultModal && codingResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl premium-card bg-slate-900 border border-indigo-500/20 p-8 glass-panel shadow-2xl space-y-6"
            >
              {/* Score header */}
              <div className="text-center relative">
                <div className="mx-auto w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 animate-bounce">
                  <Trophy size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white">Coding Round Evaluated</h3>
                <div className="text-5xl font-black gradient-text mt-3">{codingResult.score}%</div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Accuracy / efficiency Score</p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-950/40 border border-slate-800 rounded-xl flex items-center gap-3">
                  <Cpu className="text-indigo-400" size={20} />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Time Complexity</p>
                    <p className="text-sm font-bold text-white font-mono">{codingResult.timeComplexity}</p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950/40 border border-slate-800 rounded-xl flex items-center gap-3">
                  <Award className="text-indigo-400" size={20} />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Space Complexity</p>
                    <p className="text-sm font-bold text-white font-mono">{codingResult.spaceComplexity}</p>
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
                  <MessageSquareCode className="text-indigo-400" size={16} />
                  <span>AI Recommendations</span>
                </h4>
                <ul className="space-y-2">
                  {codingResult.suggestions.map((sug, i) => (
                    <li key={i} className="text-xs text-slate-400 leading-relaxed flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowResultModal(false)}
                  className="btn-secondary w-full py-3 text-xs font-bold flex justify-center items-center cursor-pointer"
                >
                  Keep Modifying
                </button>
                <Link
                  href="/analytics"
                  className="btn-primary w-full py-3 text-xs font-bold flex justify-center items-center hover:scale-105 active:scale-95 duration-200"
                >
                  View Performance Analytics
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
