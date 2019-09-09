

		class Wind {
		  	constructor(scene,iX,iY,velocity,angle,dur,wait,initTime,color,isMasked,imageData) {
				this.x = iX-windowWidth/2;
				this.y =-iY+windowHeight/2;
				this.radius = 0;
				this.velocity=velocity;//randomIntFromInterval(8,20);
				this.maxRadius=10000;
				this.innerradius=300;
				this.currentInnerRadius=0;
				this.isMasked=isMasked;
				this.color=color;

				this.deleteMe=false;
				//var rand=int(random(3,10));
				this.rand=randomIntFromInterval(5,20);
				this.randDur=randomIntFromInterval(1,5);
				this.imageData=imageData;
				if(debugLog)console.log("push "+this.imageData);


				this.hsl = this.color.getHSL(this.hsl);
				this.maskColor = new THREE.Color();

				this.s=scale(this.hsl.s,0,1,0.5,0.7);
				this.l=this.hsl.l//scale(this.hsl.l,0,1,0.5,0.7);
				this.maskColor.setHSL( this.hsl.h, this.s,this.l);

				//if(rand%4==0)rand+=Math.PI/2;
				this.mult=1;
				if(Math.random()>0.5)this.mult=-1;
				this.angle=scene.userData.latestAngle+angle;//(this.rand*(Math.PI/4)*this.mult);//random(2*PI);
				scene.userData.latestAngle=this.angle;
				this.duration=dur;//scale(this.rand,5,20,200,2000);//random(500,3000);
				this.easingType='easeOutQuad';
				this.initTime=initTime;
				this.wait=wait;

		  }

		  move(scene,millis){
		  	//console.log(this.radius);
		  	if(millis>this.initTime+this.wait){
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

		  hello(){
		  	console.log("hello");
		  }

		  setMaxRadius(maxrad){
		  	this.maxRadius=maxrad;
		  }

		}