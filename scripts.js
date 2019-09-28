var canvas, ctx, dx, dy, squareSize, score, screenWidth, screenHeight, food, interval, started, gameOver, snake1, snake2, snakes, twoPlayers;

function Snake(pos){
	this.pos = pos;
	this.dx = 0;
	this.dy = -10;
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
		if(j == 1){
			ctx.fillStyle = "gold";
			ctx.strokeStyle = "goldenrod";
		}
		for(i = 0; i < snakes[j].pos.length; i++){
			ctx.fillRect(snakes[j].pos[i].x, snakes[j].pos[i].y, squareSize, squareSize);
			ctx.strokeRect(snakes[j].pos[i].x, snakes[j].pos[i].y, squareSize, squareSize);
		}
	}
}

//effectively moves the snake by adding the next location to a list array and popping the last element
function moveSnake(snakes){
	for(i = 0; i < snakes.length; i++){
		var head = {x:snakes[i].pos[0].x + snakes[i].dx, y:snakes[i].pos[0].y + snakes[i].dy};
		snakes[i].pos.unshift(head);

		//if it hits food do not pop
		if(snakes[i].pos[0].x == food.x && snakes[i].pos[0].y == food.y){
			createFood(snakes);
			score++;
		}
		else {
			snakes[i].pos.pop();
		}
	}
}

function getDirection(){
	const LEFT_KEY = 37;
	const RIGHT_KEY = 39;
	const UP_KEY = 38;
	const DOWN_KEY = 40;
	const A_KEY = 65;
	const D_KEY = 68;
	const W_KEY = 87;
	const S_KEY = 83;
	var keyPressed = event.keyCode;
	if(keyPressed == LEFT_KEY && snakes[0].dx != 10){
		snakes[0].dx = -10;
		snakes[0].dy = 0;
	}
	else if(keyPressed == RIGHT_KEY && snakes[0].dx != -10){
		snakes[0].dx = 10;
		snakes[0].dy = 0;
	}
	else if(keyPressed == UP_KEY && snakes[0].dy != 10){
		snakes[0].dx = 0;
		snakes[0].dy = -10;
	}
	else if(keyPressed == DOWN_KEY && snakes[0].dy != -10){
		snakes[0].dx = 0;
		snakes[0].dy = 10;
	}
	if(twoPlayers){
		if(keyPressed == A_KEY && snakes[1].dx != 10){
			snakes[1].dx = -10;
			snakes[1].dy = 0;
		}
		else if(keyPressed == D_KEY && snakes[1].dx != -10){
			snakes[1].dx = 10;
			snakes[1].dy = 0;
		}
		else if(keyPressed == W_KEY && snakes[1].dy != 10){
			snakes[1].dx = 0;
			snakes[1].dy = -10;
		}
		else if(keyPressed == S_KEY && snakes[1].dy != -10){
			snakes[1].dx = 0;
			snakes[1].dy = 10;
		}
	}
}

document.addEventListener("keydown", getDirection);

//generates a random number within the screen size given that is a multiple of ten
function randCoor(size){
	return Math.round((Math.random() * (size - squareSize)) / 10) * 10;
}

function createFood(snakes){
	var x = randCoor(screenWidth);
	var y = randCoor(screenHeight);
	//checks to make sure its not spawning food where snake is
	for(j = 0; j < snakes.length; j++){
		for(i = 0; i < snakes[j].pos.length; i++){
			if(x == snakes[j].pos[i].x && y == snakes[j].pos[i].y){
				x = randCoor(screenWidth);
				y = randCoor(screenHeight);
			}
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
	for(i = 1; i < snake.pos.length; i++){
		if(snake.pos[0].x == snake.pos[i].x && snake.pos[0].y == snake.pos[i].y){
			clearInterval(interval);
			gameOver = true;
			return;
		}
	}
	//checks for collision with other snake
	if(twoPlayers){
		//figures out which snake called the function
		otherSnake = (snake == snake1) ? snake2 : snake1;
		for(i = 1; i < otherSnake.pos.length; i++){
			if(snake.pos[0].x == otherSnake.pos[i].x && snake.pos[0].y == otherSnake.pos[i].y){
				clearInterval(interval);
				gameOver = true;
				return;
			}
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
	squareSize = 10;
	score = 0;
	screenWidth = 600;
	screenHeight = 400;
	snake1 = new Snake([{x:250, y:250}, {x:250, y:260}, {x:250, y:270}, {x:250, y:280}]);
	if(document.getElementById("players").checked == true && !twoPlayers){
		snake2 = new Snake([{x:350, y:250}, {x:350, y:260}, {x:350, y:270}, {x:350, y:280}]);
		snakes = [snake1, snake2];
		twoPlayers = true;
	}
	else
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
		if(document.getElementById("players").checked == true){
			snake2 = new Snake([{x:350, y:250}, {x:350, y:260}, {x:350, y:270}, {x:350, y:280}]);
			snakes = [snake1, snake2];
			draw(snakes);
			twoPlayers = true;
		}
		else {
			twoPlayers = false;
			snakes = [snake1];
			draw(snakes);
		}
		interval = setInterval(main, 180);
		started = true;
	}
}

//the function that is looped
function main(){
	moveSnake(snakes);
	write(snake1);
	draw(snakes);
	checkCol(snake1);
	checkCol(snake2);
	if(gameOver)
		init();
}

init();

//if a key is pressed the game starts or restarts
document.body.onkeyup =  start;


