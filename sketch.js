let img;
let grid = [];
let gridSpacing = 50;
let activePluses = [];
let title;
let baseFontSize;
let dynamicGridSpacing;
let restartButton;

let stage = 1;
let button;

let quotesStage2 = [
  "a lesson you learned over and over again",
  "a number of breaths",
  "the ratio of laughs and cries",
  "pressure underneath your feet",
  "a first time",
  "a last time",
  "the weight of a goodbye",
  "how your skin felt in the sun",
  "a loud silence",
  "the rhythm of your name said aloud",
  "a smell that transported you",
  "moments your heartbeat changed",
  "how long you stayed still",
  "the shape of a scar",
  "what your hands held tightly",
  "a time you felt completely seen",
  "how your voice sounded then",
  "a pattern you've traced in your mind",
  "where the tension settles in your body",
  "the trace left after you left"
];

let quotesStage3 = [
  "a machine that understands your softness",
  "the data your body refuses to give away",
  "archives of joy",
  "a signal only your body can transmit",
  "a code made from your grandmother’s hum",
  "what we carry forward, together",
  "a ceremony we haven’t invented yet",
  "how we find each other again, and again",
  "an object unknown to you",
  "something old that returns transformed",
  "the scent of a memory not yet made",
  "a dream you carry forward",
  "what your breath knows before your mind does",
  "how your name is spoken in a place not yet built",
  "a love letter",
  "a lullaby sung to a child born tomorrow",
];

let activeQuotes = [];
let quoteFadeChance = 0.015;

function preload() {
  img = loadImage("sankofabird.png"); // Replace with your image path
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  if (windowWidth < 600) { // Mobile
    baseFontSize = 12;
    dynamicGridSpacing = 35;
  } else {
    baseFontSize = 18;
    dynamicGridSpacing = 50;
  }

  gridSpacing = dynamicGridSpacing;

  imageMode(CENTER);
  noStroke();
  createGrid();
  createRestartButton();
  createStageButton();
  textLeading(baseFontSize + 12);
}

function draw() {
  background(255);

  // Background grid and pluses
  if (random() < 0.08) spawnRandomPlus();
  checkMouseHover();
  drawGrid();
  drawPluses();


  // Stage-specific overlays
  if (stage === 1) {
    title = "DATAFIED PASTS, DESIROUS FUTURES";
    textSize(baseFontSize-2);
    text("in order to recalim our digital futures from the imaginaries of big tech, we must carve new spaces for counter-temporal technologies that enable our agency. \n\n take a moment to orient yourself in physical and digital space, then begin.", width / 2, height / 2, windowWidth/1.5);
  } else if (stage === 2) {
    title = "rememory is a portal to initmate data personal to the individual and the collective body\nsit with the screen until you see a resonant prompt about the past\nwrite the prompt and your memory on the left side of the page";
    drawActiveQuotes();
  } else if (stage === 3) {
    title = "our unearthed futurity is ripe with desire\nhow do you see yourself becoming alongside the machine and your environment?\nwrite what resonates and your response on the right side of the page";
    drawActiveQuotes();
  } else {
    title = ""
    text("with this reorientation of the past and future,\ntrace the seam between the two side of the paper.\n\nwhat hopes lie dormant there?\n\ntake this with your on your journey\n\nthank you", width / 2, height / 2, windowWidth/1.5);
    restartButton.show();
    restartButton.position((windowWidth - 125) / 2, windowHeight - 80);
  }

  drawTitle();
}


function spawnQuote() {
  let quotePool = stage === 2 ? quotesStage2 : quotesStage3;
  let quote = random(quotePool);
  let duration = random(3000, 5000);
  let now = millis();

  activeQuotes.push({
    text: quote,
    x: random(100, width - 100),
    y: random(100, height - 100),
    startTime: now,
    endTime: now + duration
  });
}

function drawActiveQuotes() {
  if (random() < quoteFadeChance) {
    spawnQuote();
  }

  let now = millis();
  activeQuotes = activeQuotes.filter(q => now < q.endTime);

  textSize(baseFontSize-2);
  textAlign(CENTER, CENTER);
  textStyle(ITALIC);
  textFont("Times New Roman");

  for (let q of activeQuotes) {
    let progress = (now - q.startTime) / (q.endTime - q.startTime);
    let alpha = 255 * sin(progress * PI);
    fill(150, alpha);
    text(q.text, q.x, q.y);
  }
}

