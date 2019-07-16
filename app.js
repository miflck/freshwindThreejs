
// Threejs
// Get a reference to the container element that will hold our scene
const container = document.querySelector( '#scene-container' );
// create a Scene
const scene = new THREE.Scene();

// create the renderer
//const renderer = new THREE.WebGLRenderer({ antialias: true,alpha: true,preserveDrawingBuffer: true  });
const renderer = new THREE.WebGLRenderer({ antialias: false,alpha: true,preserveDrawingBuffer: true  });

renderer.autoClearColor = false;

var clock = new THREE.Clock({autoStart:true});


 // Create shortcuts for window size.
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;


 // Create shortcuts for window size.
//var windowWidth = window.innerWidth;
//var windowHeight = window.innerHeight;

//var windowWidth=1920;
//var windowHeight=1200;


var windowWidth=1920;
var windowHeight=1080;
var pixelScaleFact=1;


//var windowWidth=1500;
//var windowHeight=800;

const windowHalfY = windowHeight / 2

// Create a Camera
const left = -windowWidth/2; 
const right = windowWidth/2;
const topB =	windowHeight/2;
const bottom = -windowHeight/2;
const near= 0;
const far= 100;
const camera = new THREE.OrthographicCamera( left, right, topB, bottom, near, far );





// Winds
var winds=[];
let latestAngle=0;
// angelRotation
var randMin=5;
var randMax=15;
var rotationDurationMin=1000;
var rotationDurationMAx=2000;
var windVelocityMin=15;
var windVelocityMax=20;


// VANES
var numberOfVanes=[];
var vanegeometry = new THREE.BufferGeometry();
vanegeometry.dynamic = true;
var diameter=18;


var vanes = [];
var testvanes = [];

var line;
const r = 100;
const mouseY = 0;

var  stats;


var lineGeometry;
var lineMaterial;

//oldcolors
//const colors=[0x005597, 0x000C78,0x0017E6,0x0012B0,0xA7C6ED,0x307FE2,0x13294B,0xC7DBF4,0xA7A8AA,0x000000] //(meine)

const colors=[0xCAE4F6,0xAAD4EB,0x61AEE5,0x4E71B4,0x26539D]

// music color
//const colors=[0xF8485E,0xD0006F,0x702082,0xFF8200,0xFFCD00,0x5FE0B7,0x7A9A01,0x85B09A,0x88DBDF]



// image

//var imagedata;
var isloaded=false;
var imagesData=[];



var eraseWaveInitTime;
var eraseWaveTimerDuration;
var eraseWaveIntervalMin=1500;
var eraseWaveIntervalMax=3000;

var waveInitTime;
var waveTimerDuration;
var waveIntervalMin=1500;
var waveIntervalMax=5000;

var cycleWaveInitTime;
var cycleWaveTimerDuration;
var cycleWaveIntervalMin=6000;
var cycleWaveIntervalMax=7000;



var bIsTimed=true;


var imageIndex=0;



// STATE
var state;
let oldstate;
const WAVE =0;
const CONTENT=1;

var zeroStartX=windowWidth-50;
var zeroStartY=0;

			
init();
animate();



function init() {
	var xpos=-windowWidth/2
	var ypos=windowHeight/2
	var opX=0
	var opY=0
	
	createVanes(diameter);

  	window.addEventListener("mousedown", onMouseDown, false);
	window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener("touchstart", onTouchDown, false);
	document.addEventListener("keydown", onDocumentKeyDown, false);



	camera.position.z = 1;

	
	vanegeometry = createGeometry();
	vanegeometry.computeBoundingSphere();

 	lineGeometry = new THREE.LineSegmentsGeometry().setPositions( vanegeometry.attributes.position.array);
 	lineGeometry.setColors( vanegeometry.attributes.color.array);

 	lineMaterial = new THREE.LineMaterial( { vertexColors: THREE.VertexColors, linewidth: 4.5} );
	lineMaterial.resolution.set( windowWidth,windowHeight); // important, for now...
	var thickline = new THREE.LineSegments2( lineGeometry, lineMaterial );
	scene.add( thickline );

	// background plane
	var plane = new THREE.Mesh( new THREE.PlaneGeometry( windowWidth, windowHeight ), new THREE.MeshBasicMaterial( { transparent: true, opacity: 0.25 } ) );
	plane.position.z = -10;
	scene.add( plane );

	
	
	renderer.setPixelRatio( window.devicePixelRatio );
	//renderer.setPixelRatio( 1);


	renderer.setSize( windowWidth, windowHeight );
	renderer.setClearColor( 0x000000, 0);

	// add the automatically created <canvas> element to the page
	container.appendChild( renderer.domElement );

	stats = new Stats();
	container.appendChild( stats.dom );

	/*
	if(typeof imagesData[0] === 'undefined') {
		console.log("undef");
	}
	else {
		 console.log("def");
	}
	*/

	state=WAVE;
	eraseWaveInitTime=getMilliseconds(clock);
	eraseWaveTimerDuration=randomIntFromInterval(eraseWaveIntervalMin,eraseWaveIntervalMax);

	cycleWaveInitTime=getMilliseconds(clock);
	cycleWaveTimerDuration=randomIntFromInterval(cycleWaveIntervalMin,cycleWaveIntervalMax);


}


