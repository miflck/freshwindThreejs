class WindVane {
	constructor(iX,iY,diameter,clock,opX,opY){
		this.x = iX;
    	this.y =iY;
      this.ox = opX;
      this.oy =opY;
    	this.diameter = diameter;
    	this.pos= new THREE.Vector3( this.x, this.y,0);
    	this.alpha=255;
    	this.startAngle = 0;
    	this.currentAngle = 0;
    	this.targetAngle = 0;
    	this.thetaAngle = this.targetAngle-this.currentAngle;
  		this.duration=0;
   		this.endAnimation=getMilliseconds(clock)+this.duration;
    	this.startAnimation=getMilliseconds(clock);
      this.isActive=false;
      this.isOnMask=false;
      this.zPos=0;
      this.lerpFact=1;

	}


	 update(millis){
      if(this.isActive){
        	this.currentAngle=easeOutQuad(millis-this.startAnimation,this.startAngle,this.thetaAngle,this.duration);
		  }
        if(millis>this.endAnimation){
          this.currentAngle=this.targetAngle;
          this.isActive=false;
        }
	}

	get getCurrentAngle(){
		return this.currentAngle;
	}

	setDuration(duration){
    	this.duration=duration;
  	}

  	setTargetAngle(angle,millis){
    	if(angle!=this.targetAngle){
    		this.startAngle=this.currentAngle;
    		this.targetAngle=angle;
    		this.thetaAngle= this.targetAngle-this.startAngle;
   			this.endAnimation=millis+this.duration;
    		this.startAnimation=millis;
        this.isActive=true;
    	}
  	}

}