function createStageButton() {
  button = createButton('NEXT');
  positionStageButton();

  button.mousePressed(() => {
    stage++;
    activeQuotes = [];
    if (stage >= 4) button.hide();
    else positionStageButton();
  });

  button.style('background-color', 'white');
  button.style('color', 'black');
  button.style('border', '1px solid black');
  button.style('font-family', 'arial');
  button.style('font-size', '16px');
  button.style('font-weight', 'bold');
  button.style('padding', '10px 20px');
  button.style('text-transform', 'uppercase');
  button.style('border-radius', '0');
  button.style('outline', 'none');
  button.style('cursor', 'pointer');

  // Hover effect
  button.mouseOver(() => {
    button.style('background-color', 'black');
    button.style('color', 'white');
  });

  button.mouseOut(() => {
    button.style('background-color', 'white');
    button.style('color', 'black');
  });
}

function drawTitle() {
  textSize(baseFontSize);
  textFont('arial');
  textStyle(NORMAL);
  textAlign(CENTER, CENTER);
  let padding = 12;

  let tw = textWidth(title);
  let th = textAscent() + textDescent();

  let x = width / 2;
  let y = 75;

  fill(255);
  noStroke();
  rectMode(CENTER);
  rect(x, y, tw + padding * 2, th + padding * 4);

  fill(0);
  text(title, x, y, windowWidth/1.5);
}

// =====================
// Grid + Plus Logic
// =====================

function createGrid() {
  grid = [];
  for (let y = gridSpacing / 2; y < height; y += gridSpacing) {
    for (let x = gridSpacing / 2; x < width; x += gridSpacing) {
      grid.push({ x, y });
    }
  }
}

function drawGrid() {
  for (let pt of grid) {
    if (isPlusActiveAt(pt.x, pt.y)) continue;
    fill(175);
    ellipse(pt.x, pt.y, 2, 2);
  }
}

function drawPluses() {
  let now = millis();
  activePluses = activePluses.filter(p => now < p.endTime);

  for (let p of activePluses) {
    let progress = (now - p.startTime) / (p.endTime - p.startTime);
    let alpha = 255 * sin(progress * PI);

    stroke(175, alpha);
    strokeWeight(1);
    line(p.x - 6, p.y, p.x + 6, p.y);
    line(p.x, p.y - 6, p.x, p.y + 6);
  }

  noStroke();
}

function spawnRandomPlus() {
  if (grid.length === 0) return;

  let idx = int(random(grid.length));
  let pt = grid[idx];
  triggerPlusAt(pt.x, pt.y);
}

function triggerPlusAt(x, y) {
  if (isPlusActiveAt(x, y)) return;

  let now = millis();
  let duration = random(1000, 2000);
  activePluses.push({ x, y, startTime: now, endTime: now + duration });
}

function isPlusActiveAt(x, y) {
  return activePluses.some(p => p.x === x && p.y === y);
}

function checkMouseHover() {
  for (let pt of grid) {
    if (dist(mouseX, mouseY, pt.x, pt.y) < 10) {
      triggerPlusAt(pt.x, pt.y);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (windowWidth < 600) {
    baseFontSize = 12;
    dynamicGridSpacing = 35;
  } else {
    baseFontSize = 18;
    dynamicGridSpacing = 50;
  }

  gridSpacing = dynamicGridSpacing;

  createGrid();
  if (stage < 4) button.position((width / 2) - 50, height - 100);
}

function positionStageButton() {
  let btnWidth = 100;
  button.position((windowWidth - btnWidth) / 2, windowHeight - 80);
}

function createRestartButton() {
  restartButton = createButton('RESTART');
  restartButton.hide(); // hidden until stage 4

  restartButton.mousePressed(() => {
    stage = 1;
    activeQuotes = [];
    button.show();
    restartButton.hide();
    positionStageButton();
  });

  restartButton.style('background-color', 'white');
  restartButton.style('color', 'black');
  restartButton.style('border', '1px solid black');
  restartButton.style('font-family', 'arial');
  restartButton.style('font-size', '16px');
  restartButton.style('font-weight', 'bold');
  restartButton.style('padding', '10px 20px');
  restartButton.style('text-transform', 'uppercase');
  restartButton.style('border-radius', '0');
  restartButton.style('outline', 'none');
  restartButton.style('cursor', 'pointer');

  restartButton.mouseOver(() => {
    restartButton.style('background-color', 'black');
    restartButton.style('color', 'white');
  });

  restartButton.mouseOut(() => {
    restartButton.style('background-color', 'white');
    restartButton.style('color', 'black');
  });
}