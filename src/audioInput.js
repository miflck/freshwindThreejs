let mic;
let song, analyzer;

let fft;
let energies = [];


const nBands=256;

// debug
let w;
let initMic=false;

let maxVolumeToRandomWave=0.05;
let isMaxVolume=true;

var button;

var isStarted=false;



let =1000;



var bNormalize = true;
var centerClip = false;

var audiodebug=false;
var lerpedFrequency=0;
var lerpedMicLevel=0;



function preload(){
  //song = loadSound('assets/Game Ambient.mp3');
  console.log("preload");
}

function setup() {


  mic = new p5.AudioIn(error());
  mic.start();

  let cnv = createCanvas(200, 200);
  cnv.id('mycanvas');


  button = createButton('start input');
  button.id("recordbutton");
  //button.position(50, 50);
  button.mousePressed(startButton_clicked);

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
  fft = new p5.FFT(0.9,nBands);
  fft.setInput(mic);
 //  var spectrum = fft.analyze();







}


var makeWind = throttle(function(mask,frequency,volume) {
  if(getState() != MICRO){
    setState(MICRO);
  }
 makeRandomWindFromSound(mask,frequency,volume);
}, 1000);

function draw() {

  fill(127);
  stroke(0);

  background(255);


  if(initMic){

    fill(0,0,255);
    var micLevel = mic.getLevel();
    lerpedMicLevel=lerp(lerpedMicLevel,micLevel,0.01);
    var h = map(micLevel, 0, 1, 0, height);
    var hl = map(lerpedMicLevel, 0, 1, 0, height);



      if(micLevel>maxVolumeToRandomWave){
        fill(0);
        var timeDomain = fft.waveform();
        var corrBuff = autoCorrelate(timeDomain);
        var freq = findFrequency(corrBuff);
        textSize(15);
        text("" + noteFromPitch(freq), 0, height / 2);
        text("" + freq, 0, (height / 4)*3);

        makeWind(0,freq,micLevel);

    }



if(audiodebug){

    var spectrum = fft.analyze();

  noStroke();
  fill(0,255,0,100); // spectrum is green
  for (var i = 0; i< spectrum.length; i++){
    var x = map(i, 0, spectrum.length, 0, width);
    var h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width / spectrum.length-2, h )
  }





  var waveform = fft.waveform();
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




 fill(0,0,255);
     micLevel = mic.getLevel();
    lerpedMicLevel=lerp(lerpedMicLevel,micLevel,0.01);

    var h = map(micLevel, 0, 1, 0, height);
    var hl = map(lerpedMicLevel, 0, 1, 0, height);

    fill(100,255,255);

    rect(0,height,10,-h);
    fill(100,100,255);
    rect(50,height,10,-h);
  /*  if(micLevel>maxVolumeToRandomWave){
      fill(255,0,0);
    }
*/
      var corrBuff = autoCorrelate(waveform);
      var freq = findFrequency(corrBuff);
      lerpedFrequency=lerp(lerpedFrequency,freq,0.0001);
      text("" + freq, 0, 50);
      fill(255,0,0);
      text("" + lerpedFrequency, 0, 60);
      fill(0,0,255)
      text("" + micLevel, 10, 10);
      text("" + lerpedMicLevel, 10, 20);

    }

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


function startButton_clicked() {
  if(isStarted)return;
  toggleSound();
  isStarted=true;
  button.addClass("invisible");
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


// not used anymore
function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }
    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }
    return maxIndex;
}




function autoCorrelate(buffer) {
    var newBuffer = [];
    var nSamples = buffer.length;

    var autocorrelation = [];

    // center clip removes any samples under 0.1
    if (centerClip) {
        var cutoff = 0.1;
        for (var i = 0; i < buffer.length; i++) {
            var val = buffer[i];
            buffer[i] = Math.abs(val) > cutoff ? val : 0;
        }
    }

    for (var lag = 0; lag < nSamples; lag++){
        var sum = 0;
        for (var index = 0; index < nSamples; index++){
            var indexLagged = index+lag;
            if (indexLagged < nSamples){
                var sound1 = buffer[index];
                var sound2 = buffer[indexLagged];
                var product = sound1 * sound2;
                sum += product;
            }
        }

        // average to a value between -1 and 1
        newBuffer[lag] = sum/nSamples;
    }

    if (bNormalize){
        var biggestVal = 0;
        for (var index = 0; index < nSamples; index++){
            if (abs(newBuffer[index]) > biggestVal){
                biggestVal = abs(newBuffer[index]);
            }
        }
        for (var index = 0; index < nSamples; index++){
            newBuffer[index] /= biggestVal;
        }
    }

    return newBuffer;
}


function findFrequency(autocorr) {

  var nSamples = autocorr.length;
  var valOfLargestPeakSoFar = 0;
  var indexOfLargestPeakSoFar = -1;

  for (var index = 1; index < nSamples; index++){
    var valL = autocorr[index-1];
    var valC = autocorr[index];
    var valR = autocorr[index+1];

    var bIsPeak = ((valL < valC) && (valR < valC));
    if (bIsPeak){
      if (valC > valOfLargestPeakSoFar){
        valOfLargestPeakSoFar = valC;
        indexOfLargestPeakSoFar = index;
      }
    }
  }
  
  var distanceToNextLargestPeak = indexOfLargestPeakSoFar - 0;

  // convert sample count to frequency
  var fundamentalFrequency = sampleRate() / distanceToNextLargestPeak;
  return fundamentalFrequency;
}


function noteFromPitch( frequency ) {
    var noteText = [ 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2' ];
    var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
    var nnum = Math.round( noteNum ) + 69;
    var note = nnum % 12;
    return noteText[note];
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

