
// Threejs
// Get a reference to the container element that will hold our scene
var container;
// create a Scene
const scene = new THREE.Scene();

// create the renderer
//const renderer = new THREE.WebGLRenderer({ antialias: true,alpha: true,preserveDrawingBuffer: true  });
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true  });
renderer.autoClearColor = false;

// create a clock for animations
var clock = new THREE.Clock({autoStart:true});



// Window and Pixel Vars
let windowWidth=window.innerWidth; //1280;
let windowHeight=window.innerHeight; //800;
let pixelScaleFact=1;
let windowHalfY = windowHeight / 2


// Create a Camera
let left = -windowWidth/2; 
let right = windowWidth/2;
let topB =	windowHeight/2;
let bottom = -windowHeight/2;
let near= 0;
let far= 1000;
let camera = new THREE.OrthographicCamera( left, right, topB, bottom, near, far );

// Winds
var winds=[];
let latestAngle=0;
// rotation fact
var randMin=5;
var randMax=15;
var rotationDurationMin=1500;
var rotationDurationMax=3000;
var windVelocityMin=10;
var windVelocityMax=30;

// wind timer
var bIsTimed=false;
var idleMicroTimer;
var maxMicroIdleTime=3000;


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


// VANES
var numberOfVanes;
var vanes = [];
var vanegeometry = new THREE.BufferGeometry();
vanegeometry.dynamic = true;
var diameter=20;//13;
var lineGeometry;
var lineMaterial;
var thickline;
var plane;

//oldcolors
const colors=[0x005597, 0x000C78,0x0017E6,0x0012B0,0xA7C6ED,0x307FE2,0x13294B,0xC7DBF4,0xA7A8AA,0x000000] //(meine)
//const colors=[0xCAE4F6,0xAAD4EB,0x61AEE5,0x4E71B4,0x26539D];
let darkBlueColor=new THREE.Color(0x26539D);
let dynamicColor=true;

// music color
//const colors=[0xF8485E,0xD0006F,0x702082,0xFF8200,0xFFCD00,0x5FE0B7,0x7A9A01,0x85B09A,0x88DBDF]

//const colors =[0xFF1919,0xff7300,0xffaa00,0xffff00,0xb3ff1a,0x79d28b,0x66b5c1];
//const colors =[0x66b5c1,0x79d28b,0xb3ff1a,0xffff00,0xffaa00,0xff7300,0xFF1919];



const colorcounter=0;


// Background images
var isloaded=false;
var imagesData=[];
var imageIndex=0;

var imageScalefact=1;

// STATE
var state;
let oldstate;
const WIND =0;
const CONTENT=1;
const MICRO=2;



var zeroStartX=windowWidth-50;
var zeroStartY=0;

var debugLog=true;

let contentRectX=300;
let contentRectY=180;
let contentRectW=600;
let contentRectH=windowHeight-contentRectY;



let minVolume=0.1;
let maxVolume=0.2;


let freqMin=180;
let freqMax=500;


/*
// setup event listeners		
window.addEventListener("mousedown", onMouseDown, false);
window.addEventListener( 'resize', onWindowResize, false );
window.addEventListener("touchstart", onTouchStart, false);
document.addEventListener("keydown", onDocumentKeyDown, false);	
*/

/*
	init();
	animate();
*/


let bCreated=false;




//var gui = new dat.GUI();
//var cam = gui.addFolder('Micro');





function init() {

 	container= document.querySelector( '#playground-content' );


	// create all the vanes
	createVanes(diameter);

	// set up geometry
	vanegeometry = createGeometry();

	vanegeometry.computeBoundingSphere();

 	lineGeometry = new THREE.LineSegmentsGeometry().setPositions( vanegeometry.attributes.position.array);

 	lineGeometry.setColors( vanegeometry.attributes.color.array);



	// set up material
 	lineMaterial = new THREE.LineMaterial( { vertexColors: THREE.VertexColors, linewidth: 1.8} );
	lineMaterial.resolution.set( windowWidth,windowHeight); // important, for now...
	thickline = new THREE.LineSegments2( lineGeometry, lineMaterial );
	scene.add( thickline );
	// background plane
	plane = new THREE.Mesh( new THREE.PlaneGeometry( windowWidth, windowHeight ), new THREE.MeshBasicMaterial( {  transparent: true, opacity: 0.6	 } ) );
	plane.position.z = -10;
	scene.add( plane );




	// start automatic timers
//	state=WIND;
	setState(WIND);
	waveInitTime=getMilliseconds(clock);
	waveTimerDuration=randomIntFromInterval(eraseWaveIntervalMin,eraseWaveIntervalMax);

	cycleWaveInitTime=getMilliseconds(clock);
	cycleWaveTimerDuration=randomIntFromInterval(cycleWaveIntervalMin,cycleWaveIntervalMax);


	camera.position.z = 1;	
	renderer.setPixelRatio( window.devicePixelRatio );
	//renderer.setPixelRatio( 1);
	renderer.setSize( windowWidth, windowHeight );
	//renderer.setClearColor( 0xFFFF00, 0);
	// add the automatically created <canvas> element to the page
	container.appendChild( renderer.domElement );

	render();


}




