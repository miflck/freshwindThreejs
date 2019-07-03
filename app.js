
// Threejs
// Get a reference to the container element that will hold our scene
const container = document.querySelector( '#scene-container' );
// create a Scene
const scene = new THREE.Scene();

// create the renderer
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


// VANES
var numberOfVanes=[];
var vanegeometry = new THREE.BufferGeometry();
vanegeometry.dynamic = true;
var diameter=15;


var vanes = [];
var testvanes = [];

var line;
const r = 100;
const mouseY = 0;

var  stats;
var angle = Math.PI/10;//Math.random()*Math.PI;


var lineGeometry;
var lineMaterial;

//oldcolors
//const colors=[0x005597, 0x000C78,0x0017E6,0x0012B0,0xA7C6ED,0x307FE2,0x13294B,0xC7DBF4,0xA7A8AA,0x000000]

const colors=[0x0017E6,0x0012B0,0xA7C6ED,0x307FE2,0xC7DBF4,0x0057B8,0x8DC8E8,0x1E22AA]

// music color
//const colors=[0xF8485E,0xD0006F,0x702082,0xFF8200,0xFFCD00,0x5FE0B7,0x7A9A01,0x85B09A,0x88DBDF]



// image

//var imagedata;
var isloaded=false;
var imagesData=[];



var eraseWaveInitTime;
var eraseWaveTimerDuration;


var imageIndex=0;

			
init();
animate();



function init() {
	var xpos=-windowWidth/2
	var ypos=windowHeight/2
	var opX=0
	var opY=0
	/*for(var i=0;i<numberOfVanes;i++){
		vanes.push(new WindVane(xpos,ypos,diameter,clock,opX,opY));
		xpos+=diameter;
		opX+=diameter;
		if(xpos>windowWidth/2){
			xpos=-windowWidth/2
			ypos-=diameter;
			opX=0;
			opY+=diameter;
		}
	}*/


createVanes(diameter);

/*
	for(var i=0;i<60000;i++){
		testvanes.push(new WindVane(xpos,ypos,diameter,clock));
		xpos+=diameter;
		if(xpos>windowWidth/2){
			xpos=-windowWidth/2
			ypos-=diameter;
		}
	}	
*/
  	window.addEventListener("mousedown", onMouseDown, false);
	window.addEventListener( 'resize', onWindowResize, false );

	window.addEventListener("touchstart", onTouchDown, false);
	document.addEventListener("keydown", onDocumentKeyDown, false);



	camera.position.z = 1;

	

	var vanegeometry = createGeometry();
//	material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors,linewidth: 3 } );

	//vanegeometry.computeBoundingSphere();


 lineGeometry = new THREE.LineSegmentsGeometry().setPositions( vanegeometry.attributes.position.array);
 lineGeometry.setColors( vanegeometry.attributes.color.array);

 lineMaterial = new THREE.LineMaterial( { vertexColors: THREE.VertexColors, linewidth: 4} );
lineMaterial.resolution.set( window.innerWidth, window.innerHeight ); // important, for now...
var thickline = new THREE.LineSegments2( lineGeometry, lineMaterial );
scene.add( thickline );

// background plane
var plane = new THREE.Mesh( new THREE.PlaneGeometry( windowWidth, windowHeight ), new THREE.MeshBasicMaterial( { transparent: true, opacity: 0.5 } ) );
plane.position.z = -10;
scene.add( plane );

/*
	// make line
	for ( i = 0; i < 1; ++ i ) {
		p = parameters[ i ];
		material = new THREE.LineBasicMaterial({ 
			color: p[ 1 ], 
			//opacity: p[ 2 ],
			linewidth: 3, 
		} );



		line = new THREE.LineSegments( vanegeometry, material );
		line.updateMatrix();
		scene.add( line );	
	}*/

	//line = new THREE.LineSegments( vanegeometry, material );
	//scene.add( line );


	//line = new THREE.LineSegments( vanegeometry, material );
	//line.computeLineDistances()

//	line.computeLineDistances();
	//			line.scale.set( 1, 1, 1 );
	//scene.add( line );



	
	/*matLine = new THREE.LineMaterial( {

	color: 0x4080ff,
	linewidth: 1, // in pixels
	//resolution:  // to be set by renderer, eventually
	dashed: false

} );*/


				//	line2 = new THREE.Line2( lgeometry, matLine );

				//scene.add( line2 );

	//renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setPixelRatio( window.devicePixelRatio );
	//renderer.setPixelRatio( 1);


	renderer.setSize( windowWidth, windowHeight );
	renderer.setClearColor( 0x000000, 0);

	// add the automatically created <canvas> element to the page
	container.appendChild( renderer.domElement );

	stats = new Stats();
	container.appendChild( stats.dom );

/*var loader = new THREE.ImageLoader();

// load a image resource
loader.load(
	// resource URL
	'images/1.png',

	// onLoad callback
	function ( image ) {

	imagedata = getImageData(image);

	var color = getPixel( imagedata, 900, 300 );
	console.log(color.a);
	isloaded=true;

	for (let i = 0; i < numberOfVanes; i++) {
		var color = getPixel( imagedata, vanes[i].ox,vanes[i].oy );
		if(color.a==255){
			vanes[i].isOnMask=true;		
		}else{
			vanes[i].isOnMask=false;
		}
	}


	},

	// onProgress callback currently not supported
	undefined,

	// onError callback
	function () {
		console.error( 'An error happened.' );
	}
);
*/


/*
var files = ['images/1.png','images/11.png','images/22.png','images/33.png'];
	
loadBackgroundImages(files);
*/



	console.log(imagesData.length);
	if(typeof imagesData[0] === 'undefined') {
		console.log("undef");
	}
	else {
		 console.log("def");
	}

}


