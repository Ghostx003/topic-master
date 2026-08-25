/**
 * Topic Master — PYQ Screenshot Importer Background Service Worker (Manifest V3)
 * Exact question viewport capture from top border line to tags,
 * matching official GateOverflow problem statement + code + options + tags layout.
 * Removes left sidebar, headers, and right whitespace for a pixel-perfect middle crop.
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

    case 'RESET_SUBJECTS_SCREENSHOTS':
      handleResetSubjectsScreenshots(message.subjects).then(sendResponse);
      return true;
  }
});

/**
 * Start or resume batch import for selected subjects
 */
async function handleStartImport(subjects) {
  const response = await fetch(chrome.runtime.getURL('questions.json'));
  const allQuestions = await response.json();

  const subjectSet = new Set(subjects);
  const targetQuestions = allQuestions.filter((q) => subjectSet.has(q.subject));

  const storageData = await chrome.storage.local.get(null);
  const statuses = storageData.pyq_question_statuses || {};

  importState.queue = targetQuestions;
  importState.selectedSubjects = subjects;
  importState.currentIndex = 0;
  importState.status = 'IMPORTING';

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
 * Clean up page distractions and style the question element for crystal-clear capture
 * Keeps: Top line, Voting Buttons, Question Text, Code, Options, and Tags
 * Hides: Left navigation sidebar, headers, author box, action buttons, comments, answers
 */
async function cleanPageForScreenshot(tabId) {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const styleId = 'tm-clean-pyq-screenshot-style';
        let style = document.getElementById(styleId);
        if (!style) {
          style = document.createElement('style');
          style.id = styleId;
          style.textContent = `
            /* Hide entire left navigation sidebar & menu triggers */
            .sc-header-wrapper,
            .qa-header,
            .topbar-search-container,
            .sc-logo-container,
            .topbar-user-container,
            .sc-logReg,
            .qa-nav-user,
            .qam-main-nav-wrapper,
            .qa-nav-main,
            .sc-main-nav,
            .sc-side-nav,
            .qa-sidepanel-left,
            .qam-sidepanel,
            .sc-menu,
            .sc-nav-panel,
            .left-sidebar,
            .qa-left-sidebar,
            .sc-left-sidebar,
            nav[class*="nav"],
            div[class*="left-nav"],
            div[class*="side-nav"],
            div[class*="main-nav"],
            .theme-switch-wrapper,
            .dark-mode-switch,
            .qa-main-heading,
            h1,
            
            /* Hide sidebars and side widgets */
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
            
            /* Hide top metadata (asked by, views, date) */
            .qa-q-view-meta,
            .qa-q-item-meta,
            .qa-post-meta,
            .entry-meta,
            .qa-user-container,
            .ct-who1,
            
            /* Hide action buttons (answer, comment, share, print) */
            .qa-q-view-buttons,
            nav.qa-q-view-buttons,
            
            /* Hide comments section & comment forms */
            .comment-section,
            .qa-post-c-list,
            .qa-c-form,
            .comment-list-container,
            .qa-comments-header,
            .qa-c-list,
            .qa-q-view-c-list,
            
            /* Hide answers section & answer form */
            .qa-a-list,
            .qa-a-form,
            #anew,
            .qa-a-list-title,
            .qa-comment-button,
            .qa-q-view-follows,
            
            /* Hide AI summary bottom bar */
            .ai-summary-container,
            .ai-summary-bar,
            div[class*="ai-summary"],
            div[id*="ai-summary"],
            .btn-ai-summary,
            .q2a-ai-summary {
              display: none !important;
              visibility: hidden !important;
              height: 0 !important;
              width: 0 !important;
              opacity: 0 !important;
              pointer-events: none !important;
              margin: 0 !important;
              padding: 0 !important;
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
              padding: 16px 24px !important;
              box-sizing: border-box !important;
            }

            .qa-main {
              width: 100% !important;
              max-width: 960px !important;
              margin: 0 auto !important;
              padding: 0 !important;
              float: none !important;
            }

            .qa-q-view, article.qa-post-view {
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding-top: 14px !important;
              border-top: 1.5px solid #e2e8f0 !important;
              border-bottom: none !important;
              box-sizing: border-box !important;
            }

            .qa-voting-container {
              display: block !important;
              visibility: visible !important;
            }

            .qa-q-view-content {
              font-size: 15.5px !important;
              line-height: 1.65 !important;
              color: #1e293b !important;
            }

            #section-post-tags, .qa-q-view-tags {
              display: block !important;
              visibility: visible !important;
              margin-top: 14px !important;
            }

            .prettyprint, pre {
              background: #f8fafc !important;
              border: 1px solid #e2e8f0 !important;
              border-radius: 8px !important;
              padding: 12px !important;
              margin: 12px 0 !important;
              font-size: 13.5px !important;
              line-height: 1.5 !important;
            }
          `;
          document.head.appendChild(style);
        }

        // Direct DOM Element removal
        const selectorsToHide = [
          '.sc-header-wrapper',
          '.qam-main-nav-wrapper',
          '.qa-nav-main',
          '.sc-main-nav',
          '.sc-side-nav',
          '.qa-sidepanel-left',
          '.qam-sidepanel',
          '.sc-menu',
          '.sc-nav-panel',
          '.left-sidebar',
          '.qa-left-sidebar',
          '.sc-left-sidebar',
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
          '#q2a-chat-widget',
          '.qa-main-heading',
          'h1',
          '.qa-q-view-meta',
          '.qa-q-item-meta',
          '.qa-post-meta',
          '.entry-meta',
          '.qa-user-container',
          '.ct-who1',
          '.qa-q-view-buttons',
          'nav.qa-q-view-buttons',
          '.comment-section',
          '.qa-post-c-list',
          '.qa-c-form',
          '.qa-a-list',
          '.qa-a-form',
          'div[class*="ai-summary"]',
          'div[id*="ai-summary"]',
          '.theme-switch-wrapper',
          '.dark-mode-switch'
        ];

        selectorsToHide.forEach((sel) => {
          document.querySelectorAll(sel).forEach((el) => {
            el.style.setProperty('display', 'none', 'important');
          });
        });

        // Scroll the question element to top of the viewport
        window.scrollTo(0, 0);

        const qView =
          document.querySelector('.qa-q-view') ||
          document.querySelector('article.qa-post-view') ||
          document.querySelector('.qa-main') ||
          document.body;

        const tagsElem =
          document.querySelector('#section-post-tags') ||
          document.querySelector('.qa-q-view-tags') ||
          document.querySelector('.qa-q-view-content') ||
          qView;

        qView.scrollIntoView({ behavior: 'instant', block: 'start' });

        const qRect = qView.getBoundingClientRect();
        const tagsRect = tagsElem.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        const top = Math.max(0, qRect.top);
        const bottom = Math.max(tagsRect.bottom, qRect.bottom);
        const height = bottom - top + 18;

        return {
          left: Math.max(0, qRect.left),
          top: top,
          width: qRect.width,
          height: height,
          dpr: dpr
        };
      },
    });

    return results && results[0] ? results[0].result : null;
  } catch (_) {
    return null;
  }
}

