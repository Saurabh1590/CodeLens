// CodeLens LeetCode Content Script

// Keep track of counts locally
let localRunCount = 0;
let localSubCount = 0;
let timerInterval: any = null;
let secondsElapsed = 0;
let currentLanguage = 'C++';

console.log('[CodeLens] Content script injected successfully!');

// Inject a visual tracking HUD directly onto LeetCode
function injectHUD(problemTitle: string) {
  // Remove existing if any
  const existing = document.getElementById('codelens-hud');
  if (existing) existing.remove();

  const hud = document.createElement('div');
  hud.id = 'codelens-hud';
  hud.style.position = 'fixed';
  hud.style.bottom = '24px';
  hud.style.right = '24px';
  hud.style.zIndex = '99999';
  hud.style.backgroundColor = '#0B0F19';
  hud.style.border = '1px solid rgba(99, 102, 241, 0.4)';
  hud.style.borderRadius = '12px';
  hud.style.padding = '12px 16px';
  hud.style.color = '#F3F4F6';
  hud.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  hud.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px -3px rgba(99, 102, 241, 0.2)';
  hud.style.width = '240px';
  hud.style.display = 'flex';
  hud.style.flexDirection = 'column';
  hud.style.gap = '8px';

  // Build HUD safely without innerHTML interpolation (XSS prevention)
  const headerDiv = document.createElement('div');
  headerDiv.style.cssText = 'display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px;';
  const statusSpan = document.createElement('span');
  statusSpan.style.cssText = 'font-weight: bold; font-size: 13px; color: #fff; display: flex; align-items: center; gap: 6px;';
  statusSpan.textContent = '● CodeLens Active';
  const timerSpan = document.createElement('span');
  timerSpan.id = 'hud-timer';
  timerSpan.style.cssText = 'font-family: monospace; font-size: 12px; color: #A5B4FC;';
  timerSpan.textContent = '00:00';
  headerDiv.appendChild(statusSpan);
  headerDiv.appendChild(timerSpan);

  const infoDiv = document.createElement('div');
  infoDiv.style.cssText = 'font-size: 11px;';
  const titleLine = document.createElement('div');
  titleLine.style.color = '#9CA3AF';
  titleLine.textContent = 'Problem: ';
  const titleStrong = document.createElement('strong');
  titleStrong.id = 'hud-title';
  titleStrong.style.color = '#fff';
  titleStrong.textContent = problemTitle; // safe: textContent, not innerHTML
  titleLine.appendChild(titleStrong);
  const statsLine = document.createElement('div');
  statsLine.style.cssText = 'margin-top: 4px; color: #9CA3AF;';
  statsLine.textContent = 'Runs: ';
  const runsSpan = document.createElement('span');
  runsSpan.id = 'hud-runs';
  runsSpan.style.color = '#fff';
  runsSpan.textContent = '0';
  statsLine.appendChild(runsSpan);
  statsLine.append(' | Language: ');
  const langSpan = document.createElement('span');
  langSpan.id = 'hud-lang';
  langSpan.style.color = '#fff';
  langSpan.textContent = 'C++';
  statsLine.appendChild(langSpan);
  infoDiv.appendChild(titleLine);
  infoDiv.appendChild(statsLine);

  hud.innerHTML = `
    <style>
      @keyframes pulse {
        0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
        70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
      }
      #codelens-hud button:hover { opacity: 0.9; }
    </style>`;
  hud.appendChild(headerDiv);
  hud.appendChild(infoDiv);

  const actionsDiv = document.createElement('div');
  actionsDiv.style.cssText = 'display: flex; gap: 6px; margin-top: 4px;';
  const finishBtn = document.createElement('button');
  finishBtn.id = 'hud-btn-finish';
  finishBtn.style.cssText = 'flex: 1; padding: 4px; background-color: #6366F1; border: none; border-radius: 4px; color: white; font-size: 10px; font-weight: bold; cursor: pointer;';
  finishBtn.textContent = 'Save Session';
  const cancelBtn = document.createElement('button');
  cancelBtn.id = 'hud-btn-cancel';
  cancelBtn.style.cssText = 'padding: 4px 8px; background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color: #D1D5DB; font-size: 10px; cursor: pointer;';
  cancelBtn.textContent = 'Cancel';
  actionsDiv.appendChild(finishBtn);
  actionsDiv.appendChild(cancelBtn);
  hud.appendChild(actionsDiv);

  document.body.appendChild(hud);

  // Set up timer
  secondsElapsed = 0;
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    secondsElapsed++;
    const timerSpan = document.getElementById('hud-timer');
    if (timerSpan) {
      const mins = Math.floor(secondsElapsed / 60);
      const secs = secondsElapsed % 60;
      timerSpan.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  }, 1000);

  // Button hooks
  document.getElementById('hud-btn-finish')?.addEventListener('click', () => {
    finishSession('Solved');
  });

  document.getElementById('hud-btn-cancel')?.addEventListener('click', () => {
    hud.remove();
    if (timerInterval) clearInterval(timerInterval);
    console.log('[CodeLens] Session cancelled by user.');
  });
}

