// Width of box
var BOX_WIDTH;
// Height of box
var length;
// Distances of box from the center of the coordinate system
var distance;
// Store location of each confetti
var confLocs;
// Store initial angle of each confetti
var confTheta;
// Determines cube height
var cubeHeightSlider;
// Determines wave movement speed
var waveSpeedSlider;
// Determines camera location
var cameraRotationSlider;
// Determines camera zoom
var zoomSlider;

function setup() {
  createCanvas(900, 800, WEBGL);

  // Initialize variables
  BOX_WIDTH = 50;
  distance = 0;
  length = 0;
  confLocs = [];
  confTheta = [];

  // Set up location and angle of confetti
  for (var index = 0; index < 200; ++index) {
    // Position confetti location to spread all over structure
    confLocs.push(
      createVector(random(-500, 500), random(-800, 0), random(-500, 500))
    );
    // Push confetti starting angles
    confTheta.push(random(360));
  }

  // SLIDERS: custom control of wave movement speed, cube height, camera location and camera zoom

  // Slider for wave movement speed
  waveSpeedSlider = createSlider(0.1, 2, 1, 0.1);
  waveSpeedSlider.position(20, 20);
  waveSpeedSlider.style("width", "200px");

  // Slider for cube height
  cubeHeightSlider = createSlider(0.1, 2, 1, 0.1);
  cubeHeightSlider.position(20, 60);
  cubeHeightSlider.style("width", "200px");

  // Slider for camera location
  cameraRotationSlider = createSlider(0.1, 2, 1, 0.1);
  cameraRotationSlider.position(20, 100);
  cameraRotationSlider.style("width", "200px");

  // Zoom slider for camera zoom
  zoomSlider = createSlider(0.6, 1.2, 0.9, 0.1);
  zoomSlider.position(20, 140);
  zoomSlider.style("width", "200px");
}

function draw() {
  // Dark gray background
  background(50);

  // Change the mode to DEGREE
  angleMode(DEGREES);

  // Step 2: NORMAL MATERIAL

  // Normal material not affected by light - placeholder not affected by light
  // normalMaterial();

  stroke(0);
  // Distinguish boxes from one another
  strokeWeight(2);

  // Draw animated confetti
  confetti();

  // LIGHT SOURCES

  // POINT LIGHT SOURCES

  // Blue point light source
  pointLight(50, 100, 255, 500, -500, 200);

  // Red point light source
  pointLight(255, 50, 50, 100, 400, 100);

  // DIRECTIONAL LIGHT SOURCE
  directionalLight(50, 185, 90, -100, -100, -1);

  // Create grid of boxes of uniform size spanning the X and Z axes
  for (var xCoordinate = -400; xCoordinate < 400; xCoordinate += BOX_WIDTH) {
    for (var zCoordinate = -400; zCoordinate < 400; zCoordinate += BOX_WIDTH) {
      push();
      // For each box, compute distance from center of coordinate system
      distance = dist(xCoordinate, 0, zCoordinate, 0, 0, 0);
      // Modulate height of box based on its distance from center of coordinate system in a periodic manner
      length = map(
        sin(distance + frameCount / (0.2 * waveSpeedSlider.value())),
        -1,
        1,
        100,
        300
      );
      // Move box into position within grid system
      translate(xCoordinate, 0, zCoordinate);

      // Create box material -- metallic surface
      specularMaterial(255);

      // Set width and height of box
      box(BOX_WIDTH, length * cubeHeightSlider.value(), BOX_WIDTH);
      pop();
    }
  }

  // Generate a continuous rotation about the grid system
  var xLocation =
    cos(frameCount * cameraRotationSlider.value()) *
    (width / zoomSlider.value());
  var zLocation =
    sin(frameCount * cameraRotationSlider.value()) *
    (width / zoomSlider.value());
  // Position camera location to observe boxess from above and point camera to centre of scene
  camera(xLocation, -600, zLocation, 0, 0, 0, 0, 1, 0);
}

// Function that draws confetti based on location and angle
function confetti() {
  for (var index = 0; index < confLocs.length; ++index) {
    push();
    // Remove diagonal line that splits plane into triangles
    noStroke();
    // Fill plane with random color
    fill(random(255), random(255), random(255));
    // Move to correct position
    translate(confLocs[index].x, confLocs[index].y, confLocs[index].z);
    // Animate confetti to fall downwards
    ++confLocs[index].y;
    // Create spinning effect for confetti
    confTheta[index] += 10;
    // Set initial angle of confetti
    rotateX(confTheta[index]);
    // Draw confetti as a square plane
    plane(15, 15);
    // Reset confetti to top of world once it has reached middle of coordinate system
    if (confLocs[index].y > 0) {
      confLocs[index].y = -800;
    }
    pop();
  }
}
