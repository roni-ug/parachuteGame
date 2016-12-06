
//stores all game elements
class ElementsData {
	constructor(){
	this.backGroundScreen = new imageElement(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT,"background");

    this.boat = new imageElement(Math.floor(CANVAS_WIDTH/2) -60 , 400, 140, 160,"boat");
  	this.plane = new Plane(CANVAS_WIDTH, 30, 100,  60,"plane");

	this.scoreBoxText = new textElement(30, 30, 100, 100, `score:${SCORE}         lives:`);

	this.allHearts = new AllHearts("lives");
	this.allParachutes = new AllParachutes("parachute");

	this.newGameButton = new imageElement(250, 300, 300, 125,"newGameButton");
	this.newGameButton.appearsInScreen = OPENNING_SCREEN;

	this.parachuteImageOfText = new imageElement(170, 100, 515, 85,"parachuteText");
	this.parachuteImageOfText.appearsInScreen = OPENNING_SCREEN;

	this.gameOverImageOfText = new imageElement(170, 100, 505, 85,"gameOverText");
	this.gameOverImageOfText.appearsInScreen = END_SCREEN;
	}	
}


// the general screen element that image and text inherit from
class generalElement {
	constructor(objX, objY, objWidth, objHeight){
		this.x = objX, this.y = objY;
		this.width = objWidth, this.height = objHeight;
		this.appearsInScreen = MAIN_GAME_SCREEN;
	}

	draw(){};
	update(){};
}


class imageElement extends generalElement {
	constructor(objX, objY, objWidth, objHeight,imgName){
		super(objX, objY, objWidth, objHeight);
		this.sprite = new sprite(imgName);

	}
	draw(){
		this.sprite.draw(canvas, this.x, this.y);
	}	
}

class textElement extends generalElement {
	constructor (objX, objY, objWidth, objHeight, text){
		super(objX, objY, objWidth, objHeight);
		this.text = text;
		canvas.font = "15px Ariel";
	}	
	draw (){
		canvas.fillText(this.text, this.x, this.y);
	}
}



class Plane extends imageElement{
	constructor(objX, objY, objWidth, objHeight,imgName){
		super(objX, objY, objWidth, objHeight,imgName);
	}
	update(){
		if (this.x > -this.width) {
			this.x -= PLANE_SPEED;
		} 
		else {
			this.x = CANVAS_WIDTH;
		}	
	}		
}

class AllHearts{
	constructor(imgName){
		this.heartElements = [];
        this.appearsInScreen = MAIN_GAME_SCREEN;
		
		for ( let i = 0; i < MAX_LIVES; i++) {
			this.heartElements.push(new imageElement(160 + 35 * i, 15, 30, 30,imgName));
		}
		
	}
	
	
	draw (){
        this.heartElements.forEach(function (element) {
            element.draw();
        });      
}
	
	remove (){
		if (this.heartElements.length > 0) {
			this.heartElements.pop();
		}
	}
	
	update(){}
}


class AllParachutes{
    
	constructor(imgName){
		this.appearsInScreen = MAIN_GAME_SCREEN;
		this.update_counter = 0;
		this.rand = Math.round(Math.random() * DROP_RATE);
		this.parachuteElements = {};
		this.key = 0;
		this.img = imgName;
	}
	
	
	update(){
		// handles pushing new parachute to parachute array in random times
		if (this.update_counter === this.rand) {
			this.update_counter = 0;
			this.rand = Math.round(Math.random() * DROP_RATE + 100);
			if (Object.keys(this.parachuteElements).length < 2) {
				this.key++;
				this.addParachute();
			}
		}
		this.update_counter++;
		var self = this;
		
		Object.keys(this.parachuteElements).forEach( function (currKey) {
			self.parachuteElements[currKey].update();	
		});
        
	}
	
	addParachute (){
        
		this.parachuteElements[this.key] = new Parachute(elementsData.plane.x, 30, 60, 60,this.img, this.key);
	}
	remove(key){
		delete this.parachuteElements[key];
	}
	draw (){
		var self = this;
		Object.keys(this.parachuteElements).forEach( function (currKey) {
			let isLoaded = self.parachuteElements[currKey].sprite.image.complete;
			if(isLoaded ){
				self.parachuteElements[currKey].draw();	
			}
			
		});	
    }
}


class Parachute extends imageElement{
	constructor	(objX, objY, objWidth, objHeight,imgName,key){
		super(objX, objY, objWidth, objHeight,imgName);
		this.key= key;
	}
	update(){
		this.y += DROP_SPEED;
		if (this.y >= elementsData.boat.y && 
				this.y < elementsData.boat.y + DROP_SPEED) {
				
				if (this.x >= elementsData.boat.x && 
					this.x <= elementsData.boat.x + elementsData.boat.width) {
					
					SCORE++;
					elementsData.scoreBoxText.text = "score:" + SCORE + "         lives:";
				} 
				else {
					LIVES--;
					elementsData.allHearts.remove();
					
					if (LIVES === 0) {
						GAME_ACTIVE = false;
					}
				}
				elementsData.allParachutes.remove(this.key);
			}
	}
}

class sprite {
	constructor(name){
		this.image = new Image();
		this.image.id = name;
		var self = this;
		

		this.spriteImagePath = "images/";
		this.image.src = this.spriteImagePath + name + ".png";
	}
	draw(canvas, x, y) {
		canvas.drawImage(this.image, x, y);
	}
}


