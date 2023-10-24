let state = 0; // 0: photo available 1: photo taken
let switcher = 0; // 0:front 1:rear
let cam;
let switchBtn;

let rearSetting;
let frontSetting;

let detector;
let detectedObjects = [];

function preload(){
  detector = ml5.objectDetector('cocossd');
}

function setup() {
  //pixelDensity(1);
  createCanvas(displayWidth, displayHeight);
  
  switchBtn = createButton('Switch');
  switchBtn.position(10,10);
  switchBtn.size(150,50);
  switchBtn.mouseReleased(switchCam);
  

  rearSetting = {
    audio: false,
    video: {
      facingMode: {
        exact: "environment" //rear camera
      }
    }
  }
  
  frontSetting = {
    audio: false,
    video: {
      facingMode: {
        exact: "user" //front camera
      }
    }
  }
  
  cam = createCapture(frontSetting);
  cam.size(displayWidth,661);
  cam.hide();
  
  detector.detect(cam, gotDetections);
  
}

function switchCam(){
  if(switcher == 0){
    switcher = 1;
    cam.remove();
    cam = createCapture(rearSetting);
    cam.size(displayWidth,661);
    cam.hide();
    
    detector.detect(cam, gotDetections);
  }else if(switcher == 1){
    switcher = 0;
    cam.remove();
    cam = createCapture(frontSetting);
    cam.size(displayWidth,661);
    cam.hide();
    
    detector.detect(cam, gotDetections);
  }
}

function draw() {
  background(0);
  
  image(cam,0,100,displayWidth,661);
  
  fill(230);
  noStroke();
  ellipse(width/2,800,70);
  fill(230,0,0);
  ellipse(width/2,800,50);
}
  


function gotDetections(error, results) {
  if (error) {
    console.error(error);
  }
  
  for (let i = 0; i < detectedObjects.length; i++) {
    let object = detectedObjects[i];
    if(object.label == 'apple'){
      stroke(0,255,0);
      strokeWeight(4);
      noFill();
      rect(object.x, object.y, object.width, object.height);
      noStroke();
      fill(0,255,0);
      textSize(24);
      text(object.label, object.x + 10, object.y+24);
  }
}
  
  detectedObjects = results;
  detector.detect(cam, gotDetections);
}