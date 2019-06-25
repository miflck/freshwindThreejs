// Threejs
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
var numberOfVanes=15000;
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
var matline;


const colors=[0xff7700, 0xadd8e6, 0x497393 , 0x1e84d4 ,0x155c94,0xaaaaaa,0x1FB937,0x96B91F,0x1FB9B7,0x941FB9  ]


// image

	var imagedata;
	var isloaded=false;
			
init();
animate();


function init() {
	var xpos=-windowWidth/2
	var ypos=windowHeight/2
		var opX=0
	var opY=0
	for(var i=0;i<numberOfVanes;i++){
		vanes.push(new WindVane(xpos,ypos,diameter,clock,opX,opY));
		xpos+=diameter;
		opX+=diameter;
		if(xpos>windowWidth/2){
			xpos=-windowWidth/2
			ypos-=diameter;
			opX=0;
			opY+=diameter;
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

	  	window.addEventListener("touchstart", onTouchDown, false);


	camera.position.z = 1;

	var i, p,parameters = [[ 0.25, 0xff7700, 1 ], [ 0.5, 0xadd8e6, 1 ], [ 0.75, 0x497393, 0.75 ], [ 1, 0x1e84d4, 0.5 ], [ 1.25, 0x155c94, 0.8 ],[ 3.0, 0xaaaaaa, 0.75 ]];
	

	var vanegeometry = createGeometry();
	material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors,linewidth: 3 } );

	vanegeometry.computeBoundingSphere();


var params = function() {
	this.curves = true;
	this.circles = false;
	this.amount = 100;
	this.lineWidth = 1;
	this.dashArray = 0.6;
	this.dashOffset = 0;
	this.dashRatio = 0.5;
	this.taper = 'parabolic';
	this.strokes = false;
	this.sizeAttenuation = false;
	this.animateWidth = false;
	this.spread = false;
	this.autoRotate = true;
	this.autoUpdate = true;
	this.animateVisibility = false;
	this.animateDashOffset = false;
	
};

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

	line = new THREE.LineSegments( vanegeometry, material );
	scene.add( line );


	//line = new THREE.LineSegments( vanegeometry, material );
	//line.computeLineDistances()

//	line.computeLineDistances();
	//			line.scale.set( 1, 1, 1 );
	//scene.add( line );


/*var TAU = 2 * Math.PI;

	var hexagonGeometry = new THREE.Geometry();
for( var j = 0; j < TAU - .1; j += TAU / 100 ) {
	var v = new THREE.Vector3();
	v.set( Math.cos( j )*200, Math.sin( j )*200, 0 );
	hexagonGeometry.vertices.push( v );
}
hexagonGeometry.vertices.push( hexagonGeometry.vertices[ 0 ].clone() );


var resolution = new THREE.Vector2( window.innerWidth, window.innerHeight );


var mline = new MeshLine();
mline.setGeometry( hexagonGeometry );
var mat = new MeshLineMaterial( {
		useMap: false,
		color: new THREE.Color( colors[ 0 ] ),
		opacity: 1,
		resolution: resolution,
		sizeAttenuation: !false,
		lineWidth: 0.1,
		near: camera.near,
		far: camera.far
		
	});


var mesh = new THREE.Mesh( mline.geometry, mat ); // this syntax could definitely be improved!
scene.add( mesh );
	*/
	/*matLine = new THREE.LineMaterial( {

	color: 0x4080ff,
	linewidth: 1, // in pixels
	//resolution:  // to be set by renderer, eventually
	dashed: false

} );*/


				//	line2 = new THREE.Line2( lgeometry, matLine );

				//scene.add( line2 );

	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( windowWidth, windowHeight );
	renderer.setClearColor( 0xffff00, 0);

	// add the automatically created <canvas> element to the page
	container.appendChild( renderer.domElement );

	stats = new Stats();
	container.appendChild( stats.dom );

var loader = new THREE.ImageLoader();

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
  	// get millis slows whole down. so one Time for all…
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

			

function setActive(vane,wind,millis){
	var angle=wind.angle
	var duration=wind.duration
	var dilitationTime=	500;
	var dilitationAngle=Math.PI/4;
	vane.setEasingType(wind.easingType);
	vane.setColor(wind.color)


	 if(vane.isOnMask){

	     vane.setDuration(duration+dilitationTime);
         vane.setTargetAngle((angle+dilitationAngle),millis); 
	}else{
		vane.setDuration(duration);
		vane.setTargetAngle(angle,millis); 
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


		function removeEntity(object) {
    		var selectedObject = scene.getObjectById(object.name);
    		scene.remove( selectedObject );
		}


		function onMouseDown(event) {
			var col=new THREE.Color( colors[Math.floor(Math.random()*colors.length)] );
			winds.push(new Wind(event.clientX ,event.clientY,0,col));
		}

			function onTouchDown(event) {
				alert(event)
			var col=new THREE.Color( colors[Math.floor(Math.random()*colors.length)] );
			winds.push(new Wind(event.touches[0].clientX ,event.touches[0].clientY,0,col));
		}

		