var canvas, ctx, dx, dy, squareSize, screenWidth, screenHeight, food, interval, started, game_over, snake1, snake2, snakes, twoPlayers, twoPlayersNextGame;

function Snake(pos){
	this.pos = pos;
	this.dx = 0;
	this.dy = -10;
	this.score = 0;
	this.dead = false;
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
	//writes scores
	ele = document.getElementById("score1");
	ele.innerHTML = snake1.score;
	if(snake2){
		ele = document.getElementById("score2");
		ele.innerHTML = snake2.score;
	}
}

//effectively moves the snake by adding the next location to a list array and popping the last element
function moveSnake(snakes){
	//had some wierd counting issue where I was getting set to 5 when the create food function was called so I switched it to k
	for(k = 0; k < snakes.length; k++){
		var head = {x:snakes[k].pos[0].x + snakes[k].dx, y:snakes[k].pos[0].y + snakes[k].dy};
		snakes[k].pos.unshift(head);

		//if it hits food do not pop
		if(snakes[k].pos[0].x == food.x && snakes[k].pos[0].y == food.y){
			createFood(snakes);
			snakes[k].score++;
		}
		else {
			snakes[k].pos.pop();
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

//writes to the html for testing purposes
function write(snake){
	var ele = document.getElementById("snakex");
	ele.innerHTML = snake.pos[0].x;
	ele = document.getElementById("snakey");
	ele.innerHTML = snake.pos[0].y;
	ele = document.getElementById("foodx");
	ele.innerHTML = food.x;
	ele = document.getElementById("foody");
	ele.innerHTML = food.y;
}

function checkCol(snake){
	//checks for collision with wall
	if(snake.pos[0].x == -10 || snake.pos[0].x == screenWidth || snake.pos[0].y == -10 || snake.pos[0].y == screenHeight){
		clearInterval(interval);
		game_over = true;
		snake.dead = true;
		return;
	}
	//checks for collision with self
	for(i = 1; i < snake.pos.length; i++){
		if(snake.pos[0].x == snake.pos[i].x && snake.pos[0].y == snake.pos[i].y){
			clearInterval(interval);
			game_over = true;
			snake.dead = true;
			return;
		}
	}
	//checks for collision with other snake
	if(twoPlayers){
		//figures out which snake called the function
		otherSnake = (snake == snake1) ? snake2 : snake1;
		for(i = 0; i < otherSnake.pos.length; i++){
			if(snake.pos[0].x == otherSnake.pos[i].x && snake.pos[0].y == otherSnake.pos[i].y){
				clearInterval(interval);
				game_over = true;
				snake.dead = true;
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

//first function that is called to initialize all values
function init(){
	canvas = document.getElementById("gameArea");
	ctx = canvas.getContext("2d");
	squareSize = 10;
	screenWidth = 600;
	screenHeight = 400;
	snake1 = new Snake([{x:250, y:250}, {x:250, y:260}, {x:250, y:270}, {x:250, y:280}]);
	snakes = [snake1];
	food = {x: randCoor(screenWidth), y: randCoor(screenHeight)};
	draw(snakes);
	displayMessage("Press any key to Start");
	started = false;
}

//a helper function to initialize the snakes
//accepts the number of snakes wanted 1 or 2
function initSnakes(num){
	if(num == 1){
		snake1 = new Snake([{x:250, y:250}, {x:250, y:260}, {x:250, y:270}, {x:250, y:280}]);
		snakes = [snake1];
	}
	else if(num == 2){
		snake1 = new Snake([{x:250, y:250}, {x:250, y:260}, {x:250, y:270}, {x:250, y:280}]);
		snake2 = new Snake([{x:350, y:250}, {x:350, y:260}, {x:350, y:270}, {x:350, y:280}]);
		snakes = [snake1, snake2];
	}
}

function start(){
	//so that the interval is not set multiple times making it faster and faster
	if(!started){
		twoPlayers = (twoPlayersNextGame) ? true : false;
		food = {x: randCoor(screenWidth), y: randCoor(screenHeight)};
		snake1 = new Snake([{x:250, y:250}, {x:250, y:260}, {x:250, y:270}, {x:250, y:280}]);
		if(twoPlayers){
			snake2 = new Snake([{x:350, y:250}, {x:350, y:260}, {x:350, y:270}, {x:350, y:280}]);
			snakes = [snake1, snake2];
			draw(snakes);
		}
		else {
			snakes = [snake1];
			draw(snakes);
		}
		dif = document.getElementById("difficulty").value;
		if(dif == "easy")
			interval = setInterval(main, 180);
		else if(dif == "normal")
			interval = setInterval(main, 100);
		else if(dif == "hard")
			interval = setInterval(main, 60);
		document.getElementById("difficulty").value = dif;
		document.getElementById("difficulty").blur();
		started = true;
	}
	//sort of a stupid fix but I was having the problem where if you selected the difficulty then immidiatly hit another key the
	//select would still be in focus and change the difficulty so instead of stopping it from happening I just changed it back
	document.body.onkeyup =  function (){
		document.getElementById("difficulty").value = dif;
		document.getElementById("difficulty").blur();
	}

}

function gameOver(){
	if(twoPlayers){
		if(snake1.dead == true)
			displayMessage("P1 Died - Press any key to Restart");
		else
			displayMessage("P2 Died - Press any key to Restart");
	}
	else
		displayMessage("Game Over - Press any key to Restart");
	//waits for 0.6 seconds to avoid immidiatly restarting if keys are accidentaly pressed
	setTimeout(function() {started = false;}, 600);
	game_over = false;
}

//the function that is looped
function main(){
	moveSnake(snakes);
	checkCol(snake1);
	if(twoPlayers)
		checkCol(snake2);
	draw(snakes);
	if(game_over)
		gameOver();
}

//a function that deals with when the players button is clicked
//sets a dummy variable if clicked during a game
document.getElementById("players").onclick = function (){
	if(twoPlayersNextGame){
		twoPlayersNextGame = false;
		document.getElementById("players").innerHTML = "Two Players?"
		if(!started){
			snakes = [snake1];
			draw(snakes);
			displayMessage("Press any key to Start");
		}
	}
	else {
		twoPlayersNextGame = true;
		document.getElementById("players").innerHTML = "One Player?"
		if(!started){
			snake1 = new Snake([{x:250, y:250}, {x:250, y:260}, {x:250, y:270}, {x:250, y:280}]);
			snake2 = new Snake([{x:350, y:250}, {x:350, y:260}, {x:350, y:270}, {x:350, y:280}]);
			snakes = [snake1, snake2];
			draw(snakes);
			displayMessage("Press any key to Start");
		}
	}
}

init();

//if a key is pressed the game starts or restarts
document.body.onkeydown =  start;


