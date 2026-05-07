const type_map = {
  0: 'structure',
  1: 'unit',
  2: 'upgrade',
}

export function renderResult(result, container) {
  console.log("############", result);
  const html = result.steps.map(step => `
    <div class="step-card">
      <div class="step-icon"></div>
      <div class="step-info">
        <div class="step-top"><span>${step.minutes}:${String(step.seconds).padStart(2, '0')}</span><span>${step.supply}/200</span></div>
        <div class="step-bottom">${type_map[step.type]} - ${step.id}</div>
      </div>
    </div>
  `).join('');

  container.innerHTML = html;
}
