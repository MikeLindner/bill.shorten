// DOM Elements
const urlInput = document.getElementById('url');
const titleInput = document.getElementById('title');
const shortenBtn = document.getElementById('shorten-btn');
const resultDiv = document.getElementById('result');
const resultUrl = document.getElementById('result-url');
const copyBtn = document.getElementById('copy-btn');
const copyFeedback = document.getElementById('copy-feedback');
const errorDiv = document.getElementById('error');
const remainingSpan = document.getElementById('remaining');

// Load remaining count on startup
async function loadRemainingCount() {
  const result = await window.billAPI.getRemainingCount();
  if (result.success) {
    remainingSpan.textContent = result.count;
  } else {
    remainingSpan.textContent = '???';
  }
}

// Shorten URL
async function shortenUrl() {
  const url = urlInput.value.trim();
  const title = titleInput.value.trim() || 'Shortened Link';
  
  // Validation
  if (!url) {
    showError('Please enter a URL to shorten');
    return;
  }
  
  if (!isValidUrl(url)) {
    showError('Please enter a valid URL (including https://)');
    return;
  }
  
  // UI feedback
  shortenBtn.disabled = true;
  shortenBtn.classList.add('loading');
  hideError();
  resultDiv.classList.add('hidden');
  
  try {
    const result = await window.billAPI.createShortLink(url, title);
    
    if (result.success) {
      resultUrl.value = result.shortUrl;
      resultDiv.classList.remove('hidden');
      remainingSpan.textContent = result.remaining;
      
      // Clear inputs for next use
      urlInput.value = '';
      titleInput.value = '';
      urlInput.focus();
    } else {
      showError(result.error || 'Failed to create short link');
    }
  } catch (error) {
    showError('An unexpected error occurred');
    console.error(error);
  } finally {
    shortenBtn.disabled = false;
    shortenBtn.classList.remove('loading');
  }
}

// Copy to clipboard
async function copyToClipboard() {
  await window.billAPI.copyToClipboard(resultUrl.value);
  
  copyFeedback.classList.add('show');
  copyBtn.textContent = '✅';
  
  setTimeout(() => {
    copyFeedback.classList.remove('show');
    copyBtn.textContent = '📋';
  }, 2000);
}

// Helpers
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

function showError(message) {
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
}

function hideError() {
  errorDiv.classList.add('hidden');
}

// Event Listeners
shortenBtn.addEventListener('click', shortenUrl);
copyBtn.addEventListener('click', copyToClipboard);

// Enter key to submit
urlInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') titleInput.focus();
});

titleInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') shortenUrl();
});

// Double-click result to copy
resultUrl.addEventListener('dblclick', copyToClipboard);

// Initialize
loadRemainingCount();
