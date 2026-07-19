// CodeLens Extension Popup Controller

document.addEventListener('DOMContentLoaded', async () => {
  const statusBadge = document.getElementById('tracking-status') as HTMLSpanElement;
  const timerSpan = document.getElementById('tracking-timer') as HTMLSpanElement;
  const problemInfoDiv = document.getElementById('problem-info') as HTMLDivElement;
  const problemNameSpan = document.getElementById('problem-name') as HTMLDivElement;
  const problemRunsSpan = document.getElementById('problem-runs') as HTMLSpanElement;
  const problemLangSpan = document.getElementById('problem-lang') as HTMLSpanElement;
  const emailInput = document.getElementById('user-email') as HTMLInputElement;
  const btnSimulate = document.getElementById('btn-simulate') as HTMLButtonElement;
  const simProfileSelect = document.getElementById('sim-profile') as HTMLSelectElement;

  // Load email configuration
  const stored = await chrome.storage.local.get(['userEmail']);
  if (stored.userEmail) {
    emailInput.value = stored.userEmail;
  } else {
    await chrome.storage.local.set({ userEmail: emailInput.value });
  }

  // Save email configuration on change
  emailInput.addEventListener('input', async () => {
    await chrome.storage.local.set({ userEmail: emailInput.value });
  });

  // Poll background tracking status
  const updateUI = async () => {
    const data = await chrome.storage.local.get([
      'trackingState',
      'elapsedSeconds',
      'problemTitle',
      'runCount',
      'language'
    ]);

    if (data.trackingState === 'TRACKING') {
      statusBadge.textContent = 'Tracking';
      statusBadge.className = 'status-badge status-tracking';
      problemInfoDiv.style.display = 'block';
      problemNameSpan.textContent = data.problemTitle || 'LeetCode Problem';
      problemRunsSpan.textContent = String(data.runCount || 0);
      problemLangSpan.textContent = data.language || 'C++';

      const seconds = data.elapsedSeconds || 0;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      timerSpan.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    } else {
      statusBadge.textContent = 'Idle';
      statusBadge.className = 'status-badge status-idle';
      timerSpan.textContent = '00:00';
      problemInfoDiv.style.display = 'none';
    }
  };

  // Run periodic UI check
  updateUI();
  setInterval(updateUI, 1000);

  // Simulated Session Trigger
  btnSimulate.addEventListener('click', async () => {
    const type = simProfileSelect.value;
    const email = emailInput.value;

    btnSimulate.disabled = true;
    btnSimulate.textContent = 'Simulating...';

    chrome.runtime.sendMessage(
      {
        action: 'SIMULATE_SESSION',
        payload: { type, email }
      },
      (response) => {
        btnSimulate.disabled = false;
        btnSimulate.textContent = 'Inject Simulation Logs';

        if (response && response.success) {
          alert(`Successfully simulated "${type.toUpperCase()}" session! Check your CodeLens dashboard.`);
        } else {
          alert(`Failed to simulate session: ${response?.error || 'Server offline'}`);
        }
      }
    );
  });
});