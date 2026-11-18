const durationMs = 25 * 60 * 1000;
const baseTitle = '집중 타이머';
const timeDisplay = document.querySelector('#time');
const statusDisplay = document.querySelector('#status');
const startButton = document.querySelector('#start');
const pauseButton = document.querySelector('#pause');
const resetButton = document.querySelector('#reset');

let remainingMs = durationMs;
let endTime = null;
let intervalId = null;
let started = false;

function formatTime(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function render() {
  const time = formatTime(remainingMs);
  const running = endTime !== null;
  const completed = remainingMs === 0;
  const status = completed ? '집중 완료!' : '';

  timeDisplay.textContent = time;
  statusDisplay.textContent = status;
  startButton.disabled = running || completed;
  pauseButton.disabled = !running;

  let title = baseTitle;
  if (completed) {
    title = `${status} - ${baseTitle}`;
  } else if (started) {
    title = `${time} ${baseTitle}`;
  }
  if (document.title !== title) document.title = title;
}

function stop() {
  clearInterval(intervalId);
  intervalId = null;
  endTime = null;
}

function syncRemainingTime() {
  remainingMs = Math.max(0, endTime - Date.now());
}

function tick() {
  if (endTime === null) return;

  syncRemainingTime();
  if (remainingMs === 0) stop();
  render();
}

function start() {
  if (endTime !== null || remainingMs === 0) return;

  started = true;
  endTime = Date.now() + remainingMs;
  intervalId = setInterval(tick, 200);
  render();
}

function pause() {
  if (endTime === null) return;

  syncRemainingTime();
  stop();
  render();
}

function reset() {
  stop();
  remainingMs = durationMs;
  started = false;
  render();
}

startButton.addEventListener('click', start);
pauseButton.addEventListener('click', pause);
resetButton.addEventListener('click', reset);
document.addEventListener('visibilitychange', tick);
render();

function initThemeToggle() {
  const root = document.documentElement;
  const toggle = document.querySelector('#theme-toggle');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

  function isDarkTheme() {
    return root.dataset.theme ? root.dataset.theme === 'dark' : systemTheme.matches;
  }

  function updateThemeToggle() {
    toggle.setAttribute('aria-pressed', String(isDarkTheme()));
  }

  function toggleTheme() {
    const theme = isDarkTheme() ? 'light' : 'dark';
    root.dataset.theme = theme;
    updateThemeToggle();

    try {
      localStorage.setItem('focus-timer-theme', theme);
    } catch {
      // Keep the override for this page when storage is unavailable.
    }
  }

  toggle.addEventListener('click', toggleTheme);
  systemTheme.addEventListener('change', updateThemeToggle);
  updateThemeToggle();
}

initThemeToggle();
