import {
  ExtractedFeatures,
  AnalysisResult,
  AnalysisScore,
  Difficulty,
} from '@codelens/shared';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Feature extraction from session data
export function extractFeatures(
  events: Array<{ eventType: string; details?: string }>,
  snapshots: Array<{ code: string; timestamp: Date }>,
  durations: {
    reading: number;
    coding: number;
    debugging: number;
    total: number;
  }
): Partial<ExtractedFeatures> {
  const runCount = events.filter((e) => e.eventType === 'RUN').length;
  const submissionCount = events.filter(
    (e) => e.eventType === 'SUBMIT'
  ).length;
  const errorCount = events.filter((e) => e.eventType === 'ERROR').length;

  return {
    readingDuration: durations.reading,
    codingDuration: durations.coding,
    debuggingDuration: durations.debugging,
    totalDuration: durations.total,
    readingRatio: durations.total ? durations.reading / durations.total : 0,
    codingRatio: durations.total ? durations.coding / durations.total : 0,
    debuggingRatio: durations.total ? durations.debugging / durations.total : 0,
    codeRunCount: runCount,
    submissionCount,
    errorCount,
    acceptanceRate: submissionCount > 0 ? 100 / submissionCount : 0,
    avgTimePerRun: runCount ? durations.total / runCount : 0,
    codeChangeCount: snapshots.length,
  };
}

// Rule-based baseline scoring
export function runRuleEngine(features: Partial<ExtractedFeatures>): AnalysisScore {
  let planning = 0.5;
  let implementation = 0.5;
  let debugging = 0.5;
  let optimization = 0.5;

  // Planning: based on reading duration
  if (features.readingRatio && features.readingRatio > 0.3) planning = 0.9;
  else if (features.readingRatio && features.readingRatio > 0.2) planning = 0.75;

  // Implementation: based on coding efficiency
  if (
    features.codeRunCount &&
    features.totalDuration &&
    features.codeRunCount <= features.totalDuration / 300000
  )
    implementation = 0.85;
  else implementation = 0.6;

  // Debugging: based on error count and runs
  if (features.errorCount === 0) debugging = 0.9;
  else if (
    features.errorCount &&
    features.codeRunCount &&
    features.errorCount / features.codeRunCount < 0.3
  )
    debugging = 0.75;

  // Optimization: based on acceptance rate
  if (features.acceptanceRate && features.acceptanceRate > 0.8) optimization = 0.9;
  else if (features.acceptanceRate && features.acceptanceRate > 0.5)
    optimization = 0.7;

  const overall = Math.round(
    (planning * 0.2 + implementation * 0.3 + debugging * 0.3 + optimization * 0.2) * 100
  );

  return {
    overall: Math.min(100, overall),
    planning: Math.round(planning * 100),
    implementation: Math.round(implementation * 100),
    debugging: Math.round(debugging * 100),
    optimization: Math.round(optimization * 100),
    confidence: 60,
  };
}

