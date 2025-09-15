let laneCounts = [0, 0, 0, 0];
let laneTimes = [0, 0, 0, 0];
let topLanes = [0, 1];
let isManual = false;
const minGreen = 5;
const maxGreen = 180;
const maxCount = 100;

class TrafficDashboard {
  constructor() {
    this.initElements();
    this.setupEventListeners();
    this.updateTimestamp();
    this.updateDashboard();
    this.startUpdateInterval();
  }

  initElements() {
    this.manualToggle = document.getElementById('manual-toggle');
    this.manualInputs = document.getElementById('manual-inputs');
    this.overrideStatus = document.getElementById('override-status');
    this.applyManual = document.getElementById('apply-manual');
    this.statusIndicator = this.overrideStatus.querySelector('.status-indicator');
    this.timestamp = document.getElementById('timestamp');
  }

  setupEventListeners() {
    this.manualToggle.addEventListener('change', (e) => this.toggleManualMode(e));
    this.applyManual.addEventListener('click', (e) => this.applyManualSettings(e));
  }

  toggleManualMode(event) {
    isManual = event.target.checked;
    this.manualInputs.classList.toggle('active', isManual);
    const statusText = isManual ? 'Manual Mode Active' : 'AI Mode Active';
    const indicatorClass = isManual ? 'inactive-indicator' : 'active-indicator';
    this.overrideStatus.innerHTML = `${statusText} <span class="status-indicator ${indicatorClass}"></span>`;
    if (!isManual) {
      this.updateDashboard();
    }
  }

  applyManualSettings(event) {
    event.preventDefault();
    if (isManual) {
      try {
        laneTimes = [
          Math.min(Math.max(parseFloat(document.getElementById('manual-lane1').value) || 30, minGreen), maxGreen),
          Math.min(Math.max(parseFloat(document.getElementById('manual-lane2').value) || 30, minGreen), maxGreen),
          Math.min(Math.max(parseFloat(document.getElementById('manual-lane3').value) || 30, minGreen), maxGreen),
          Math.min(Math.max(parseFloat(document.getElementById('manual-lane4').value) || 30, minGreen), maxGreen)
        ];

        const select = document.getElementById('active-lane1');
        topLanes = Array.from(select.selectedOptions).map(opt => parseInt(opt.value));
        if (topLanes.length !== 2) {
          alert('Please select exactly 2 active lanes.');
          return;
        }
        this.updateDashboard();
      } catch (error) {
        console.error('Error applying manual settings:', error);
        alert('Invalid input. Please check values.');
      }
    }
  }

  updateLaneCounts() {
    // Simulate (replace with real YOLO data)
    laneCounts = laneCounts.map(() => Math.floor(Math.random() * 40));
    return laneCounts;
  }

  calculateGreenTimes(counts) {
    return counts.map(count => Math.min(minGreen + (count / maxCount) * (maxGreen - minGreen), maxGreen));
  }

  updateDashboard() {
    if (!isManual) {
      const counts = this.updateLaneCounts();
      laneTimes = this.calculateGreenTimes(counts);
      topLanes = counts.map((count, idx) => [count, idx])
                       .sort((a, b) => b[0] - a[0])
                       .slice(0, 2)
                       .map(x => x[1]);
      laneCounts = counts;
    }

    // Update lane info with fade animation
    for (let i = 0; i < 4; i++) {
      const infoDiv = document.getElementById(`lane${i+1}-info`);
      const color = topLanes.includes(i) ? '#10b981' : '#ef4444'; // Green/Red hex for inline style
      const status = topLanes.includes(i) ? 'ACTIVE' : '';
      infoDiv.innerHTML = `
        <p class="text-sm font-medium text-gray-300">Lane ${i+1}: ${laneCounts[i]} cars</p>
        <p class="text-sm text-blue-400">Green Time: ${laneTimes[i].toFixed(1)}s</p>
        <p class="status text-lg font-bold" style="color: ${color}">${status}</p>
      `;
      infoDiv.style.animation = 'fadeInUp 0.5s ease-out';

      // Smooth chart updates using requestAnimationFrame
      this.animateBar(`chart-bar-${i+1}`, (laneCounts[i] / 40) * 100, 'green');
      this.animateBar(`chart-bar-time-${i+1}`, (laneTimes[i] / maxGreen) * 100, 'blue');
    }
    this.updateTimestamp();
  }

  animateBar(barId, targetHeight, color) {
    const bar = document.querySelector(`#${barId} div`);
    const startHeight = parseFloat(bar.style.height) || 0;
    const duration = 700;
    const startTime = performance.now();

    function animate(time) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
      bar.style.height = `${startHeight + (targetHeight - startHeight) * easeProgress}%`;
      bar.style.backgroundColor = color === 'green' ? '#10b981' : '#3b82f6';
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  updateTimestamp() {
    this.timestamp.textContent = `Updated: ${new Date().toLocaleTimeString()}`;
  }

  startUpdateInterval() {
    setInterval(() => {
      if (!isManual) {
        this.updateDashboard();
      }
    }, 1000);
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  try {
    new TrafficDashboard();
  } catch (error) {
    console.error('Dashboard initialization failed:', error);
  }
});