const headers = ['Supply', 'Time', 'Type', 'ID', 'Name'];

const type_map = {
  0: 'structure',
  1: 'unit',
  2: 'upgrade',
}

export function renderResult(result, container) {
  const html = `
    <h2>${result.title}</h2>
    <table>
      <thead>
        <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${result.steps.map(step => `
          <tr>
            <td>${step.supply}</td>
            <td>${step.minutes}:${String(step.seconds).padStart(2, '0')}</td>
            <td>${type_map[step.type]}</td>
            <td>${step.id}</td>
            <td>todo</td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;

  container.innerHTML = html;
}