function setMask(image){
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

function loadBackgroundImages(files){
	loadImages(files,function(data){
		imagesData=data;
		console.log(imagesData.length);
		setMask(imagesData[0]);
	});
}

function updateGeometry(){
	var vertex = new THREE.Vector3(0,0,0);
	var vertex2 = new THREE.Vector3();
	var axis = new THREE.Vector3( 0, 0, 1 );
	var vanel=diameter;

	var p = vanegeometry.attributes.position.array;
	var color = vanegeometry.attributes.color.array;


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
		var col=vanes[i].getStrokeColor;
	
		vector.x=vanel;
		vector.y=0;



		var x=Math.cos(angle)*vanel;
		var y=Math.sin(angle)*vanel;

		vertex.x=p[i*6];
		vertex.y=p[i*6+1];
		vertex.z=p[i*6+2]

		//vertex2.x=p[i*6+3];
		//vertex2.y=p[i*6+4];
		//vertex2.z=p[i*6+5];

		p[i*6+3]=vertex.x+x;
		p[i*6+4]=vertex.y+y;
		
		color[i*6]=col.r;
		color[i*6+1]=col.g;
		color[i*6+2]=col.b;

		color[i*6+3]=col.r;
		color[i*6+4]=col.g;
		color[i*6+5]=col.b;


	
	}
	//vanegeometry.attributes.position.needsUpdate = true;
	//vanegeometry.attributes.color.needsUpdate = true;
	lineGeometry.setPositions( vanegeometry.attributes.position.array);
	lineGeometry.attributes.position.needsUpdate = true;
	lineGeometry.setColors( vanegeometry.attributes.color.array);

}

function createGeometry() {

	var vertices = [];
	var colors = [];
	var vertex = new THREE.Vector3();
	var vertex3 = new THREE.Vector3();
	var xpos=-windowWidth/2
	var ypos=windowHeight/2
	var vanel=diameter;
	var axis = new THREE.Vector3( 0, 0, 1 );



	vanes.map(vane =>{
		vertex.x = vane.position.x;
		vertex.y = vane.position.y;
		vertex.z = 0;
		vertices.push( vertex.x, vertex.y, vertex.z );

		vertices.push( vertex.x+vanel, vertex.y, vertex.z );

		colors.push(0 );
		colors.push(0 );
		colors.push( 0 );

		colors.push(0 );
		colors.push(0 );
		colors.push( 0 );

	})

	vanegeometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
	vanegeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
	return vanegeometry;
}

	function onWindowResize() {

		//windowHalfY = window.innerHeight / 2;

		//camera.aspect = window.innerWidth / window.innerHeight;
		//camera.updateProjectionMatrix();

		//renderer.setSize( window.innerWidth, window.innerHeight );

	}

	function onDocumentMouseMove( event ) {
		//mouseY = event.clientY - windowHalfY;
	}

	function onDocumentMouseDown( event ) {
	  	//winds.push(new Wind(event.clientX - windowHalfX,event.clientY - windowHalfY));
	}


	function onTouchDown(event) {

   	makeRandomWind(1);
       	if(Math.random()>0.7){
       	    	cycleImages();
       	    }

	//var col=new THREE.Color( colors[Math.floor(Math.random()*colors.length)] );
	//winds.push(new Wind(event.touches[0].clientX ,event.touches[0].clientY,0,col));
		//makeRandomWind(0);

}

	function onDocumentTouchMove( event ) {
	/*	if ( event.touches.length == 1 ) {
			event.preventDefault();
			mouseY = event.touches[ 0 ].pageY - windowHalfY;
		}
		*/
	}


