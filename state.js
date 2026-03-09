//this just used for state managment

//const MODE = window.location.hash.replace("#", ""); // accessing the two different screen
const MODE = window.MODE || (
  window.location.hash.includes("archive") ? "archive" :
  window.location.hash.includes("embodied") ? "embodied" :
  "machine"
);

const MODE_OFFSET = MODE === "embodied" ? 350 : 0;

const CYCLE_DURATION = 25000; // 25 seconds 
const PHASES = ["idle", "build", "hold", "fade"];

let cycleStart = Date.now();

function getPhase() {
  const elapsed =
    (Date.now() - cycleStart - MODE_OFFSET + CYCLE_DURATION) %
    CYCLE_DURATION;

  const progress = elapsed / CYCLE_DURATION;

  if (progress < 0.2) return "build";
  if (progress < 0.5) return "hold";
  return "fade";
}

function resetCycle() {
  cycleStart = Date.now();
}