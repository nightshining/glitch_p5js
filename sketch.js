
let glitch;
let imgPath = "data/profile_cropped1.jpg";
let pass1;
let shader;
let bGlitch, bFilter, bShader, bThresh = false;
let timer = 1;
var counter = 0;
let img;



function setup(){

  createCanvas(400,400);//image size, want this to work with embed no scrolling 
  background(0);
  //imageMode(CENTER);

  glitch = new Glitch();
  // glitch.debug(); // debug info

  glitch.pixelate(.8); // hard pixels
  // glitch.errors(false); // no error messages

  // test loadBytes w/ callback
  glitch.loadBytes(imgPath, function() {
    // glitch.saveBytes('fish_glitch.png'); // toggle saveBytes()
  });

  glitch.loadType('jpg');
  glitch.loadQuality(0.9)

  glitch.loadImage(imgPath); // glitch loadImage()

  loadImage(imgPath, function(img) {
    glitch.loadImage(img); // from p5.js loadImage()
  });


  //glitch.debug(false); // turn off before draw()!

  // shader = loadShader ('shaders/base.vert', 'shaders/solarize.frag');
  // pass1 = createGraphics(width,height, WEBGL);
  // pass1.noStroke();
}

function draw() {

  if (bGlitch) {
    
    glitch.resetBytes(); // fresh bytes
    let randomMin = random(100)/100;
    let randomMax = random(100)/100;
    glitch.limitBytes(randomMin,randomMax) // limit bytes
    // glitch.randomByte(52) // single random
    // glitch.randomBytes(5) // 5 random
    let randomByteMin = random(100);
    let randomByteMax = random(100);
    glitch.randomBytes(randomByteMin,randomByteMax) // 5 random pos, exact val
    glitch.replaceByte(53, 255); // single replace
    glitch.replaceBytes(123, '7c'); // all replace
     //glitch.replaceHex('ffdb00430101', 'ffdb00430155');
     let randomSwap = random(100);
     glitch.swapBytes(1, randomSwap); // swap values
     glitch.buildImage();
      
  }  



   // pass1.shader(shader);
   // shader.setUniform('tex0', glitch.image);
   // shader.setUniform('powerCurve', 1.8);
   // shader.setUniform('centerBrightness',1.0 );
   // shader.setUniform('colorize', 1.0 );
   // shader.setUniform('inverse', 1 );
   // pass1.rect(0,0,width/2, height/2);
 
     
   push();
   scale(0.6,0.6);
   image (glitch.image,0,0);
   pop();
  
   if (bFilter){ 
    filter(INVERT); 
   };



   //fill(255,0,0);
   //copy(pass1, 0, 0, 500, 500, 0, 0, 500, 500);

    
   // let rx = int(random(glitch.image.width));
   // let ry = int(random(glitch.image.height));

 
   counter++;
   bGlitch = false;
   tint(255);
    

   if (bThresh) {
        filter(THRESHOLD);
      }

  if (counter % 60 == 0 && timer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
    timer--;
    bGlitch = false;
  }
  if (timer == 0) {
    counter = 0;
    timer   = int(random(5));
    bGlitch = true;
    bFilter = round(random(1));
    bShader = round(random(1));
    let prob = 0.2;
    let r = random(1);
      if (r < prob) {
        bThresh = true;
      } else {
        bThresh = false;
      }
  
   if (random(1) < 0.9){
        tint( int(random(255)), 0, int(random(200)) );
      }

  }

}

function windowResized(){
  resizeCanvas(400,400);
}

function mousePressed(){
  bGlitch = !bGlitch;
  bFilter = !bFilter;
}


function thresh(){

   // Loop through the pixels X and Y
      for (let y = 0; y < glitch.image.height; y++) {
        for (let x = 0; x < glitch.image.width; x++) {

          // Get the pixel color at (x, y)
          const pixel = glitch.image.get(x, y);
          // Get the brightness value of the pixel
          const gray = brightness(pixel);
        
          // If the pixel is greater than the threshold, return white, otherwise return black
          let r = int(random(10));
          if (gray < r) {
            let red   = int(random(50,255));
            let rW = int(random(x));
            let rY = int(random(y));
            glitch.image.set(rW,rY, color(red,0,0));
          }
          

        }
      }
  
    glitch.image.updatePixels();
}


