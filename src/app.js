
// Threejs
// create a Scene
const scene = new THREE.Scene();
var scenes = [], views, t, canvas, renderer;
// create a clock for animations
var clock = new THREE.Clock({autoStart:true});

// Window and Pixel Vars
let windowWidth=30;
let windowHeight=30;
let pixelScaleFact=1;
let windowHalfY = windowHeight / 2

//Vane Settings
var diameter=15;
let darkBlueColor=new THREE.Color(0x0000FF);
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

let bCreated=false;

function init() {
// get canvas:
	canvas = document.getElementById( 'c' );
	// create the renderer
	renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true,alpha: true,preserveDrawingBuffer: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.autoClearColor = true;
	views = document.querySelectorAll( '.windcontainer');
	
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


function updateGeometry(scene){
	if(!bCreated)return;
	var vertex = new THREE.Vector3(0,0,0);
	var axis = new THREE.Vector3( 0, 0, 1 );
	var vanel=diameter;
	var p = scene.userData.vanegeometry.attributes.position.array;
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
	}
	scene.userData.lineGeometry.setPositions( scene.userData.vanegeometry.attributes.position.array);
	scene.userData.lineGeometry.attributes.position.needsUpdate = true;

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

function createVanes(scene, diameter){
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
    return vanes;
}


function setActive(vane,wind,millis){
	var angle=wind.angle
	var duration=wind.duration
	vane.setDuration(duration);
	vane.setTargetAngle(angle,millis); 
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

	var col=darkBlueColor;
    var vel = randomIntFromInterval(windVelocityMin,windVelocityMax);
    // random rotation factor
 	var rand=randomIntFromInterval(randMin,randMax);
	var mult=1;
	var angle=rand*(Math.PI/4)*mult;
    var dur=scale(rand,randMin,randMax,rotationDurationMin,rotationDurationMAx);
    // get start time
	var millis=getMilliseconds(clock);
		scene.userData.winds.push(new Wind(scene,pos.x,pos.y,vel,angle,dur,millis,col));
		var mywind=scene.userData.winds[scene.userData.winds.length -1];
		mywind.setMaxRadius(rect.width*5);
}

/*function makeRandomWindWithForce(scene,isMasked,force){
	var rect = scene.userData.view.getBoundingClientRect();
	// make startposition
  	var center= new THREE.Vector3( rect.width/2,rect.height/2,0);
  	var pos=new THREE.Vector3(-(rect.width/3)*2,0,0);
	var axis = new THREE.Vector3( 0, 0, 1);
	var angle = randomFloatFromInterval(-Math.PI/4,Math.PI/4);
	pos.applyAxisAngle( axis, angle );
	pos.add(center);
	var col=darkBlueColor;
    var vel = randomIntFromInterval(windVelocityMin,windVelocityMax);
    // random rotation factor
 	var rand=randomIntFromInterval(randMin,randMax);
	var mult=1;
	//if(Math.random()>0.5)mult=-1;
	var angle=rand*(Math.PI/4)*mult;
    var dur=1000;

    // get start time
	var millis=getMilliseconds(clock);
	if(isloaded){
		scene.userData.winds.push(new Wind(scene,pos.x,pos.y,vel,angle,dur,millis,col));
	}
}*/


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




function resetScene(scene,linewidth){
    var rect = scene.userData.view.getBoundingClientRect();
    // remove old stuff
    scene.remove(scene.userData.vanegeometry);
    scene.remove(scene.userData.lineGeometry);
    scene.remove(scene.userData.thickline );
    createVanes(scene,diameter);

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
    scene.userData.latestAngle=0;
}



function removeEntity(scene,object) {
    var selectedObject = scene.getObjectById(object.name);
    scene.remove( selectedObject );
}




// WIND 
class Wind {
  	constructor(scene,iX,iY,velocity,angle,dur,initTime,color) {
		this.x = iX-windowWidth/2;
		this.y =-iY+windowHeight/2;
		this.radius = 0;
		this.velocity=velocity;
		this.maxRadius=10000;
		this.innerradius=300;
		this.currentInnerRadius=0;
		this.color=color;

		this.deleteMe=false;
		this.rand=randomIntFromInterval(5,20);
		this.randDur=randomIntFromInterval(1,5);
		this.angle=scene.userData.latestAngle+angle;
		scene.userData.latestAngle=this.angle;
		this.duration=dur;
		this.initTime=initTime;

  }

  move(scene,millis){
  	if(millis>this.initTime){
    	this.radius+=this.velocity;
    	if(this.radius>this.maxRadius)this.deleteMe=true;
    	this.currentInnerRadius=this.radius-this.innerradius;
    	if(this.currentInnerRadius<0)this.currentInnerRadius=0;
	}
  }

  display(){
  }

  getDeleteMe(){
    return this.deleteMe;
  }

  setMaxRadius(maxrad){
  	this.maxRadius=maxrad;
  }

}


// VANES
class WindVane {
	constructor(iX,iY,diameter,clock,opX,opY){
		this.x = iX;
    	this.y =iY;
      this.ox = opX;
      this.oy =opY;
    	this.diameter = diameter;
    	this.pos= new THREE.Vector3( this.x, this.y,0);
    	this.alpha=255;
    	this.startAngle = 0;
    	this.currentAngle = 0;
    	this.targetAngle = 0;
    	this.thetaAngle = this.targetAngle-this.currentAngle;
  		this.duration=0;
   		this.endAnimation=getMilliseconds(clock)+this.duration;
    	this.startAnimation=getMilliseconds(clock);
      this.isActive=false;
      this.isOnMask=false;
      this.zPos=0;
      this.lerpFact=1;

	}


	 update(millis){
      if(this.isActive){
        	this.currentAngle=easeOutQuad(millis-this.startAnimation,this.startAngle,this.thetaAngle,this.duration);
		  }
        if(millis>this.endAnimation){
          this.currentAngle=this.targetAngle;
          this.isActive=false;
        }
	}

	get getCurrentAngle(){
		return this.currentAngle;
	}

	setDuration(duration){
    	this.duration=duration;
  	}

  	setTargetAngle(angle,millis){
    	if(angle!=this.targetAngle){
    		this.startAngle=this.currentAngle;
    		this.targetAngle=angle;
    		this.thetaAngle= this.targetAngle-this.startAngle;
   			this.endAnimation=millis+this.duration;
    		this.startAnimation=millis;
        this.isActive=true;
    	}
  	}

}

// HELPERS
// random number interval

function randomIntFromInterval(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}
        
function randomFloatFromInterval(min, max){
      return (Math.random()*(max-min+1)+min);
}
// mapping
const scale = (num, in_min, in_max, out_min, out_max) => {
     return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function check_a_point(a, b, x, y, r) {
    var dist_points = (a - x) * (a - x) + (b - y) * (b - y);
    r *= r;
    if (dist_points < r ) {
        return true;
    }
    return false;
}

// quadratic easing out - decelerating to zero velocity
function easeOutQuad (t, b, c, d) {
    return -c *(t/=d)*(t-2) + b;
};


//THREEjs clock
function getMilliseconds(clock){
    return Math.floor(clock.getElapsedTime()*1000);
}
