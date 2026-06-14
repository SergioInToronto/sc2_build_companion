import { LOOKUP } from './lookup.mjs';

const type_map = {
  0: 'structure',
  1: 'unit',
  2: 'upgrade',
}

export function renderResult(result, container) {
  console.log("############", result);
  const html = result.steps.map(step => {
    const name = LOOKUP[step.type]?.[step.id] ?? `Unknown: [${type_map[step.type]}, ${step.id}]`;
    const stepTime = step.minutes * 60 + step.seconds;
    return `
    <div class="step-card" data-step-time="${stepTime}">
      <div class="step-icon"></div>
      <div class="step-info">
        <div class="step-top"><span class="step-time">${step.minutes}:${String(step.seconds).padStart(2, '0')}</span><span class="step-supply">${step.supply}/200</span></div>
        <div class="step-bottom">${name}</div>
      </div>
    </div>
  `;
  }).join('');

  container.innerHTML = html;
}