function animate() {
	//console.log(winds.length);
	var millis=getMilliseconds(clock);
		// update Wind	
		winds.map((wind,i) =>{
			wind.move(millis);
	//		wind.display();
			if(wind.getDeleteMe()){
				removeEntity(wind);
				winds.splice(i,1);
			}
  		})
	

// check if switch back to Wind Waves
	if(millis>idleMicroTimer+maxMicroIdleTime){
		setState(WIND);
	}

  	
  	switch(state){
        case WIND:
        	if(bIsTimed){
				/*if(millis>waveInitTime+waveTimerDuration){
   				makeRandomWind(true);
    			waveInitTime=millis;
   				waveTimerDuration=randomIntFromInterval(waveIntervalMin,waveIntervalMax);
  				}*/

	 			if(millis>cycleWaveInitTime+cycleWaveTimerDuration){
	   			cycleImages();
	   			makeRandomWind(true);
	    		cycleWaveInitTime=millis;
	    		cycleWaveTimerDuration=randomIntFromInterval(cycleWaveIntervalMin,cycleWaveIntervalMax);
	    		waveInitTime=millis;
	    		waveTimerDuration=randomIntFromInterval(waveIntervalMin,waveIntervalMax);
  				}
			}
        break;

        case CONTENT:
        	if(millis>waveInitTime+waveTimerDuration){
   				makeRandomWind(true);
    			waveInitTime=millis;
   				waveTimerDuration=randomIntFromInterval(waveIntervalContentMin,waveIntervalContentMax);
  			}

        break;

    	case MICRO:
    		// no other Winds please
        	/*if(millis>cycleWaveInitTime+cycleWaveTimerDuration){
	   			cycleImages();
	   			makeRandomWind(true);
	    		cycleWaveInitTime=millis;
	    		cycleWaveTimerDuration=randomIntFromInterval(cycleWaveIntervalMin,cycleWaveIntervalMax);
	    		waveInitTime=millis;
	    		waveTimerDuration=randomIntFromInterval(waveIntervalMin,waveIntervalMax);
  				}*/
        break;
        }
	updateGeometry();
	requestAnimationFrame( animate );
	render();
}



function render() {			
	renderer.render( scene, camera );
}




/*function setMask(image){
	var imagedata = getImageData(image);
	console.log("set Mask"+imagedata);
	isloaded=true;
	for (let i = 0; i < numberOfVanes; i++) {
		var color = getPixel( imagedata, vanes[i].ox*pixelScaleFact,vanes[i].oy*pixelScaleFact);
		if(color.a==255){
			vanes[i].isOnMask=true;		
		}else{
			vanes[i].isOnMask=false;
		}
	}
}
*/
function loadBackgroundImages(files){
	loadImages(files,function(data){
		imagesData=data;
		isloaded=true;
		makeRandomWind(0);
	});
}

function updateGeometry(){
	if(!bCreated)return;
	var vertex = new THREE.Vector3(0,0,0);
	var axis = new THREE.Vector3( 0, 0, 1 );
	var vanel=diameter;

	var p = vanegeometry.attributes.position.array;
	if(dynamicColor)var color = vanegeometry.attributes.color.array;


	var vector = new THREE.Vector3( vanel, 0, 0 );
	var millis=getMilliseconds(clock);


	for (let i = 0; i < numberOfVanes; i++) {




		var vane=vanes[i];

  			winds.map((wind,i) =>{
            	let outer=check_a_point(vane.x,vane.y,wind.x,wind.y,wind.radius);
            	let inner=check_a_point(vane.x,vane.y,wind.x,wind.y,wind.currentInnerRadius);
           // Circles
           	if(outer &! inner){
             	setActive(vane,wind,millis);
            	};
            })
  		
  		vane.update(millis);
		var angle=vanes[i].getCurrentAngle;
		if(dynamicColor)var col=vanes[i].getStrokeColor;
		vector.x=vanel;
		vector.y=0;



		var x=Math.cos(angle)*vanel;
		var y=Math.sin(angle)*vanel;

        //vertex.z=vane.zPos


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
	//vanegeometry.attributes.position.needsUpdate = true;
	//vanegeometry.attributes.color.needsUpdate = true;
	lineGeometry.setPositions( vanegeometry.attributes.position.array);
	lineGeometry.attributes.position.needsUpdate = true;
	if(dynamicColor)lineGeometry.setColors( vanegeometry.attributes.color.array);

}

function createGeometry() {

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

		//colors.push(0 );
		//colors.push(0 );
		//colors.push( 0 );

		//colors.push(1 );
		//colors.push(0 );
		//colors.push( 0 );

	})

	vanegeometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
	vanegeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
	bCreated=true;

	return vanegeometry;
}


			

