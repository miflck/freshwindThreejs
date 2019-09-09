
// Threejs

// create a Scene
const scene = new THREE.Scene();
var scenes = [], views, t, canvas, renderer;
// create a clock for animations
var clock = new THREE.Clock({autoStart:true});

// Window and Pixel Vars
let windowWidth=300;
let windowHeight=300;
let pixelScaleFact=1;
let windowHalfY = windowHeight / 2

// Create a Camera
let left = -windowWidth/2; 
let right = windowWidth/2;
let topB =	windowHeight/2;
let bottom = -windowHeight/2;
let near= 0;
let far= 100;
let camera = new THREE.OrthographicCamera( left, right, topB, bottom, near, far );

//Vane Settings
var diameter=25;
//oldcolors
const colors=[0x005597, 0x000C78,0x0017E6,0x0012B0,0xA7C6ED,0x307FE2,0x13294B,0xC7DBF4,0xA7A8AA,0x000000] //(meine)

let darkBlueColor=new THREE.Color(0x26539D);
let dynamicColor=false;
let lineWidth=1.5;

// Winds
var winds=[];

// rotation fact
var randMin=5;
var randMax=15;
var rotationDurationMin=1500;
var rotationDurationMAx=3000;
var windVelocityMin=10;
var windVelocityMax=18;

// wind timer
var bIsTimed=true;

var eraseWaveInitTime;
var eraseWaveTimerDuration;
var eraseWaveIntervalMin=1500;
var eraseWaveIntervalMax=3000;

var waveInitTime;
var waveTimerDuration;
var waveIntervalMin=1500;
var waveIntervalMax=3000;

var waveIntervalContentMin=3000;
var waveIntervalContentMax=8000;

var cycleWaveInitTime;
var cycleWaveTimerDuration;
var cycleWaveIntervalMin=3000;
var cycleWaveIntervalMax=5000;

// Background images
var isloaded=false;
var imagesData=[];
var imageIndex=0;

// STATE
var state;
let oldstate;
const WIND =0;
const CONTENT=1;

var zeroStartX=windowWidth-50;
var zeroStartY=0;

var debugLog=false;

let contentRectX=300;
let contentRectY=180;
let contentRectW=600;
let contentRectH=windowHeight-contentRectY;

let bCreated=false;

function init() {
// get canvas:
	canvas = document.getElementById( 'c' );
	// create the renderer
	renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true,alpha: true,preserveDrawingBuffer: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.autoClearColor = true;
	views = document.querySelectorAll( '.windcontainer');
	if(debugLog)console.log("views "+views.length)
	

	for ( var n = 0; n < views.length; n ++ ) {
		var scene = new THREE.Scene();
		scene.userData.view = views[ n ];
		// set the viewport
		var rect = scene.userData.view.getBoundingClientRect();
        camera = new THREE.OrthographicCamera();
        camera.left = 0;
        camera.right = rect.width;
        camera.top = rect.height / 2;
        camera.bottom = rect.height / -2;
        camera.near = 0.1;
        camera.far = 1500;
        camera.updateProjectionMatrix();
        camera.position.set( -rect.width/2, 0, 50 );
        scene.userData.camera = camera;

		var vanes=createVanes(scene, diameter);
		resetScene(scene,lineWidth);
  		scene.userData.winds=[];
  		scene.userData.latestAngle=0;
  		updateGeometry(scene);
  		makeRandomWind(scene,false);
		scenes.push( scene );
		}

	scenes.forEach( function ( scene ) {
		if(debugLog)console.log("scene")
		if(debugLog)console.log(scene.userData.vanes[0].position);
	});

	t = 0;
	animate();
}



function recalculateVanes(){
	scenes.forEach( function ( scene ) {
		var rect = scene.userData.view.getBoundingClientRect();
		var vanes = [];
		var countX = Math.ceil(rect.width/diameter);
		var countY = Math.ceil(rect.height/diameter);
		var xpos=-rect.width/2
		var ypos=rect.height/2
		var opX=0
		var opY=0
		for (var j = 0; j < countY; j++) {
			for (var i = 0; i < countX; i++) {
				vanes.push( new WindVane((diameter*i)-rect.width/2, (diameter*j)-rect.height/2  ,diameter,clock,diameter*i,-diameter*j+rect.height ));
			}
		};
		var numberOfVanes=vanes.length;
		scene.userData.vanes=vanes;
		scene.userData.numberOfVanes=numberOfVanes;
	});
}




