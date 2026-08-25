/**
 * Topic Master — PYQ Screenshot Importer Background Service Worker (Manifest V3)
 * Sequential single-tab webpage capture with Cloudflare detection, persistent resume,
 * and automated element cleaner for distractions/sidebars.
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
  const storageData = await chrome.storage.local.get(null);
  const statuses = storageData.pyq_question_statuses || {};

  importState.queue = targetQuestions;
  importState.selectedSubjects = subjects;
  importState.currentIndex = 0;
  importState.status = 'IMPORTING';

  // Calculate already captured (including manual single-page captures)
  let alreadyCaptured = 0;
  targetQuestions.forEach((q) => {
    if (statuses[q.id] === 'CAPTURED' || storageData[`pyq_img_${q.id}`]) {
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
 * Clean up page distractions (headers, search bar, sidebars, chat, notices) before taking screenshot
 */
async function cleanPageForScreenshot(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        // Inject clean styles
        const styleId = 'tm-clean-pyq-screenshot-style';
        let style = document.getElementById(styleId);
        if (!style) {
          style = document.createElement('style');
          style.id = styleId;
          style.textContent = `
            .sc-header-wrapper,
            .qa-header,
            .topbar-search-container,
            .sc-logo-container,
            .topbar-user-container,
            .sc-logReg,
            .qa-nav-user,
            aside.qa-sidepanel,
            .qa-sidepanel,
            .qa-widgets-side,
            .qa-notice-widget,
            .q2a-chat-widget-wrap,
            .q2a-chat-widget-container,
            .qa-sidebar,
            .as-widget,
            .tagsearch-widget-container,
            .qa-related-qs,
            .qa-nav-cat-list,
            .qa-activity-widget,
            .qa-footer,
            .qa-nav-footer,
            .qa-feed,
            .qa-suggest-next,
            #q2a-chat-widget,
            .qam-main-nav-wrapper {
              display: none !important;
              visibility: hidden !important;
              height: 0 !important;
              width: 0 !important;
              opacity: 0 !important;
              pointer-events: none !important;
            }

            body, html {
              background: #ffffff !important;
              margin: 0 !important;
              padding: 0 !important;
              overflow-x: hidden !important;
            }

            .qa-body-wrapper {
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 10px 24px !important;
            }

            .qa-main {
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              float: none !important;
              padding: 10px 0 !important;
            }

            .qa-q-view {
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 10px 0 !important;
              border-bottom: none !important;
            }
          `;
          document.head.appendChild(style);
        }

        // Direct DOM Element hiding
        const selectorsToHide = [
          '.sc-header-wrapper',
          'aside.qa-sidepanel',
          '.qa-sidepanel',
          '.qa-widgets-side',
          '.qa-notice-widget',
          '.q2a-chat-widget-wrap',
          '.q2a-chat-widget-container',
          '.qa-sidebar',
          '.as-widget',
          '.tagsearch-widget-container',
          '.qa-related-qs',
          '.qa-nav-cat-list',
          '.qa-activity-widget',
          '.topbar-search-container',
          '.sc-logo-container',
          '.topbar-user-container',
          '.sc-logReg',
          '.qa-nav-user',
          '.qa-footer',
          '.qa-nav-footer',
          '#q2a-chat-widget'
        ];

        selectorsToHide.forEach((sel) => {
          document.querySelectorAll(sel).forEach((el) => {
            el.style.setProperty('display', 'none', 'important');
          });
        });

        // Scroll question view to top
        const qElem =
          document.querySelector('.qa-q-view') ||
          document.querySelector('.entry-content') ||
          document.querySelector('.qa-main') ||
          document.body;
        if (qElem) {
          qElem.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      },
    });
  } catch (_) {}
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

  // Check if already captured in storage OR manually added/captured
  const storageData = await chrome.storage.local.get(['pyq_question_statuses', `pyq_img_${q.id}`]);
  const statuses = storageData.pyq_question_statuses || {};

  if ((statuses[q.id] === 'CAPTURED' && storageData[`pyq_img_${q.id}`]) || storageData[`pyq_img_${q.id}`]) {
    // Already captured or manually added, skip smoothly
    importState.currentIndex++;
    importState.stats.skipped = (importState.stats.skipped || 0) + 1;
    broadcastState();
    setTimeout(processNextInQueue, 30);
    return;
  }

  try {
    // Step 1: Ensure worker tab exists and is active for capturing
    let tab = null;
    if (importState.workerTabId) {
      try {
        tab = await chrome.tabs.get(importState.workerTabId);
      } catch (_) {
        importState.workerTabId = null;
      }
    }

    if (!tab) {
      tab = await chrome.tabs.create({ url: q.link, active: true });
      importState.workerTabId = tab.id;
    } else {
      await chrome.tabs.update(tab.id, { url: q.link, active: true });
    }

    // Step 2: Wait for tab navigation and DOM load
    await waitForTabComplete(tab.id, 25000);

    // Step 3: Check for Cloudflare / Security challenge
    const isSecurityChallenge = await checkForSecurityChallenge(tab.id);
    if (isSecurityChallenge) {
      importState.status = 'PAUSED_CLOUDFLARE';
      saveState();
      await chrome.tabs.update(tab.id, { active: true });
      broadcastState();
      return;
    }

    // Step 4: Clean page distractions (hide header, sidebars, chat) and position question
    await cleanPageForScreenshot(tab.id);
    await new Promise((r) => setTimeout(r, 1400));

    // Step 5: Capture visible tab
    const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: 'jpeg', quality: 90 });

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

  // Controlled delay between questions
  setTimeout(processNextInQueue, 500);
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
          document.querySelector('.cf-turnstile-wrapper') ||
          document.querySelector('#turnstile-wrapper');

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
    // 1. Create tab active so Chrome renders and paints it properly
    captureTab = await chrome.tabs.create({ url, active: true });
    await waitForTabComplete(captureTab.id, 25000);

    const isChallenge = await checkForSecurityChallenge(captureTab.id);
    if (isChallenge) {
      return { success: false, error: 'SECURITY_CHALLENGE' };
    }

    // 2. Clean page distractions and scroll question into view
    await cleanPageForScreenshot(captureTab.id);
    await new Promise((r) => setTimeout(r, 1400));

    // 3. Capture visible tab
    const dataUrl = await chrome.tabs.captureVisibleTab(captureTab.windowId, { format: 'jpeg', quality: 90 });

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

      // 4. Close the temporary capture tab
      try {
        await chrome.tabs.remove(captureTab.id);
      } catch (_) {}

      // 5. Notify web tabs
      notifyWebTabs({
        type: 'PYQ_SCREENSHOT_BATCH_CAPTURE',
        questionId,
        url,
        subject,
        dataUrl,
      });

      return { success: true, dataUrl };
    }

    if (captureTab) {
      try {
        await chrome.tabs.remove(captureTab.id);
      } catch (_) {}
    }
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
      (t.url.includes('localhost') || t.url.includes('127.0.0.1') || t.url.includes('topic-master') || t.url.includes('vercel.app'))
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
