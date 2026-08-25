/**
 * Topic Master — PYQ Screenshot Importer Background Service Worker (Manifest V3)
 * High-precision single-element question cropping with distraction removal,
 * tall viewport rendering, and Cloudflare detection.
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
 * Clean up page distractions and style the question element for crystal-clear capture
 */
async function cleanPageForScreenshot(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const styleId = 'tm-clean-pyq-screenshot-style';
        let style = document.getElementById(styleId);
        if (!style) {
          style = document.createElement('style');
          style.id = styleId;
          style.textContent = `
            /* Hide all page headers, sidebars, footers, chats */
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
            .qam-main-nav-wrapper,
            
            /* Hide voting buttons & counters */
            .qa-voting-container,
            .qa-voting,
            .qa-voting-net,
            .qa-vote-buttons,
            .confetti-button,
            
            /* Hide tag bar & view count / author info */
            #section-post-tags,
            .qa-q-view-tags,
            .qa-user-container,
            .qa-q-item-meta,
            
            /* Hide action buttons (answer, comment, share, print) */
            .qa-q-view-buttons,
            
            /* Hide comments section & comment input form */
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
              max-width: 100% !important;
              margin: 0 !important;
              float: none !important;
              padding: 0 !important;
            }

            .qa-main-heading, h1 {
              font-size: 20px !important;
              font-weight: 800 !important;
              color: #0f172a !important;
              margin: 0 0 16px 0 !important;
              padding: 0 !important;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            }

            .qa-q-view, article.qa-post-view {
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              border: none !important;
              box-shadow: none !important;
            }

            .qa-q-view-main {
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              float: none !important;
            }

            .qa-q-view-content {
              width: 100% !important;
              max-width: 100% !important;
              font-size: 16px !important;
              line-height: 1.65 !important;
              color: #1e293b !important;
            }

            .entry-content img, .qa-q-view-content img {
              max-width: 100% !important;
              height: auto !important;
            }

            .prettyprint, pre {
              background: #f8fafc !important;
              border: 1px solid #e2e8f0 !important;
              border-radius: 10px !important;
              padding: 14px !important;
              margin: 12px 0 !important;
              font-size: 14px !important;
              line-height: 1.5 !important;
            }
          `;
          document.head.appendChild(style);
        }

        // Direct DOM Element removal for extra reliability
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
          '#q2a-chat-widget',
          '.qa-voting-container',
          '#section-post-tags',
          '.qa-user-container',
          '.qa-q-view-buttons',
          '.comment-section',
          '.qa-post-c-list',
          '.qa-c-form',
          '.qa-a-list',
          '.qa-a-form',
          'div[class*="ai-summary"]',
          'div[id*="ai-summary"]'
        ];

        selectorsToHide.forEach((sel) => {
          document.querySelectorAll(sel).forEach((el) => {
            el.style.setProperty('display', 'none', 'important');
          });
        });

        // Scroll the question element to top-left of the viewport
        window.scrollTo(0, 0);
        const qElem =
          document.querySelector('.qa-main-heading') ||
          document.querySelector('.qa-q-view') ||
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
 * Crop the full viewport screenshot tightly around the question element
 */
async function cropElementScreenshot(tabId, fullDataUrl) {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      func: (dataUrl) => {
        return new Promise((resolve) => {
          // Identify target question container
          const targetElem =
            document.querySelector('.qa-main') ||
            document.querySelector('.qa-q-view') ||
            document.querySelector('article.qa-post-view') ||
            document.querySelector('.qa-q-view-content') ||
            document.body;

          const rect = targetElem.getBoundingClientRect();
          const dpr = window.devicePixelRatio || 1;
          const padding = 16 * dpr;

          const img = new Image();
          img.onload = () => {
            const cropX = Math.max(0, rect.left * dpr - padding);
            const cropY = Math.max(0, rect.top * dpr - padding);
            const cropWidth = Math.min(img.width - cropX, rect.width * dpr + padding * 2);
            const cropHeight = Math.min(img.height - cropY, rect.height * dpr + padding * 2);

            if (cropWidth <= 0 || cropHeight <= 0) {
              resolve(dataUrl);
              return;
            }

            const canvas = document.createElement('canvas');
            canvas.width = cropWidth;
            canvas.height = cropHeight;

            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(
              img,
              cropX,
              cropY,
              cropWidth,
              cropHeight,
              0,
              0,
              cropWidth,
              cropHeight
            );

            resolve(canvas.toDataURL('image/jpeg', 0.92));
          };
          img.onerror = () => resolve(dataUrl);
          img.src = dataUrl;
        });
      },
      args: [fullDataUrl],
    });

    return results && results[0] && results[0].result ? results[0].result : fullDataUrl;
  } catch (err) {
    console.warn('Crop fallback:', err);
    return fullDataUrl;
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

  // Check if already captured in storage OR manually added/captured
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

    // Step 2: Ensure window is maximized for full resolution
    if (tab.windowId) {
      try {
        await chrome.windows.update(tab.windowId, { state: 'maximized' });
      } catch (_) {}
    }

    // Step 3: Wait for tab navigation and DOM load
    await waitForTabComplete(tab.id, 25000);

    // Step 4: Check for Cloudflare / Security challenge
    const isSecurityChallenge = await checkForSecurityChallenge(tab.id);
    if (isSecurityChallenge) {
      importState.status = 'PAUSED_CLOUDFLARE';
      saveState();
      await chrome.tabs.update(tab.id, { active: true });
      broadcastState();
      return;
    }

    // Step 5: Clean page distractions, voting buttons, comments, author card
    await cleanPageForScreenshot(tab.id);
    await new Promise((r) => setTimeout(r, 1400));

    // Step 6: Capture visible tab
    const rawDataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: 'jpeg', quality: 95 });

    if (rawDataUrl && rawDataUrl.startsWith('data:image')) {
      // Step 7: Crop tightly to the question element
      const dataUrl = await cropElementScreenshot(tab.id, rawDataUrl);

      // Step 8: Store screenshot in local storage
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

      // Step 9: Broadcast captured image to all Topic Master web tabs
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

    // 2. Clean page distractions and position question
    await cleanPageForScreenshot(captureTab.id);
    await new Promise((r) => setTimeout(r, 1400));

    // 3. Capture visible tab
    const rawDataUrl = await chrome.tabs.captureVisibleTab(captureTab.windowId, { format: 'jpeg', quality: 95 });

    if (rawDataUrl && rawDataUrl.startsWith('data:image')) {
      // 4. Crop tightly to the question element
      const dataUrl = await cropElementScreenshot(captureTab.id, rawDataUrl);

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

      // 5. Close the temporary capture tab
      try {
        await chrome.tabs.remove(captureTab.id);
      } catch (_) {}

      // 6. Notify web tabs
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
