let grammar;
let lastPhase = null;
let currentLine = "";

let vid;
let loopStart, loopEnd;

let machineLoopStart  = 0;
let machineLoopEnd    = 10;

let embodiedLoopStart = 82;
let embodiedLoopEnd   = 92;

let videoReady = false;

let machineFont, embodiedFont;

/* 
depending on what page we are on, load different grammar and different font
this allows me to have a unified visual aesthetic, timing, and visual on both screens
*/
function preload() {
  machineFont = loadFont('redactionfont.otf');
  embodiedFont = loadFont('redactionnorm.otf');

  if (MODE === "machine") { 
    grammar = loadJSON("grammar/machine.json");
  } else {
    grammar = loadJSON("grammar/embodied.json");
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);  
  pixelDensity(1);
  textAlign(CENTER, CENTER);
  textWrap(WORD);
  textSize(min(width, height) * 0.125);

  // assign the part of the video that is being looped and the font based on the mode
  if (MODE === "machine") {
    loopStart = machineLoopStart;
    loopEnd   = machineLoopEnd;
    textFont(machineFont);
    
    // load and hide the video
    vid = createVideo('glitch.mp4', () => {
      vid.hide();
      vid.volume(0); // required for autoplay
      vid.time(loopStart);
      vid.play();
      videoReady = true;
    });
  } else {
    loopStart = embodiedLoopStart;
    loopEnd   = embodiedLoopEnd;
    textFont(embodiedFont);

    // load and hide the video
    vid = createVideo('Ghana_1979.mp4', () => {
      vid.hide();
      vid.volume(0); // required for autoplay
      vid.time(loopStart);
      vid.play();
      videoReady = true;
    });
  }

  
}

function draw() {
  // if video hasn't loaded yet, just black screen
  if (!videoReady) {
    background(0);
    return;
  }

  if (vid.time() > loopEnd) {
    vid.time(loopStart);
  }

  drawVideo();
  drawText()
}

function drawVideo() {
  background(0);
  image(vid, 0, 0, width, height);

  // darken overlay so can see text better
  noStroke();
  fill(0, 100);   // 100 is the alpha
  rect(0, 0, width, height);
}


function drawText() {
  const phase = getPhase();

  // only generate new line if the phase has changed
  if (phase !== lastPhase) {
    currentLine = generateLine(grammar, MODE, phase);
    lastPhase = phase;
  }

  fill(240, 232, 205);
  noStroke();
  text(
    currentLine,
    (width / 2) - windowWidth * 0.375,
    height / 2,
    windowWidth * 0.75
  );
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}