// New Year Countdown Clock App

const countdownEl = document.getElementById('countdown');
const currentTimeEl = document.getElementById('current-time');
const targetForm = document.getElementById('target-form');
const targetInput = document.getElementById('target-datetime');
const fireworksEl = document.getElementById('fireworks');
const fireworkImg = document.getElementById('firework-img');

const STORAGE_KEY = 'ny-countdown-target';

function getDefaultTargetDate() {
  const now = new Date();
  let year = now.getFullYear();
  // If it's already New Year's Day, set for next year
  if (now.getMonth() === 0 && now.getDate() === 1 && now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
    year += 1;
  }
  return new Date(`${year}-01-01T00:00:00`);
}

function loadTargetDate() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return new Date(stored);
  }
  return getDefaultTargetDate();
}

function saveTargetDate(date) {
  localStorage.setItem(STORAGE_KEY, date.toISOString());
}

function updateCountdown(targetDate) {
  const now = new Date();
  let diff = targetDate - now;
  if (diff < 0) diff = 0;
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  countdownEl.textContent = `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
}

function updateCurrentTime() {
  const now = new Date();
  currentTimeEl.textContent = now.toLocaleTimeString();
}

function showFireworks() {
  document.body.style.overflow = 'hidden';
  fireworksEl.style.display = 'flex';
}

function hideFireworks() {
  document.body.style.overflow = '';
  fireworksEl.style.display = 'none';
}

function setInputToTarget(targetDate) {
  // Format as yyyy-MM-ddTHH:mm for input
  const pad = n => String(n).padStart(2, '0');
  const y = targetDate.getFullYear();
  const m = pad(targetDate.getMonth() + 1);
  const d = pad(targetDate.getDate());
  const h = pad(targetDate.getHours());
  const min = pad(targetDate.getMinutes());
  targetInput.value = `${y}-${m}-${d}T${h}:${min}`;
}

let targetDate = loadTargetDate();
setInputToTarget(targetDate);

let countdownInterval = setInterval(() => {
  updateCountdown(targetDate);
  updateCurrentTime();
  if (targetDate - new Date() <= 0) {
    clearInterval(countdownInterval);
    document.querySelector('main').style.display = 'none';
    showFireworks();
  }
}, 1000);

updateCountdown(targetDate);
updateCurrentTime();

// Handle form submission
if (targetForm) {
  targetForm.addEventListener('submit', e => {
    e.preventDefault();
    const val = targetInput.value;
    if (val) {
      targetDate = new Date(val);
      saveTargetDate(targetDate);
      setInputToTarget(targetDate);
      hideFireworks();
      document.querySelector('main').style.display = '';
      clearInterval(countdownInterval);
      countdownInterval = setInterval(() => {
        updateCountdown(targetDate);
        updateCurrentTime();
        if (targetDate - new Date() <= 0) {
          clearInterval(countdownInterval);
          document.querySelector('main').style.display = 'none';
          showFireworks();
        }
      }, 1000);
      updateCountdown(targetDate);
      updateCurrentTime();
    }
  });
}
