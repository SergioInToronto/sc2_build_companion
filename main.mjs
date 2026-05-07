import { renderResult } from './display.mjs';

document.getElementById('saltForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.getElementById('saltInput').value;
    const container = document.getElementById('result');
    const result = decodeSALT(input);
    renderResult(result, container);
});
