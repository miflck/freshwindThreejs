class WindVane {
	constructor(iX,iY,diameter,clock){
		this.x = iX;
    	this.y =iY;
    	this.diameter = diameter;
    	this.pos= new THREE.Vector3( this.x, this.y,0);
    	//this.strokeColor=color(0,100,200);
    	this.alpha=255;
    
    	this.startAngle = 0;
    	this.currentAngle = 0;
    	this.targetAngle = 0;
    	this.thetaAngle = this.targetAngle-this.currentAngle;



  		this.duration=0;
   		this.endAnimation=getMilliseconds(clock)+this.duration;
    	this.startAnimation=getMilliseconds(clock);
    	this.easingType='easeInOutSine';
    	//console.log("init vane");


	}


	 update(millis){
		//var millis=getMilliseconds(clock);
		 if(millis < this.endAnimation){

		 	switch (this.easingType) {
  				case 'easeInOutSine':
      				this.currentAngle=easeInOutSine(millis-this.startAnimation,this.startAngle,this.thetaAngle,this.duration);
    			break;

			    case 'easeInQuad':
			      this.currentAngle=easeInQuad(millis-this.startAnimation,this.startAngle,this.thetaAngle,this.duration);
			    break;

			    case 'easeOutQuad':
			      this.currentAngle=easeOutQuad(millis-this.startAnimation,this.startAngle,this.thetaAngle,this.duration);
			    break;
			}

		}
        if(Math.abs(this.currentAngle-this.targetAngle)<0.09)this.currentAngle=this.targetAngle;

	}

	get getCurrentAngle(){
		return this.currentAngle;
	}

	get position(){
		return this.pos;
	}

	setDuration(duration){
    	this.duration=duration;
  	}

  	setTargetAngle(angle){
    	if(angle!=this.targetAngle){
    		this.startAngle=this.currentAngle;
    		this.targetAngle=angle;
    		this.thetaAngle= this.targetAngle-this.startAngle;
   			this.endAnimation=getMilliseconds(clock)+this.duration;
    		this.startAnimation=getMilliseconds(clock);
    	}
  	}

  	setEasingType(easingType){
  		this.easingType=easingType;
	}
}