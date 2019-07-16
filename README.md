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
 provide some background images:

```javascript
var files = ['images/1111.png','images/2222.png','images/3333.png','images/4444.png','images/5555.png'];
/* load the backgroundimages*/
loadBackgroundImages(files);

```

set rectangle for content:
setContentRect(x,y,width,height)

```javascript
// set empty space for content
setContentRect(300,180,900,windowHeight-180);
```

then call init and start the loop with animate():

```javascript
//setup
init();
//start loop
animate();
```
to make a white rect for content, call setState(CONTENT):
```javascript
setState(CONTENT);
```

to fade out the content rect, call setState(WIND)
```javascript
setState(WIND);
```
