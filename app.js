6// Threejs
// Get a reference to the container element that will hold our scene
const container = document.querySelector( '#scene-container' );
// create a Scene
const scene = new THREE.Scene();

// create the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true,alpha: true });

var clock = new THREE.Clock({autoStart:true});


 // Create shortcuts for window size.
 var windowWidth = window.innerWidth;
 var windowHeight = window.innerHeight;
const windowHalfY = windowHeight / 2

// Create a Camera
const left = -windowWidth/2; 
console.log(window);
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
var numberOfVanes=10000;
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

var material;

			
init();
animate();


function init() {
	var xpos=-windowWidth/2
	var ypos=windowHeight/2
	for(var i=0;i<numberOfVanes;i++){
		vanes.push(new WindVane(xpos,ypos,diameter,clock));
		xpos+=diameter;
		if(xpos>windowWidth/2){
			xpos=-windowWidth/2
			ypos-=diameter;
		}
	}
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

	camera.position.z = 1;

	var i, p,parameters = [[ 0.25, 0xff7700, 1 ], [ 0.5, 0xff9900, 1 ], [ 0.75, 0xffaa00, 0.75 ], [ 1, 0xffaa00, 0.5 ], [ 1.25, 0x000833, 0.8 ],[ 3.0, 0xaaaaaa, 0.75 ], [ 3.5, 0xffffff, 0.5 ], [ 4.5, 0xffffff, 0.25 ], [ 5.5, 0xffffff, 0.125 ]];

	var geometry = createGeometry();
	// make line
	for ( i = 0; i < 1; ++ i ) {
		p = parameters[ i ];
		material = new THREE.LineBasicMaterial({ 
			color: p[ 1 ], 
			//opacity: p[ 2 ],
			linewidth: 3, 
		} );
		line = new THREE.LineSegments( geometry, material );
		line.updateMatrix();
		scene.add( line );	
	}

	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( windowWidth, windowHeight );
	renderer.setClearColor( 0xffff00, 0);

	// add the automatically created <canvas> element to the page
	container.appendChild( renderer.domElement );

	stats = new Stats();
	container.appendChild( stats.dom );

	}


function updateGeometry(){
	angle+=0.1;
	var vertex = new THREE.Vector3(0,0,0);
	var vertex2 = new THREE.Vector3();
	var axis = new THREE.Vector3( 0, 0, 1 );
	var vanel=diameter;

	var p = vanegeometry.attributes.position.array;


	var vector = new THREE.Vector3( vanel, 0, 0 );



	for (let i = 0; i < numberOfVanes; i++) {
		angle=vanes[i].getCurrentAngle;
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
	
	}
	vanegeometry.attributes.position.needsUpdate = true;
}

function createGeometry() {
	//vanegeometry= new THREE.BufferGeometry();
	var vertices = [];
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
		vertex.add(vector);
		vertices.push( vertex.x, vertex.y, vertex.z );
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
		updateGeometry();
		
		// update Wind	
		winds.map((wind,i) =>{
			wind.move();
	//		wind.display();
			if(wind.getDeleteMe()){
				removeEntity(wind);
				winds.splice(i,1);
			}
  		})


		// update Vane
  		//vanes.map(vane =>{
var millis=getMilliseconds(clock);
	for (let i = 0; i < numberOfVanes; i++) {
			var vane=vanes[i];
					

			//console.log(vane.x)

  			winds.map((wind,i) =>{
            	let outer=check_a_point(vane.x,vane.y,wind.x,wind.y,wind.radius);
            	let inner=check_a_point(vane.x,vane.y,wind.x,wind.y,wind.currentInnerRadius);
           
           // Circles
           		if(outer &! inner){
             		setActive(vane,wind);
            	};
            })
            // Circles End
        
  			vane.update(millis);

      				//vane.currentAngle=easeInOutSine(millis-vane.startAnimation,vane.startAngle,vane.thetaAngle,vane.duration);


			//console.log(vane.getCurrentAngle);
		//})
	}

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

			

function setActive(vane,wind){
	var angle=wind.angle
	var duration=wind.duration
	vane.setDuration(duration);
	vane.setTargetAngle(angle); 
	vane.setEasingType(wind.easingType);

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


		function removeEntity(object) {
    		var selectedObject = scene.getObjectById(object.name);
    		scene.remove( selectedObject );
		}


		function onMouseDown(event) {
			winds.push(new Wind(event.clientX ,event.clientY ));
		}

		