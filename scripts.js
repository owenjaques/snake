var canvas = document.getElementById("gameArea");
var ctx = canvas.getContext("2d");
var dx = squareSize = 10;
var dy = score = 0;
var screenWidth = 600;
var screenHeight = 400;

var snake = [ {x:250, y:250}, {x:250, y:260}, {x:250, y:270}, {x:250, y:280}];
var food = {x: randCoor(screenWidth), y: randCoor(screenHeight)};

function draw(){
	//draws background
	ctx.fillStyle = "aqua";
	ctx.strokeStyle = "grey";
	ctx.fillRect(0, 0, screenWidth, screenHeight);
	ctx.strokeRect(0, 0, screenWidth, screenHeight);
	//draws food
	ctx.fillStyle = "red";
	ctx.strokestyle = "darkred";
	ctx.fillRect(food.x, food.y, squareSize, squareSize);
	ctx.strokeRect(food.x, food.y, squareSize, squareSize);
	//draws snake
	ctx.fillStyle = "lightgreen";
	ctx.strokeStyle = "darkgreen";
	for(i = 0; i < snake.length; i++){
		ctx.fillRect(snake[i].x, snake[i].y, squareSize, squareSize);
		ctx.strokeRect(snake[i].x, snake[i].y, squareSize, squareSize);
	}
}

function moveSnake(){
	var head = {x:snake[0].x + dx, y:snake[0].y + dy};
	snake.unshift(head);
	if(snake[0].x == food.x && snake[0].y == food.y){
		createFood();
		score++;
	}
	else {
		snake.pop();
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

function randCoor(size){
	return Math.round((Math.random() * (size - squareSize)) / 10) * 10;
}

function createFood(){
	var x = randCoor(screenWidth);
	var y = randCoor(screenHeight);
	//checks to make sure its not spawning food where snake is
	for(i = 0; i < snake.length; i++){
		if(x == snake[i].x && y == snake[i].y){
			x = randCoor(screenWidth);
			y = randCoor(screenHeight);
		}
	}
	food.x = x;
	food.y = y;
}

function write(){
	var ele = document.getElementById("snakex");
	ele.innerHTML = snake[0].x;
	ele = document.getElementById("snakey");
	ele.innerHTML = snake[0].y;
	ele = document.getElementById("foodx");
	ele.innerHTML = food.x;
	ele = document.getElementById("foody");
	ele.innerHTML = food.y;
	ele = document.getElementById("score");
	ele.innerHTML = score;
}

function checkCol(){
	//checks for collision with wall
	if(snake[0].x == -10 || snake[0].x == screenWidth || snake[0].y == -10 || snake[0].y == screenHeight){
		clearInterval(interval);
		document.getElementById("gameOver").innerHTML = "Snake!!! - Game Over";
	}
	//checks for collision with self
	for(i = 1; i < snake.length; i++){
		if(snake[0].x == snake[i].x && snake[0].y == snake[i].y){
			clearInterval(interval);
			document.getElementById("gameOver").innerHTML = "Snake!!! - Game Over";
		}
	}
}

function main(){
	moveSnake();
	write();
	checkCol();
	draw();
}

var interval = setInterval(main, 125);