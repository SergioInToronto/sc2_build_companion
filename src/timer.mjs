const START_SECONDS = -3;
const SPEED_FACTOR = 5734 / 4096; // ~1.399, roughly 40% faster than real time

let startRealTime = null;   // Date.now() when the timer was last started
let accumulatedGameSeconds = START_SECONDS; // game-time seconds accumulated before last pause
let intervalId = null;

function formatTime(s) {
  const negative = s < 0;
  const abs = Math.abs(s);
  const minutes = Math.floor(abs / 60);
  const seconds = abs % 60;
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  return negative ? `-${formatted}` : formatted;
}

function currentGameSeconds() {
  if (startRealTime === null) return accumulatedGameSeconds;
  const realElapsed = (Date.now() - startRealTime) / 1000;
  return accumulatedGameSeconds + realElapsed * SPEED_FACTOR;
}

function tick(displayEl, callbacks) {
  const t = Math.floor(currentGameSeconds());
  displayEl.textContent = formatTime(t);
  callbacks.forEach(fn => fn(t));
}

export function initTimer(callbacks = []) {
  const btn = document.getElementById('timerStart');
  const display = document.getElementById('timerDisplay');

  btn.disabled = true;
  display.textContent = formatTime(Math.floor(accumulatedGameSeconds));

  btn.addEventListener('click', () => {
    if (intervalId === null) {
      // Start
      startRealTime = Date.now();
      intervalId = setInterval(() => tick(display, callbacks), 250);
      btn.textContent = 'Pause';
    } else {
      // Pause — snapshot the current game time before stopping
      accumulatedGameSeconds = currentGameSeconds();
      startRealTime = null;
      clearInterval(intervalId);
      intervalId = null;
      btn.textContent = 'Start';
    }
  });
}

export function enableTimer() {
  document.getElementById('timerStart').disabled = false;
}
