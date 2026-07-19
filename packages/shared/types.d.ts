 export declare enum EventType {
    OPEN_PROBLEM = "OPEN_PROBLEM",
    START_TYPING = "START_TYPING",
    RUN = "RUN",
    SUBMIT = "SUBMIT",
    WRONG_ANSWER = "WRONG_ANSWER",
    TLE = "TLE",
    RUNTIME_ERROR = "RUNTIME_ERROR",
    COMPILE_ERROR = "COMPILE_ERROR",
    ACCEPTED = "ACCEPTED",
    LEAVE_PAGE = "LEAVE_PAGE"
}
export declare enum Difficulty {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD"
}
export declare enum SessionStatus {
    SOLVED = "SOLVED",
    UNSOLVED = "UNSOLVED",
    ABANDONED = "ABANDONED"
}
export declare enum SnapshotTrigger {
    RUN = "RUN",
    SUBMIT = "SUBMIT"
}
export declare enum Verdict {
    ACCEPTED = "ACCEPTED",
    WRONG_ANSWER = "WRONG_ANSWER",
    TLE = "TLE",
    RUNTIME_ERROR = "RUNTIME_ERROR",
    COMPILE_ERROR = "COMPILE_ERROR"
}
export declare enum Platform {
    LEETCODE = "LEETCODE",
    GEEKSFORGEEKS = "GEEKSFORGEEKS",
    CODEFORCES = "CODEFORCES",
    HACKERRANK = "HACKERRANK",
    CODECHEF = "CODECHEF"
}
export interface CodeSnapshot {
    snapshotNumber: number;
    trigger: SnapshotTrigger;
    verdict?: Verdict | null;
    code: string;
    timestamp: string;
    runNumber: number;
    submissionNumber: number;
    executionTime?: string | null;
    memoryUsed?: string | null;
}
export interface SessionEvent {
    eventType: EventType;
    timestamp: string;
    details?: string | null;
}
export interface SessionSummary {
    readingDuration: number;
    codingDuration: number;
    debuggingDuration: number;
    totalDuration: number;
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
    startTime: string;
    endTime: string;
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
    avgSolveTime: number;
    solvedCount: number;
    difficultyCounts: {
        [key in Difficulty]: number;
    };
    difficultyAvgTimes: {
        [key in Difficulty]: number;
    };
    topicCounts: Record<string, number>;
    weeklyScore: number;
    dailyActivity: {
        date: string;
        count: number;
    }[];
} 