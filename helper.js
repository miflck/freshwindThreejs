function randomIntFromInterval(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}
        
function randomFloatFromInterval(min, max){
      return (Math.random()*(max-min+1)+min);
}

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




