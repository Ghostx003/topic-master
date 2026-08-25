/**
 * Topic Master — Extension Content Script Bridge
 * Bridges messages between the Topic Master React Web App and Chrome Extension background worker.
 */

// Listen for messages from the web page (window.postMessage)
window.addEventListener('message', async (event) => {
  // Only accept messages from same window
  if (event.source !== window || !event.data) return;

  if (event.data.type === 'CAPTURE_SPECIFIC_PAGE_REQUEST') {
    const { questionId, url, subject } = event.data;

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'CAPTURE_SPECIFIC_PAGE',
        questionId,
        url,
        subject,
      });

      window.postMessage(
        {
          type: 'CAPTURE_SPECIFIC_PAGE_RESPONSE',
          questionId,
          success: Boolean(response && response.success),
          dataUrl: response ? response.dataUrl : null,
          error: response ? response.error : 'Unknown error',
        },
        '*'
      );
    } catch (err) {
      window.postMessage(
        {
          type: 'CAPTURE_SPECIFIC_PAGE_RESPONSE',
          questionId,
          success: false,
          error: err.message,
        },
        '*'
      );
    }
  }
});

// Listen for background worker messages and relay to web page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === 'PYQ_SCREENSHOT_BATCH_CAPTURE') {
    window.postMessage(message, '*');
    sendResponse({ received: true });
    return true;
  }

  if (message && message.type === 'PYQ_SCREENSHOTS_RESET_NOTIFY') {
    window.postMessage(message, '*');
    sendResponse({ received: true });
    return true;
  }

  if (message && message.type === 'GET_STORED_SCREENSHOT_IDS') {
    // Request current IDs from page script via window.postMessage
    const reqId = 'req_' + Math.random().toString(36).slice(2);
    let resolved = false;

    const handler = (event) => {
      if (event.source !== window || !event.data) return;
      if (event.data.type === 'GET_STORED_SCREENSHOT_IDS_RESPONSE' && event.data.reqId === reqId) {
        if (!resolved) {
          resolved = true;
          window.removeEventListener('message', handler);
          sendResponse({ ids: event.data.ids || [] });
        }
      }
    };

    window.addEventListener('message', handler);
    window.postMessage({ type: 'GET_STORED_SCREENSHOT_IDS_REQUEST', reqId }, '*');

    // Timeout fallback after 2.5s
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        window.removeEventListener('message', handler);
        sendResponse({ ids: [] });
      }
    }, 2500);

    return true; // Async response
  }
});
