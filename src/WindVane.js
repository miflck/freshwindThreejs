class WindVane {
	constructor(iX,iY,diameter,clock,opX,opY){
		this.x = iX;
    	this.y =iY;


      this.ox = opX;
      this.oy =opY;

    	this.diameter = diameter;
    	this.pos= new THREE.Vector3( this.x, this.y,0);


    	this.strokeColor=new THREE.Color(0x26539D); // red
      this.targetColor=new THREE.Color(0x26539D); // red
      this.lerpFact=0;
    	this.alpha=255;
    	this.startAngle = 0;
    	this.currentAngle = 0;
    	this.targetAngle = 0;
    	this.thetaAngle = this.targetAngle-this.currentAngle;

  		this.duration=0;
   		this.endAnimation=getMilliseconds(clock)+this.duration;
    	this.startAnimation=getMilliseconds(clock);
    	this.easingType='easeInOutSine';
      this.alphavalue=255;

      this.isActive=false;
      this.isOnMask=false;
      this.zPos=0;
	}


	 update(millis){
      if(this.isActive){
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

            case 'easeInOutQuad':
              this.currentAngle=easeInOutQuad(millis-this.startAnimation,this.startAngle,this.thetaAngle,this.duration);
            break;
  			}
          this.lerpFact=1;
          this.strokeColor.lerp(this.targetColor,this.lerpFact);
		  }
        if(millis>this.endAnimation){
          this.currentAngle=this.targetAngle;
          this.isActive=false;
        }
	}




  setColor(color){
   this.targetColor=color;
  }

	get getCurrentAngle(){
		return this.currentAngle;
	}

	get position(){
		return this.pos;
	}

  get getStrokeColor(){
    return this.strokeColor;
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

  	setEasingType(easingType){
  		this.easingType=easingType;
	}
}