var canvas, ctx, square_size, screen_width, screen_height, food, interval, started, game_over, snake1, snake2, snakes, two_players, two_players_next_game;

//the snake object
function Snake(pos){
	this.pos = pos;
	this.dx = 0;
	this.dy = -square_size;
	this.score = 0;
	this.dead = false;
	//stops annoying bug where spinning around too quick cause a collision with self
	this.got_direction = true;
}

//draws on canvas
function draw(){
	//draws background
	ctx.fillStyle = "paleturquoise";
	ctx.strokeStyle = "grey";
	ctx.fillRect(0, 0, screen_width, screen_height);
	ctx.strokeRect(0, 0, screen_width, screen_height);
	//draws food
	ctx.fillStyle = "red";
	ctx.fillRect(food.x, food.y, square_size, square_size);
	ctx.strokeRect(food.x, food.y, square_size, square_size);
	//draws snake
	ctx.fillStyle = "lightgreen";
	ctx.strokeStyle = "darkgreen";
	for(j = 0; j < snakes.length; j++){
		if(j == 1){
			ctx.fillStyle = "gold";
			ctx.strokeStyle = "goldenrod";
		}
		for(i = 0; i < snakes[j].pos.length; i++){
			ctx.fillRect(snakes[j].pos[i].x, snakes[j].pos[i].y, square_size, square_size);
			ctx.strokeRect(snakes[j].pos[i].x, snakes[j].pos[i].y, square_size, square_size);
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
function moveSnakes(){
	//had some wierd counting issue where I was getting set to 5 when the create food function was called so I switched it to k
	for(k = 0; k < snakes.length; k++){
		var head = {x:snakes[k].pos[0].x + snakes[k].dx, y:snakes[k].pos[0].y + snakes[k].dy};
		snakes[k].pos.unshift(head);

		//if it hits food do not pop
		if(snakes[k].pos[0].x == food.x && snakes[k].pos[0].y == food.y){
			createFood();
			snakes[k].score++;
		}
		else {
			snakes[k].pos.pop();
		}
		
		//resests got direction to false allowing the player to input direction for next turn
		snakes[k].got_direction = false;
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
	var key_pressed = event.keyCode;
	if(!snake1.got_direction){
		snake1.got_direction = true;
		if(key_pressed == LEFT_KEY && snakes[0].dx != square_size){
			snakes[0].dx = -square_size;
			snakes[0].dy = 0;
		}
		else if(key_pressed == RIGHT_KEY && snakes[0].dx != -square_size){
			snakes[0].dx = square_size;
			snakes[0].dy = 0;
		}
		else if(key_pressed == UP_KEY && snakes[0].dy != square_size){
			snakes[0].dx = 0;
			snakes[0].dy = -square_size;
		}
		else if(key_pressed == DOWN_KEY && snakes[0].dy != -square_size){
			snakes[0].dx = 0;
			snakes[0].dy = square_size;
		}
		else {
			//if nothing was pressd reset to false
			snake1.got_direction = false;
		}
	}
	if(two_players){
		if(!snake2.got_direction){
			snake2.got_direction = true;
			if(key_pressed == A_KEY && snakes[1].dx != square_size){
				snakes[1].dx = -square_size;
				snakes[1].dy = 0;
			}
			else if(key_pressed == D_KEY && snakes[1].dx != -square_size){
				snakes[1].dx = square_size;
				snakes[1].dy = 0;
			}
			else if(key_pressed == W_KEY && snakes[1].dy != square_size){
				snakes[1].dx = 0;
				snakes[1].dy = -square_size;
			}
			else if(key_pressed == S_KEY && snakes[1].dy != -square_size){
				snakes[1].dx = 0;
				snakes[1].dy = square_size;
			}
			else {
				snake2.got_direction = false;
			}
		}
	}
}

document.addEventListener("keydown", getDirection);

//generates a random number within the screen size given that is a multiple of ten
function randCoor(size){
	return Math.round((Math.random() * (size - square_size)) / square_size) * square_size;
}

function createFood(){
	var x = randCoor(screen_width);
	var y = randCoor(screen_height);
	//checks to make sure its not spawning food where snake is
	for(j = 0; j < snakes.length; j++){
		for(i = 0; i < snakes[j].pos.length; i++){
			if(x == snakes[j].pos[i].x && y == snakes[j].pos[i].y){
				x = randCoor(screen_width);
				y = randCoor(screen_height);
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
	if(snake.pos[0].x == -square_size || snake.pos[0].x == screen_width || snake.pos[0].y == -square_size || snake.pos[0].y == screen_height){
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
	if(two_players){
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
	ctx.strokeStyle = "rebeccapurple";
	ctx.fillText(message, 25, screen_height/2);
	ctx.strokeText(message, 25, screen_height/2);
}

//first function that is called to initialize all values
function init(){
	canvas = document.getElementById("gameArea");
	ctx = canvas.getContext("2d");
	square_size = 10;
	screen_width = 600;
	screen_height = 400;
	initSnakes(1);
	food = {x: randCoor(screen_width), y: randCoor(screen_height)};
	draw();
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

//the function that is called every time a new game is started
function start(){
	//so that the interval is not set multiple times making it faster and faster
	if(!started){
		two_players = (two_players_next_game) ? true : false;
		food = {x: randCoor(screen_width), y: randCoor(screen_height)};
		if(two_players){
			initSnakes(2);
			draw();
		}
		else {
			initSnakes(1);
			draw();
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
	if(two_players){
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
	moveSnakes();
	checkCol(snake1);
	if(two_players)
		checkCol(snake2);
	draw();
	if(game_over)
		gameOver();
}

//a function that deals with when the players button is clicked
//sets a dummy variable if clicked during a game
document.getElementById("players").onclick = function (){
	if(two_players_next_game){
		two_players_next_game = false;
		document.getElementById("players").innerHTML = "Two Players"
		if(!started){
			initSnakes(1);
			draw();
			displayMessage("Press any key to Start");
		}
	}
	else {
		two_players_next_game = true;
		document.getElementById("players").innerHTML = "One Player"
		if(!started){
			initSnakes(2);
			draw();
			displayMessage("Press any key to Start");
		}
	}
}

init();

//if a key is pressed the game starts or restarts
document.body.onkeydown =  start;