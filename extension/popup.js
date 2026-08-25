/**
 * Topic Master — PYQ Screenshot Importer Popup UI Logic
 */

let allQuestions = [];
let subjectCounts = {};
let selectedSubjects = new Set();
let resetSelectedSubjects = new Set();
let capturedStatusMap = {};
let allSelected = false;
let resetAllSelected = false;

// DOM Elements
const statusBadge = document.getElementById('statusBadge');
const securityAlert = document.getElementById('securityAlert');
const progressCount = document.getElementById('progressCount');
const progressPercent = document.getElementById('progressPercent');
const progressBar = document.getElementById('progressBar');
const activeQuestionText = document.getElementById('activeQuestionText');
const subjectList = document.getElementById('subjectList');
const toggleSelectAllBtn = document.getElementById('toggleSelectAllBtn');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resumeBtn = document.getElementById('resumeBtn');

// Reset Modal Elements
const openResetBtn = document.getElementById('openResetBtn');
const resetModal = document.getElementById('resetModal');
const closeResetModalBtn = document.getElementById('closeResetModalBtn');
const cancelResetBtn = document.getElementById('cancelResetBtn');
const confirmResetBtn = document.getElementById('confirmResetBtn');
const resetSubjectList = document.getElementById('resetSubjectList');
const resetToggleAllBtn = document.getElementById('resetToggleAllBtn');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  await syncStateWithBackground();
  setupListeners();
});

async function loadData() {
  try {
    // 1. Fetch questions dataset
    const response = await fetch(chrome.runtime.getURL('questions.json'));
    allQuestions = await response.json();

    // 2. Fetch already captured statuses from chrome.storage.local
    const storage = await chrome.storage.local.get(null);
    capturedStatusMap = storage.pyq_question_statuses || {};

    // 3. Count BY SUBJECT ONLY
    subjectCounts = {};
    allQuestions.forEach((q) => {
      const subj = q.subject || 'General Aptitude';
      if (!subjectCounts[subj]) {
        subjectCounts[subj] = { total: 0, captured: 0 };
      }
      subjectCounts[subj].total++;
      if (capturedStatusMap[q.id] === 'CAPTURED' && storage[`pyq_img_${q.id}`]) {
        subjectCounts[subj].captured++;
      }
    });

    renderSubjectList();
    renderResetSubjectList();
  } catch (err) {
    console.error('Failed to load questions:', err);
  }
}

function renderSubjectList() {
  subjectList.innerHTML = '';
  const subjects = Object.keys(subjectCounts).sort();

  subjects.forEach((subj) => {
    const data = subjectCounts[subj];
    const isFullyCaptured = data.captured >= data.total;

    const row = document.createElement('div');
    row.className = 'subject-item';

    const left = document.createElement('div');
    left.className = 'subject-item-left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'subject-checkbox';
    checkbox.checked = selectedSubjects.has(subj);
    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        selectedSubjects.add(subj);
      } else {
        selectedSubjects.delete(subj);
      }
      updateButtonsState();
    });

    const name = document.createElement('span');
    name.className = 'subject-name';
    name.textContent = subj;
    name.title = subj;

    left.appendChild(checkbox);
    left.appendChild(name);

    const right = document.createElement('div');
    right.className = 'subject-item-right';

    // Dedicated Force Check Button
    const forceBtn = document.createElement('button');
    forceBtn.className = 'force-check-btn';
    forceBtn.innerHTML = '⚡ Force Check';
    forceBtn.title = `Verify each question in ${subj} against website & capture missing screenshots`;
    forceBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      forceBtn.disabled = true;
      forceBtn.innerHTML = 'Checking...';

      try {
        const res = await chrome.runtime.sendMessage({
          type: 'FORCE_CHECK_SUBJECT',
          subject: subj,
          forceAll: false,
        });

        if (res && res.message) {
          activeQuestionText.textContent = res.message;
          activeQuestionText.style.color = '#34d399';
        }

        await loadData();
        await syncStateWithBackground();
      } catch (err) {
        console.error('Force check error:', err);
      } finally {
        forceBtn.disabled = false;
        forceBtn.innerHTML = '⚡ Force Check';
      }
    });

    const count = document.createElement('span');
    count.className = 'subject-count';
    count.textContent = `${data.captured}/${data.total}`;
    if (isFullyCaptured) {
      count.style.color = '#10b981';
      count.style.borderColor = 'rgba(16, 185, 129, 0.4)';
    }

    right.appendChild(forceBtn);
    right.appendChild(count);

    row.appendChild(left);
    row.appendChild(right);

    row.addEventListener('click', (e) => {
      if (e.target !== checkbox && !e.target.closest('.force-check-btn')) {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
      }
    });

    subjectList.appendChild(row);
  });
}