function setMask(image){
	var imagedata = getImageData(image);
	console.log("get imagedata"+imagedata);

	//var color = getPixel( imagedata, 900, 300 );
	//console.log(color.a);
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
	angle+=0.1;
	var vertex = new THREE.Vector3(0,0,0);
	var vertex2 = new THREE.Vector3();
	var axis = new THREE.Vector3( 0, 0, 1 );
	var vanel=diameter;

	var p = vanegeometry.attributes.position.array;
	var color = vanegeometry.attributes.color.array;


	var vector = new THREE.Vector3( vanel, 0, 0 );

	for (let i = 0; i < numberOfVanes; i++) {


 		//var fact=imagedata.width/fixedWindowWidth;
  		//var factH=imagedata.height/fixedWindowHeight;
		angle=vanes[i].getCurrentAngle;

		var col=vanes[i].getStrokeColor;
	
		vector.x=vanel;
		vector.y=0;
		vector.z=0;



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
	vanegeometry.attributes.position.needsUpdate = true;

	vanegeometry.attributes.color.needsUpdate = true;

	lineGeometry.attributes.position.needsUpdate = true;
	lineGeometry.setPositions( vanegeometry.attributes.position.array);
	lineGeometry.setColors( vanegeometry.attributes.color.array);

}

function createGeometry() {

//vanegeometry=new THREE.Geometry();
	//vanegeometry= new THREE.BufferGeometry();
	var vertices = [];
	var colors = [];
	var vertex = new THREE.Vector3();
	var vertex3 = new THREE.Vector3();
	var xpos=-windowWidth/2
	var ypos=windowHeight/2
	var vanel=diameter;
	var axis = new THREE.Vector3( 0, 0, 1 );

	angle+=0.05;


	vanes.map(vane =>{
		vertex.x = vane.position.x;
		vertex.y = vane.position.y;
		vertex.z = 0;
		var vector = new THREE.Vector3( vanel, 0, 0 );
		//vector.applyAxisAngle( axis, angle );
		vertices.push( vertex.x, vertex.y, vertex.z );
		//vanegeometry.vertices.push( vertex );

		vertex.add(vector);
		vertices.push( vertex.x, vertex.y, vertex.z );




		colors.push(0 );
		colors.push(0 );
		colors.push( 0 );

		colors.push(0 );
		colors.push(0 );
		colors.push( 0 );

		//vanegeometry.vertices.push( vertex );

	})


	/*for ( var i = 0; i <numberOfVanes; i ++ ) {

		vertex.x = xpos;
		vertex.y = ypos;
		vertex.z = 0;

		//var angle = Math.PI/10;//Math.random()*Math.PI;
		var vector = new THREE.Vector3( vanel, 0, 0 );
		vector.applyAxisAngle( axis, angle );

		//vertex.normalize();
		//vertex.multiplyScalar( r );
		xpos+=vanel;
		if(xpos>windowWidth/2){
			xpos=-windowWidth/2
			ypos-=vanel;
		}

		vertices.push( vertex.x, vertex.y, vertex.z );
		vertex.add(vector);
		vertices.push( vertex.x, vertex.y, vertex.z );
	}*/


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

		mouseY = event.clientY - windowHalfY;

	}

	function onDocumentMouseDown( event ) {

	  	winds.push(new Wind(event.clientX - windowHalfX,event.clientY - windowHalfY));

	}

	function onDocumentTouchStart( event ) {

		if ( event.touches.length > 1 ) {
			event.preventDefault();
			mouseY = event.touches[ 0 ].pageY - windowHalfY;
		}

	}

	function onDocumentTouchMove( event ) {
		if ( event.touches.length == 1 ) {
			event.preventDefault();
			mouseY = event.touches[ 0 ].pageY - windowHalfY;
		}

	}

			//

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


		// update Vane
  		//vanes.map(vane =>{
  	// get millis slows whole down. so one Time for all…
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
	}
	
	updateGeometry();

	requestAnimationFrame( animate );
	render();
	stats.update();
}



		function render() {
				
			renderer.render( scene, camera );
				/*var time = Date.now() * 0.0001;


					for ( var i = 0; i < scene.children.length; i ++ ) {

					var object = scene.children[ i ];

					if ( object.isLine ) {

						//object.rotation.x = time * ( i < 4 ? ( i + 1 ) : - ( i + 1 ) );


						}

						}
				*/

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

				vane.setColor(wind.color);


    if(wind.isMasked){
		if(vane.isOnMask){
			//vane.setColor(wind.color)
	    	vane.setDuration(duration+dilitationTime);
        	vane.setTargetAngle((angle+dilitationAngle),millis); 

		}else{
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

	}





              //vane.setColor(wind.color);
             /* if(wind.isMasked){
                if(vane.isOnMask){
                  vane.setDuration(duration+500);
                  vane.setTargetAngle(angle+PI/4); 
                  vane.setAlphaDuration(duration-500);
                  vane.setTargetAlpha(255);
                  vane.setFlutterParams(500,50,0.5)
                }else{
                  vane.setAlphaDuration(duration-500);
                  //vane.setAlphaDuration(duration+500);
                  vane.setTargetAlpha(unmaskedAlpha);
                  if(fade)vane.setTargetAlpha(0);
                  vane.setFlutterParams(500,100,0.05)
                }
              }else{
                  vane.setTargetAlpha(255);
              }*/
}



function makeRandomWind(isMasked){
  	var center= new THREE.Vector3( windowWidth/2,windowHeight/2,0);
  	var pos=new THREE.Vector3(windowWidth/2,0,0);
	var axis = new THREE.Vector3( 0, 0, 1);
	var angle = randomFloatFromInterval(0,2*Math.PI);
	pos.applyAxisAngle( axis, angle );
	pos.add(center);
		var randNr=Math.floor(Math.random()*colors.length);
	var col=new THREE.Color( colors[randNr]);
		console.log("color "+randNr+' #' + col.getHex().toString(16));


    var vel = randomIntFromInterval(18,20);

    var randMin=5;
        var randMax=8;

 	var rand=randomIntFromInterval(randMin,randMax);
 	//var rand=randomIntFromInterval(30,40);


	var mult=1;
	if(Math.random()>0.5)mult=-1;
	var angle=rand*(Math.PI/4)*mult;
    var dur=scale(rand,randMin,randMax,500,1000);
    //    var dur=scale(rand,30,80,3000,8000);

    var wait=0;
	var millis=getMilliseconds(clock);

	winds.push(new Wind(pos.x ,pos.y,vel,angle,dur,wait,millis,col,isMasked));

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

	function onTouchDown(event) {
	var col=new THREE.Color( colors[Math.floor(Math.random()*colors.length)] );
	//winds.push(new Wind(event.touches[0].clientX ,event.touches[0].clientY,0,col));
		//makeRandomWind(0);

}

function cycleImages(){
	imageIndex=(imageIndex+1)%imagesData.length
	setMask(imagesData[imageIndex]);
	console.log("cycle!"+imageIndex);
}


// movement
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    // up
    if (keyCode == 87) {
       	makeRandomWind(1);

        // down
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



		