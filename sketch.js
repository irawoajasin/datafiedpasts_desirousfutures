let grammar;
let lastPhase = null;
let currentLine = "";

let vid;
let loopStart, loopEnd;
let archiveStartTime;

let machineLoopStart  = 0;
let machineLoopEnd    = 10;

let embodiedLoopStart = 82;
let embodiedLoopEnd   = 92;

let videoReady = false;

let machineFont, embodiedFont;

let machineGrammar;
let embodiedGrammar;

let machineLine = "";
let embodiedLine = "";

let machineVid;
let embodiedVid;

/* 
depending on what page we are on, load different grammar and different font
this allows me to have a unified visual aesthetic, timing, and visual on both screens
*/
function preload() {
  machineFont = loadFont('redactionfont.otf');
  embodiedFont = loadFont('redactionnorm.otf');

  if (MODE === "machine") {
    grammar = loadJSON("grammar/machine.json");
  } else if (MODE === "embodied") {
    grammar = loadJSON("grammar/embodied.json");
  } else if (MODE === "archive") {
    machineGrammar = loadJSON("grammar/machine.json");
    embodiedGrammar = loadJSON("grammar/embodied.json");
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);  
  pixelDensity(1);
  textAlign(CENTER, CENTER);
  textWrap(WORD);
  textSize(min(width, height) * 0.075);

  archiveStartTime = millis();

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

  if (MODE === "archive") {
    machineVid = createVideo("glitch.mp4");
    machineVid.hide();
    machineVid.volume(0);
    machineVid.elt.muted = true;

    embodiedVid = createVideo("Ghana_1979.mp4");
    embodiedVid.hide();
    embodiedVid.volume(0);
    embodiedVid.elt.muted = true;

    machineVid.elt.onloadeddata = () => {
      machineVid.elt.currentTime = machineLoopStart;
      machineVid.elt.play();
    };

    embodiedVid.elt.onloadeddata = () => {
      embodiedVid.elt.currentTime = embodiedLoopStart;
      embodiedVid.elt.play();
    };
  }
}

function draw() {
  // if video hasn't loaded yet, just black screen
  if (MODE !== "archive" && !videoReady) {
  background(0);
  return;
}

  if (MODE === "archive") {
    drawArchive();
    return;
  } else {
    drawVideo();
    drawText();
  }

  if (vid.time() > loopEnd) {
    vid.time(loopStart);
  }
}

function drawVideo() {
  background(0);
  image(vid, 0, 0, width, height);

  // darken overlay so can see text better
  noStroke();
  //fill(0, 50);  // 100 is the alpha
  //rect(0, 0, width, height);
}


function drawText() {
  const phase = getPhase();

  // only generate new line if the phase has changed
  if (phase !== lastPhase) {
    currentLine = generateLine(grammar);
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

function drawArchive() {
  if (!machineVid || !embodiedVid) return;
  if (machineVid.elt.readyState < 2 || embodiedVid.elt.readyState < 2) {
    background(0);
    return;
  }

  background(0);
  let half = width / 2;
  image(machineVid, 0, 0, half, height);
  image(embodiedVid, half, 0, half, height);

  // handle looping manually
  if (machineVid.time() >= machineLoopEnd) machineVid.elt.currentTime = machineLoopStart;
  if (embodiedVid.time() >= embodiedLoopEnd) embodiedVid.elt.currentTime = embodiedLoopStart;

  drawArchiveText();
}

function drawArchiveText() {

  const phase = getPhase();

  if (phase !== lastPhase) {

    machineLine = generateLine(machineGrammar);
    embodiedLine = generateLine(embodiedGrammar);

    lastPhase = phase;
  }

  fill(240,232,205);
  textAlign(CENTER, CENTER);

  let half = width / 2;

  textFont(machineFont);
  text(machineLine, half * 0.1, height/2, half * 0.8);
  textFont(embodiedFont);
  text(embodiedLine, half + half*0.1, height/2, half * 0.8);
}