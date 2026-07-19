import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { SessionPayload } from '@codelens/shared';
import { analyzeSession } from './ai/analyzer.js';

dotenv.config();

const prisma = new PrismaClient();

const fastify = Fastify({
  logger: true,
});

// Middleware
const allowedOrigins = [
  'localhost',
  'localhost',
  'localhost',
  'localhost',
  'localhost',
  ...(process.env.CORS_ORIGIN || '').split(',').filter(Boolean)
];
fastify.register(cors, {
  origin: (origin, cb) => {
    // Allow requests with no origin (e.g. curl, mobile apps, extension)
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      cb(null, true);
    } else {
      // Check for domain matches (ignoring schemes like http/https)
      const isAllowed = allowedOrigins.some(allowed => {
        if (allowed === '*') return true;
        const cleanAllowed = allowed.replace(/^https?:\/\//, '');
        const cleanOrigin = origin.replace(/^https?:\/\//, '');
        return cleanOrigin === cleanAllowed || cleanOrigin.endsWith('.' + cleanAllowed);
      });

      if (isAllowed) {
        cb(null, true);
      } else {
        cb(new Error(`Not allowed by CORS: ${origin}`), false);
      }
    }
  },
});

// Mock data
const MOCK_SESSIONS = [
  {
    id: 's1',
    problemTitle: 'Edit Distance',
    difficulty: 'Hard',
    status: 'Solved',
    solveTime: 45,
    score: 87,
  },
  {
    id: 's2',
    problemTitle: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    status: 'Solved',
    solveTime: 32,
    score: 92,
  },
  {
    id: 's3',
    problemTitle: 'Word Ladder',
    difficulty: 'Hard',
    status: 'Unsolved',
    solveTime: 18,
    score: 64,
  },
];

const MOCK_ANALYSIS = {
  score: {
    overall: 84,
    planning: 95,
    implementation: 87,
    debugging: 89,
    optimization: 82,
    confidence: 92,
  },
  summary:
    'Strong planning on Easy topics with excellent space complexity optimization. Consider improving base condition handling in DP problems.',
  strengths: [
    'Excellent planning on Easy topics. You spend initial seconds analyzing constraints.',
    'Optimal space complexity structures (e.g. O(1) states in Climbing Stairs).',
    'Effective BFS/DFS tree mapping logic.',
  ],
  weaknesses: [
    'Struggles with DP base conditions, leading to excessive runs and TLEs.',
    'Impulsive compiler test running. You trigger runs within 30s of error codes without tracing.',
    'Failing to ignore negative sub-ranges (Binary Tree Path Sum).',
  ],
  recommendations: [
    {
      category: 'DP',
      count: 3,
      reason: 'You hit TLE and boundary crashes on Edit Distance. Practice memoized transitions.',
    },
    {
      category: 'Graph',
      count: 2,
      reason: 'You struggled with cyclic backtracking on Course Schedule. Solve 2 cycle detection tasks.',
    },
    {
      category: 'Array',
      count: 1,
      reason: 'Familiarize yourself with sorting preprocessing limits.',
    },
  ],
};

interface CreateSessionBody {
  problemTitle?: string;
  difficulty?: string;
  status?: string;
  totalDuration?: number;
}

// Routes
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

fastify.get<{ Querystring: { email?: string } }>('/api/sessions', async (req) => {
  try {
    const email = req.query.email;
    const sessions = await prisma.session.findMany({
      where: email ? {
        user: {
          email: email
        }
      } : undefined,
      include: {
        analyses: {
          select: {
            overallScore: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return sessions.map(s => ({
      id: s.id,
      problemTitle: s.problemTitle,
      difficulty: s.difficulty,
      status: s.status,
      solveTime: Math.round(s.totalDuration / 60),
      score: s.analyses[0]?.overallScore ?? 75,
      date: s.createdAt.toISOString().split('T')[0]
    }));
  } catch (error) {
    fastify.log.error(error);
    return MOCK_SESSIONS;
  }
});

fastify.get<{ Params: { id: string } }>('/api/sessions/:id', async (req) => {
  try {
    const s = await prisma.session.findUnique({
      where: { id: req.params.id },
      include: {
        events: true,
        snapshots: true,
        analyses: {
          include: {
            recommendations: true
          }
        }
      }
    });
    if (!s) {
      throw new Error('Session not found');
    }
    return {
      id: s.id,
      problemTitle: s.problemTitle,
      problemSlug: s.problemSlug,
      difficulty: s.difficulty,
      status: s.status,
      solveTime: Math.round(s.totalDuration / 60),
      score: s.analyses[0]?.overallScore ?? 75,
      date: s.createdAt.toISOString().split('T')[0],
      startTime: s.startTime.toISOString().substring(11, 16),
      endTime: s.endTime.toISOString().substring(11, 16),
      metrics: {
        readingDuration: Math.round(s.readingDuration / 60),
        codingDuration: Math.round(s.codingDuration / 60),
        debuggingDuration: Math.round(s.debuggingDuration / 60),
        totalDuration: Math.round(s.totalDuration / 60),
        runCount: s.runCount,
        submissionCount: s.submissionCount,
        acceptanceRate: Math.round((s.runCount / (s.submissionCount || 1)) * 100),
        errorCount: s.runCount - s.submissionCount
      }
    };
  } catch (error) {
    fastify.log.error(error);
    const session = MOCK_SESSIONS.find((s) => s.id === req.params.id);
    if (!session) {
      throw new Error('Session not found');
    }
    return session;
  }
});

fastify.get<{ Params: { id: string } }>(
  '/api/sessions/:id/analysis',
  async (req) => {
    try {
      const analysis = await prisma.analysis.findFirst({
        where: { sessionId: req.params.id },
        include: {
          recommendations: true
        }
      });
      if (!analysis) {
        return MOCK_ANALYSIS;
      }
      return {
        score: {
          overall: analysis.overallScore,
          planning: analysis.planningScore,
          implementation: analysis.implementationScore,
          debugging: analysis.debuggingScore,
          optimization: analysis.optimizationScore,
          confidence: analysis.confidenceScore,
        },
        summary: analysis.summary,
        strengths: JSON.parse(analysis.strengths),
        weaknesses: JSON.parse(analysis.weaknesses),
        recommendations: analysis.recommendations.map(r => ({
          category: r.category,
          count: r.count,
          reason: r.reason
        }))
      };
    } catch (error) {
      return MOCK_ANALYSIS;
    }
  }
);

fastify.post<{ Body: SessionPayload }>('/api/sessions', async (req, reply) => {
  try {
    const payload = req.body;
    
    // 1. Find or create user
    const email = payload.email || 'test@codelens.dev';
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { email } });
    }

    // 2. Create Session in Database
    const problemTitle = payload.problemTitle || 'New Problem';
    const problemSlug = problemTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        problemTitle,
        problemSlug,
        problemUrl: payload.problemUrl || '',
        platform: payload.platform || 'LEETCODE',
        difficulty: payload.difficulty || 'Medium',
        tags: JSON.stringify(payload.tags || []),
        language: payload.language || 'C++',
        startTime: new Date(payload.startTime || new Date()),
        endTime: new Date(payload.endTime || new Date()),
        status: payload.status || 'Solved',
        readingDuration: payload.summary?.readingDuration || 0,
        codingDuration: payload.summary?.codingDuration || 0,
        debuggingDuration: payload.summary?.debuggingDuration || 0,
        totalDuration: payload.summary?.totalDuration || 0,
        runCount: payload.summary?.runCount || 0,
        submissionCount: payload.summary?.submissionCount || 0,
      }
    });

    // 3. Create Session Events
    if (payload.events && Array.isArray(payload.events)) {
      for (const e of payload.events) {
        await prisma.sessionEvent.create({
          data: {
            sessionId: session.id,
            eventType: e.eventType,
            timestamp: new Date(e.timestamp || new Date()),
            details: e.details ? JSON.stringify(e.details) : null
          }
        });
      }
    }

    // 4. Create Code Snapshots
    if (payload.snapshots && Array.isArray(payload.snapshots)) {
      for (const s of payload.snapshots) {
        await prisma.codeSnapshot.create({
          data: {
            sessionId: session.id,
            snapshotNumber: s.snapshotNumber,
            trigger: s.trigger,
            verdict: s.verdict || null,
            code: s.code || '',
            timestamp: new Date(s.timestamp || new Date()),
            runNumber: s.runNumber || 0,
            submissionNumber: s.submissionNumber || 0,
            executionTime: s.executionTime || null,
            memoryUsed: s.memoryUsed || null
          }
        });
      }
    }

    // 5. Trigger Rule Engine & AI analysis
    const features = {
      readingDuration: payload.summary?.readingDuration || 0,
      codingDuration: payload.summary?.codingDuration || 0,
      debuggingDuration: payload.summary?.debuggingDuration || 0,
      totalDuration: payload.summary?.totalDuration || 0,
      codeRunCount: payload.summary?.runCount || 0,
      submissionCount: payload.summary?.submissionCount || 0,
      errorCount: 0,
      acceptanceRate: payload.summary?.submissionCount > 0 ? (payload.summary.runCount / payload.summary.submissionCount) * 100 : 0
    };

    const analysisResult = await analyzeSession({
      problemTitle: session.problemTitle,
      difficulty: session.difficulty as any,
      features: features as any,
      codeSnapshots: (payload.snapshots || []).map((s: any) => ({ code: s.code, timestamp: new Date(s.timestamp) })),
      userId: user.id
    });

    // 6. Save Analysis Result to Database
    const analysis = await prisma.analysis.create({
      data: {
        sessionId: session.id,
        analysisVersion: '1.0.0',
        model: 'gemini-fallback',
        overallScore: analysisResult.score.overall,
        planningScore: analysisResult.score.planning,
        implementationScore: analysisResult.score.implementation,
        debuggingScore: analysisResult.score.debugging,
        optimizationScore: analysisResult.score.optimization,
        confidenceScore: analysisResult.score.confidence,
        summary: analysisResult.summary,
        strengths: JSON.stringify(analysisResult.strengths),
        weaknesses: JSON.stringify(analysisResult.weaknesses)
      }
    });

    if (analysisResult.recommendations && Array.isArray(analysisResult.recommendations)) {
      for (const rec of analysisResult.recommendations) {
        await prisma.recommendation.create({
          data: {
            analysisId: analysis.id,
            category: rec.category,
            count: rec.count,
            reason: rec.reason
          }
        });
      }
    }

    return reply.status(201).send({
      id: session.id,
      message: 'Session created and analyzed successfully',
    });
  } catch (error) {
    fastify.log.error(error);
    return reply.status(400).send({
      error: (error as Error).message || 'Invalid request',
    });
  }
});

fastify.post<{ Params: { id: string } }>(
  '/api/sessions/:id/analyze',
  async (req, reply) => {
    try {
      return reply.status(201).send(MOCK_ANALYSIS);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        error: 'Analysis failed',
      });
    }
  }
);

// Error handling
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  reply.status(500).send({
    error: error.message || 'Internal server error',
  });
});

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || process.env.API_PORT || '3000', 10);
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`:white_check_mark: API running at localhost:${port}`);
    console.log(':memo: Using mock data (Prisma database not initialized)');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();