function renderResetSubjectList() {
  resetSubjectList.innerHTML = '';
  const subjects = Object.keys(subjectCounts).sort();

  subjects.forEach((subj) => {
    const data = subjectCounts[subj];
    const isSelected = resetSelectedSubjects.has(subj);

    const row = document.createElement('div');
    row.className = `reset-subject-item ${isSelected ? 'selected' : ''}`;

    const left = document.createElement('div');
    left.className = 'subject-item-left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'subject-checkbox';
    checkbox.checked = isSelected;
    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        resetSelectedSubjects.add(subj);
      } else {
        resetSelectedSubjects.delete(subj);
      }
      updateResetModalState();
    });

    const name = document.createElement('span');
    name.className = 'subject-name';
    name.textContent = subj;

    left.appendChild(checkbox);
    left.appendChild(name);

    const count = document.createElement('span');
    count.className = 'subject-count';
    count.textContent = `${data.captured} captured`;

    row.appendChild(left);
    row.appendChild(count);

    row.addEventListener('click', (e) => {
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
      }
    });

    resetSubjectList.appendChild(row);
  });

  updateResetModalState();
}

function updateResetModalState() {
  confirmResetBtn.disabled = resetSelectedSubjects.size === 0;
  confirmResetBtn.textContent = `Reset Selected (${resetSelectedSubjects.size})`;
}

function setupListeners() {
  // Toggle Select All
  toggleSelectAllBtn.addEventListener('click', () => {
    allSelected = !allSelected;
    const subjects = Object.keys(subjectCounts);
    if (allSelected) {
      subjects.forEach((s) => selectedSubjects.add(s));
      toggleSelectAllBtn.textContent = 'Deselect All';
    } else {
      selectedSubjects.clear();
      toggleSelectAllBtn.textContent = 'Select All';
    }
    renderSubjectList();
    updateButtonsState();
  });

  // Start Import
  startBtn.addEventListener('click', async () => {
    if (selectedSubjects.size === 0) {
      alert('Please select at least one subject to import.');
      return;
    }
    startBtn.disabled = true;
    await chrome.runtime.sendMessage({
      type: 'START_IMPORT',
      subjects: Array.from(selectedSubjects),
    });
    await syncStateWithBackground();
  });

  // Stop Import (Immediately resets to normal IDLE state)
  stopBtn.addEventListener('click', async () => {
    stopBtn.disabled = true;
    await chrome.runtime.sendMessage({ type: 'STOP_IMPORT' });
    await loadData();
    await syncStateWithBackground();
  });

  // Resume Import
  resumeBtn.addEventListener('click', async () => {
    resumeBtn.disabled = true;
    await chrome.runtime.sendMessage({ type: 'RESUME_IMPORT' });
    await syncStateWithBackground();
  });

  // Open Reset Modal
  openResetBtn.addEventListener('click', () => {
    resetSelectedSubjects.clear();
    renderResetSubjectList();
    resetModal.style.display = 'flex';
  });

  // Close Reset Modal
  closeResetModalBtn.addEventListener('click', () => {
    resetModal.style.display = 'none';
  });

  cancelResetBtn.addEventListener('click', () => {
    resetModal.style.display = 'none';
  });

  // Toggle All for Reset
  resetToggleAllBtn.addEventListener('click', () => {
    resetAllSelected = !resetAllSelected;
    const subjects = Object.keys(subjectCounts);
    if (resetAllSelected) {
      subjects.forEach((s) => resetSelectedSubjects.add(s));
      resetToggleAllBtn.textContent = 'Deselect All';
    } else {
      resetSelectedSubjects.clear();
      resetToggleAllBtn.textContent = 'Select All';
    }
    renderResetSubjectList();
  });

  // Confirm Reset
  confirmResetBtn.addEventListener('click', async () => {
    if (resetSelectedSubjects.size === 0) return;
    confirmResetBtn.disabled = true;
    confirmResetBtn.textContent = 'Resetting...';

    await chrome.runtime.sendMessage({
      type: 'RESET_SUBJECTS_SCREENSHOTS',
      subjects: Array.from(resetSelectedSubjects),
    });

    await loadData();
    await syncStateWithBackground();
    resetModal.style.display = 'none';
  });

  // Listen for real-time background messages
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'STATE_UPDATED') {
      applyStateToUI(message.state);
      loadData();
    }
  });
}

