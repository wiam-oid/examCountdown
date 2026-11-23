const messages = [
  "WA SIIIIR T9RAAAA!",
  "ALLEZ SI BRAHIIIIM",
  "L9RAYA L9RAYA!"
];

const typingSpeed = 150;   // ms per letter (bigger = slower)
const deleteSpeed = 50;    // ms per letter when erasing
const pause = 4000;        // ms the finished message stays on screen

const messageEl = document.getElementById("message");
let messageIndex = 0;
let charIndex = 0;

function type() {
  const current = messages[messageIndex];
  if (charIndex < current.length) {
    messageEl.textContent += current[charIndex];
    charIndex++;
    setTimeout(type, typingSpeed);
  } else {
    setTimeout(erase, pause);
  }
}

function erase() {
  if (charIndex > 0) {
    messageEl.textContent = messageEl.textContent.slice(0, -1);
    charIndex--;
    setTimeout(erase, deleteSpeed);
  } else {
    messageIndex = (messageIndex + 1) % messages.length;
    setTimeout(type, 500);
  }
}

type();


// --- MODULE & PLANNER STATE (must be declared BEFORE updateCountdown runs) ---
const modulesEl = document.getElementById("modules");
const MAX_MODULES = 14;

const savedModules = Number(localStorage.getItem("examModules"));
let moduleCount = savedModules
  ? Math.min(MAX_MODULES, Math.max(1, savedModules))
  : 12;
modulesEl.textContent = moduleCount;

function updatePlanner(totalSeconds) {
  const totalHoursLeft  = totalSeconds / 3600;
  const totalDaysLeft   = totalSeconds / 86400;
  const hoursPerModule  = totalHoursLeft / moduleCount;
  const daysPerModule   = totalDaysLeft / moduleCount;
  const modulesPerDay   = totalDaysLeft > 0 ? moduleCount / totalDaysLeft : 0;

  document.getElementById("hours-left").textContent       = Math.floor(totalHoursLeft);
  document.getElementById("hours-per-module").textContent = hoursPerModule.toFixed(1);
  document.getElementById("days-per-module").textContent  = daysPerModule.toFixed(1);
  document.getElementById("modules-per-day").textContent  = modulesPerDay.toFixed(2);
}

function changeModules(delta) {
  moduleCount = Math.min(MAX_MODULES, Math.max(1, moduleCount + delta));
  modulesEl.textContent = moduleCount;
  localStorage.setItem("examModules", moduleCount);
  updateCountdown();
}

document.getElementById("dec-modules").addEventListener("click", () => changeModules(-1));
document.getElementById("inc-modules").addEventListener("click", () => changeModules(1));


// --- COUNTDOWN TIMER ---
const examDate = new Date("2026-12-21T08:00:00+01:00");

function updateCountdown() {
  const diff = examDate - new Date();          // milliseconds left
  const totalSeconds = Math.max(0, Math.floor(diff / 1000));

  const days    = Math.floor(totalSeconds / 86400);
  const hours   = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  document.getElementById("days").textContent    = days;
  document.getElementById("hours").textContent   = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");

  updatePlanner(totalSeconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);


// --- WORLD CLOCKS ---
function formatTime(timeZone) {
  const now = new Date();
  return now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timeZone
  });
}

function updateClocks() {
  document.getElementById("ma-time").textContent     = formatTime("Africa/Casablanca");
  document.getElementById("london-time").textContent = formatTime("Europe/London");
  document.getElementById("moscow-time").textContent = formatTime("Europe/Moscow");
  document.getElementById("cairo-time").textContent  = formatTime("Africa/Cairo");
}

updateClocks();
setInterval(updateClocks, 1000);

// --- SCROLL CONFETTI ---
const canvas = document.getElementById("confetti-canvas");
const myConfetti = confetti.create(canvas, {
  resize: true,
  useWorker: true
});

const plannerSection = document.querySelector(".planner");
let hasFiredConfetti = false;

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      myConfetti({
        particleCount: 120,
        spread: 160,
        origin: { y: 0.6 }
      });
    }
  });
}, {
  threshold: 0.6 // Triggers when 60% of the planner section is visible
});

scrollObserver.observe(plannerSection);