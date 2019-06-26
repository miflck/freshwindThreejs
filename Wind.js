

		class Wind {
		  	constructor(iX,iY,isMasked,color) {
				this.x = iX-windowWidth/2;
				this.y =-iY+windowHeight/2;
				this.radius = 0;
				this.velocity=randomIntFromInterval(8,20);
				this.maxRadius=10000;
				this.innerradius=80;
				this.currentInnerRadius=0;
				this.isMasked=isMasked;
				this.color=color;

				this.deleteMe=false;
				//var rand=int(random(3,10));
				this.rand=randomIntFromInterval(5,20);
				this.randDur=randomIntFromInterval(1,5);




				//if(rand%4==0)rand+=Math.PI/2;
				this.mult=1;
				if(Math.random()>0.5)this.mult=-1;
				this.angle=latestAngle+(this.rand*(Math.PI/4)*this.mult);//random(2*PI);

				//this.angle=latestAngle+2*Math.PI//random(2*PI);

				latestAngle=this.angle;


				//this.duration=scale(this.randDur,1,5,200,2000);//random(500,3000);
				this.duration=scale(this.rand,5,20,200,2000);//random(500,3000);

				//this.duration=random(500,3000);

				//const rn= randomIntFromInterval(0,colors.length);
				// this.color=color(colors[rn]);
				this.flutterDistance=randomIntFromInterval(200,500);
				this.flutterRadius=randomIntFromInterval(50,200);
				this.flutterSpeed=randomFloatFromInterval(0.1,0.5);
				this.rotMax=randomFloatFromInterval(0,5*Math.PI);//*int(random(5));
				this.easingType='easeOutQuad';


				this.geometry = new THREE.CircleGeometry( 5, 32 );
				this.material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
				//this.circle = new THREE.Mesh( this.geometry, this.material );
			//	this.circle.position.x=this.x;
		//		this.circle.position.y=this.y;
		//		this.name=this.circle.id;
				//scene.add( this.circle );

		  }

		  move(){
		  	//console.log(this.radius);
		    this.radius+=this.velocity;
		    if(this.radius>this.maxRadius)this.deleteMe=true;
		    this.currentInnerRadius=this.radius-this.innerradius;
		    if(this.currentInnerRadius<0)this.currentInnerRadius=0;
		    //this.geometry = new THREE.CircleGeometry( this.radius, 32 );
		   // var selectedObject = scene.getObjectById(this.name);
    		//scene.remove( selectedObject );

			//this.circle = new THREE.Mesh( this.geometry, this.material );
			//this.name=this.circle.id;

			//this.circle.position.x=this.x;
			//this.circle.position.y=-this.y;
			//scene.add( this.circle );


		  }

		  display(){
		   /* push();
		    strokeWeight(1);
		    stroke(255,0,0,50);
		    noFill();
		    translate(this.x,this.y);
		    //ellipse(0,0, this.radius*2,this.radius*2);
		    //ellipse(0,0, this.currentInnerRadius*2,this.currentInnerRadius*2);
		    pop();*/
		  }

		  getDeleteMe(){
		    return this.deleteMe;


		  }

		}