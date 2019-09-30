

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
;
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