
//stores all game elements
class GameElements {
	constructor() {
		this.backGroundScreen = new ImageElement(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, "background");

		this.boat = new ImageElement(Math.floor(CANVAS_WIDTH / 2) - 60, 400, 140, 160, "boat");
		this.plane = new Plane(CANVAS_WIDTH, 30, 100, 60, "plane");

		this.scoreBoxText = new TextElement(30, 30, 100, 100, `score:${SCORE}         lives:`);

		this.allHearts = new AllHearts("lives");
		this.allParachutes = new AllParachutes("parachute");

		this.newGameButton = new ImageElement(250, 300, 300, 125, "newGameButton");
		this.newGameButton.appearsInScreen = OPENNING_SCREEN;

		this.parachuteImageOfText = new ImageElement(170, 100, 515, 85, "parachuteText");
		this.parachuteImageOfText.appearsInScreen = OPENNING_SCREEN;

		this.gameOverImageOfText = new ImageElement(170, 100, 505, 85, "gameOverText");
		this.gameOverImageOfText.appearsInScreen = END_SCREEN;
	}
}


// the general screen element that image and text inherit from
class generalElement {
	constructor(objX, objY, objWidth, objHeight) {
		this.x = objX, this.y = objY;
		this.width = objWidth, this.height = objHeight;
		this.appearsInScreen = MAIN_GAME_SCREEN;
	}

	draw() { };
	update() { };
}


class ImageElement extends generalElement {
	constructor(objX, objY, objWidth, objHeight, imgName) {
		super(objX, objY, objWidth, objHeight);
		this.sprite = new sprite(this, imgName);
		
	}
	draw() {
		this.sprite.draw(canvas, this.x, this.y);
	}
}

class TextElement extends generalElement {
	constructor(objX, objY, objWidth, objHeight, text) {
		super(objX, objY, objWidth, objHeight);
		this.text = text;
		canvas.font = "15px Ariel";
	}
	draw() {
		canvas.fillText(this.text, this.x, this.y);
	}
}



class Plane extends ImageElement {
	constructor(objX, objY, objWidth, objHeight, imgName) {
		super(objX, objY, objWidth, objHeight, imgName);
	}
	update() {
		if (this.x > -this.width) {
			this.x -= PLANE_SPEED;
		}
		else {
			this.x = CANVAS_WIDTH;
		}
	}
}

class AllHearts {
	constructor(imgName) {
		this.heartElements = [];
		this.appearsInScreen = MAIN_GAME_SCREEN;

		for (let i = 0; i < MAX_LIVES; i++) {
			this.heartElements.push(new ImageElement(160 + 35 * i, 15, 30, 30, imgName));
		}

	}


	draw() {
		this.heartElements.forEach(function (element) {
			element.draw();
		});
	}

	remove() {
		if (this.heartElements.length > 0) {
			this.heartElements.pop();
		}
	}

	update() { }
}


class AllParachutes {

	constructor(imgName) {
		this.appearsInScreen = MAIN_GAME_SCREEN;
		this.update_counter = 0;
		this.rand = Math.round(Math.random() * DROP_RATE);
		this.parachuteElements = {};
		this.key = 0;
		this.img = imgName;
	}


	update() {
		// handles pushing new parachute to parachute array in random times
		if (this.update_counter === this.rand) {
			this.update_counter = 0;
			this.rand = Math.round(Math.random() * DROP_RATE + 100);
			if (Object.keys(this.parachuteElements).length < 2 && gameElements.plane.x > MARGIN && gameElements.plane.x < CANVAS_WIDTH - MARGIN) {
				this.key++;
				this.addParachute();
			}
		}
		this.update_counter++;
		var self = this;

		Object.keys(this.parachuteElements).forEach(function (currKey) {
			self.parachuteElements[currKey].update();
		});

	}

	addParachute() {

		this.parachuteElements[this.key] = new Parachute(gameElements.plane.x, 30, 60, 60, this.img, this.key);
	}
	remove(key) {
		delete this.parachuteElements[key];
	}
	draw() {
		var self = this;
		Object.keys(this.parachuteElements).forEach(function (currKey) {
			let isLoaded = self.parachuteElements[currKey].sprite.image.complete;
			if (isLoaded) {
				self.parachuteElements[currKey].draw();
			}

		});
	}
}


class Parachute extends ImageElement {
	constructor(objX, objY, objWidth, objHeight, imgName, key) {
		super(objX, objY, objWidth, objHeight, imgName);
		this.key = key;
		this.counter = 0;
	}
	update() {
		this.y += DROP_SPEED;
		if (this.y >= gameElements.boat.y &&
			this.y < gameElements.boat.y + DROP_SPEED) {

			if (this.x >= gameElements.boat.x &&
				this.x <= gameElements.boat.x + gameElements.boat.width) {

				SCORE++;
				gameElements.scoreBoxText.text = "score:" + SCORE + "         lives:";
			}
			else {
				LIVES--;
				gameElements.allHearts.remove();

				if (LIVES === 0) {
					GAME_ACTIVE = false;
				}
			}
			gameElements.allParachutes.remove(this.key);
		}
	}
}

class sprite {
	constructor(ob, name) {
		this.image = new Image();


		this.spriteImagePath = "images/";

		this.image.src = this.spriteImagePath + name + ".png";


	}
	draw(canvas, x, y) {

		canvas.drawImage(this.image, x, y);
	}
}


