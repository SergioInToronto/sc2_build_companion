/**
 * createHighlighter — returns a tick callback that highlights the current
 * build-order step(s) based on the game timer.
 *
 * Rules:
 *  - Highlight all cards whose data-step-time equals the highest step-time
 *    that is <= gameSeconds (i.e. the most recently reached step(s)).
 *  - Edge case: if gameSeconds is before the very first step, highlight the
 *    first card anyway.
 *  - Scroll the first newly-active card into view when the active set changes.
 */
export function createHighlighter(containerEl) {
  let lastActiveTime = undefined; // tracks previous active step-time to detect changes

  return function highlight(gameSeconds) {
    const cards = Array.from(containerEl.querySelectorAll('.step-card'));
    if (cards.length === 0) return;

    // Build a sorted list of unique step times
    const stepTimes = cards.map(c => parseInt(c.dataset.stepTime, 10));

    // Find the highest step-time that has been reached
    let activeTime = null;
    for (const t of stepTimes) {
      if (t <= gameSeconds) {
        if (activeTime === null || t > activeTime) activeTime = t;
      }
    }

    // Edge case: timer hasn't reached any step yet — highlight the first card
    if (activeTime === null) {
      activeTime = stepTimes[0];
    }

    const changed = activeTime !== lastActiveTime;
    lastActiveTime = activeTime;

    let firstActive = null;
    cards.forEach((card, i) => {
      const isActive = stepTimes[i] === activeTime;
      card.classList.toggle('step-active', isActive);
      if (isActive && firstActive === null) firstActive = card;
    });

    if (changed && firstActive) {
      firstActive.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };
}
