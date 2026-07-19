import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const USER_EMAIL = 'test@codelens.dev';

async function main() {
  console.log('[Seed] Wiping existing data...');
  await prisma.user.deleteMany({ where: { email: USER_EMAIL } }).catch(() => {});

  console.log('[Seed] Creating test user...');
  const user = await prisma.user.create({
    data: {
      email: USER_EMAIL
    }
  });

  const now = new Date('2026-07-17T12:00:00Z');

  // Helper to subtract days
  const dateAgo = (days: number, hoursOffset = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    d.setHours(d.getHours() + hoursOffset);
    return d;
  };

  const sessionsData = [
    {
      problemTitle: 'Two Sum',
      difficulty: 'Easy',
      tags: ['Array', 'HashMap'],
      language: 'C++',
      startTime: dateAgo(9, -2),
      endTime: dateAgo(9, -1.9), // 6 minutes
      status: 'Solved',
      readingDuration: 90,
      codingDuration: 180,
      debuggingDuration: 90,
      totalDuration: 360,
      runCount: 1,
      submissionCount: 1,
      snapshots: [
        {
          snapshotNumber: 1,
          trigger: 'RUN',
          verdict: 'Accepted',
          code: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> mp;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (mp.count(complement)) {
                return {mp[complement], i};
            }
            mp[nums[i]] = i;
        }
        return {};
    }
};`,
          timestamp: dateAgo(9, -1.95),
          runNumber: 1,
          submissionNumber: 0,
          executionTime: '8ms',
          memoryUsed: '10.8MB'
        },
        {
          snapshotNumber: 2,
          trigger: 'SUBMIT',
          verdict: 'Accepted',
          code: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> mp;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (mp.count(complement)) {
                return {mp[complement], i};
            }
            mp[nums[i]] = i;
        }
        return {};
    }
};`,
          timestamp: dateAgo(9, -1.9),
          runNumber: 1,
          submissionNumber: 1,
          executionTime: '4ms',
          memoryUsed: '10.8MB'
        }
      ],
      events: [
        { eventType: 'OPEN_PROBLEM', offsetSeconds: 0 },
        { eventType: 'START_TYPING', offsetSeconds: 90 },
        { eventType: 'RUN', offsetSeconds: 270 },
        { eventType: 'ACCEPTED', offsetSeconds: 280 },
        { eventType: 'SUBMIT', offsetSeconds: 350 },
        { eventType: 'ACCEPTED', offsetSeconds: 360 }
      ],
      analysis: {
        overallScore: 94,
        planningScore: 95,
        implementationScore: 92,
        debuggingScore: 100,
        optimizationScore: 90,
        confidenceScore: 95,
        summary: 'Excellent session. You solved the problem in record time (6 mins) with an optimal O(N) hash map strategy. Your reading planning phase was concise but successful. No syntax errors or logical debugging loops needed.',
        strengths: ['Optimal Data Structure Selection', 'Flawless syntax run', 'Clean logic'],
        weaknesses: [],
        recommendations: [
          { category: 'HashMap', count: 1, reason: 'Excellent work. Maintain consistency on hash problems.' }
        ]
      }
    },
    {
      problemTitle: '3Sum',
      difficulty: 'Medium',
      tags: ['Array', 'Two Pointers', 'Sorting'],
      language: 'Python',
      startTime: dateAgo(8, -1),
      endTime: dateAgo(8, -0.6), // 24 minutes
      status: 'Solved',
      readingDuration: 180,
      codingDuration: 720,
      debuggingDuration: 540,
      totalDuration: 1440,
      runCount: 4,
      submissionCount: 2,
      snapshots: [
        {
          snapshotNumber: 1,
          trigger: 'RUN',
          verdict: 'Wrong Answer',
          code: `class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        res = []
        for i in range(len(nums)):
            l, r = i + 1, len(nums) - 1
            while l < r:
                s = nums[i] + nums[l] + nums[r]
                if s == 0:
                    res.append([nums[i], nums[l], nums[r]])
                    l += 1
                    r -= 1
                elif s < 0:
                    l += 1
                else:
                    r -= 1
        return res`,
          timestamp: dateAgo(8, -0.85),
          runNumber: 1,
          submissionNumber: 0,
          executionTime: 'N/A',
          memoryUsed: 'N/A'
        },
        {
          snapshotNumber: 2,
          trigger: 'RUN',
          verdict: 'Wrong Answer',
          code: `class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        res = []
        for i in range(len(nums)):
            if i > 0 and nums[i] == nums[i-1]:
                continue
            l, r = i + 1, len(nums) - 1
            while l < r:
                s = nums[i] + nums[l] + nums[r]
                if s == 0:
                    res.append([nums[i], nums[l], nums[r]])
                    l += 1
                    r -= 1
                elif s < 0:
                    l += 1
                else:
                    r -= 1
        return res`,
          timestamp: dateAgo(8, -0.75),
          runNumber: 2,
          submissionNumber: 0,
          executionTime: 'N/A',
          memoryUsed: 'N/A'
        },
        {
          snapshotNumber: 3,
          trigger: 'SUBMIT',
          verdict: 'Wrong Answer',
          code: `class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        res = []
        for i in range(len(nums)):
            if i > 0 and nums[i] == nums[i-1]:
                continue
            l, r = i + 1, len(nums) - 1
            while l < r:
                s = nums[i] + nums[l] + nums[r]
                if s == 0:
                    res.append([nums[i], nums[l], nums[r]])
                    while l < r and nums[l] == nums[l+1]:
                        l += 1
                    while l < r and nums[r] == nums[r-1]:
                        r -= 1
                    l += 1
                    r -= 1
                elif s < 0:
                    l += 1
                else:
                    r -= 1
        return res`,
          timestamp: dateAgo(8, -0.65),
          runNumber: 3,
          submissionNumber: 1,
          executionTime: 'N/A',
          memoryUsed: 'N/A'
        },
        {
          snapshotNumber: 4,
          trigger: 'SUBMIT',
          verdict: 'Accepted',
          code: `class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        res = []
        for i in range(len(nums) - 2):
            if i > 0 and nums[i] == nums[i-1]:
                continue
            l, r = i + 1, len(nums) - 1
            while l < r:
                s = nums[i] + nums[l] + nums[r]
                if s == 0:
                    res.append([nums[i], nums[l], nums[r]])
                    while l < r and nums[l] == nums[l+1]:
                        l += 1
                    while l < r and nums[r] == nums[r-1]:
                        r -= 1
                    l += 1
                    r -= 1
                elif s < 0:
                    l += 1
                else:
                    r -= 1
        return res`,
          timestamp: dateAgo(8, -0.6),
          runNumber: 4,
          submissionNumber: 2,
          executionTime: '584ms',
          memoryUsed: '19.2MB'
        }
      ],
      events: [
        { eventType: 'OPEN_PROBLEM', offsetSeconds: 0 },
        { eventType: 'START_TYPING', offsetSeconds: 180 },
        { eventType: 'RUN', offsetSeconds: 900 },
        { eventType: 'WRONG_ANSWER', offsetSeconds: 920 },
        { eventType: 'RUN', offsetSeconds: 1080 },
        { eventType: 'WRONG_ANSWER', offsetSeconds: 1100 },
        { eventType: 'SUBMIT', offsetSeconds: 1260 },
        { eventType: 'WRONG_ANSWER', offsetSeconds: 1280 },
        { eventType: 'SUBMIT', offsetSeconds: 1420 },
        { eventType: 'ACCEPTED', offsetSeconds: 1440 }
      ],
      analysis: {
        overallScore: 78,
        planningScore: 85,
        implementationScore: 75,
        debuggingScore: 72,
        optimizationScore: 82,
        confidenceScore: 90,
        summary: 'You understood the algorithm (Two Pointers) but struggled with duplicate edge cases. In Run #1, you had duplicates in the answer set. In Run #2, you skipped duplicate pivots but not duplicate left/right boundaries. Finally, in Submit #2, you restricted the range correctly. Take care of duplicates early in the planning phase.',
        strengths: ['Optimal algorithm selection (Two pointers)', 'Good time complexity awareness'],
        weaknesses: ['Failed to address edge cases (duplicates) early', 'Submit without dry-run on duplicates'],
        recommendations: [
          { category: 'Two Pointers', count: 3, reason: 'Practice 3 Two Pointer problems focusing on deduplication steps.' }
        ]
      }
    },
    {
      problemTitle: 'Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      tags: ['String', 'Sliding Window', 'HashMap'],
      language: 'Java',
      startTime: dateAgo(6, -3),
      endTime: dateAgo(6, -2.7), // 18 minutes
      status: 'Solved',
      readingDuration: 210,
      codingDuration: 600,
      debuggingDuration: 270,
      totalDuration: 1080,
      runCount: 2,
      submissionCount: 1,
      snapshots: [
        {
          snapshotNumber: 1,
          trigger: 'RUN',
          verdict: 'Accepted',
          code: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        int[] count = new int[128];
        int l = 0, r = 0;
        int maxLen = 0;
        while (r < s.length()) {
            char rc = s.charAt(r);
            count[rc]++;
            while (count[rc] > 1) {
                char lc = s.charAt(l);
                count[lc]--;
                l++;
            }
            maxLen = Math.max(maxLen, r - l + 1);
            r++;
        }
        return maxLen;
    }
}`,
          timestamp: dateAgo(6, -2.75),
          runNumber: 2,
          submissionNumber: 0,
          executionTime: '2ms',
          memoryUsed: '41.2MB'
        },
        {
          snapshotNumber: 2,
          trigger: 'SUBMIT',
          verdict: 'Accepted',
          code: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        int[] count = new int[128];
        int l = 0, r = 0;
        int maxLen = 0;
        while (r < s.length()) {
            char rc = s.charAt(r);
            count[rc]++;
            while (count[rc] > 1) {
                char lc = s.charAt(l);
                count[lc]--;
                l++;
            }
            maxLen = Math.max(maxLen, r - l + 1);
            r++;
        }
        return maxLen;
    }
}`,
          timestamp: dateAgo(6, -2.7),
          runNumber: 2,
          submissionNumber: 1,
          executionTime: '2ms',
          memoryUsed: '41.2MB'
        }
      ],
      events: [
        { eventType: 'OPEN_PROBLEM', offsetSeconds: 0 },
        { eventType: 'START_TYPING', offsetSeconds: 210 },
        { eventType: 'RUN', offsetSeconds: 810 },
        { eventType: 'ACCEPTED', offsetSeconds: 830 },
        { eventType: 'SUBMIT', offsetSeconds: 1060 },
        { eventType: 'ACCEPTED', offsetSeconds: 1080 }
      ],
      analysis: {
        overallScore: 92,
        planningScore: 90,
        implementationScore: 95,
        debuggingScore: 92,
        optimizationScore: 90,
        confidenceScore: 88,
        summary: 'Excellent use of sliding window with array-based frequency map. High score across the board. You planned well before typing, which resulted in zero wrong answers.',
        strengths: ['Effective sliding window setup', 'Optimized space complexity using fixed array'],
        weaknesses: [],
        recommendations: [
          { category: 'Sliding Window', count: 2, reason: 'Strengthen sliding window concepts on Hard problems.' }
        ]
      }
    },
    {
      problemTitle: 'Edit Distance',
      difficulty: 'Hard',
      tags: ['Dynamic Programming', 'String'],
      language: 'C++',
      startTime: dateAgo(4, -1),
      endTime: dateAgo(4, 0.16), // 70 minutes
      status: 'Solved',
      readingDuration: 120,
      codingDuration: 1080, // 18m
      debuggingDuration: 3000, // 50m
      totalDuration: 4200,
      runCount: 9,
      submissionCount: 4,
      snapshots: [
        {
          snapshotNumber: 1,
          trigger: 'RUN',
          verdict: 'Compile Error',
          code: `class Solution {
public:
    int minDistance(string word1, string word2) {
        // Brute force recursive attempt
        return solve(word1, word2, 0, 0);
    }

    int solve(string& w1, string& w2, int i, int j) {
        if (i == w1.length()) return w2.length() - j;
        if (j == w2.length()) return w1.length() - i;

        if (w1[i] == w2[j]) return solve(w1, w2, i + 1, j + 1);

        int ins = 1 + solve(w1, w2, i, j + 1);
        int del = 1 + solve(w1, w2, i + 1, j);
        int rep = 1 + solve(w1, w2, i + 1, j + 1);
        return min({ins, del, rep});
    }
};`, // forgot helper declaration scope
          timestamp: dateAgo(4, -0.7),
          runNumber: 1,
          submissionNumber: 0,
          executionTime: 'N/A',
          memoryUsed: 'N/A'
        },
        {
          snapshotNumber: 2,
          trigger: 'RUN',
          verdict: 'Accepted',
          code: `class Solution {
public:
    int minDistance(string word1, string word2) {
        return solve(word1, word2, 0, 0);
    }

    int solve(string& w1, string& w2, int i, int j) {
        if (i == w1.length()) return w2.length() - j;
        if (j == w2.length()) return w1.length() - i;

        if (w1[i] == w2[j]) return solve(w1, w2, i + 1, j + 1);

        int ins = 1 + solve(w1, w2, i, j + 1);
        int del = 1 + solve(w1, w2, i + 1, j);
        int rep = 1 + solve(w1, w2, i + 1, j + 1);
        return min(ins, min(del, rep));
    }
};`, // compiles now, but O(3^(M+N)) brute force
          timestamp: dateAgo(4, -0.6),
          runNumber: 2,
          submissionNumber: 0,
          executionTime: '2ms',
          memoryUsed: '6.4MB'
        },
        {
          snapshotNumber: 3,
          trigger: 'SUBMIT',
          verdict: 'TLE',
          code: `class Solution {
public:
    int minDistance(string word1, string word2) {
        return solve(word1, word2, 0, 0);
    }

    int solve(string& w1, string& w2, int i, int j) {
        if (i == w1.length()) return w2.length() - j;
        if (j == w2.length()) return w1.length() - i;

        if (w1[i] == w2[j]) return solve(w1, w2, i + 1, j + 1);

        int ins = 1 + solve(w1, w2, i, j + 1);
        int del = 1 + solve(w1, w2, i + 1, j);
        int rep = 1 + solve(w1, w2, i + 1, j + 1);
        return min(ins, min(del, rep));
    }
};`, // TLE due to complexity
          timestamp: dateAgo(4, -0.4),
          runNumber: 4,
          submissionNumber: 1,
          executionTime: 'Timeout',
          memoryUsed: 'N/A'
        },
        {
          snapshotNumber: 4,
          trigger: 'RUN',
          verdict: 'Wrong Answer',
          code: `class Solution {
public:
    int minDistance(string word1, string word2) {
        vector<vector<int>> memo(word1.length() + 1, vector<int>(word2.length() + 1, -1));
        return solve(word1, word2, 0, 0, memo);
    }

    int solve(string& w1, string& w2, int i, int j, vector<vector<int>>& memo) {
        if (i == w1.length()) return w2.length() - j;
        if (j == w2.length()) return w1.length() - i;
        if (memo[i][j] != -1) return memo[i][j];

        if (w1[i] == w2[j]) return memo[i][j] = solve(w1, w2, i + 1, j + 1, memo);

        int ins = 1 + solve(w1, w2, i, j + 1, memo);
        int del = 1 + solve(w1, w2, i + 1, j, memo);
        int rep = 1 + solve(w1, w2, i + 1, j + 1, memo);
        return memo[i][j] = min(ins, min(del, rep));
    }
};`, // bug: initialized size of memo incorrectly
          timestamp: dateAgo(4, 0.05),
          runNumber: 7,
          submissionNumber: 2,
          executionTime: 'Crash',
          memoryUsed: 'N/A'
        },
        {
          snapshotNumber: 5,
          trigger: 'SUBMIT',
          verdict: 'Accepted',
          code: `class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.length(), n = word2.length();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1[i-1] == word2[j-1]) {
                    dp[i][j] = dp[i-1][j-1];
                } else {
                    dp[i][j] = 1 + min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});
                }
            }
        }
        return dp[m][n];
    }
};`, // Optimal bottom-up DP solve
          timestamp: dateAgo(4, 0.16),
          runNumber: 9,
          submissionNumber: 4,
          executionTime: '8ms',
          memoryUsed: '9.2MB'
        }
      ],
      events: [
        { eventType: 'OPEN_PROBLEM', offsetSeconds: 0 },
        { eventType: 'START_TYPING', offsetSeconds: 120 },
        { eventType: 'RUN', offsetSeconds: 1200 }, // Compile Error
        { eventType: 'COMPILE_ERROR', offsetSeconds: 1220 },
        { eventType: 'RUN', offsetSeconds: 1440 }, // Compile pass, WA brute
        { eventType: 'WRONG_ANSWER', offsetSeconds: 1460 },
        { eventType: 'SUBMIT', offsetSeconds: 2160 }, // TLE
        { eventType: 'TLE', offsetSeconds: 2200 },
        { eventType: 'RUN', offsetSeconds: 3780 }, // Runtime error size
        { eventType: 'RUNTIME_ERROR', offsetSeconds: 3800 },
        { eventType: 'SUBMIT', offsetSeconds: 4180 }, // Accepted
        { eventType: 'ACCEPTED', offsetSeconds: 4200 }
      ],
      analysis: {
        overallScore: 56,
        planningScore: 40,
        implementationScore: 52,
        debuggingScore: 48,
        optimizationScore: 45,
        confidenceScore: 92,
        summary: 'Severe struggles with DP complexity constraints. You jumped directly to building a brute-force recursive tree (3^N) instead of building a state matrix. You hit compile errors and then a critical TLE. In the second half, you attempted memoization but crashed due to out-of-bound vector sizing. You finally rewrote it bottom-up. Focus on drawing the state matrix beforehand.',
        strengths: ['Persistent debugging', 'Successfully identified state subproblems'],
        weaknesses: ['Inefficient brute-force start (TLE)', 'Out of bound array dimensions', 'Overly fast editing on failures'],
        recommendations: [
          { category: 'DP', count: 4, reason: 'You hit TLE and boundary crashes on DP. Solve 4 DP Tabulation questions.' }
        ]
      }
    },
    {
      problemTitle: 'Course Schedule',
      difficulty: 'Medium',
      tags: ['Graph', 'BFS', 'Topological Sort'],
      language: 'Python',
      startTime: dateAgo(3, -2),
      endTime: dateAgo(3, -1.4), // 36 minutes
      status: 'Solved',
      readingDuration: 300,
      codingDuration: 1200,
      debuggingDuration: 660,
      totalDuration: 2160,
      runCount: 3,
      submissionCount: 1,
      snapshots: [
        {
          snapshotNumber: 1,
          trigger: 'RUN',
          verdict: 'Wrong Answer',
          code: `class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        adj = {i: [] for i in range(numCourses)}
        for dest, src in prerequisites:
            adj[src].append(dest)

        visited = set()
        def dfs(node):
            if node in visited:
                return False
            visited.add(node)
            for neighbor in adj[node]:
                if not dfs(neighbor):
                    return False
            return True

        for i in range(numCourses):
            if not dfs(i):
                return False
        return True`, // Missing backtracking on visited (checking global visited rather than path visited)
          timestamp: dateAgo(3, -1.7),
          runNumber: 1,
          submissionNumber: 0,
          executionTime: 'N/A',
          memoryUsed: 'N/A'
        },
        {
          snapshotNumber: 2,
          trigger: 'SUBMIT',
          verdict: 'Accepted',
          code: `class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        adj = {i: [] for i in range(numCourses)}
        for dest, src in prerequisites:
            adj[src].append(dest)

        visited = [0] * numCourses # 0=unvisited, 1=visiting, 2=visited
        def dfs(node):
            if visited[node] == 1:
                return False
            if visited[node] == 2:
                return True
            visited[node] = 1
            for neighbor in adj[node]:
                if not dfs(neighbor):
                    return False
            visited[node] = 2
            return True

        for i in range(numCourses):
            if not dfs(i):
                return False
        return True`,
          timestamp: dateAgo(3, -1.4),
          runNumber: 3,
          submissionNumber: 1,
          executionTime: '92ms',
          memoryUsed: '17.6MB'
        }
      ],
      events: [
        { eventType: 'OPEN_PROBLEM', offsetSeconds: 0 },
        { eventType: 'START_TYPING', offsetSeconds: 300 },
        { eventType: 'RUN', offsetSeconds: 1500 },
        { eventType: 'WRONG_ANSWER', offsetSeconds: 1520 },
        { eventType: 'SUBMIT', offsetSeconds: 2140 },
        { eventType: 'ACCEPTED', offsetSeconds: 2160 }
      ],
      analysis: {
        overallScore: 82,
        planningScore: 88,
        implementationScore: 80,
        debuggingScore: 80,
        optimizationScore: 85,
        confidenceScore: 88,
        summary: 'Good attempt. You initially did not track cycle states properly, mislabeling the visited set. You quickly adjusted from a single set to a 3-state tracking array, successfully handling loop detection in directed graphs.',
        strengths: ['Accurate Graph adj-list translation', 'Correct choice of DFS for topological check'],
        weaknesses: ['Confused global visited with path backtracking'],
        recommendations: [
          { category: 'Graph', count: 2, reason: 'Strengthen cycle detection checks in directed vs undirected graphs.' }
        ]
      }
    },
    {
      problemTitle: 'Binary Tree Maximum Path Sum',
      difficulty: 'Hard',
      tags: ['Tree', 'DFS', 'Binary Tree'],
      language: 'C++',
      startTime: dateAgo(2, -4),
      endTime: dateAgo(2, -3.3), // 42 minutes
      status: 'Solved',
      readingDuration: 360,
      codingDuration: 1440,
      debuggingDuration: 720,
      totalDuration: 2520,
      runCount: 5,
      submissionCount: 2,
      snapshots: [
        {
          snapshotNumber: 1,
          trigger: 'RUN',
          verdict: 'Wrong Answer',
          code: `class Solution {
public:
    int maxPathSum(TreeNode* root) {
        int max_sum = 0;
        solve(root, max_sum);
        return max_sum;
    }

    int solve(TreeNode* node, int& max_sum) {
        if (!node) return 0;
        int left = solve(node->left, max_sum);
        int right = solve(node->right, max_sum);
        max_sum = max(max_sum, node->val + left + right);
        return node->val + max(left, right);
    }
};`, // bug: fails if maximum path is negative, because max_sum is initialized to 0 and we do not prune negative subtrees
          timestamp: dateAgo(2, -3.7),
          runNumber: 2,
          submissionNumber: 0,
          executionTime: 'N/A',
          memoryUsed: 'N/A'
        },
        {
          snapshotNumber: 2,
          trigger: 'SUBMIT',
          verdict: 'Accepted',
          code: `class Solution {
public:
    int maxPathSum(TreeNode* root) {
        int max_sum = INT_MIN;
        solve(root, max_sum);
        return max_sum;
    }

    int solve(TreeNode* node, int& max_sum) {
        if (!node) return 0;
        int left = max(0, solve(node->left, max_sum));
        int right = max(0, solve(node->right, max_sum));
        max_sum = max(max_sum, node->val + left + right);
        return node->val + max(left, right);
    }
};`,
          timestamp: dateAgo(2, -3.3),
          runNumber: 5,
          submissionNumber: 2,
          executionTime: '16ms',
          memoryUsed: '27.4MB'
        }
      ],
      events: [
        { eventType: 'OPEN_PROBLEM', offsetSeconds: 0 },
        { eventType: 'START_TYPING', offsetSeconds: 360 },
        { eventType: 'RUN', offsetSeconds: 1800 },
        { eventType: 'WRONG_ANSWER', offsetSeconds: 1820 },
        { eventType: 'SUBMIT', offsetSeconds: 2500 },
        { eventType: 'ACCEPTED', offsetSeconds: 2520 }
      ],
      analysis: {
        overallScore: 81,
        planningScore: 90,
        implementationScore: 78,
        debuggingScore: 82,
        optimizationScore: 80,
        confidenceScore: 85,
        summary: 'You solved this tree question with clean recursion. However, you missed the negative value edge case: initializing the global max to 0 and not ignoring negative path contributions. In step 2, you added max(0, subtree) successfully.',
        strengths: ['Clean recursive model', 'Good DFS state tracking'],
        weaknesses: ['Ignored negative values in initialization'],
        recommendations: [
          { category: 'Tree', count: 2, reason: 'Practice tree traversals with negative constraints.' }
        ]
      }
    },
    {
      problemTitle: 'Valid Parentheses',
      difficulty: 'Easy',
      tags: ['Stack', 'String'],
      language: 'Python',
      startTime: dateAgo(1, -3),
      endTime: dateAgo(1, -2.95), // 3 minutes
      status: 'Solved',
      readingDuration: 45,
      codingDuration: 120,
      debuggingDuration: 15,
      totalDuration: 180,
      runCount: 1,
      submissionCount: 1,
      snapshots: [
        {
          snapshotNumber: 1,
          trigger: 'SUBMIT',
          verdict: 'Accepted',
          code: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {")": "(", "}": "{", "]": "["}
        for char in s:
            if char in mapping:
                top_element = stack.pop() if stack else '#'
                if mapping[char] != top_element:
                    return False
            else:
                stack.append(char)
        return not stack`,
          timestamp: dateAgo(1, -2.95),
          runNumber: 1,
          submissionNumber: 1,
          executionTime: '32ms',
          memoryUsed: '16.2MB'
        }
      ],
      events: [
        { eventType: 'OPEN_PROBLEM', offsetSeconds: 0 },
        { eventType: 'START_TYPING', offsetSeconds: 45 },
        { eventType: 'SUBMIT', offsetSeconds: 170 },
        { eventType: 'ACCEPTED', offsetSeconds: 180 }
      ],
      analysis: {
        overallScore: 96,
        planningScore: 92,
        implementationScore: 98,
        debuggingScore: 100,
        optimizationScore: 95,
        confidenceScore: 90,
        summary: 'Extremely efficient solve. Standard stack implementation done correctly on the first attempt. Clean time O(N) and space O(N).',
        strengths: ['Flawless syntax', 'No unnecessary debug runs'],
        weaknesses: [],
        recommendations: [
          { category: 'Stack', count: 1, reason: 'Continue with harder string parsing stack questions.' }
        ]
      }
    },
    {
      problemTitle: 'Climbing Stairs',
      difficulty: 'Easy',
      tags: ['Dynamic Programming', 'Math'],
      language: 'Python',
      startTime: dateAgo(0, -4),
      endTime: dateAgo(0, -3.85), // 9 minutes
      status: 'Solved',
      readingDuration: 60,
      codingDuration: 360,
      debuggingDuration: 120,
      totalDuration: 540,
      runCount: 1,
      submissionCount: 1,
      snapshots: [
        {
          snapshotNumber: 1,
          trigger: 'SUBMIT',
          verdict: 'Accepted',
          code: `class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2: return n
        a, b = 1, 2
        for _ in range(3, n + 1):
            a, b = b, a + b
        return b`,
          timestamp: dateAgo(0, -3.85),
          runNumber: 1,
          submissionNumber: 1,
          executionTime: '24ms',
          memoryUsed: '16.1MB'
        }
      ],
      events: [
        { eventType: 'OPEN_PROBLEM', offsetSeconds: 0 },
        { eventType: 'START_TYPING', offsetSeconds: 60 },
        { eventType: 'SUBMIT', offsetSeconds: 530 },
        { eventType: 'ACCEPTED', offsetSeconds: 540 }
      ],
      analysis: {
        overallScore: 95,
        planningScore: 95,
        implementationScore: 95,
        debuggingScore: 100,
        optimizationScore: 92,
        confidenceScore: 90,
        summary: 'Excellent space-optimized DP solution. Instead of initializing an O(N) list, you used O(1) state variables, achieving maximum runtime speed.',
        strengths: ['O(1) memory design', 'No incorrect submissions'],
        weaknesses: [],
        recommendations: [
          { category: 'DP', count: 2, reason: 'Progress from linear DP to 2D matrix DP problems.' }
        ]
      }
    }
  ];

  console.log('[Seed] Inserting sessions, events, snapshots, and analyses...');

  for (const s of sessionsData) {
    // 1. Create Session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        problemSlug: s.problemTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        problemTitle: s.problemTitle,
        difficulty: s.difficulty,
        tags: JSON.stringify(s.tags),
        language: s.language,
        startTime: s.startTime,
        endTime: s.endTime,
        status: s.status,
        readingDuration: s.readingDuration,
        codingDuration: s.codingDuration,
        debuggingDuration: s.debuggingDuration,
        totalDuration: s.totalDuration,
        runCount: s.runCount,
        submissionCount: s.submissionCount
      }
    });

    // 2. Create Events
    for (const e of s.events) {
      const timestamp = new Date(s.startTime);
      timestamp.setSeconds(timestamp.getSeconds() + e.offsetSeconds);
      await prisma.sessionEvent.create({
        data: {
          sessionId: session.id,
          eventType: e.eventType,
          timestamp
        }
      });
    }

    // 3. Create Snapshots
    for (const snap of s.snapshots) {
      await prisma.codeSnapshot.create({
        data: {
          sessionId: session.id,
          snapshotNumber: snap.snapshotNumber,
          trigger: snap.trigger,
          verdict: snap.verdict,
          code: snap.code,
          timestamp: snap.timestamp,
          runNumber: snap.runNumber,
          submissionNumber: snap.submissionNumber,
          executionTime: snap.executionTime,
          memoryUsed: snap.memoryUsed
        }
      });
    }

    // 4. Create Analysis & Recommendations
    const analysis = await prisma.analysis.create({
      data: {
        sessionId: session.id,
        analysisVersion: '1.0.0',
        model: 'rule-engine-seeder',
        overallScore: s.analysis.overallScore,
        planningScore: s.analysis.planningScore,
        implementationScore: s.analysis.implementationScore,
        debuggingScore: s.analysis.debuggingScore,
        optimizationScore: s.analysis.optimizationScore,
        confidenceScore: s.analysis.confidenceScore,
        summary: s.analysis.summary,
        strengths: JSON.stringify(s.analysis.strengths),
        weaknesses: JSON.stringify(s.analysis.weaknesses)
      }
    });

    for (const rec of s.analysis.recommendations) {
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

  console.log('[Seed] Database populated successfully with 9 mock sessions!');
  await prisma.$disconnect();
}

main().catch(err => {
  console.error('[Seed] Error seeding db:', err);
  process.exit(1);
});