// Detect algorithms and data structures from code
export function detectAlgorithmsAndStructures(
  codeSnapshots: Array<{ code: string }>
): { algorithms: string[]; dataStructures: string[] } {
  const code = codeSnapshots.map((s) => s.code).join('\n');

  const algorithms: string[] = [];
  const dataStructures: string[] = [];

  // Algorithm detection
  if (/(dfs|depth.first|depthFirst)/i.test(code)) algorithms.push('DFS');
  if (/(bfs|breadth.first|breadthFirst)/i.test(code)) algorithms.push('BFS');
  if (/(dynamic programming|dp\[|memo)/i.test(code)) algorithms.push('Dynamic Programming');
  if (/(binary search|binarySearch)/i.test(code)) algorithms.push('Binary Search');
  if (/(two.?pointer|twoPointer)/i.test(code)) algorithms.push('Two Pointers');
  if (/(sliding.?window|slidingWindow)/i.test(code)) algorithms.push('Sliding Window');
  if (/(sort|quicksort|mergesort)/i.test(code)) algorithms.push('Sorting');

  // Data structure detection
  if (/(hash.?map|HashMap|dict|Map\<|unordered_map)/i.test(code))
    dataStructures.push('HashMap');
  if (/(tree|TreeNode|Node)/i.test(code)) dataStructures.push('Tree');
  if (/(linked.?list|ListNode)/i.test(code)) dataStructures.push('Linked List');
  if (/(graph|Graph|adjacency)/i.test(code)) dataStructures.push('Graph');
  if (/(queue|Queue|Deque)/i.test(code)) dataStructures.push('Queue');
  if (/(stack|Stack)/i.test(code)) dataStructures.push('Stack');
  if (/(set|Set|unordered_set)/i.test(code)) dataStructures.push('Set');

  return { algorithms, dataStructures };
}

// Fallback analysis when Gemini API is unavailable
function generateFallbackAnalysis(
  problemTitle: string,
  difficulty: Difficulty,
  features: Partial<ExtractedFeatures>,
  score: AnalysisScore
): AnalysisResult {
  const strengths = [];
  const weaknesses = [];

  if (score.planning > 80)
    strengths.push('Strong planning phase - good problem analysis before coding');
  if (score.debugging > 80)
    strengths.push('Efficient debugging - few errors relative to code runs');
  if (score.optimization > 80)
    strengths.push('Good code optimization - efficient solution');

  if (score.planning < 50)
    weaknesses.push('Consider spending more time understanding the problem');
  if (score.debugging < 50)
    weaknesses.push('Try running tests more strategically to reduce debugging time');
  if (features.codeChangeCount && features.codeChangeCount > 10)
    weaknesses.push('Excessive code rewrites - plan more before coding');

  return {
    score,
    summary: `${problemTitle} (${difficulty}) - Keep practicing to improve your score`,
    strengths: strengths.length > 0 ? strengths : ['Keep working on problem-solving'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['No significant issues detected'],
    algorithms: [],
    dataStructures: [],
    recommendations: [
      {
        category: 'Practice',
        count: 3,
        reason: 'Solve more problems to improve overall score',
      },
    ],
  };
}

// Main analysis pipeline
export async function analyzeSession(params: {
  problemTitle: string;
  difficulty: Difficulty;
  features: ExtractedFeatures;
  codeSnapshots: Array<{ code: string; timestamp?: Date }>;
  userId: string;
}): Promise<AnalysisResult> {
  // Run rule engine
  const score = runRuleEngine(params.features);

  // Detect algorithms and structures
  const { algorithms, dataStructures } = detectAlgorithmsAndStructures(
    params.codeSnapshots
  );

  // Try Gemini analysis if API key available
  if (!GEMINI_API_KEY) {
    return generateFallbackAnalysis(
      params.problemTitle,
      params.difficulty,
      params.features,
      score
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an expert LeetCode coding coach. Analyze this problem-solving session and provide ONLY a JSON response (no markdown, no extra text).

Session Data:
- Problem: ${params.problemTitle}
- Difficulty: ${params.difficulty}
- Total Time: ${Math.round(params.features.totalDuration / 1000 / 60)} minutes
- Reading Time: ${Math.round(params.features.readingDuration / 1000 / 60)} minutes
- Coding Time: ${Math.round(params.features.codingDuration / 1000 / 60)} minutes
- Debugging Time: ${Math.round(params.features.debuggingDuration / 1000 / 60)} minutes
- Code Runs: ${params.features.codeRunCount}
- Submissions: ${params.features.submissionCount}
- Errors: ${params.features.errorCount}
- Algorithms Used: ${algorithms.join(', ') || 'None detected'}
- Data Structures: ${dataStructures.join(', ') || 'Basic'}

Provide response in this exact JSON format:
{
  "summary": "2-3 sentence coaching feedback on their problem-solving approach",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["area to improve 1", "area to improve 2", "area to improve 3"],
  "recommendations": [
    {"category": "category name", "count": 2, "reason": "why to practice this"},
    {"category": "another category", "count": 3, "reason": "why this matters"}
  ]
}

Respond with ONLY the JSON object, nothing else.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        score,
        summary: parsed.summary || 'Session analyzed successfully',
        strengths: parsed.strengths || ['Great effort on problem-solving'],
        weaknesses: parsed.weaknesses || ['Keep practicing to improve'],
        algorithms,
        dataStructures,
        recommendations: parsed.recommendations || [
          { category: 'Practice', count: 3, reason: 'Reinforce learning' },
        ],
      };
    }
  } catch (error) {
    console.error('Gemini analysis failed:', error);
  }

  // Fallback
  return generateFallbackAnalysis(
    params.problemTitle,
    params.difficulty,
    params.features,
    score
  );
}