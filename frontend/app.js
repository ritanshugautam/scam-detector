const messageInput = document.getElementById('message-input');
const analyzeBtn = document.getElementById('analyze-btn');
const inputError = document.getElementById('input-error');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const errorBanner = document.getElementById('error-banner');

analyzeBtn.addEventListener('click', async () => {
  const message = messageInput.value.trim();

  // Reset state from any previous run
  inputError.hidden = true;
  messageInput.classList.remove('has-error');
  results.hidden = true;
  errorBanner.hidden = true;

  if (!message) {
    inputError.hidden = false;
    messageInput.classList.add('has-error');
    messageInput.focus();
    return;
  }

  analyzeBtn.disabled = true;
  loading.hidden = false;

  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Server error');
    }

    renderResults(data);
    results.hidden = false;
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch {
    errorBanner.hidden = false;
    errorBanner.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } finally {
    loading.hidden = true;
    analyzeBtn.disabled = false;
  }
});

function renderResults(data) {
  // Verdict badge
  const badge = document.getElementById('verdict-badge');
  badge.textContent = data.verdict;
  badge.className = 'verdict-badge';

  if (data.verdict === 'SCAM') {
    badge.classList.add('scam');
  } else if (data.verdict === 'LIKELY SCAM') {
    badge.classList.add('likely-scam');
  } else {
    badge.classList.add('looks-safe');
  }

  // Explanation
  document.getElementById('explanation').textContent = data.explanation;

  // Red flags
  const flagsCard = document.getElementById('red-flags-card');
  const flagsList = document.getElementById('red-flags-list');
  flagsList.innerHTML = '';

  if (data.red_flags && data.red_flags.length > 0) {
    flagsCard.hidden = false;
    data.red_flags.forEach((flag) => {
      const li = document.createElement('li');
      li.textContent = flag;
      flagsList.appendChild(li);
    });
  } else {
    flagsCard.hidden = true;
  }

  // What to do
  const todoList = document.getElementById('what-to-do-list');
  todoList.innerHTML = '';
  (data.what_to_do || []).forEach((step) => {
    const li = document.createElement('li');
    li.textContent = step;
    todoList.appendChild(li);
  });
}
