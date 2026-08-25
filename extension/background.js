/**
 * Topic Master — PYQ Screenshot Importer Background Service Worker (Manifest V3)
 * Sequential single-tab webpage capture with Cloudflare detection and persistent resume.
 */

let importState = {
  status: 'IDLE', // 'IDLE' | 'IMPORTING' | 'PAUSED_CLOUDFLARE' | 'STOPPED' | 'COMPLETED'
  queue: [],
  currentIndex: 0,
  selectedSubjects: [],
  workerTabId: null,
  stats: {
    total: 0,
    captured: 0,
    failed: 0,
    skipped: 0,
  },
  currentQuestion: null,
};

// Load saved queue state on startup
chrome.runtime.onStartup.addListener(loadSavedState);
chrome.runtime.onInstalled.addListener(loadSavedState);

async function loadSavedState() {
  const data = await chrome.storage.local.get(['pyq_import_state', 'pyq_question_statuses']);
  if (data.pyq_import_state) {
    importState = { ...importState, ...data.pyq_import_state };
    if (importState.status === 'IMPORTING') {
      importState.status = 'STOPPED';
    }
  }
}

async function saveState() {
  await chrome.storage.local.set({
    pyq_import_state: {
      status: importState.status,
      currentIndex: importState.currentIndex,
      selectedSubjects: importState.selectedSubjects,
      stats: importState.stats,
    },
  });
}

/**
 * Message Handler for Popup and Content Scripts
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'GET_STATUS':
      sendResponse({ state: importState });
      break;

    case 'START_IMPORT':
      handleStartImport(message.subjects).then(sendResponse);
      return true;

    case 'PAUSE_IMPORT':
      importState.status = 'PAUSED_CLOUDFLARE';
      saveState();
      sendResponse({ success: true, state: importState });
      break;

    case 'RESUME_IMPORT':
      handleResumeImport().then(sendResponse);
      return true;

    case 'STOP_IMPORT':
      handleStopImport().then(sendResponse);
      return true;

    case 'CAPTURE_SPECIFIC_PAGE':
      handleCaptureSpecific(message.questionId, message.url, message.subject).then(sendResponse);
      return true;

    case 'GET_STORAGE_STATS':
      getStorageStats().then(sendResponse);
      return true;
  }
});

/**
 * Start or resume batch import for selected subjects
 */
async function handleStartImport(subjects) {
  // Load questions dataset
  const response = await fetch(chrome.runtime.getURL('questions.json'));
  const allQuestions = await response.json();

  // Filter questions by selected subjects
  const subjectSet = new Set(subjects);
  const targetQuestions = allQuestions.filter((q) => subjectSet.has(q.subject));

  // Get already captured statuses from local storage
  const storageData = await chrome.storage.local.get('pyq_question_statuses');
  const statuses = storageData.pyq_question_statuses || {};

  importState.queue = targetQuestions;
  importState.selectedSubjects = subjects;
  importState.currentIndex = 0;
  importState.status = 'IMPORTING';

  // Calculate already captured
  let alreadyCaptured = 0;
  targetQuestions.forEach((q) => {
    if (statuses[q.id] === 'CAPTURED') {
      alreadyCaptured++;
    }
  });

  importState.stats = {
    total: targetQuestions.length,
    captured: alreadyCaptured,
    failed: 0,
    skipped: 0,
  };

  saveState();
  processNextInQueue();
  return { success: true, state: importState };
}

/**
 * Resume from paused/stopped state
 */
async function handleResumeImport() {
  if (importState.queue.length === 0) {
    if (importState.selectedSubjects.length > 0) {
      return handleStartImport(importState.selectedSubjects);
    }
    return { success: false, error: 'Queue is empty' };
  }

  importState.status = 'IMPORTING';
  saveState();
  processNextInQueue();
  return { success: true, state: importState };
}

/**
 * Stop active import queue
 */
