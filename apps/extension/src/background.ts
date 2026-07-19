// CodeLens Background Service Worker
import { CodeSnapshot, SessionEvent, SessionPayload } from '@codelens/shared';

interface ActiveSession {
  email: string;
  problemTitle: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  language: string;
  startTime: string;
  runCount: number;
  submissionCount: number;
  events: SessionEvent[];
  snapshots: CodeSnapshot[];
}

let activeSession: ActiveSession | null = null;

// Periodically update active session duration in storage if active
setInterval(async () => {
  if (activeSession) {
    const elapsedSeconds = Math.round((new Date().getTime() - new Date(activeSession.startTime).getTime()) / 1000);
    await chrome.storage.local.set({
      trackingState: 'TRACKING',
      elapsedSeconds,
      problemTitle: activeSession.problemTitle,
      runCount: activeSession.runCount,
      language: activeSession.language
    });
  } else {
    await chrome.storage.local.set({ trackingState: 'IDLE' });
  }
}, 1000);

// Message Handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action, payload } = message;

  if (action === 'SESSION_START') {
    activeSession = {
      email: payload.email || 'test@codelens.dev',
      problemTitle: payload.problemTitle,
      difficulty: payload.difficulty || 'Medium',
      tags: payload.tags || ['Array'],
      language: payload.language || 'C++',
      startTime: new Date().toISOString(),
      runCount: 0,
      submissionCount: 0,
      events: [{ eventType: 'OPEN_PROBLEM', timestamp: new Date().toISOString() }],
      snapshots: []
    };
    chrome.storage.local.set({ trackingState: 'TRACKING' });
    console.log('[Background] Active session started:', activeSession.problemTitle);
    sendResponse({ status: 'started' });
  }

  else if (action === 'EVENT_RECORD') {
    if (activeSession) {
      const { eventType, details } = payload;
      activeSession.events.push({
        eventType,
        timestamp: new Date().toISOString(),
        details
      });
      if (eventType === 'RUN') activeSession.runCount++;
      if (eventType === 'SUBMIT') activeSession.submissionCount++;
      console.log('[Background] Event recorded:', eventType);
      sendResponse({ status: 'recorded' });
    }
  }

  else if (action === 'SNAPSHOT_RECORD') {
    if (activeSession) {
      const { trigger, verdict, code } = payload;
      const snapshotNumber = activeSession.snapshots.length + 1;

      const newSnapshot: CodeSnapshot = {
        snapshotNumber,
        trigger,
        verdict,
        code,
        timestamp: new Date().toISOString(),
        runNumber: activeSession.runCount,
        submissionNumber: activeSession.submissionCount,
        executionTime: payload.executionTime || 'N/A',
        memoryUsed: payload.memoryUsed || 'N/A'
      };

      activeSession.snapshots.push(newSnapshot);
      console.log('[Background] Code Snapshot added. Total:', activeSession.snapshots.length);
      sendResponse({ status: 'snapshot_added' });
    }
  }

  else if (action === 'SESSION_FINISH') {
    if (activeSession) {
      const endTime = new Date().toISOString();
      const status = payload.status || 'Solved';

      // Add final LEAVE_PAGE or ACCEPTED event if not present
      activeSession.events.push({
        eventType: status === 'Solved' ? 'ACCEPTED' : 'LEAVE_PAGE',
        timestamp: endTime
      });

      // Calculate final durations
      const totalDuration = Math.round((new Date(endTime).getTime() - new Date(activeSession.startTime).getTime()) / 1000);

      // Estimate times
      const readingDuration = Math.min(180, Math.round(totalDuration * 0.15));
      const codingDuration = Math.round(totalDuration * 0.5);
      const debuggingDuration = Math.max(0, totalDuration - readingDuration - codingDuration);

      const finalPayload: SessionPayload = {
        email: activeSession.email,
        problemTitle: activeSession.problemTitle,
        difficulty: activeSession.difficulty,
        tags: activeSession.tags,
        language: activeSession.language,
        startTime: activeSession.startTime,
        endTime,
        status,
        summary: {
          readingDuration,
          codingDuration,
          debuggingDuration,
          totalDuration,
          runCount: activeSession.runCount,
          submissionCount: activeSession.submissionCount
        },
        events: activeSession.events,
        snapshots: activeSession.snapshots
      };

      // Get API URL from storage and upload to Fastify server
      chrome.storage.local.get(['apiUrl'], (data) => {
        const baseUrl = data.apiUrl || 'http://localhost:3000';
        const url = `${baseUrl.replace(/\/$/, '')}/api/sessions`;
        
        console.log('[Background] Finishing session and uploading. Destination:', url);

        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(finalPayload)
        })
        .then(res => res.json())
        .then(data => {
          console.log('[Background] Upload successful:', data);
          activeSession = null;
          chrome.storage.local.set({ trackingState: 'IDLE' });
          sendResponse({ success: true, response: data });
        })
        .catch(err => {
          console.error('[Background] Upload failed:', err);
          // Save to local storage for retry/recovery
          chrome.storage.local.set({ pendingUpload: finalPayload });
          activeSession = null;
          chrome.storage.local.set({ trackingState: 'IDLE' });
          sendResponse({ success: false, error: String(err) });
        });
      });

      return true; // Keep channel open for async response
    } else {
      sendResponse({ error: 'No active session to finish' });
    }
  }

  // Simulation handler directly triggered by popup
  else if (action === 'SIMULATE_SESSION') {
    const simType = payload.type || 'dp';
    const email = payload.email || 'test@codelens.dev';
    console.log('[Background] Injecting simulated session:', simType, 'for', email);

    // Call inject helper
    simulateInjectedSession(simType, email)
      .then(data => sendResponse({ success: true, data }))
      .catch(err => sendResponse({ success: false, error: String(err) }));

    return true; // Keep channel open
  }

  return false;
});

