const START_SECONDS = -3;

let elapsedSeconds = START_SECONDS;
let intervalId = null;

function formatTime(s) {
  const negative = s < 0;
  const abs = Math.abs(s);
  const minutes = Math.floor(abs / 60);
  const seconds = abs % 60;
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  return negative ? `-${formatted}` : formatted;
}

function tick(displayEl) {
  elapsedSeconds += 1;
  displayEl.textContent = formatTime(elapsedSeconds);
}

export function initTimer() {
  const btn = document.getElementById('timerStart');
  const display = document.getElementById('timerDisplay');

  display.textContent = formatTime(elapsedSeconds);

  btn.addEventListener('click', () => {
    if (intervalId === null) {
      // Start
      intervalId = setInterval(() => tick(display), 1000);
      btn.textContent = 'Pause';
    } else {
      // Pause
      clearInterval(intervalId);
      intervalId = null;
      btn.textContent = 'Start';
    }
  });
}
