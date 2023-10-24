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
  switchBtn.position(width/2,10);
  switchBtn.size(250,50);
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
  cam.size(displayWidth,661);// 이 명령어 추가해주었습니다.
  cam.hide();
  
  detector.detect(cam, gotDetections);
  
}

function switchCam(){
  if(switcher == 0){
    switcher = 1;
    cam.remove();
    cam = createCapture(rearSetting);
    cam.size(displayWidth,661); // 이 명령어 추가해주었습니다.
    cam.hide();
    
    detector.detect(cam, gotDetections);//cam 을 지우고 새롭게 createCapture 를 하였기 때문에, front/rear 카메라 변경될 때마다 이 명령어를 한 번 더 적어주어야 합니다.
  }else if(switcher == 1){
    switcher = 0;
    cam.remove();
    cam = createCapture(frontSetting);
    cam.size(displayWidth,661);// 이 명령어 추가해주었습니다.
    cam.hide();
    
    detector.detect(cam, gotDetections); //cam 을 지우고 새롭게 createCapture 를 하였기 때문에, front/rear 카메라 변경될 때마다 이 명령어를 한 번 더 적어주어야 합니다.
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

function mouseReleased(){
  if(dist(mouseX, mouseY, width/2, 400) <= 35){
    let fileName = 'myCanvas_'+day()+hour()+minute()+second()+'.jpg'
    saveCanvas(image, fileName);
  }
}

function gotDetections(error, results) {
  if (error) {
    console.error(error);
  }
  
  detectedObjects = results;
  detector.detect(cam, gotDetections);
}