function animate(time) {


var millis=getMilliseconds(clock);
scenes.forEach( function ( scene ) {

	// update Wind	
		scene.userData.winds.map((wind,i) =>{
			wind.move(scene,millis);
	//		wind.display();
			if(wind.getDeleteMe()){
				removeEntity(scene,wind);
				scene.userData.winds.splice(i,1);
			}
  		})
});


	scenes.forEach( function ( scene ) {
		var rect = scene.userData.view.getBoundingClientRect();
		// check if it's offscreen. If so skip it
		if ( rect.bottom < 0 || rect.top > renderer.domElement.clientHeight ||
			 rect.right < 0 || rect.left > renderer.domElement.clientWidth ) {
			return; // it's off screen
		}

		updateGeometry(scene);
	});

	requestAnimationFrame( animate );
	render();
	time *= 0.001;  // convert time to seconds
	scenes.forEach( function ( scene ) {
    });
}



function render() {			


	updateWindowSize();
	renderer.setScissorTest( false );
	renderer.clear();
	renderer.setScissorTest( true );

	scenes.forEach( function ( scene ) {
	
		var rect = scene.userData.view.getBoundingClientRect();
		// check if it's offscreen. If so skip it
		if ( rect.bottom < 0 || rect.top > renderer.domElement.clientHeight ||
			 rect.right < 0 || rect.left > renderer.domElement.clientWidth ) {
			return; // it's off screen
		}

		// set the viewport
		var width = rect.right - rect.left;
		var height = rect.bottom - rect.top;
		var left = rect.left;
		var bottom = renderer.domElement.clientHeight - rect.bottom;

		//update camera if needed
   		scene.userData.camera.left = 0;
        scene.userData.camera.right = rect.width;
        scene.userData.camera.top = rect.height / 2;
        scene.userData.camera.bottom = rect.height / -2;
        scene.userData.camera.near = 0.1;
        scene.userData.camera.far = 1500;
        scene.userData.camera.updateProjectionMatrix();
		scene.userData.camera.position.set( -rect.width/2, 0, 50 );

		renderer.setViewport( left, bottom, width, height );
		renderer.setScissor( left, bottom, width, height );
		renderer.render( scene, scene.userData.camera );

	});
}

function loadBackgroundImages(files){
	loadImages(files,function(data){
		imagesData=data;
		if(debugLog)console.log("loaded ");
		isloaded=true;
		if(debugLog)console.log(imagesData);
	});
}

function updateGeometry(scene){
	if(!bCreated)return;
	var vertex = new THREE.Vector3(0,0,0);
	var axis = new THREE.Vector3( 0, 0, 1 );
	var vanel=diameter;
	var p = scene.userData.vanegeometry.attributes.position.array;
	if(dynamicColor)var color = scene.userData.vanegeometry.attributes.color.array;
	var vector = new THREE.Vector3( vanel, 0, 0 );
	var millis=getMilliseconds(clock);

	for (let i = 0; i < scene.userData.numberOfVanes; i++) {
		var vane=scene.userData.vanes[i];
  			scene.userData.winds.map((wind,i) =>{
            	let outer=check_a_point(vane.x,vane.y,wind.x,wind.y,wind.radius);
            	let inner=check_a_point(vane.x,vane.y,wind.x,wind.y,wind.currentInnerRadius);
           // Circles
           	if(outer &! inner){
             	setActive(vane,wind,millis);
            	};
            })
  		
  		vane.update(millis);

		var angle=vane.getCurrentAngle;
		if(dynamicColor)var col=vane.getStrokeColor;
		vector.x=vanel;
		vector.y=0;

		var x=Math.cos(angle)*vanel;
		var y=Math.sin(angle)*vanel;

		vertex.x=p[i*6];
		vertex.y=p[i*6+1];
		p[i*6+2]=vane.zPos//vane.zPos//ertex.z;

		p[i*6+3]=vertex.x+x;
		p[i*6+4]=vertex.y+y;
		p[i*6+5]=vane.zPos

		if(dynamicColor){
			color[i*6]=col.r;
			color[i*6+1]=col.g;
			color[i*6+2]=col.b;

			color[i*6+3]=col.r;
			color[i*6+4]=col.g;
			color[i*6+5]=col.b;
		}
	}
	scene.userData.lineGeometry.setPositions( scene.userData.vanegeometry.attributes.position.array);
	scene.userData.lineGeometry.attributes.position.needsUpdate = true;
	if(dynamicColor)scene.userData.lineGeometry.setColors( scene.userData.vanegeometry.attributes.color.array);

}

