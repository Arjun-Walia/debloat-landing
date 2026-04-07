const { performance } = require('perf_hooks');

// Mock a simple DOM
const dom = {
  elements: {
    'quick-start': { id: 'quick-start', offsetTop: 0 },
    'openclaw-cmd': { id: 'openclaw-cmd', offsetTop: 500 },
    'architecture': { id: 'architecture', offsetTop: 1000 },
    'safety': { id: 'safety', offsetTop: 1500 }
  },
  getElementById: function(id) {
    // Simulate DOM lookup overhead
    let sum = 0;
    for (let i = 0; i < 100; i++) { sum += Math.random(); }
    return this.elements[id] || null;
  }
};

const sidebarNav = [
  { id: 'quick-start', label: 'QUICK_START', num: '01' },
  { id: 'openclaw-cmd', label: 'OPENCLAW_CMD', num: '02' },
  { id: 'architecture', label: 'ARCHITECTURE', num: '03' },
  { id: 'safety', label: 'SAFETY_GUIDE', num: '04' },
];

const iterations = 10000;

// Baseline (Old approach)
function testBaseline() {
  const start = performance.now();
  for (let iter = 0; iter < iterations; iter++) {
    const sections = sidebarNav.map(nav => dom.getElementById(nav.id));
    const scrollPos = 800;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section && section.offsetTop <= scrollPos) {
        break;
      }
    }
  }
  return performance.now() - start;
}

// Optimized (Cached approach)
function testOptimized() {
  const sections = sidebarNav.map(nav => ({
    id: nav.id,
    element: dom.getElementById(nav.id)
  }));

  const start = performance.now();
  for (let iter = 0; iter < iterations; iter++) {
    const scrollPos = 800;

    for (let i = sections.length - 1; i >= 0; i--) {
      const { id, element } = sections[i];
      if (element && element.offsetTop <= scrollPos) {
        break;
      }
    }
  }
  return performance.now() - start;
}

const baselineTime = testBaseline();
const optimizedTime = testOptimized();

console.log(`Baseline (Repeated lookups): ${baselineTime.toFixed(2)}ms`);
console.log(`Optimized (Cached elements): ${optimizedTime.toFixed(2)}ms`);
console.log(`Improvement: ${((baselineTime - optimizedTime) / baselineTime * 100).toFixed(2)}% faster`);
