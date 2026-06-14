/**
 * createHighlighter — returns a tick callback that highlights the upcoming
 * build-order step(s) based on the game timer.
 *
 * Rules:
 *  - Highlight all cards whose data-step-time equals the lowest step-time
 *    that is strictly greater than gameSeconds (i.e. the next step(s)).
 *  - Edge case: before the first step, highlight the first card.
 *  - Edge case: after the last step, highlight the last card.
 *  - Scroll the first newly-active card into view when the active set changes.
 */
export function createHighlighter(containerEl) {
  let lastActiveTime = undefined; // tracks previous active step-time to detect changes

  return function highlight(gameSeconds) {
    const cards = Array.from(containerEl.querySelectorAll('.step-card'));
    if (cards.length === 0) return;

    const stepTimes = cards.map(c => parseInt(c.dataset.stepTime, 10));

    // Find the lowest step-time strictly greater than gameSeconds (next step)
    let activeTime = null;
    for (const t of stepTimes) {
      if (t > gameSeconds) {
        if (activeTime === null || t < activeTime) activeTime = t;
      }
    }

    // Edge case: no future step — stay on the last card
    if (activeTime === null) {
      activeTime = stepTimes[stepTimes.length - 1];
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
