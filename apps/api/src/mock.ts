import { PrismaClient } from '@prisma/client';
import {
  Difficulty,
  SessionStatus,
  EventType,
  SnapshotTrigger,
  Verdict,
  Platform,
} from '@codelens/shared';

const prisma = new PrismaClient();

// Mock data templates
const MOCK_PROBLEMS = [
  {
    slug: 'two-sum',
    title: 'Two Sum',
    difficulty: Difficulty.EASY,
    tags: ['Array', 'Hash Table'],
    algorithm: 'Two Pointers',
  },
  {
    slug: 'add-two-numbers',
    title: 'Add Two Numbers',
    difficulty: Difficulty.MEDIUM,
    tags: ['LinkedList', 'Math'],
    algorithm: 'LinkedList Traversal',
  },
  {
    slug: 'longest-substring-without-repeating',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: Difficulty.MEDIUM,
    tags: ['Hash Table', 'Sliding Window', 'String'],
    algorithm: 'Sliding Window',
  },
  {
    slug: 'median-of-two-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    difficulty: Difficulty.HARD,
    tags: ['Array', 'Binary Search'],
    algorithm: 'Binary Search',
  },
  {
    slug: 'longest-palindromic-substring',
    title: 'Longest Palindromic Substring',
    difficulty: Difficulty.MEDIUM,
    tags: ['DP', 'String'],
    algorithm: 'Dynamic Programming',
  },
  {
    slug: 'regular-expression-matching',
    title: 'Regular Expression Matching',
    difficulty: Difficulty.HARD,
    tags: ['DP', 'String'],
    algorithm: 'Dynamic Programming',
  },
  {
    slug: 'container-with-most-water',
    title: 'Container With Most Water',
    difficulty: Difficulty.MEDIUM,
    tags: ['Array', 'Two Pointers'],
    algorithm: 'Two Pointers',
  },
  {
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: Difficulty.EASY,
    tags: ['String', 'Stack'],
    algorithm: 'Stack',
  },
];

