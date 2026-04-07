const { JSDOM } = require("jsdom");
const { window } = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
const document = window.document;

function baseline(gridSize) {
  const pixelGridEl = document.createElement('div');
  document.body.appendChild(pixelGridEl);
  pixelGridEl.innerHTML = '';

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const pixel = document.createElement('div');
      pixel.classList.add('pixelated-image-card__pixel');
      pixel.style.backgroundColor = 'currentColor';

      const size = 100 / gridSize;
      pixel.style.width = `${size}%`;
      pixel.style.height = `${size}%`;
      pixel.style.left = `${col * size}%`;
      pixel.style.top = `${row * size}%`;
      pixelGridEl.appendChild(pixel);
    }
  }
  document.body.removeChild(pixelGridEl);
}

function optimized(gridSize) {
  const pixelGridEl = document.createElement('div');
  document.body.appendChild(pixelGridEl);
  pixelGridEl.innerHTML = '';
  const fragment = document.createDocumentFragment();

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const pixel = document.createElement('div');
      pixel.classList.add('pixelated-image-card__pixel');
      pixel.style.backgroundColor = 'currentColor';

      const size = 100 / gridSize;
      pixel.style.width = `${size}%`;
      pixel.style.height = `${size}%`;
      pixel.style.left = `${col * size}%`;
      pixel.style.top = `${row * size}%`;
      fragment.appendChild(pixel);
    }
  }
  pixelGridEl.appendChild(fragment);
  document.body.removeChild(pixelGridEl);
}

const gridSize = 50; // 2500 pixels per iteration
const iterations = 100;

// Warmup
for (let i = 0; i < 10; i++) {
  baseline(gridSize);
  optimized(gridSize);
}

const baselineStart = performance.now();
for (let i = 0; i < iterations; i++) {
  baseline(gridSize);
}
const baselineTime = performance.now() - baselineStart;
console.log(`Baseline: ${baselineTime.toFixed(2)} ms`);

const optimizedStart = performance.now();
for (let i = 0; i < iterations; i++) {
  optimized(gridSize);
}
const optimizedTime = performance.now() - optimizedStart;
console.log(`Optimized: ${optimizedTime.toFixed(2)} ms`);
console.log(`Improvement: ${((baselineTime - optimizedTime) / baselineTime * 100).toFixed(2)}%`);