function setActive(vane,wind,millis){
	var angle=wind.angle
	var duration=wind.duration
	var dilitationTime=	-500;
	var dilitationAngle=Math.PI/4;
	vane.setEasingType(wind.easingType);

	/*var wc=wind.color;
	var hsl = wc.getHSL(hsl);
	var color = new THREE.Color();
	color.setHSL( hsl[0], hsl[1], hsl[2]);*/

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
         	 //updateVanesInverse(mil);
        	//  maskColor=new THREE.Color('0xFFFFFF');        
			/*var content = document.getElementsByClassName("content");
			var rect = content[0].getBoundingClientRect();
			contentRectX=rect.left;
			contentRectY=rect.top;
			contentRectW=content[0].clientWidth;
			contentRectH=content[0].offsetHeight;
			*/
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

        case MICRO:
			var color = getPixel( wind.imageData, vane.ox*pixelScaleFact,vane.oy*pixelScaleFact);
			if(color.a==255){
				vane.isOnMask=true;		
			}else{
				vane.isOnMask=false;
			}
          	vane.zPos=0;
        break;
        }
        

    if(wind.isMasked){
		if(vane.isOnMask){
			vane.setColor(maskColor)
	    	vane.setDuration(duration+dilitationTime);
        	vane.setTargetAngle((angle+dilitationAngle),millis); 
		}else{
			vane.setColor(wind.color);
			//var s=scale(hsl.s,0,1,0,0.5);
			//var l=scale(hsl.l,0,1,0.7,1);
			//color.setHSL( hsl.h, s,l);
        	//vane.setColor(wind.maskColor);
			vane.setDuration(duration);
			vane.setTargetAngle(angle,millis); 
		}
	}else{
		//color.setHSL( hsl[0], hsl[1], hsl[2]);
		//vane.setColor(color);
		//vane.setColor(wind.color);
		vane.setDuration(duration);
		vane.setTargetAngle(angle,millis); 
		vane.setColor(wind.color);

	}
}



function getState(){
	return state;
}


function setState(newState){
	oldstate=state;
	state=newState;

	if(debugLog)console.log("--- set State: "+oldstate+" "+state);

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
      
      	case MICRO:
        //makeWindFromLocation(0,0,1);
      	break;

      }
}


