# freshwindThreejs
Freshwind Threejs repo


first provide some background images:

```
var files = ['images/1111.png','images/2222.png','images/3333.png','images/4444.png','images/5555.png'];
/* load the backgroundimages*/
loadBackgroundImages(files);
```

set rectangle for content:
setContentRect(x,y,width,height)

```
		// set empty space for content
		setContentRect(300,180,900,windowHeight-180);
```

then call init and start the loop with animate():

```
//setup
	init();
//start loop
	animate();
```
