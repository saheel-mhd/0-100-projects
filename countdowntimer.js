function showSection(section) {
    document.getElementById('stopwatch').classList.add('hidden');
    document.getElementById('countdown').classList.add('hidden');
    
    document.getElementById(section).classList.remove('hidden');
}

function toggleStopwatchBtn(action)  {
    const start = document.getElementById('start-btn-stopwatch');
    const pause = document.getElementById('pause-btn-stopwatch');
    const reset = document.getElementById('reset-btn-stopwatch');
    const resume = document.getElementById('resume-btn-stopwatch');

    if(action === 'start') {
        start.classList.add('hidden');
        pause.classList.remove('hidden');
        reset.classList.remove('hidden');
        resume.classList.add('hidden');
    } else if(action === 'reset') {
        start.classList.remove('hidden');
        pause.classList.add('hidden');
        reset.classList.add('hidden');
        resume.classList.add('hidden');
    } else if(action === 'pause') {
        start.classList.add('hidden');
        pause.classList.add('hidden');
        resume.classList.remove('hidden');
        reset.classList.remove('hidden');
    }
}

function toggleCountdownBtn(action) {
    const start = document.getElementById('start-btn-countdown');
    const pause = document.getElementById('pause-btn-countdown');
    const reset = document.getElementById('reset-btn-countdown');
    if(action === 'start') {
        start.classList.add('hidden');
        pause.classList.remove('hidden')
        reset.classList.remove('hidden');
    } else if(action === 'reset') {
        start.classList.remove('hidden');
        pause.classList.add('hidden');
        reset.classList.add('hidden');
    }
}

function timerUp() {
    let timerInterval;
    let totalSeconds = 0;

    const daysEl = document.querySelector('[x-text="Days"]');
    const hoursEl = document.querySelector('[x-text="Hours"]');
    const minutesEl = document.querySelector('[x-text="Minutes"]');
    const secondsEl = document.querySelector('[x-text="Second"]');

    const startBtn = document.getElementById("start-btn-stopwatch");
    const pauseBtn = document.getElementById("pause-btn-stopwatch");
    const resetBtn = document.getElementById("reset-btn-stopwatch");
    const resumeBtn = document.getElementById("resume-btn-stopwatch");

    function updateDisplay() {
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      daysEl.textContent = String(days).padStart(2, "0");
      hoursEl.textContent = String(hours).padStart(2, "0");
      minutesEl.textContent = String(minutes).padStart(2, "0");
      secondsEl.textContent = String(seconds).padStart(2, "0");
    }

    startBtn.addEventListener("click", () => {
      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        totalSeconds++;
        updateDisplay();
      }, 1000);
    });

    pauseBtn.addEventListener("click", () => {
      clearInterval(timerInterval);
    });

    resetBtn.addEventListener("click", () => {
      clearInterval(timerInterval);
      totalSeconds = 0;
      updateDisplay();
    });

    resumeBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    totalSeconds++;
    updateDisplay();
  }, 1000);
  toggleStopwatchBtn("start"); // or create a new state for 'resumed' if needed
});


    updateDisplay();
  }

  window.addEventListener("DOMContentLoaded", timerUp);