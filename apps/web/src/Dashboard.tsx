import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Target,
  CheckCircle2,
  AlertCircle,
  Settings,
  LogOut,
  ChevronRight,
  BarChart3,
  Zap,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const topicData = [
  { name: 'Array', value: 5 },
  { name: 'HashMap', value: 3 },
  { name: 'Two Ptr', value: 2 },
  { name: 'DP', value: 3 },
];

const progressData = [
  { week: 'W1', score: 61 },
  { week: 'W2', score: 65 },
  { week: 'W3', score: 73 },
  { week: 'W4', score: 79 },
  { week: 'W5', score: 83 },
  { week: 'W6', score: 91 },
  { week: 'W7', score: 84 },
];

const SESSIONS = [
  {
    id: 's1',
    title: 'Edit Distance',
    difficulty: 'Hard',
    status: 'Solved',
    time: 45,
    score: 87,
    date: '2026-07-17',
  },
  {
    id: 's2',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    status: 'Solved',
    time: 32,
    score: 92,
    date: '2026-07-16',
  },
  {
    id: 's3',
    title: 'Word Ladder',
    difficulty: 'Hard',
    status: 'Unsolved',
    time: 18,
    score: 64,
    date: '2026-07-15',
  },
];

export default function Dashboard() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sessions, setSessions] = useState<any[]>(SESSIONS);
  const [error, setError] = useState<string | null>(null);

  // Fetch sessions from API on mount and every 5 seconds
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const storedEmail = localStorage.getItem('userEmail') || 'test@codelens.dev';
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/sessions?email=${encodeURIComponent(storedEmail)}`);
        if (!response.ok) throw new Error('Failed to fetch sessions');
        const data = await response.json();
        setSessions(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError('Could not connect to API. Using mock data.');
        // Keep mock data as fallback
        setSessions(SESSIONS);
      }
    };

    fetchSessions();
    const interval = setInterval(fetchSessions, 5000); // Poll every 5 seconds for new sessions

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-150">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">CodeLens</h1>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm font-medium text-slate-700">[email]</span>
            <Link
              to="/settings"
              className="p-2 hover:bg-slate-100 rounded-md transition-colors duration-150"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-slate-600" />
            </Link>
            <button
              className="p-2 hover:bg-slate-100 rounded-md transition-colors duration-150"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* API Status Badge */}
        {error && (
          <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span className="text-sm text-amber-800">{error}</span>
          </div>
        )}
        {!error && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-md flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-emerald-800">✓ Real-time data connected to API</span>
          </div>
        )}
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Streak', value: '5', icon: TrendingUp, bg: 'bg-indigo-50', text: 'text-indigo-600' },
            { label: 'Acceptance Rate', value: '78%', icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-600' },
            { label: 'Avg Solve Time', value: '23m', icon: Target, bg: 'bg-blue-50', text: 'text-blue-600' },
            { label: 'Solved', value: '9', icon: BarChart3, bg: 'bg-violet-50', text: 'text-violet-600' },
          ].map((kpi, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-md p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium text-slate-600">{kpi.label}</h3>
                <div className={`p-2 ${kpi.bg} rounded-md`}>
                  <kpi.icon className={`w-4 h-4 ${kpi.text}`} />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Topic Chart */}
          <div className="bg-white border border-slate-200 rounded-md p-6">
            <div className="mb-6">
              <h2 className="text-base font-extrabold text-slate-900">Topic Strengths</h2>
              <p className="text-sm text-slate-500 mt-1">Problems solved by category</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topicData}>
                <CartesianGrid strokeDasharray="0" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 13, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 13, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                  }}
                />
                <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Progress Chart */}
          <div className="bg-white border border-slate-200 rounded-md p-6">
            <div className="mb-6">
              <h2 className="text-base font-extrabold text-slate-900">Score Progress</h2>
              <p className="text-sm text-slate-500 mt-1">Weekly performance trend</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="0" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 13, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 13, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={{ fill: '#4F46E5', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Session Details Section */}
        <div className="grid grid-cols-3 gap-6">
          {/* Sessions List */}
          <div className="col-span-2">
            <div className="bg-white border border-slate-200 rounded-md">
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Recent Sessions</h2>
                  <p className="text-sm text-slate-500 mt-1">Last 10 problems solved</p>
                </div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="text-sm border border-slate-200 rounded-md px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All</option>
                  <option value="solved">Solved</option>
                  <option value="unsolved">Unsolved</option>
                </select>
              </div>

              <div className="divide-y divide-slate-200">
                {sessions.map((session) => (
                  <Link
                    key={session.id}
                    to={`/sessions/${session.id}`}
                    className="px-6 py-4 hover:bg-slate-50 transition-colors duration-150 flex items-center justify-between group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-slate-900 truncate">{session.title || session.problemTitle}</h3>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-sm ${
                            session.difficulty === 'Easy'
                              ? 'bg-emerald-50 text-emerald-700'
                              : session.difficulty === 'Medium'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {session.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>{(session.time || session.solveTime || 0)}m</span>
                        <span>{session.date || new Date().toISOString().split('T')[0]}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-sm ${
                          session.status === 'Solved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {session.status === 'Solved' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {session.status}
                      </span>
                      <div className="text-right">
                        <p className="font-extrabold text-slate-900">{session.score}</p>
                        <p className="text-xs text-slate-500">/100</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors duration-150" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* AI Coach Sidebar */}
          <div className="space-y-6">
            {/* Score Card */}
            <div className="bg-white border border-slate-200 rounded-md p-6">
              <h3 className="text-sm font-medium text-slate-600 mb-4">Session Score</h3>
              <div className="text-center mb-6">
                <p className="text-4xl font-extrabold text-indigo-600">84</p>
                <p className="text-sm text-slate-500">/100</p>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Planning', value: 95 },
                  { label: 'Implementation', value: 87 },
                  { label: 'Debugging', value: 89 },
                  { label: 'Optimization', value: 82 },
                ].map((metric, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-slate-700">{metric.label}</span>
                      <span className="text-xs font-extrabold text-slate-900">{metric.value}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600"
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-md p-6">
              <h3 className="text-sm font-extrabold text-emerald-900 mb-3">Your Strengths</h3>
              <ul className="space-y-2 text-sm text-emerald-800">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Excellent planning phase</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Optimal space complexity</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Effective BFS/DFS logic</span>
                </li>
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-amber-50 border border-amber-200 rounded-md p-6">
              <h3 className="text-sm font-extrabold text-amber-900 mb-3">Areas to Improve</h3>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>DP base condition handling</span>
                </li>
                <li className="flex gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Impulsive test running</span>
                </li>
                <li className="flex gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Edge case handling</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-8 bg-white border border-slate-200 rounded-md p-6">
          <h2 className="text-base font-extrabold text-slate-900 mb-6">Personalized Recommendations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                category: 'Dynamic Programming',
                count: 3,
                reason: 'You hit TLE on Edit Distance. Practice memoized transitions.',
              },
              {
                category: 'Graph Algorithms',
                count: 2,
                reason: 'Cyclic backtracking issues on Course Schedule. Solve detection tasks.',
              },
              {
                category: 'Array Techniques',
                count: 1,
                reason: 'Refresh sorting preprocessing patterns.',
              },
            ].map((rec, i) => (
              <div key={i} className="border border-slate-200 rounded-md p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium text-slate-900">{rec.category}</h3>
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-700 font-extrabold text-xs rounded-full">
                    {rec.count}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-4">{rec.reason}</p>
                <button className="w-full px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded-md transition-colors duration-150">
                  Start Practice
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}