function createGeometry(vanes) {

	var geometry = new THREE.BufferGeometry();
		geometry.dynamic = true;

	var vertices = [];
	var colors = [];
	var vertex = new THREE.Vector3();
	var xpos=-windowWidth/2
	var ypos=windowHeight/2
	var vanel=diameter;
	var axis = new THREE.Vector3( 0, 0, 1 );

	vanes.map(vane =>{
		vertex.x = vane.pos.x;
		vertex.y = vane.pos.y;
		vertex.z = 0//randomIntFromInterval(-1,1)//vane.zPos;

		vertices.push( vertex.x, vertex.y, vertex.z );
		vertices.push( vertex.x+vanel, vertex.y, vertex.z );

		colors.push(darkBlueColor.r);
		colors.push(darkBlueColor.g);
		colors.push(darkBlueColor.b);

		colors.push(darkBlueColor.r);
		colors.push(darkBlueColor.g);
		colors.push(darkBlueColor.b);
	})

	geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
	geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
	bCreated=true;

	return geometry;
}

function setActive(vane,wind,millis){
	var angle=wind.angle
	var duration=wind.duration
	var dilitationTime=	-500;
	var dilitationAngle=Math.PI/4;
	vane.setEasingType(wind.easingType);
	var col=wind.color;
	var maskColor;
        maskColor=wind.color;

  	switch(state){
        case WIND:

        	var color = getPixel( wind.imageData, vane.ox*pixelScaleFact,vane.oy*pixelScaleFact);
			if(color.a==255){
				vane.isOnMask=true;		
			}else{
				vane.isOnMask=false;
			}
          	vane.zPos=0;
        break;

        case CONTENT:
          let isInside=checkIsInside(vane.ox*pixelScaleFact,vane.oy*pixelScaleFact,contentRectX,contentRectY,contentRectW,contentRectH);
          	// check if inside rect
			if(isInside){
				vane.isOnMask=true;
			}else{
				vane.isOnMask=false;
			}

        	if(vane.isOnMask){
          		vane.zPos=500;
      		}else{
      			vane.zPos=0;
      		}
        break;
        }
        

    if(wind.isMasked){
		if(vane.isOnMask){
			vane.setColor(maskColor)
	    	vane.setDuration(duration+dilitationTime);
        	vane.setTargetAngle((angle+dilitationAngle),millis); 
		}else{
			vane.setColor(wind.color);
			vane.setDuration(duration);
			vane.setTargetAngle(angle,millis); 
		}
	}else{
		vane.setDuration(duration);
		vane.setTargetAngle(angle,millis); 
		vane.setColor(wind.color);
	}
}



function setState(newState){
	oldstate=state;
	state=newState;

	switch(state){
        case WIND:
        winds=[];
        imageIndex=0;
        waveInitTime=getMilliseconds(clock);
		waveTimerDuration=randomIntFromInterval(waveIntervalContentMin,waveIntervalContentMax);

		cycleWaveInitTime=getMilliseconds(clock);
		cycleWaveTimerDuration=randomIntFromInterval(cycleWaveIntervalMin,cycleWaveIntervalMax);

        makeWindFromLocation(windowWidth-50,0,0);
        break;

        case CONTENT:
        winds=[];
        makeWindFromLocation(windowWidth-50,0,1);
       	waveInitTime=getMilliseconds(clock);
		waveTimerDuration=randomIntFromInterval(waveIntervalContentMin,waveIntervalContentMax);
        break;
      }

}


function makeRandomWind(scene,isMasked){
  	
  	if(scene.userData.winds.length > 1) return;

	var rect = scene.userData.view.getBoundingClientRect();


	// make startposition
  	var center= new THREE.Vector3( rect.width/2,rect.height/2,0);
  	var pos=new THREE.Vector3(-(rect.width/3)*2,0,0);
	var axis = new THREE.Vector3( 0, 0, 1);
	//var angle = randomFloatFromInterval(0,2*Math.PI);
	var angle = randomFloatFromInterval(-Math.PI/4,Math.PI/4);
	pos.applyAxisAngle( axis, angle );
	pos.add(center);

	// get random color from array
	var randNr=Math.floor(Math.random()*colors.length);
	var col=new THREE.Color( colors[randNr]);
	// no more random!
	//var col=new THREE.Color( 0x26539D);
    var vel = randomIntFromInterval(windVelocityMin,windVelocityMax);
    // random rotation factor
 	var rand=randomIntFromInterval(randMin,randMax);
	var mult=1;
	//if(Math.random()>0.5)mult=-1;
	var angle=rand*(Math.PI/4)*mult;
    var dur=scale(rand,randMin,randMax,rotationDurationMin,rotationDurationMAx);
    // delay in starting wave, not implemented yet
    var wait=0;
    // get start time
	var millis=getMilliseconds(clock);
	if(isloaded){
		var imagedata = getImageData(imagesData[imageIndex]);
		if(debugLog)console.log("data "+imagedata);
		scene.userData.winds.push(new Wind(scene,pos.x,pos.y,vel,angle,dur,wait,millis,col,isMasked,imagedata));
		var mywind=scene.userData.winds[scene.userData.winds.length -1];
		mywind.setMaxRadius(rect.width*5);
	}
}