function animate() {
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
	
	if(bIsTimed){
		if(millis>eraseWaveInitTime+eraseWaveTimerDuration){
   			makeRandomWind(true);
    		eraseWaveInitTime=millis;
   			eraseWaveTimerDuration=randomIntFromInterval(eraseWaveIntervalMin,eraseWaveIntervalMax);
  		}


	 if(millis>cycleWaveInitTime+cycleWaveTimerDuration){
   		cycleImages();
   		makeRandomWind(true);
    	cycleWaveInitTime=millis;
    	cycleWaveTimerDuration=randomIntFromInterval(cycleWaveIntervalMin,cycleWaveIntervalMax);
    	eraseWaveInitTime=millis;
    	eraseWaveTimerDuration=3000//randomIntFromInterval(eraseWaveIntervalMin,eraseWaveIntervalMax);
  }




	}
  	
  	switch(state){
        case WAVE:
        
        break;

        case CONTENT:

        break;
        }

	updateGeometry();
	requestAnimationFrame( animate );
	render();
	stats.update();
}



	function render() {			
		renderer.render( scene, camera );
	}

			

function setActive(vane,wind,millis){
	var angle=wind.angle
	var duration=wind.duration
	var dilitationTime=	500;
	var dilitationAngle=Math.PI/4;
	vane.setEasingType(wind.easingType);

	/*var wc=wind.color;
	var hsl = wc.getHSL(hsl);
	var color = new THREE.Color();
	color.setHSL( hsl[0], hsl[1], hsl[2]);*/


	var col=wind.color;
	var maskColor;


	var color = getPixel( wind.imageData, vane.ox*pixelScaleFact,vane.oy*pixelScaleFact);
		if(color.a==255){
			vane.isOnMask=true;		
		}else{
			vane.isOnMask=false;
		}


	
  	switch(state){
        case WAVE:
          //updateVanes(mil);
          maskColor=wind.color;
        break;

        case CONTENT:
          //updateVanesInverse(mil);
          maskColor=new THREE.Color('#FFFFFF');
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
		vane.setTargetAngle(angle,millis); 
		vane.setDuration(duration);
					vane.setColor(wind.color);

	}
}



function setState(newState){
	oldstate=state;
	state=newState;

	switch(state){
        case WAVE:
        //setMask(actualImage);
        //makeEraseWave(false);
       // makeWave(false);

   

        break;

        case CONTENT:
        setMask(nullImage);
       // makeWaveWithPosition(zeroStartX,zeroStartY);



        break;
      }

}



function makeRandomWind(isMasked){
  	var center= new THREE.Vector3( windowWidth/2,windowHeight/2,0);
  	var pos=new THREE.Vector3(-(windowWidth/3)*2,0,0);
	var axis = new THREE.Vector3( 0, 0, 1);
	//var angle = randomFloatFromInterval(0,2*Math.PI);
	var angle = randomFloatFromInterval(-Math.PI/4,Math.PI/4);


	pos.applyAxisAngle( axis, angle );
	pos.add(center);
	var randNr=Math.floor(Math.random()*colors.length);
	var col=new THREE.Color( colors[randNr]);
	console.log("color "+randNr+' #' + col.getHex().toString(16));


    var vel = randomIntFromInterval(windVelocityMin,windVelocityMax);


 	var rand=randomIntFromInterval(randMin,randMax);
 	//var rand=randomIntFromInterval(30,40);


	var mult=1;
	//if(Math.random()>0.5)mult=-1;
	var angle=rand*(Math.PI/4)*mult;
    var dur=scale(rand,randMin,randMax,rotationDurationMin,rotationDurationMAx);
    //    var dur=scale(rand,30,80,3000,8000);

    var wait=0;
	var millis=getMilliseconds(clock);


	if(isloaded){
		var imagedata = getImageData(imagesData[imageIndex]);
		console.log("data "+imagedata);
		winds.push(new Wind(pos.x ,pos.y,vel,angle,dur,wait,millis,col,isMasked,imagedata));
	}
}








function removeEntity(object) {
	var selectedObject = scene.getObjectById(object.name);
	scene.remove( selectedObject );
}


function onMouseDown(event) {
	makeRandomWind(1);
	var col=new THREE.Color( colors[Math.floor(Math.random()*colors.length)] );
	//winds.push(new Wind(event.clientX ,event.clientY,0,col));
}



function cycleImages(){
	imageIndex=(imageIndex+1)%imagesData.length
	//setMask(imagesData[imageIndex]);
	console.log("cycle!"+imageIndex);
}


// movement
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    // w
    if (keyCode == 87) { 
       	makeRandomWind(1);

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



		