// Scrape code from LeetCode editor DOM
function getEditorCode(): string {
  // Resilient Monaco query: find all lines and join
  const lineElems = document.querySelectorAll('.monaco-editor .view-lines .view-line');
  if (lineElems.length > 0) {
    const lines: string[] = [];
    lineElems.forEach(el => {
      lines.push(el.textContent || '');
    });
    return lines.join('\n');
  }

  // Fallback to general code textareas
  const textarea = document.querySelector('textarea.inputarea') as HTMLTextAreaElement;
  if (textarea) return textarea.value;

  return '// [CodeLens failed to capture editor state]';
}

// Detect problem name from title or slug
function getProblemDetails() {
  const path = window.location.pathname; // e.g. /problems/two-sum/description/
  const parts = path.split('/').filter(p => p.length > 0);
  let title = 'LeetCode Problem';
  if (parts.length > 1 && parts[0] === 'problems') {
    title = parts[1]
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  // Detect difficulty from text selectors or class attributes
  let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium';
  const difficultyElement = document.querySelector('.text-difficulty-easy, .text-difficulty-medium, .text-difficulty-hard, [class*="text-green-s"], [class*="text-yellow-s"], [class*="text-red-s"]');
  if (difficultyElement) {
    const txt = difficultyElement.textContent?.trim();
    if (txt === 'Easy' || txt === 'Medium' || txt === 'Hard') {
      difficulty = txt as 'Easy' | 'Medium' | 'Hard';
    }
  } else {
    // Slower fallback: search for elements with exact text content
    const labels = Array.from(document.querySelectorAll('span, div'));
    for (const el of labels) {
      const txt = el.textContent?.trim();
      if (txt === 'Easy' || txt === 'Medium' || txt === 'Hard') {
        difficulty = txt as 'Easy' | 'Medium' | 'Hard';
        break;
      }
    }
  }

  // Detect language from UI selectors robustly (handling chevrons, icons, newlines)
  let lang = 'C++';
  const knownLanguages = ['C++', 'Java', 'Python', 'Python3', 'JavaScript', 'TypeScript', 'C#', 'Go', 'Rust', 'C', 'Ruby', 'Swift', 'Kotlin', 'Scala', 'PHP'];
  
  const buttons = document.querySelectorAll('button');
  for (const btn of Array.from(buttons)) {
    const text = (btn.innerText || btn.textContent || '').trim();
    const matched = knownLanguages.find(l => {
      const cleanL = l.replace(/\+/g, '\\+');
      const regex = new RegExp('^' + cleanL + '(\\s|$|\\n|▼|▾|\\s+)', 'i');
      return regex.test(text);
    });
    if (matched) {
      lang = matched;
      break;
    }
  }
  currentLanguage = lang;

  return { title, difficulty, lang, tags: [difficulty, 'Algorithms'] };
}

// Initialize session
function startSession() {
  const details = getProblemDetails();

  // Fetch email from local storage config
  chrome.storage.local.get(['userEmail'], (data) => {
    const email = data.userEmail || 'test@codelens.dev';

    chrome.runtime.sendMessage({
      action: 'SESSION_START',
      payload: {
        email,
        problemTitle: details.title,
        difficulty: details.difficulty,
        tags: details.tags,
        language: details.lang
      }
    }, (res) => {
      console.log('[CodeLens] Start session response:', res);
      injectHUD(details.title);
      updateHUDCounts();
    });
  });
}

function updateHUDCounts() {
  const runsSpan = document.getElementById('hud-runs');
  const langSpan = document.getElementById('hud-lang');
  if (runsSpan) runsSpan.textContent = String(localRunCount);
  if (langSpan) langSpan.textContent = currentLanguage;
}

// Listen for interactions on code run & submits
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (!target) return;

  // LeetCode uses buttons with testids or specific text like "Run" and "Submit"
  const text = target.innerText || target.textContent || '';
  const isRun = text.trim() === 'Run';
  const isSubmit = text.trim() === 'Submit';

  if (isRun) {
    localRunCount++;
    console.log('[CodeLens] User triggered code RUN');
    chrome.runtime.sendMessage({
      action: 'EVENT_RECORD',
      payload: { eventType: 'RUN' }
    });

    // Save code snapshot
    const code = getEditorCode();
    chrome.runtime.sendMessage({
      action: 'SNAPSHOT_RECORD',
      payload: { trigger: 'RUN', code, verdict: 'Pending' }
    });

    updateHUDCounts();
    detectVerdict('RUN');
  }

  else if (isSubmit) {
    localSubCount++;
    console.log('[CodeLens] User triggered code SUBMIT');
    chrome.runtime.sendMessage({
      action: 'EVENT_RECORD',
      payload: { eventType: 'SUBMIT' }
    });

    const code = getEditorCode();
    chrome.runtime.sendMessage({
      action: 'SNAPSHOT_RECORD',
      payload: { trigger: 'SUBMIT', code, verdict: 'Pending' }
    });

    detectVerdict('SUBMIT');
  }
});