function makeRandomWindWithForce(scene,isMasked,force){
	var rect = scene.userData.view.getBoundingClientRect();
	// make startposition
  	var center= new THREE.Vector3( rect.width/2,rect.height/2,0);
  	var pos=new THREE.Vector3(-(rect.width/3)*2,0,0);
	var axis = new THREE.Vector3( 0, 0, 1);
	//var angle = randomFloatFromInterval(0,2*Math.PI);
	var angle = randomFloatFromInterval(-Math.PI/4,Math.PI/4);
	pos.applyAxisAngle( axis, angle );
	pos.add(center);
	// get random color from array
	var randNr=Math.floor(Math.random()*colors.length);
	var col=new THREE.Color( colors[randNr]);
	// no more random!
	//var col=new THREE.Color( 0x26539D);
    var vel = randomIntFromInterval(windVelocityMin,windVelocityMax);
    // random rotation factor
 	var rand=randomIntFromInterval(randMin,randMax);
	var mult=1;
	//if(Math.random()>0.5)mult=-1;
	var angle=rand*(Math.PI/4)*mult;
    var dur=1000//scale(rand,randMin,randMax,rotationDurationMin,rotationDurationMAx);
    // delay in starting wave, not implemented yet
    var wait=0;
    // get start time
	var millis=getMilliseconds(clock);
	if(isloaded){
		var imagedata = getImageData(imagesData[imageIndex]);
		if(debugLog)console.log("data "+imagedata);
		scene.userData.winds.push(new Wind(scene,pos.x,pos.y,vel,angle,dur,wait,millis,col,isMasked,imagedata));
	}
}

function makeWindFromLocation(xPos,yPos,isMasked){
  	
	// get random color from array
	var randNr=Math.floor(Math.random()*colors.length);
	var col=new THREE.Color( colors[randNr]);
	if(debugLog)console.log("color "+randNr+' #' + col.getHex().toString(16));

    var vel = randomIntFromInterval(windVelocityMin,windVelocityMax);
    // random rotation factor
 	var rand=randomIntFromInterval(randMin,randMax);
	var mult=1;
	//if(Math.random()>0.5)mult=-1;
	var angle=rand*(Math.PI/4)*mult;
    var dur=scale(rand,randMin,randMax,rotationDurationMin,rotationDurationMAx);
    //    var dur=scale(rand,30,80,3000,8000);
    // delay in starting wave, not implemented yet
    var wait=0;
    // get start time
	var millis=getMilliseconds(clock);
	if(isloaded){
		var imagedata = getImageData(imagesData[imageIndex]);
		if(debugLog)console.log("data "+imagedata);
		winds.push(new Wind(scene,xPos,yPos,vel,angle,dur,wait,millis,col,isMasked,imagedata));
	}
}




function setContentRect(_contentRectX,_contentRectY,_contentRectW,_contentRectH){
	contentRectX=_contentRectX;
	contentRectY=_contentRectY;
	contentRectW=_contentRectW;
	contentRectH=_contentRectH;
}



function updateWindowSize() {
	var width = canvas.clientWidth;
	var height = canvas.clientHeight;
	if ( canvas.width !== width || canvas.height != height ) {
		renderer.setSize( width, height, false );

	}
}




window.addEventListener( 'resize', onWindowResize, false );
		
function onWindowResize() {
	scenes.forEach( function ( scene ) {
	var vanes=createVanes(scene, diameter);
		resetScene(scene,lineWidth);
	});

}









/*
// INPUT EVENTS

function onMouseDown(event) {
	makeRandomWind(1);
}

// movement
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    // w
    if (keyCode == 87) { 
       	//makeRandomWind(1);

       	setSize(randomIntFromInterval(1000,2500),randomIntFromInterval(500,1200),window.devicePixelRatio);

        //Q
    } else if (keyCode == 81) {
       makeRandomWind(1);
       cycleImages();

        // left
    } else if (keyCode == 65) {
       
        // right
    } else if (keyCode == 68) {
        
        // space
    } else if (keyCode == 32) {
        makeRandomWind(false)
    }
};

function onWindowResize() {
		//windowHalfY = window.innerHeight / 2;
		//camera.aspect = window.innerWidth / window.innerHeight;
		//camera.updateProjectionMatrix();
		//renderer.setSize( window.innerWidth, window.innerHeight );
}

function onTouchStart(event) {
   	makeRandomWind(1);
    if(Math.random()>0.7){
       	cycleImages();
    }
}


*/

		