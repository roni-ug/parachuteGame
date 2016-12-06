const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const FPS = 30;
const MAX_LIVES = 3;
const DROP_SPEED = 2;
const BOAT_SPEED = 9;
const PLANE_SPEED = 3;
const DROP_RATE = 300;
const OPENNING_SCREEN = 1;
const MAIN_GAME_SCREEN = 2;
const END_SCREEN = 3;
const leftArrow = '37';
const rightArrow = '39';

let GAME_ACTIVE = false;

let SCORE = 0;
let LIVES = 3;

let refreshIntervalId;
const canvas = document.getElementById("canvas1").getContext("2d");





// elementsData is an instance of the class ElementsData that stores the
// multiple game elements, such as boat, parachute etc..
let elementsData = new ElementsData();
initializeGame();
showGameOpeningScreen();
document.onclick = handleGameResponseToMouseClick;
document.onkeydown = hadlePlayerResponseToKeyPressed;



function showGameOpeningScreen() {
	elementsData.newGameButton.sprite.image.onload = function() {
		elementsData.backGroundScreen.draw();
		elementsData.parachuteImageOfText.draw();
		elementsData.newGameButton.draw();
	};

};


// initializes game values (score,lives.. ) to default to enable re-starting game
function initializeGame() {
	SCORE = 0;
	LIVES = 3;
};


// the game loop, calls the updates and draw functions, and handles the ending of game
// gameLoop is called periodically by setInterval whenever the new game button is clicked
function gameLoop() {
	update();
	draw();
	// when game is over, stops the setInterval, and calls the game end screen
	if (!GAME_ACTIVE) {
		clearInterval(refreshIntervalId);
		showGameEndedScreen();
	}
};

function showGameEndedScreen() {
	elementsData.backGroundScreen.draw();
	elementsData.gameOverImageOfText.draw();
	elementsData.newGameButton.draw();
};


// updates the movements and status of elements on screen
function update() {
	Object.keys(elementsData).forEach( function (key) {
		elementsData[key].update();	
	});
};

function draw(){
	Object.keys(elementsData).forEach( function (key) {
		if(elementsData[key].appearsInScreen == MAIN_GAME_SCREEN){
			elementsData[key].draw();	
		}		
	});
};



// the listener that responses to mouse clicks
function handleGameResponseToMouseClick(event) {

	let canvasX = event.pageX;
	let canvasY = event.pageY;

	if (!GAME_ACTIVE) {
		//responds to pressing the new game button
		if ((canvasX >= elementsData.newGameButton.x && 
			canvasX <= elementsData.newGameButton.x + elementsData.newGameButton.width) && 
			(canvasY >= elementsData.newGameButton.y && 
			canvasY <= elementsData.newGameButton.y + elementsData.newGameButton.height)) {

			GAME_ACTIVE = true;
			initializeGame();
			elementsData = new ElementsData();
			refreshIntervalId = setInterval(gameLoop, 1000 / FPS);
		}
	}

};


// the listener that responds to key left and key right and moves player accordingly
function hadlePlayerResponseToKeyPressed(keyPressedEvent) {

	keyPressedEvent = keyPressedEvent || window.event;
	
	if (GAME_ACTIVE) {
		// left arrow
		if (keyPressedEvent.keyCode === leftArrow) {
			elementsData.boat.x -= BOAT_SPEED;

		}
		// right arrow
		else if (keyPressedEvent.keyCode === rightArrow) {
			elementsData.boat.x += BOAT_SPEED;
		}
		// makes sure the boat won't exit screen bounds
		elementsData.boat.x = Math.min(Math.max(elementsData.boat.x, 0), CANVAS_WIDTH - elementsData.boat.width);
	}

};

