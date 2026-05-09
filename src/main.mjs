import { decodeSALT } from './salt.mjs';
import { renderResult } from './display.mjs';
import { initTimer, enableTimer } from './timer.mjs';

initTimer();

document.getElementById('saltForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.getElementById('saltInput').value;
    const container = document.getElementById('result');
    const result = decodeSALT(input);
    renderResult(result, container);
    if (container.children.length > 0) {
        enableTimer();
    }
});