/**
 * Injects a mock session into the API server to mimic leetcode activity.
 */
async function simulateInjectedSession(type: string, email: string) {
  let problemTitle = 'Valid Parentheses';
  let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Easy';
  let tags = ['Stack', 'String'];
  let language = 'Python';
  let duration = 300; // 5 minutes

  if (type === 'dp') {
    problemTitle = 'Edit Distance';
    difficulty = 'Hard';
    tags = ['Dynamic Programming', 'String'];
    language = 'C++';
    duration = 4200; // 70 minutes
  } else if (type === 'graph') {
    problemTitle = 'Course Schedule';
    difficulty = 'Medium';
    tags = ['Graph', 'BFS', 'Topological Sort'];
    language = 'Python';
    duration = 2160; // 36 minutes
  }

  const startTime = new Date();
  startTime.setSeconds(startTime.getSeconds() - duration);
  const endTime = new Date();

  // Construct events timeline
  const events: SessionEvent[] = [
    { eventType: 'OPEN_PROBLEM', timestamp: startTime.toISOString() },
    { eventType: 'START_TYPING', timestamp: new Date(startTime.getTime() + 60000).toISOString() }
  ];

  const snapshots: CodeSnapshot[] = [];

  if (type === 'dp') {
    // DP fail logs
    events.push({ eventType: 'RUN', timestamp: new Date(startTime.getTime() + 600000).toISOString() });
    events.push({ eventType: 'COMPILE_ERROR', timestamp: new Date(startTime.getTime() + 600020).toISOString() });

    snapshots.push({
      snapshotNumber: 1,
      trigger: 'RUN',
      verdict: 'Compile Error',
      timestamp: new Date(startTime.getTime() + 600000).toISOString(),
      code: 'class Solution {\npublic:\n    int minDistance(string word1, string word2) {\n        return solve(word1, word2, 0, 0);\n    }\n};',
      runNumber: 1,
      submissionNumber: 0
    });

    events.push({ eventType: 'SUBMIT', timestamp: new Date(startTime.getTime() + 1800000).toISOString() });
    events.push({ eventType: 'TLE', timestamp: new Date(startTime.getTime() + 1800040).toISOString() });

    snapshots.push({
      snapshotNumber: 2,
      trigger: 'SUBMIT',
      verdict: 'TLE',
      timestamp: new Date(startTime.getTime() + 1800000).toISOString(),
      code: 'class Solution {\npublic:\n    int minDistance(string word1, string word2) {\n        // Brute force recursive without memoization\n        return solve(word1, word2);\n    }\n};',
      runNumber: 2,
      submissionNumber: 1
    });

    events.push({ eventType: 'SUBMIT', timestamp: new Date(endTime.getTime() - 20000).toISOString() });
    events.push({ eventType: 'ACCEPTED', timestamp: endTime.toISOString() });

    snapshots.push({
      snapshotNumber: 3,
      trigger: 'SUBMIT',
      verdict: 'Accepted',
      timestamp: new Date(endTime.getTime() - 20000).toISOString(),
      code: 'class Solution {\npublic:\n    int minDistance(string word1, string word2) {\n        int m = word1.length(), n = word2.length();\n        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));\n        // dp matrix code...\n        return dp[m][n];\n    }\n};',
      runNumber: 3,
      submissionNumber: 2
    });
  } else {
    // Normal fast solve
    events.push({ eventType: 'RUN', timestamp: new Date(startTime.getTime() + 120000).toISOString() });
    events.push({ eventType: 'ACCEPTED', timestamp: new Date(startTime.getTime() + 120020).toISOString() });

    snapshots.push({
      snapshotNumber: 1,
      trigger: 'RUN',
      verdict: 'Accepted',
      timestamp: new Date(startTime.getTime() + 120000).toISOString(),
      code: '# BFS standard traversal\nclass Solution:\n    def canFinish(self, num: int, pre: List) -> bool:\n        return True',
      runNumber: 1,
      submissionNumber: 0
    });

    events.push({ eventType: 'SUBMIT', timestamp: new Date(endTime.getTime() - 10000).toISOString() });
    events.push({ eventType: 'ACCEPTED', timestamp: endTime.toISOString() });

    snapshots.push({
      snapshotNumber: 2,
      trigger: 'SUBMIT',
      verdict: 'Accepted',
      timestamp: new Date(endTime.getTime() - 10000).toISOString(),
      code: '# BFS standard traversal\nclass Solution:\n    def canFinish(self, num: int, pre: List) -> bool:\n        return True',
      runNumber: 1,
      submissionNumber: 1
    });
  }

  const payload: SessionPayload = {
    email,
    problemTitle,
    difficulty,
    tags,
    language,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    status: type === 'dp' ? 'Solved' : 'Solved',
    summary: {
      readingDuration: Math.round(duration * 0.15),
      codingDuration: Math.round(duration * 0.6),
      debuggingDuration: Math.round(duration * 0.25),
      totalDuration: duration,
      runCount: snapshots.filter(s => s.trigger === 'RUN').length,
      submissionCount: snapshots.filter(s => s.trigger === 'SUBMIT').length
    },
    events,
    snapshots
  };

  const stored = await chrome.storage.local.get(['apiUrl']);
  const baseUrl = stored.apiUrl || 'http://localhost:3000';
  const url = `${baseUrl.replace(/\/$/, '')}/api/sessions`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return response.json();
}