async function syncStateWithBackground() {
  const response = await chrome.runtime.sendMessage({ type: 'GET_STATUS' });
  if (response && response.state) {
    applyStateToUI(response.state);
  }
}

function applyStateToUI(state) {
  const { status, currentIndex, queue, stats, currentQuestion } = state;

  // 1. Status Badge
  statusBadge.className = `status-pill status-${status.toLowerCase().replace('_', '-')}`;
  statusBadge.textContent = status.replace('_', ' ');

  // 2. Cloudflare Security Alert
  if (status === 'PAUSED_CLOUDFLARE') {
    securityAlert.style.display = 'block';
  } else {
    securityAlert.style.display = 'none';
  }

  // 3. Progress Info
  const total = stats.total || queue.length || 0;
  const captured = stats.captured || 0;
  const pct = total > 0 ? Math.round((captured / total) * 100) : 0;

  progressCount.textContent = `${captured} / ${total} captured`;
  progressPercent.textContent = `${pct}%`;
  progressBar.style.width = `${pct}%`;

  // 4. Active Question Text
  if (status === 'IMPORTING' && currentQuestion) {
    activeQuestionText.textContent = `Capturing: ${currentQuestion.subject} • Q${currentQuestion.questionNumber} (${currentQuestion.year})`;
    activeQuestionText.style.color = '#60a5fa';
  } else if (status === 'COMPLETED') {
    activeQuestionText.textContent = `✓ Import complete! All selected questions captured.`;
    activeQuestionText.style.color = '#34d399';
  } else if (status === 'PAUSED_CLOUDFLARE') {
    activeQuestionText.textContent = `Paused for security verification on active question.`;
    activeQuestionText.style.color = '#fbbf24';
  } else {
    activeQuestionText.textContent = `Select subjects below and click Begin Import.`;
    activeQuestionText.style.color = '#cbd5e1';
  }

  // 5. Buttons Visibility
  if (status === 'IMPORTING') {
    startBtn.style.display = 'none';
    resumeBtn.style.display = 'none';
    stopBtn.style.display = 'flex';
    stopBtn.disabled = false;
  } else if (status === 'PAUSED_CLOUDFLARE') {
    startBtn.style.display = 'none';
    resumeBtn.style.display = 'flex';
    resumeBtn.disabled = false;
    stopBtn.style.display = 'flex';
    stopBtn.disabled = false;
  } else {
    // Normal / IDLE / Clean Stopped State
    startBtn.style.display = 'flex';
    startBtn.disabled = selectedSubjects.size === 0;
    resumeBtn.style.display = 'none';
    stopBtn.style.display = 'none';
  }
}

function updateButtonsState() {
  startBtn.disabled = selectedSubjects.size === 0;
}