const MOCK_CODE_SNIPPETS = {
  'two-sum': [
    `// Brute Force - O(n²)
function twoSum(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
}`,
    `// Hash Map - O(n)
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
  ],
  'valid-parentheses': [
    `function isValid(s) {
    const stack = [];
    const pairs = { ')': '(', '}': '{', ']': '[' };

    for (let char of s) {
        if (char === '(' || char === '{' || char === '[') {
            stack.push(char);
        } else {
            if (!stack.length || stack.pop() !== pairs[char]) {
                return false;
            }
        }
    }
    return stack.length === 0;
}`,
  ],
};

interface EventDefinition {
  type: EventType;
  delayMs: number;
}

function generateMockSession(problem: typeof MOCK_PROBLEMS[0], solved: boolean) {
  const startTime = new Date();
  const events: { type: EventType; timestamp: Date }[] = [];
  const snapshots: { code: string; verdict?: Verdict | null }[] = [];

  let currentTime = new Date(startTime);
  const codeVersions = MOCK_CODE_SNIPPETS[problem.slug as keyof typeof MOCK_CODE_SNIPPETS] || [
    'function solve() { return true; }',
    'function solve() { return true; }',
  ];

  // Reading phase
  events.push({ type: EventType.OPEN_PROBLEM, timestamp: new Date(currentTime) });
  currentTime = new Date(currentTime.getTime() + 45000 + Math.random() * 60000);
  events.push({ type: EventType.START_TYPING, timestamp: new Date(currentTime) });

  // Coding phase
  let runCount = 0;
  const totalRuns = solved ? 2 + Math.floor(Math.random() * 2) : 4 + Math.floor(Math.random() * 3);

  for (let i = 0; i < totalRuns; i++) {
    runCount++;
    currentTime = new Date(currentTime.getTime() + 30000 + Math.random() * 45000);
    events.push({ type: EventType.RUN, timestamp: new Date(currentTime) });

    let verdict: Verdict | null = null;
    if (i < totalRuns - 1) {
      const errors = [Verdict.WRONG_ANSWER, Verdict.COMPILE_ERROR, Verdict.WRONG_ANSWER];
      verdict = errors[Math.floor(Math.random() * errors.length)];
      events.push({
        type: verdict === Verdict.COMPILE_ERROR ? EventType.COMPILE_ERROR : EventType.WRONG_ANSWER,
        timestamp: new Date(currentTime),
      });
    } else if (solved) {
      verdict = Verdict.ACCEPTED;
      events.push({ type: EventType.ACCEPTED, timestamp: new Date(currentTime) });
    } else {
      verdict = Verdict.WRONG_ANSWER;
      events.push({ type: EventType.WRONG_ANSWER, timestamp: new Date(currentTime) });
    }

    snapshots.push({
      code: codeVersions[Math.min(i, codeVersions.length - 1)],
      verdict,
    });

    currentTime = new Date(currentTime.getTime() + 20000 + Math.random() * 30000);
  }

  if (solved) {
    currentTime = new Date(currentTime.getTime() + 10000);
    events.push({ type: EventType.SUBMIT, timestamp: new Date(currentTime) });
  }

  const endTime = new Date(currentTime.getTime() + 5000);

  return {
    startTime,
    endTime,
    events,
    snapshots,
    runCount,
    submissionCount: solved ? 1 : 0,
    status: solved ? SessionStatus.SOLVED : SessionStatus.UNSOLVED,
  };
}

async function createMockSessions(userEmail: string, count: number = 10) {
  console.log(`:memo: Creating ${count} mock sessions for ${userEmail}...`);

  // Create or find user
  let user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { email: userEmail },
    });
    console.log(`✓ Created user: ${userEmail}`);
  }

  for (let i = 0; i < count; i++) {
    const problem = MOCK_PROBLEMS[i % MOCK_PROBLEMS.length];
    const solved = Math.random() > 0.2; // 80% solved
    const mockData = generateMockSession(problem, solved);

    // Create session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        problemSlug: problem.slug,
        problemTitle: problem.title,
        problemUrl: `leetcode.com/problems/${problem.slug}`,
        platform: Platform.LEETCODE,
        difficulty: problem.difficulty,
        tags: JSON.stringify(problem.tags),
        language: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++'][Math.floor(Math.random() * 5)],
        startTime: mockData.startTime,
        endTime: mockData.endTime,
        status: mockData.status,
        readingDuration: Math.floor((mockData.events[1]?.timestamp.getTime() - mockData.startTime.getTime()) / 1000),
        codingDuration: Math.floor((mockData.events[mockData.events.length - 2]?.timestamp.getTime() - mockData.events[1]?.timestamp.getTime() || 0) / 1000),
        debuggingDuration: Math.floor(((mockData.endTime.getTime() - mockData.events[mockData.events.length - 2]?.timestamp.getTime()) || 0) / 1000),
        totalDuration: Math.floor((mockData.endTime.getTime() - mockData.startTime.getTime()) / 1000),
        runCount: mockData.runCount,
        submissionCount: mockData.submissionCount,
        extensionVersion: '1.0.0',
        browserInfo: 'Chrome 140',
        events: {
          create: mockData.events.map((e) => ({
            eventType: e.type,
            timestamp: e.timestamp,
            details: null,
          })),
        },
        snapshots: {
          create: mockData.snapshots.map((s, idx) => ({
            snapshotNumber: idx + 1,
            trigger: idx === mockData.snapshots.length - 1 ? SnapshotTrigger.SUBMIT : SnapshotTrigger.RUN,
            verdict: s.verdict,
            code: s.code,
            timestamp: new Date(mockData.startTime.getTime() + idx * 60000),
            runNumber: idx + 1,
            submissionNumber: mockData.submissionCount > 0 ? 1 : 0,
            executionTime: s.verdict === Verdict.TLE ? undefined : `${Math.random() * 50 | 0}ms`,
            memoryUsed: `${Math.random() * 50 + 10 | 0}MB`,
          })),
        },
      },
      include: {
        events: true,
        snapshots: true,
      },
    });

    // Create mock analysis
    const planningScore = 50 + Math.floor(Math.random() * 50);
    const implementationScore = 50 + Math.floor(Math.random() * 50);
    const debuggingScore = 40 + Math.floor(Math.random() * 60);
    const optimizationScore = 40 + Math.floor(Math.random() * 60);
    const overallScore = Math.round(
      (planningScore * 0.2 + implementationScore * 0.3 + debuggingScore * 0.3 + optimizationScore * 0.2) * 0.9
    );

    await prisma.analysis.create({
      data: {
        sessionId: session.id,
        analysisVersion: '1.0.0',
        model: 'fallback',
        overallScore,
        planningScore,
        implementationScore,
        debuggingScore,
        optimizationScore,
        confidenceScore: 75 + Math.floor(Math.random() * 25),
        summary: `Completed "${problem.title}" in ${Math.round(mockData.endTime.getTime() - mockData.startTime.getTime() / 60000)} minutes. ${solved ? 'Solution accepted.' : 'Problem not solved.'}`,
        strengths: JSON.stringify([
          'Good problem analysis approach',
          'Iterative debugging strategy',
          'Clear code structure',
        ].slice(0, 2 + Math.floor(Math.random() * 2))),
        weaknesses: JSON.stringify([
          'Could optimize time complexity',
          'Rushed edge case testing',
          'Syntax errors slowed implementation',
        ].slice(0, 1 + Math.floor(Math.random() * 2))),
        recommendations: {
          create: [
            {
              category: problem.tags[0],
              count: 2 + Math.floor(Math.random() * 3),
              reason: `Practice more ${problem.tags[0]} problems to solidify concepts.`,
            },
          ],
        },
      },
    });

    console.log(`✓ Session ${i + 1}/${count}: ${problem.title} (${mockData.status})`);
  }

  console.log(`\n:white_check_mark: Created ${count} mock sessions!`);
}

async function main() {
  try {
    const email = process.argv[2] || 'demo@codelens.ai';
    const count = parseInt(process.argv[3]) || 10;

    console.log('\n:rocket: CodeLens Mock Data Generator');
    console.log('================================\n');

    await createMockSessions(email, Math.min(count, 50));

    console.log('\n:bar_chart: Dashboard ready! Open CodeLens to view sessions.\n');
  } catch (error) {
    console.error(':x: Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();