/**
 * Convert Blob to Base64 in Service Worker without FileReader
 */
async function blobToBase64(blob) {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return `data:${blob.type || 'image/jpeg'};base64,${btoa(binary)}`;
}

/**
 * Native OffscreenCanvas cropping inside service worker (CSP-proof)
 * Cuts out left sidebar, headers, and right whitespace for a clean middle crop.
 */
async function cropImageInExtension(dataUrl, rect) {
  if (!rect || !rect.width || !rect.height) return dataUrl;
  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);

    const dpr = rect.dpr || 1;
    const paddingX = 8 * dpr;
    const paddingY = 8 * dpr;

    const cropX = Math.max(0, (rect.left || 0) * dpr - paddingX);
    const cropY = Math.max(0, (rect.top || 0) * dpr);
    const cropWidth = Math.min(imageBitmap.width - cropX, (rect.width || 0) * dpr + paddingX * 2);
    const cropHeight = Math.min(imageBitmap.height - cropY, (rect.height || 0) * dpr + paddingY);

    if (cropWidth <= 20 || cropHeight <= 20) return dataUrl;

    const offscreen = new OffscreenCanvas(cropWidth, cropHeight);
    const ctx = offscreen.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cropWidth, cropHeight);
    ctx.drawImage(imageBitmap, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

    const croppedBlob = await offscreen.convertToBlob({ type: 'image/jpeg', quality: 0.94 });
    return await blobToBase64(croppedBlob);
  } catch (err) {
    console.warn('Crop fallback:', err);
    return dataUrl;
  }
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

  const storageData = await chrome.storage.local.get(['pyq_question_statuses', `pyq_img_${q.id}`]);
  const statuses = storageData.pyq_question_statuses || {};

  if ((statuses[q.id] === 'CAPTURED' && storageData[`pyq_img_${q.id}`]) || storageData[`pyq_img_${q.id}`]) {
    importState.currentIndex++;
    importState.stats.skipped = (importState.stats.skipped || 0) + 1;
    broadcastState();
    setTimeout(processNextInQueue, 30);
    return;
  }

  try {
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

    if (tab.windowId) {
      try {
        await chrome.windows.update(tab.windowId, { state: 'maximized' });
      } catch (_) {}
    }

    await waitForTabComplete(tab.id, 25000);

    const isSecurityChallenge = await checkForSecurityChallenge(tab.id);
    if (isSecurityChallenge) {
      importState.status = 'PAUSED_CLOUDFLARE';
      saveState();
      await chrome.tabs.update(tab.id, { active: true });
      broadcastState();
      return;
    }

    const rect = await cleanPageForScreenshot(tab.id);
    await new Promise((r) => setTimeout(r, 1400));

    const rawDataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: 'jpeg', quality: 95 });

    if (rawDataUrl && rawDataUrl.startsWith('data:image')) {
      const dataUrl = await cropImageInExtension(rawDataUrl, rect);

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
    captureTab = await chrome.tabs.create({ url, active: true });
    if (captureTab.windowId) {
      try {
        await chrome.windows.update(captureTab.windowId, { state: 'maximized' });
      } catch (_) {}
    }
    await waitForTabComplete(captureTab.id, 25000);

    const isChallenge = await checkForSecurityChallenge(captureTab.id);
    if (isChallenge) {
      return { success: false, error: 'SECURITY_CHALLENGE' };
    }

    const rect = await cleanPageForScreenshot(captureTab.id);
    await new Promise((r) => setTimeout(r, 1400));

    const rawDataUrl = await chrome.tabs.captureVisibleTab(captureTab.windowId, { format: 'jpeg', quality: 95 });

    if (rawDataUrl && rawDataUrl.startsWith('data:image')) {
      const dataUrl = await cropImageInExtension(rawDataUrl, rect);

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

      try {
        await chrome.tabs.remove(captureTab.id);
      } catch (_) {}

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
    console.error('handleCaptureSpecific error:', err);
    if (captureTab) {
      try {
        await chrome.tabs.remove(captureTab.id);
      } catch (_) {}
    }
    return { success: false, error: err.message };
  }
}

/**
 * Reset screenshots for specific subjects from chrome.storage.local
 */
async function handleResetSubjectsScreenshots(subjectsToReset) {
  if (!subjectsToReset || subjectsToReset.length === 0) {
    return { success: false, error: 'No subjects specified' };
  }

  const targetSubjects = new Set(subjectsToReset);
  const response = await fetch(chrome.runtime.getURL('questions.json'));
  const allQuestions = await response.json();

  const storageData = await chrome.storage.local.get(null);
  const statuses = storageData.pyq_question_statuses || {};
  const keysToRemove = [];

  allQuestions.forEach((q) => {
    if (targetSubjects.has(q.subject)) {
      delete statuses[q.id];
      keysToRemove.push(`pyq_img_${q.id}`);
    }
  });

  if (keysToRemove.length > 0) {
    await chrome.storage.local.remove(keysToRemove);
  }
  await chrome.storage.local.set({ pyq_question_statuses: statuses });

  if (importState.status === 'IMPORTING') {
    importState.status = 'STOPPED';
  }

  saveState();
  broadcastState();

  notifyWebTabs({
    type: 'PYQ_SCREENSHOTS_RESET_NOTIFY',
    subjects: subjectsToReset,
  });

  return { success: true, count: keysToRemove.length };
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