// Watch for LeetCode dynamic result banners to update verdict
function detectVerdict(type: 'RUN' | 'SUBMIT') {
  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;
    // Scan DOM for diagnostic words
    const text = document.body.innerText;

    let detected: string | null = null;
    let eventType: string | null = null;

    if (text.includes('Accepted')) {
      detected = 'Accepted';
      eventType = 'ACCEPTED';
    } else if (text.includes('Wrong Answer')) {
      detected = 'Wrong Answer';
      eventType = 'WRONG_ANSWER';
    } else if (text.includes('Time Limit Exceeded') || text.includes('TLE')) {
      detected = 'Time Limit Exceeded';
      eventType = 'TLE';
    } else if (text.includes('Compile Error')) {
      detected = 'Compile Error';
      eventType = 'COMPILE_ERROR';
    } else if (text.includes('Runtime Error')) {
      detected = 'Runtime Error';
      eventType = 'RUNTIME_ERROR';
    }

    if (detected && eventType) {
      clearInterval(interval);
      console.log(`[CodeLens] Verdict detected: ${detected}`);

      chrome.runtime.sendMessage({
        action: 'EVENT_RECORD',
        payload: { eventType }
      });

      // If we solved it, prompt to submit session or auto-complete
      if (type === 'SUBMIT' && detected === 'Accepted') {
        finishSession('Solved');
      }
    }

    // Stop searching after 40 seconds
    if (attempts > 80) {
      clearInterval(interval);
    }
  }, 500);
}

function finishSession(status: 'Solved' | 'Unsolved') {
  console.log('[CodeLens] Ending session...');
  chrome.runtime.sendMessage({
    action: 'SESSION_FINISH',
    payload: { status }
  }, (res) => {
    console.log('[CodeLens] Session final upload result:', res);
    const hud = document.getElementById('codelens-hud');
    if (hud) {
      // Safe DOM construction instead of innerHTML
      hud.textContent = '';
      const successDiv = document.createElement('div');
      successDiv.style.cssText = 'text-align: center; color: #10B981; font-weight: bold; font-size: 13px;';
      successDiv.textContent = '✓ Session Uploaded!';
      const successMsg = document.createElement('p');
      successMsg.style.cssText = 'font-size: 10px; color: #9CA3AF; text-align: center; margin: 4px 0 0 0;';
      successMsg.textContent = 'CodeLens processed your AI learning report.';
      hud.appendChild(successDiv);
      hud.appendChild(successMsg);
      setTimeout(() => hud.remove(), 4000);
    }
    if (timerInterval) clearInterval(timerInterval);
  });
}

// Trigger initial start session with a delay to ensure page elements are loaded
let lastPathname = window.location.pathname;
setTimeout(() => {
  startSession();

  // Regularly check for SPA URL path changes
  setInterval(() => {
    if (window.location.pathname !== lastPathname) {
      lastPathname = window.location.pathname;
      console.log('[CodeLens] SPA URL change detected. Restarting session...');
      if (timerInterval) clearInterval(timerInterval);
      const existing = document.getElementById('codelens-hud');
      if (existing) existing.remove();
      localRunCount = 0;
      localSubCount = 0;
      startSession();
    }
  }, 2000);
}, 2000);