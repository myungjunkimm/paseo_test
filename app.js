const durationMs = 25 * 60 * 1000;
const timeDisplay = document.querySelector('#time');
const statusDisplay = document.querySelector('#status');
const startButton = document.querySelector('#start');
const pauseButton = document.querySelector('#pause');
const resetButton = document.querySelector('#reset');

let remainingMs = durationMs;
let endTime = null;
let intervalId = null;

function render() {
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  const running = endTime !== null;

  timeDisplay.textContent = `${minutes}:${seconds}`;
  statusDisplay.textContent = remainingMs === 0 ? '집중 완료!' : '';
  startButton.disabled = running || remainingMs === 0;
  pauseButton.disabled = !running;
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
  render();
}

startButton.addEventListener('click', start);
pauseButton.addEventListener('click', pause);
resetButton.addEventListener('click', reset);
document.addEventListener('visibilitychange', tick);
render();