async function handleStopImport() {
  importState.status = 'STOPPED';
  saveState();

  if (importState.workerTabId) {
    try {
      await chrome.tabs.remove(importState.workerTabId);
    } catch (_) {}
    importState.workerTabId = null;
  }

  return { success: true, state: importState };
}

/**
 * Process the next question in the sequential queue
 */
async function processNextInQueue() {
  if (importState.status !== 'IMPORTING') return;

  if (importState.currentIndex >= importState.queue.length) {
    importState.status = 'COMPLETED';
    saveState();
    if (importState.workerTabId) {
      try {
        await chrome.tabs.remove(importState.workerTabId);
      } catch (_) {}
      importState.workerTabId = null;
    }
    broadcastState();
    return;
  }

  const q = importState.queue[importState.currentIndex];
  importState.currentQuestion = q;

  // Check if already captured in storage
  const storageData = await chrome.storage.local.get(['pyq_question_statuses', `pyq_img_${q.id}`]);
  const statuses = storageData.pyq_question_statuses || {};

  if (statuses[q.id] === 'CAPTURED' && storageData[`pyq_img_${q.id}`]) {
    // Already captured, skip smoothly
    importState.currentIndex++;
    broadcastState();
    setTimeout(processNextInQueue, 50);
    return;
  }

  try {
    // Step 1: Ensure single worker tab exists
    let tab = null;
    if (importState.workerTabId) {
      try {
        tab = await chrome.tabs.get(importState.workerTabId);
      } catch (_) {
        importState.workerTabId = null;
      }
    }

    if (!tab) {
      tab = await chrome.tabs.create({ url: q.link, active: false });
      importState.workerTabId = tab.id;
    } else {
      await chrome.tabs.update(tab.id, { url: q.link });
    }

    // Step 2: Wait for tab navigation and DOM load
    await waitForTabComplete(tab.id, 25000);

    // Step 3: Check for Cloudflare / Security challenge
    const isSecurityChallenge = await checkForSecurityChallenge(tab.id);
    if (isSecurityChallenge) {
      importState.status = 'PAUSED_CLOUDFLARE';
      saveState();
      // Bring tab to focus so user can solve CAPTCHA
      await chrome.tabs.update(tab.id, { active: true });
      broadcastState();
      return;
    }

    // Step 4: Wait for MathJax and images to render properly
    await new Promise((r) => setTimeout(r, 1500));

    // Step 5: Capture visible tab
    const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' });

    if (dataUrl && dataUrl.startsWith('data:image')) {
      // Step 6: Store screenshot in local storage
      statuses[q.id] = 'CAPTURED';
      await chrome.storage.local.set({
        pyq_question_statuses: statuses,
        [`pyq_img_${q.id}`]: {
          questionId: q.id,
          url: q.link,
          subject: q.subject,
          dataUrl,
          timestamp: Date.now(),
        },
      });

      importState.stats.captured++;

      // Step 7: Broadcast captured image to all Topic Master web tabs
      notifyWebTabs({
        type: 'PYQ_SCREENSHOT_BATCH_CAPTURE',
        questionId: q.id,
        url: q.link,
        subject: q.subject,
        dataUrl,
      });
    } else {
      statuses[q.id] = 'FAILED';
      await chrome.storage.local.set({ pyq_question_statuses: statuses });
      importState.stats.failed++;
    }
  } catch (err) {
    console.error(`Error capturing question ${q.id}:`, err);
    statuses[q.id] = 'FAILED';
    await chrome.storage.local.set({ pyq_question_statuses: statuses });
    importState.stats.failed++;
  }

  importState.currentIndex++;
  saveState();
  broadcastState();

  // Controlled delay between questions (700ms)
  setTimeout(processNextInQueue, 700);
}

/**
 * Check if the loaded page is a Cloudflare / DDoS / Turnstile challenge
 */
