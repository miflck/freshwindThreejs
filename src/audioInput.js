let mic;
let song, analyzer;

let fft;
let energies = [];


const nBands=32;

// debug
let w;
let initMic=false;

let maxVolumeToRandomWave=0.05;
let isMaxVolume=true;


let =1000;

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







}


var makeWind = throttle(function(mask,intensity) {
 makeRandomWind(mask);
}, 1000);

function draw() {


  //console.log(mic.getSources());

  // Get the average (root mean square) amplitude
  //let rms = analyzer.getLevel();
  fill(127);
  stroke(0);

  background(255);


  if(initMic){

      fill(0,0,255);

  var micLevel = mic.getLevel();
  if(micLevel>maxVolumeToRandomWave){
      makeWind(0,micLevel);
      fill(255,0,0);
  }



    var h = map(micLevel, 0, 1, 0, height);
    rect(0,height,10,-h);

   // console.log("try wind");


    //  makeRandomWind(1);
   /* debounce(function () {
      console.log("debounced wind");

  console.log(micLevel);
      makeRandomWind(1);
    },1);

//}
  /*  debounce(function (event) {
      makeRandomWind(1);
    },1);
  }*/

/*  if(micLevel>maxVolumeToRandomWave){
    if(isMaxVolume)return;
      isMaxVolume=true;
      makeRandomWind(1);
  }else{
        isMaxVolume=false;
  }
}*/

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
}
function error(){
  console.log("error");
}


function toggleSound() {
  //mic.stop();
  if(initMic==true){
    mic.stop();
    initMic=false;

  }else{
   mic.start();
    initMic=true;
        userStartAudio();

      getAudioContext().resume()

  }
}






// as long as it continues to be invoked, raise on every interval
function throttle (func, interval) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function () {
      timeout = false;
    };
    if (!timeout) {
      func.apply(context, args)
      timeout = true;
      setTimeout(later, interval)
    }
  }
}

/*
function debounce(fn, delay) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
      timer = setTimeout(function () {
      fn.apply(context, args);
      }, delay);
    };
}*/

