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
const LEFTARROW = '37';
const RIGHTARROW = '39';
const MARGIN  = 80;

let GAME_ACTIVE = false;

let SCORE = 0;
let LIVES = 3;

let refreshIntervalId;
const canvas = document.getElementById("canvas1").getContext("2d");





// gameElements is an instance of the class GameElements that stores the
// multiple game elements, such as boat, parachute etc..
let gameElements = new GameElements();
initializeGame();
showGameOpeningScreen();
document.onclick = handleGameResponseToMouseClick;
document.onkeydown = hadlePlayerResponseToKeyPressed;



function showGameOpeningScreen() {
	gameElements.newGameButton.sprite.image.onload = function() {
		gameElements.backGroundScreen.draw();
		gameElements.parachuteImageOfText.draw();
		gameElements.newGameButton.draw();
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
	gameElements.backGroundScreen.draw();
	gameElements.gameOverImageOfText.draw();
	gameElements.newGameButton.draw();
};


// updates the movements and status of elements on screen
function update() {
	Object.keys(gameElements).forEach( function (key) {
		gameElements[key].update();	
	});
};

function draw(){
	Object.keys(gameElements).forEach( function (key) {
		if(gameElements[key].appearsInScreen == MAIN_GAME_SCREEN){
			gameElements[key].draw();	
		}		
	});
};



// the listener that responses to mouse clicks
function handleGameResponseToMouseClick(event) {

	let canvasX = event.pageX;
	let canvasY = event.pageY;
	let ClickedInButtonBoundsX = (canvasX >= gameElements.newGameButton.x &&  
		canvasX <= gameElements.newGameButton.x + gameElements.newGameButton.width);
	let ClickedInButtonBoundsY = (canvasY >= gameElements.newGameButton.y && 
		canvasY <= gameElements.newGameButton.y + gameElements.newGameButton.height);
	
	if (!GAME_ACTIVE) {
		//responds to pressing the new game button
		if (ClickedInButtonBoundsX && ClickedInButtonBoundsY) {
			GAME_ACTIVE = true;
			initializeGame();
			gameElements = new GameElements();
			refreshIntervalId = setInterval(gameLoop, 1000 / FPS);
		}
	}

};


// the listener that responds to key left and key right and moves player accordingly
function hadlePlayerResponseToKeyPressed(keyPressedEvent) {

	keyPressedEvent = keyPressedEvent || window.event;
	
	if (GAME_ACTIVE) {
		// left arrow
		if (keyPressedEvent.keyCode == LEFTARROW) {
			gameElements.boat.x -= BOAT_SPEED;

		}
		// right arrow
		else if (keyPressedEvent.keyCode == RIGHTARROW) {
			gameElements.boat.x += BOAT_SPEED;
		}
		// makes sure the boat won't exit screen bounds
		gameElements.boat.x = Math.min(Math.max(gameElements.boat.x, 0), CANVAS_WIDTH - gameElements.boat.width);
	}

};