async function checkForSecurityChallenge(tabId) {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const title = document.title.toLowerCase();
        const bodyText = document.body ? document.body.innerText.toLowerCase() : '';
        const hasChallengeId =
          document.querySelector('#challenge-running') ||
          document.querySelector('.cf-browser-verification') ||
          document.querySelector('#cf-wrapper') ||
          document.querySelector('.cf-turnstile-wrapper');

        return (
          title.includes('just a moment') ||
          title.includes('attention required') ||
          title.includes('cloudflare') ||
          bodyText.includes('checking your browser') ||
          bodyText.includes('verify you are human') ||
          Boolean(hasChallengeId)
        );
      },
    });

    return results && results[0] && results[0].result === true;
  } catch (_) {
    return false;
  }
}

/**
 * Wait for a Chrome tab to report complete status
 */
function waitForTabComplete(tabId, timeoutMs = 20000) {
  return new Promise((resolve) => {
    let resolved = false;

    const listener = (updatedTabId, changeInfo) => {
      if (updatedTabId === tabId && changeInfo.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        if (!resolved) {
          resolved = true;
          resolve();
        }
      }
    };

    chrome.tabs.onUpdated.addListener(listener);

    setTimeout(() => {
      chrome.tabs.onUpdated.removeListener(listener);
      if (!resolved) {
        resolved = true;
        resolve();
      }
    }, timeoutMs);
  });
}

/**
 * Handle capturing an individual specific question URL
 */
async function handleCaptureSpecific(questionId, url, subject) {
  let captureTab = null;
  try {
    captureTab = await chrome.tabs.create({ url, active: false });
    await waitForTabComplete(captureTab.id, 25000);

    const isChallenge = await checkForSecurityChallenge(captureTab.id);
    if (isChallenge) {
      await chrome.tabs.update(captureTab.id, { active: true });
      return { success: false, error: 'SECURITY_CHALLENGE' };
    }

    await new Promise((r) => setTimeout(r, 1500));
    const dataUrl = await chrome.tabs.captureVisibleTab(captureTab.windowId, { format: 'png' });

    if (dataUrl && dataUrl.startsWith('data:image')) {
      const storageData = await chrome.storage.local.get('pyq_question_statuses');
      const statuses = storageData.pyq_question_statuses || {};
      statuses[questionId] = 'CAPTURED';

      await chrome.storage.local.set({
        pyq_question_statuses: statuses,
        [`pyq_img_${questionId}`]: {
          questionId,
          url,
          subject,
          dataUrl,
          timestamp: Date.now(),
        },
      });

      await chrome.tabs.remove(captureTab.id);
      return { success: true, dataUrl };
    }

    if (captureTab) await chrome.tabs.remove(captureTab.id);
    return { success: false, error: 'Capture empty' };
  } catch (err) {
    if (captureTab) {
      try {
        await chrome.tabs.remove(captureTab.id);
      } catch (_) {}
    }
    return { success: false, error: err.message };
  }
}

/**
 * Broadcast state update to extension popup
 */
function broadcastState() {
  chrome.runtime.sendMessage({ type: 'STATE_UPDATED', state: importState }).catch(() => {});
}

/**
 * Send captured screenshot payload to all active Topic Master web tabs
 */
async function notifyWebTabs(payload) {
  const tabs = await chrome.tabs.query({});
  for (const t of tabs) {
    if (
      t.url &&
      (t.url.includes('localhost') || t.url.includes('127.0.0.1') || t.url.includes('topic-master'))
    ) {
      chrome.tabs.sendMessage(t.id, payload).catch(() => {});
    }
  }
}

/**
 * Get screenshot storage totals
 */
async function getStorageStats() {
  const storageData = await chrome.storage.local.get(null);
  const statuses = storageData.pyq_question_statuses || {};
  let totalCaptured = 0;

  Object.values(statuses).forEach((s) => {
    if (s === 'CAPTURED') totalCaptured++;
  });

  return { totalCaptured, totalKeys: Object.keys(storageData).length };
}