function makeRandomWind(isMasked){
console.log("wind");
  	//if(winds.length>1)return;
	// make startposition
  	var center= new THREE.Vector3( windowWidth/2,windowHeight/2,0);
  	var pos=new THREE.Vector3(-(windowWidth/3)*2,0,0);
	var axis = new THREE.Vector3( 0, 0, 1);
	var angle = randomFloatFromInterval(0,2*Math.PI);
	//var angle = randomFloatFromInterval(-Math.PI/4,Math.PI/4);
	pos.applyAxisAngle( axis, angle );
	pos.add(center);

	// get random color from array
	//var randNr=Math.floor(Math.random()*colors.length);
	//var col=new THREE.Color( colors[randNr]);
	// no more random!
	//var col=new THREE.Color( 0x26539D);
	var col=darkBlueColor;
    var vel = randomIntFromInterval(windVelocityMin,windVelocityMax);
    // random rotation factor
 	var rand=randomIntFromInterval(randMin,randMax);
	var mult=1;
	//if(Math.random()>0.5)mult=-1;
	var angle=rand*(Math.PI/4)*mult;
    var dur=scale(rand,randMin,randMax,rotationDurationMin,rotationDurationMax);
    //    var dur=scale(rand,30,80,3000,8000);

    // delay in starting wave, not implemented yet
    var wait=0;
    // get start time
	var millis=getMilliseconds(clock);
	if(isloaded){
		var imagedata = getImageData(imagesData[imageIndex]);
		if(debugLog)console.log("data "+imagedata);
		winds.push(new Wind(pos.x ,pos.y,vel,angle,dur,wait,millis,col,isMasked,imagedata));
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
    var dur=scale(rand,randMin,randMax,rotationDurationMin,rotationDurationMax);
    //    var dur=scale(rand,30,80,3000,8000);

    // delay in starting wave, not implemented yet
    var wait=0;
    // get start time
	var millis=getMilliseconds(clock);
	if(isloaded){
		var imagedata = getImageData(imagesData[imageIndex]);
		if(debugLog)console.log("data "+imagedata);
		winds.push(new Wind(xPos,yPos,vel,angle,dur,wait,millis,col,isMasked,imagedata));
	}
}


function makeWindFromLocationWithForce(xPos,yPos,isMasked,force){

  	if(force<50)return;
  	if(winds.length>3)return;
var windforce=scaleClamped(force,0,windowWidth,3,40);


	// get random color from array
	var randNr=Math.floor(Math.random()*colors.length);
	var col=new THREE.Color( colors[randNr]);
	if(debugLog)console.log("color "+randNr+' #' + col.getHex().toString(16));


    var vel = randomIntFromInterval(windVelocityMin,windVelocityMax);
    vel=windforce;
    vel=10;
    // random rotation factor
 	var rand=randomIntFromInterval(randMin,randMax);

 	rand=scaleClamped(force,50,300,4,20);




	var mult=1;
	//if(Math.random()>0.5)mult=-1;
	var angle=rand*(Math.PI/4)*mult;
    var dur=scale(rand,randMin,randMax,rotationDurationMin,rotationDurationMax);
     dur=scaleClamped(force,50,300,500,4000);
     dur=5000;

    //    var dur=scale(rand,30,80,3000,8000);

    // delay in starting wave, not implemented yet
    var wait=0;
    // get start time
	var millis=getMilliseconds(clock);
	if(isloaded){
		var imagedata = getImageData(imagesData[imageIndex]);
		if(debugLog)console.log("data "+imagedata);
		winds.push(new Wind(xPos,yPos,vel,angle,dur,wait,millis,col,isMasked,imagedata));
	}
}






function setContentRect(_contentRectX,_contentRectY,_contentRectW,_contentRectH){
	contentRectX=_contentRectX;
	contentRectY=_contentRectY;
	contentRectW=_contentRectW;
	contentRectH=_contentRectH;
}



//function onWindowResize() {
//	resetScene();
//}








function resetScene(scene,linewidth){

	windowWidth=container.innerWidth;
	windowHeight=container.innerHeight;
	windowHalfY = container.innerHeight / 2;


	setSize(windowWidth,windowHeight,window.devicePixelRatio);
	

/*// Create a Camera
 left = -windowWidth/2; 
 right = windowWidth/2;
 topB =	windowHeight/2;
 bottom = -windowHeight/2;
 near= 0;
 far= 100;
 camera = new THREE.OrthographicCamera( left, right, topB, bottom, near, far );
*/

	/*camera.aspect = windowWidth / windowHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( windowWidth,windowHeight);

    var rect = scene.userData.view.getBoundingClientRect();
    // remove old stuff
    scene.remove(scene.userData.vanegeometry);
    scene.remove(scene.userData.lineGeometry);
    scene.remove(scene.userData.thickline );
    createVanes(scene,diameter);
/*
    // set up geometry
    var vanegeometry = createGeometry(scene.userData.vanes);
     vanegeometry.computeBoundingSphere();
    scene.userData.vanegeometry=vanegeometry;

    var lineGeometry = new THREE.LineSegmentsGeometry().setPositions( vanegeometry.attributes.position.array);
    lineGeometry.setColors( vanegeometry.attributes.color.array);
    scene.userData.lineGeometry=lineGeometry;

    // set up material
    var lineMaterial = new THREE.LineMaterial( { vertexColors: THREE.VertexColors, linewidth: linewidth} );
     lineMaterial.resolution.set( windowWidth,windowHeight); // important, for now...
    lineMaterial.resolution.set( rect.width,rect.height); // important, for now...
    var thickline = new THREE.LineSegments2( lineGeometry, lineMaterial );
     scene.add( thickline );
     scene.userData.thickline=thickline;
    // reset angle
    scene.userData.latestAngle=0;*/
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

		