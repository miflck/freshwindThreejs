let mic;
let song, analyzer;

let fft;
let energies = [];


const nBands=32;

// debug
let w;
let initMic=false;

let maxVolumeToRandomWave=0.1;
let isMaxVolume=true;


function preload(){
  //song = loadSound('assets/Game Ambient.mp3');
  console.log("preload");
}

function setup() {


  mic = new p5.AudioIn(error());
  mic.start();

  let cnv = createCanvas(100, 100);
  cnv.id('mycanvas');

  w=width/nBands;

  // Create an Audio input
//  mic = new p5.AudioIn();

  // start the Audio Input.
  // By default, it does not .connect() (to the computer speakers)
  //mic.start();

 // song.loop();

// song.setVolume(0.5);
 // console.log(song);

/*
  // create a new Amplitude analyzer
  analyzer = new p5.Amplitude();
  // Patch the input to an volume analyzer
  analyzer.setInput(song);
*/
 // fft = new p5.FFT(0.9,nBands);
 //  var spectrum = fft.analyze();






   //   mic.start();


}

function draw() {
  //console.log(mic.getSources());
  background(200);

  // Get the average (root mean square) amplitude
  //let rms = analyzer.getLevel();
  fill(127);
  stroke(0);
  if(initMic){
  var micLevel = mic.getLevel();
  console.log(micLevel);
  var h = map(micLevel, 0, 1, 0, height);
  rect(0,height,10,-h);

  if(micLevel>maxVolumeToRandomWave){
    if(isMaxVolume)return;
      isMaxVolume=true;
      makeRandomWind(1);
  }else{
        isMaxVolume=false;
  }
}

/*var spectrum = fft.analyze();
var h = map(fft.getEnergy("highMid"), 0, 255, 0, height);
fill(255,0,0);
rect(0,height,10,-h);

if(h>150)makeRandomWind(0);
*/
//rect(0,height,10,-100);



  /*noStroke();
  fill(0,255,0); // spectrum is green
  for (var i = 0; i< spectrum.length; i++){
    var x = map(i, 0, spectrum.length, 0, width);
    var h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width / spectrum.length-2, h )
  }*/

 /*  var waveform = fft.waveform();
  noFill();
  beginShape();
  stroke(255,0,0); // waveform is red
  strokeWeight(1);
  for (var i = 0; i< waveform.length; i++){
    var x = map(i, 0, waveform.length, 0, width);
    var y = map( waveform[i], -1, 1, 0, height);
    vertex(x,y);
  }
  endShape();
*/

}

function error(){
  console.log("error");
}


function toggleSound() {
//mic.stop();
if(initMic==true){
  mic.stop();
  initMic=false;
  userStartAudio();

}else{
  mic.start();
  initMic=true;
}



  //mic.getSources(function(deviceList) {
    //print out the array of available sources
    //console.log(deviceList);
    //set the source to the first item in the deviceList array
   // mic.setSource(0);
     

 // });
  /* console.log("song? "+song.isPlaying());
  if ( song.isPlaying() ) { // .isPlaying() returns a boolean
    song.pause(); // .play() will resume from .pause() position
  } else {
    song.play();
    background(0,255,0);
  }*/
}