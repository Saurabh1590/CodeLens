 import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Target,
  Code2,
  CheckCircle2,
  AlertCircle,
  Zap,
  ChevronDown,
} from 'lucide-react';

export default function SessionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');

  const session = {
    id,
    title: 'Edit Distance',
    difficulty: 'Hard',
    status: 'Solved',
    date: '2026-07-17',
    startTime: '14:30',
    endTime: '15:15',
    score: 87,
    metrics: {
      readingDuration: 8,
      codingDuration: 28,
      debuggingDuration: 12,
      totalDuration: 45,
      runCount: 12,
      submissionCount: 3,
      acceptanceRate: 78,
      errorCount: 4,
    },
  };

  const scoreBreakdown = [
    { label: 'Planning', value: 95, weight: '20%' },
    { label: 'Implementation', value: 87, weight: '30%' },
    { label: 'Debugging', value: 89, weight: '30%' },
    { label: 'Optimization', value: 82, weight: '20%' },
  ];

  const codeSnapshots = [
    {
      trigger: 'START',
      time: '14:30',
      code: `function editDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  // Initial approach - brute force
  return 0;
}`,
    },
    {
      trigger: 'RUN',
      time: '14:35',
      code: `function editDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
  // Trying DP approach
  return dp[m][n];
}`,
    },
    {
      trigger: 'SUBMIT',
      time: '15:12',
      code: `function editDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i-1] === word2[j-1]) {
        dp[i][j] = dp[i-1][j-1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
      }
    }
  }
  return dp[m][n];
}`,
    },
  ];

  const analysis = {
    summary:
      'Strong DP solution with correct approach. Implementation could be optimized for space complexity.',
    strengths: [
      'Correctly identified DP as the optimal approach',
      'Handled all three edit operations (insert, delete, replace)',
      'Proper initialization of base cases',
    ],
    weaknesses: [
      'O(m*n) space complexity - could optimize to O(n) with rolling array',
      '4 run attempts before final submission - more initial planning could help',
      'No early termination checks for obviously impossible cases',
    ],
    recommendations: [
      'Practice space-optimized DP patterns',
      'Work on problem constraints analysis before coding',
      'Review similar problems: Longest Common Subsequence, Wildcard Matching',
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-slate-100 rounded-md transition-colors duration-150"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900">{session.title}</h1>
              <p className="text-sm text-slate-500 mt-1">{session.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex px-3 py-1.5 text-sm font-semibold rounded-sm ${
                session.difficulty === 'Hard'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {session.difficulty}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-sm ${
                session.status === 'Solved'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {session.status}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Clock, label: 'Total Time', value: `${session.metrics.totalDuration}m` },
            { icon: Code2, label: 'Runs', value: session.metrics.runCount },
            { icon: Target, label: 'Submissions', value: session.metrics.submissionCount },
            { icon: AlertCircle, label: 'Errors', value: session.metrics.errorCount },
          ].map((metric, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-md p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-md">
                  <metric.icon className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-600">{metric.label}</p>
                  <p className="text-lg font-extrabold text-slate-900">{metric.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Overview Section */}
            <div className="bg-white border border-slate-200 rounded-md">
              <button
                onClick={() =>
                  setExpandedSection(expandedSection === 'overview' ? null : 'overview')
                }
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors duration-150 border-b border-slate-200"
              >
                <h2 className="text-base font-extrabold text-slate-900">Score Breakdown</h2>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                    expandedSection === 'overview' ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {expandedSection === 'overview' && (
                <div className="px-6 py-4 space-y-4">
                  <div className="text-center mb-6">
                    <p className="text-5xl font-extrabold text-indigo-600 mb-1">
                      {session.score}
                    </p>
                    <p className="text-sm text-slate-500">/100</p>
                  </div>

                  {scoreBreakdown.map((item, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">
                          {item.label}
                          <span className="text-slate-500 ml-2">({item.weight})</span>
                        </span>
                        <span className="text-sm font-extrabold text-slate-900">{item.value}</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Analysis */}
            <div className="bg-white border border-slate-200 rounded-md">
              <button
                onClick={() =>
                  setExpandedSection(expandedSection === 'analysis' ? null : 'analysis')
                }
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors duration-150 border-b border-slate-200"
              >
                <h2 className="text-base font-extrabold text-slate-900">AI Analysis</h2>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                    expandedSection === 'analysis' ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {expandedSection === 'analysis' && (
                <div className="px-6 py-4 space-y-4">
                  <div>
                    <p className="text-sm text-slate-700 mb-4">{analysis.summary}</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-slate-900 mb-3">Strengths</h3>
                    <ul className="space-y-2">
                      {analysis.strengths.map((s, i) => (
                        <li key={i} className="flex gap-2 text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-slate-900 mb-3">Areas to Improve</h3>
                    <ul className="space-y-2">
                      {analysis.weaknesses.map((w, i) => (
                        <li key={i} className="flex gap-2 text-sm text-slate-700">
                          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Code Evolution */}
            <div className="bg-white border border-slate-200 rounded-md">
              <button
                onClick={() => setExpandedSection(expandedSection === 'code' ? null : 'code')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors duration-150 border-b border-slate-200"
              >
                <h2 className="text-base font-extrabold text-slate-900">Code Evolution</h2>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                    expandedSection === 'code' ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {expandedSection === 'code' && (
                <div className="px-6 py-4 space-y-4">
                  {codeSnapshots.map((snapshot, i) => (
                    <div key={i} className="border border-slate-200 rounded-md p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-sm bg-slate-100 text-slate-700">
                          {snapshot.trigger}
                        </span>
                        <span className="text-xs text-slate-500">{snapshot.time}</span>
                      </div>
                      <pre className="bg-slate-900 text-slate-100 p-3 rounded-md overflow-x-auto text-xs leading-relaxed font-mono">
                        <code>{snapshot.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Time Breakdown */}
            <div className="bg-white border border-slate-200 rounded-md p-6">
              <h3 className="text-sm font-extrabold text-slate-900 mb-4">Time Breakdown</h3>
              <div className="space-y-3">
                {[
                  {
                    label: 'Reading',
                    time: session.metrics.readingDuration,
                    color: 'bg-blue-100 text-blue-700',
                  },
                  {
                    label: 'Coding',
                    time: session.metrics.codingDuration,
                    color: 'bg-indigo-100 text-indigo-700',
                  },
                  {
                    label: 'Debugging',
                    time: session.metrics.debuggingDuration,
                    color: 'bg-amber-100 text-amber-700',
                  },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-slate-700">{item.label}</span>
                      <span className="text-xs font-extrabold text-slate-900">
                        {item.time}m
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color}`}
                        style={{
                          width: `${(item.time / session.metrics.totalDuration) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Session Info */}
            <div className="bg-slate-50 border border-slate-200 rounded-md p-6">
              <h3 className="text-sm font-extrabold text-slate-900 mb-4">Session Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-500 mb-1">Started</p>
                  <p className="font-medium text-slate-900">{session.startTime}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Completed</p>
                  <p className="font-medium text-slate-900">{session.endTime}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Status</p>
                  <p className="font-medium text-slate-900 capitalize">{session.status}</p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-md p-6">
              <h3 className="text-sm font-extrabold text-indigo-900 mb-3">Next Steps</h3>
              <ul className="space-y-2 text-sm text-indigo-800">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-2">
                    <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}