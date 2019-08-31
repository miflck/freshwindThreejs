# freshwindThreejs
# setup and use:
load following sourcefiles:
```html
<!-- Import threejs source files -->

<script src="src/threejs/three.js"></script>
<script src="threejs/stats.min.js"></script>

<script src='src/threejs/lines/LineSegmentsGeometry.js'></script>
<script src='src/threejs/lines/LineMaterial.js'></script>
<script src='src/threejs/lines/LineSegments2.js'></script>
<script src='src/threejs/lines/Line2.js'></script>

<!-- Import wind source files -->
<script src="src/helper.js?v=0.3"></script>
<script src="src/WindVane.js?v=0.3"></script>
<script src="src/Wind.js?v=0.4"></script>
<script src="src/app.js?v=0.5"></script>
```


provide a canvas:
```html
<!-- container for the threejs action -->
<canvas id="c"></canvas>
```

```css
#c {
	position: fixed;
	left: 0px; top: 0px;
	width: 100%;
	height: 100%;
	background-color: #fff;
	z-index: -1;
}
```

 provide some background images:

```javascript
var files = ['images/1111.png','images/2222.png','images/3333.png','images/4444.png','images/5555.png'];
/* load the backgroundimages*/
loadBackgroundImages(files);

```

append windcontainer:
```html
<div class="windcontainer"></div>
```


you can keydown like that:
```javascript

//  Key listener to debug and test. not necessary in production…
		document.addEventListener('keydown', function(event) {
			// w to make wind
    		if (event.keyCode == 87) {
				scenes.forEach( function ( scene ) {

					var rect = scene.userData.view.getBoundingClientRect();
					// check if it's offscreen. If so skip it
					if ( rect.bottom < 0 || rect.top > renderer.domElement.clientHeight ||
						 rect.right < 0 || rect.left > renderer.domElement.clientWidth ) {
						return; // it's off screen
					}
					makeRandomWind(scene,0);
				});
   			}
		}, false);

```



then call init:

```javascript
//setup
init();

```
