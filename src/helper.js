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


function checkIsInside(x,y,px, py,w,h) {

    if(x>px && x<px+w && y>py&&y<py+h){
        return true;
    }else{
        return false
    }
}


// EASING

/*t is current time
b is start value
c is change in value
d is duration*/


//https://gist.github.com/creotiv/effdedbe7c5526a493bf

function easeInOutQuad(t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
};

function easeInOutQuint (t, b, c, d) {
	if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
	return c/2*((t-=2)*t*t*t*t + 2) + b;
};

function easeInOutSine (t, b, c, d) {
	return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
};

function easeInQuad (t, b, c, d) {
    return c*(t/=d)*t + b;
};

// quadratic easing out - decelerating to zero velocity
function easeOutQuad (t, b, c, d) {
    return -c *(t/=d)*(t-2) + b;
};


function easeInCubic(t) {
    return Math.pow(t,3);
}

//THREEjs clock
function getMilliseconds(clock){
    return Math.floor(clock.getElapsedTime()*1000);
}






function resetScene(scene,linewidth){

    var rect = scene.userData.view.getBoundingClientRect();


   

    // remove old stuff
    scene.remove(scene.userData.vanegeometry);
    scene.remove(scene.userData.lineGeometry);
    scene.remove(scene.userData.thickline );
   // scene.remove( plane );

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

        console.log("created Vanes:"+scene.userData.numberOfVanes);

    return vanes;
}

function removeEntity(scene,object) {
    var selectedObject = scene.getObjectById(object.name);
    scene.remove( selectedObject );
}

function loadImages(imageurls,successCallback){
    var data=[];
    const loadManager = new THREE.LoadingManager();

    loadManager.onProgress = function ( item, loaded, total ) {
    // this gets called after any item has been loaded
        if(debugLog)console.log( 'Loading file: ' + item + '.\nLoaded ' + loaded + ' of ' + total + ' files.' );
    };

     loadManager.onLoad = function () {
        console.log( 'Loading complete!');

        data.map(datap => console.log(datap))

        data.sort(function(a, b) {
            return a.src.localeCompare(b.src);
        });

        data.map(datap => console.log(datap))

        successCallback(data)
    };

    const multiloader = new THREE.ImageLoader(loadManager);
    for(var i=0;i<imageurls.length;i++){
        multiloader.load(imageurls[i], function ( image ) {
            data.push( image );
        });
    }
}

function getImageData( image ) {
    var canvas = document.createElement( 'canvas' );
    canvas.width = image.width;
    canvas.height = image.height;
    var context = canvas.getContext( '2d' );
    context.drawImage( image, 0, 0 );
    return context.getImageData( 0, 0, image.width, image.height );
}

function getPixel( imagedata, x, y ) {
    var position = ( x + imagedata.width * y ) * 4, data = imagedata.data;
    return { r: data[ position ], g: data[ position + 1 ], b: data[ position + 2 ], a: data[ position + 3 ] };

}

function cycleImages(){
    imageIndex=(imageIndex+1)%imagesData.length
    if(debugLog)console.log("cycle!"+imageIndex);
}





