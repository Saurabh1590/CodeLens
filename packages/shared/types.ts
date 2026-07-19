export enum EventType {
  OPEN_PROBLEM = 'OPEN_PROBLEM',
  START_TYPING = 'START_TYPING',
  RUN = 'RUN',
  SUBMIT = 'SUBMIT',
  WRONG_ANSWER = 'WRONG_ANSWER',
  TLE = 'TLE',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  COMPILE_ERROR = 'COMPILE_ERROR',
  ACCEPTED = 'ACCEPTED',
  LEAVE_PAGE = 'LEAVE_PAGE',
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum SessionStatus {
  SOLVED = 'SOLVED',
  UNSOLVED = 'UNSOLVED',
  ABANDONED = 'ABANDONED',
}

export enum SnapshotTrigger {
  RUN = 'RUN',
  SUBMIT = 'SUBMIT',
}

export enum Verdict {
  ACCEPTED = 'ACCEPTED',
  WRONG_ANSWER = 'WRONG_ANSWER',
  TLE = 'TLE',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  COMPILE_ERROR = 'COMPILE_ERROR',
}

export enum Platform {
  LEETCODE = 'LEETCODE',
  GEEKSFORGEEKS = 'GEEKSFORGEEKS',
  CODEFORCES = 'CODEFORCES',
  HACKERRANK = 'HACKERRANK',
  CODECHEF = 'CODECHEF',
}

// Interfaces
export interface CodeSnapshot {
  snapshotNumber: number;
  trigger: SnapshotTrigger;
  verdict?: Verdict | null;
  code: string;
  timestamp: string; // ISO String
  runNumber: number;
  submissionNumber: number;
  executionTime?: string | null;
  memoryUsed?: string | null;
}

export interface SessionEvent {
  eventType: EventType;
  timestamp: string; // ISO String
  details?: string | null; // Optional JSON metadata
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
  email: string;
  problemSlug: string;
  problemTitle: string;
  problemUrl?: string;
  platform: Platform;
  difficulty: Difficulty;
  tags: string[];
  language: string;
  startTime: string; // ISO String
  endTime: string; // ISO String
  status: SessionStatus;
  summary: SessionSummary;
  events: SessionEvent[];
  snapshots: CodeSnapshot[];
  extensionVersion?: string;
  browserInfo?: string;
}

export interface ExtractedFeatures {
  readingDuration: number;
  codingDuration: number;
  debuggingDuration: number;
  totalDuration: number;
  codeRunCount: number;
  submissionCount: number;
  errorCount: number;
  acceptanceRate: number;
  readingRatio?: number;
  codingRatio?: number;
  debuggingRatio?: number;
  avgTimePerRun?: number;
  codeChangeCount?: number;
  thinkingDuration?: number;
  averageTimeBetweenRuns?: number;
  runFrequency?: number;
  submissionFrequency?: number;
  wrongAnswerPercentage?: number;
  compileErrorPercentage?: number;
  tlePercentage?: number;
  averageCodeLength?: number;
  linesAdded?: number;
  linesRemoved?: number;
  estimatedComplexity?: string;
  detectedAlgorithm?: string;
  dataStructuresUsed?: string[];
  finalCode?: string;
}

export interface Recommendation {
  category: string;
  count: number;
  reason: string;
}

export interface AnalysisScore {
  overall: number;
  planning: number;
  implementation: number;
  debugging: number;
  optimization: number;
  confidence: number;
}

export interface AnalysisResult {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  score: AnalysisScore;
  algorithms: string[];
  dataStructures: string[];
  recommendations: Recommendation[];
}

export interface DashboardStats {
  streak: number;
  acceptanceRate: number;
  avgSolveTime: number; // in minutes
  solvedCount: number;
  difficultyCounts: {
    [key in Difficulty]: number;
  };
  difficultyAvgTimes: {
    [key in Difficulty]: number;
  };
  topicCounts: Record<string, number>;
  weeklyScore: number;
  dailyActivity: { date: string; count: number }[];
}