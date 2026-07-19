export type SessionEventType =
  | 'OPEN_PROBLEM'
  | 'START_TYPING'
  | 'RUN'
  | 'SUBMIT'
  | 'WRONG_ANSWER'
  | 'TLE'
  | 'RUNTIME_ERROR'
  | 'COMPILE_ERROR'
  | 'ACCEPTED'
  | 'LEAVE_PAGE';

export interface CodeSnapshot {
  id?: string;
  sessionId?: string;
  snapshotNumber: number;
  trigger: 'RUN' | 'SUBMIT';
  verdict?: 'Accepted' | 'Wrong Answer' | 'TLE' | 'Runtime Error' | 'Compile Error' | string | null;
  code: string;
  timestamp: string; // ISO String
  runNumber: number;
  submissionNumber: number;
  executionTime?: string | null;
  memoryUsed?: string | null;
}

export interface SessionEvent {
  id?: string;
  sessionId?: string;
  eventType: SessionEventType;
  timestamp: string; // ISO String
  details?: string | null; // Optional JSON string for extra info
}

export interface SessionSummary {
  readingDuration: number; // in seconds
  codingDuration: number; // in seconds
  debuggingDuration: number; // in seconds
  totalDuration: number; // in seconds
  runCount: number;
  submissionCount: number;
}

export interface SessionPayload {
  email: string; // User email to tie session to
  problemTitle: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  language: string;
  startTime: string; // ISO String
  endTime: string; // ISO String
  status: 'Solved' | 'Unsolved';
  summary: SessionSummary;
  events: SessionEvent[];
  snapshots: CodeSnapshot[];
}

export interface Recommendation {
  id?: string;
  analysisId?: string;
  category: string;
  count: number;
  reason: string;
}

export interface AnalysisResult {
  overallScore: number;
  planningScore: number;
  implementationScore: number;
  debuggingScore: number;
  optimizationScore: number;
  confidenceScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: Recommendation[];
}

export interface DashboardStats {
  streak: number;
  acceptanceRate: number;
  avgSolveTime: number; // in minutes
  solvedCount: number;
  difficultyCounts: {
    Easy: number;
    Medium: number;
    Hard: number;
  };
  difficultyAvgTimes: {
    Easy: number;
    Medium: number;
    Hard: number;
  };
  topicCounts: Record<string, number>;
  weeklyScore: number; // 0-100 score this week
  dailyActivity: { date: string; count: number }[]; // for github contribution grid
}