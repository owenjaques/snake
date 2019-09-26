var canvas, ctx, dx, dy, squareSize, score, screenWidth, screenHeight, food, interval, started, gameOver, snake1, snakes;

function Snake(pos){
	this.pos = pos;
}

//draws on canvas
function draw(snakes){
	//draws background
	ctx.fillStyle = "aqua";
	ctx.strokeStyle = "grey";
	ctx.fillRect(0, 0, screenWidth, screenHeight);
	ctx.strokeRect(0, 0, screenWidth, screenHeight);
	//draws food
	ctx.fillStyle = "red";
	ctx.fillRect(food.x, food.y, squareSize, squareSize);
	ctx.strokeRect(food.x, food.y, squareSize, squareSize);
	//draws snake
	ctx.fillStyle = "lightgreen";
	ctx.strokeStyle = "darkgreen";
	for(j = 0; j < snakes.length; j++){
		for(i = 0; i < snakes[j].pos.length; i++){
			ctx.fillRect(snakes[j].pos[i].x, snakes[j].pos[i].y, squareSize, squareSize);
			ctx.strokeRect(snakes[j].pos[i].x, snakes[j].pos[i].y, squareSize, squareSize);
		}
	}
}

//effectively moves the snake by adding the next location to a list array and popping the last element
function moveSnake(snake){
	var head = {x:snake.pos[0].x + dx, y:snake.pos[0].y + dy};
	snake.pos.unshift(head);

	//if it hits food do not pop
	if(snake.pos[0].x == food.x && snake.pos[0].y == food.y){
		createFood(snake);
		score++;
	}
	else {
		snake.pos.pop();
	}
}

function getDirection(){
	const LEFT_KEY = 37;
	const RIGHT_KEY = 39;
	const UP_KEY = 38;
	const DOWN_KEY = 40;
	var keyPressed = event.keyCode;
	if(keyPressed == LEFT_KEY && dx != 10){
		dx = -10;
		dy = 0;
	}
	else if(keyPressed == RIGHT_KEY && dx != -10){
		dx = 10;
		dy = 0;
	}
	else if(keyPressed == UP_KEY && dy != 10){
		dx = 0;
		dy = -10;
	}
	else if(keyPressed == DOWN_KEY && dy != -10){
		dx = 0;
		dy = 10;
	}
}

document.addEventListener("keydown", getDirection);

//generates a random number within the screen size given that is a multiple of ten
function randCoor(size){
	return Math.round((Math.random() * (size - squareSize)) / 10) * 10;
}

function createFood(snake){
	var x = randCoor(screenWidth);
	var y = randCoor(screenHeight);
	//checks to make sure its not spawning food where snake is
	for(i = 0; i < snake.pos.length; i++){
		if(x == snake.pos[i].x && y == snake.pos[i].y){
			x = randCoor(screenWidth);
			y = randCoor(screenHeight);
		}
	}
	food.x = x;
	food.y = y;
}

//writes to the html
function write(snake){
	var ele = document.getElementById("snakex");
	ele.innerHTML = snake.pos[0].x;
	ele = document.getElementById("snakey");
	ele.innerHTML = snake.pos[0].y;
	ele = document.getElementById("foodx");
	ele.innerHTML = food.x;
	ele = document.getElementById("foody");
	ele.innerHTML = food.y;
	ele = document.getElementById("score");
	ele.innerHTML = score;
}

function checkCol(snake){
	//checks for collision with wall
	if(snake.pos[0].x == -10 || snake.pos[0].x == screenWidth || snake.pos[0].y == -10 || snake.pos[0].y == screenHeight){
		clearInterval(interval);
		gameOver = true;
		return;
	}
	//checks for collision with self
	for(i = 1; i < snake.length; i++){
		if(snake[0].x == snake[i].x && snake[0].y == snake[i].y){
			clearInterval(interval);
			gameOver = true;
			return;
		}
	}
}

//a helper function to display a message to the canvas
function displayMessage(message){
	ctx.font = "bold 30px Arial";
	ctx.fillStyle = "white";
	ctx.strokeStyle = "grey";
	ctx.fillText(message, 25, screenHeight/2);
	ctx.strokeText(message, 25, screenHeight/2);
}

function init(){
	canvas = document.getElementById("gameArea");
	ctx = canvas.getContext("2d");
	dx = squareSize = 10;
	dy = score = 0;
	screenWidth = 600;
	screenHeight = 400;
	snake1 = new Snake([{x:250, y:250}, {x:250, y:260}, {x:250, y:270}, {x:250, y:280}]);
	snakes = [snake1];
	food = {x: randCoor(screenWidth), y: randCoor(screenHeight)};
	if(gameOver){
		displayMessage("Game Over - Press any key to Restart");
		//waits for one second to avoid immidiatly restarting if keys are accidentaly pressed
		setTimeout(function() {started = false;}, 1000);
	}
	else {
		draw(snakes);
		displayMessage("Press any key to Start");
		started = false;
	}
	gameOver = false;
}

function start(){
	//so that the interval is not set multiple times making it faster and faster
	if(!started){
		interval = setInterval(main, 60);
		started = true;
	}
}

//the function that is looped
function main(){
	moveSnake(snake1);
	write(snake1);
	checkCol(snake1);
	draw(snakes);
	if(gameOver)
		init();
}

init();

//if a key is pressed the game starts or restarts
document.body.onkeyup =  start;


