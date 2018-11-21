// Draw rectangle
function drawRect(x, y, w, h, color) {
	context.fillStyle = color;
	context.fillRect(x, y, w, h);
}

// Draw circle
function drawCircle(x, y, r, color) {
	context.fillStyle = color;
	context.beginPath();
	context.arc(x, y, r, 0, Math.PI*2, false);
	context.closePath();
	context.fill();
}

// Draw text
function drawText(x, y, color, text) {
	context.fillStyle = color;
	context.font = "45px fantasy"; //TODO: check font "fantasy"
	context.fillText(text, x, y)
}

// Draw the net
function drawNet() {
	for (i = 0; i < canvas.height; i += 15) {
		drawRect(canvas.width / 2 - 1, i, 2, 10, "WHITE");
	}
}

// Detects collision with paddles
function collision(b, p) {
	// Define ball's collision box
	b.top = b.y - b.radius;
	b.bottom = b.y + b.radius;
	b.left = b.x - b.radius;
	b.right = b.x + b.radius;

	// Define paddles collision box
	p.top = p.y;
	p.bottom = p.y + p.height;
	p.left = p.x;
	p.right = p.x + p.width;

	return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// Moves paddle according to mouse position on the canvas
function movePaddle(event) {
	let rect = canvas.getBoundingClientRect();

	user.y = event.clientY - rect.top - user.height / 2;
}

// Reset ball
function resetBall() {
	ball.x = canvas.width / 2;
	ball.y = canvas.height / 2;
	ball.speed = 5;
	ball.velocityX = - ball.velocityX;
}

// Updates positions, speed, score and detects collisions on paddles
function update() {
	// Update ball position
	ball.x += ball.velocityX;
	ball.y += ball.velocityY;

	// Simple AI to control CPU paddle
	cpu.y += (ball.y - (cpu.y + cpu.height / 2)) * cpu.skill;

	// If ball hits top/bottom side of canvas, reflect
	if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
		ball.velocityY = - ball.velocityY;
	}

	// Set current active player
	let player = (ball.x < canvas.width / 2) ? user : cpu;

	// If the ball hit the paddle
	if (collision(ball, player)) {
		// Where did the ball hit the paddle?
		let collisionPoint = ball.y - (player.y + player.height / 2);

		// Normalize the position value (convert to a number between -1.00 and 1.00)
		collisionPoint /= player.height / 2;

		// Calculate angle in Radian
		let angleRadian = collisionPoint * Math.PI / 4;

		// Change X direction according to which player hit the ball
		let direction = (ball.x < canvas.width / 2) ? 1 : -1;

		// Change balls velocity X and Y
		ball.velocityX = direction * ball.speed * Math.cos(angleRadian);
		ball.velocityY = direction * ball.speed * Math.sin(angleRadian);

		// Increase ball speed after each paddle hit
		ball.speed += 0.33;
	}

	// If cpu scored
	if (ball.x - ball.radius < 0) {
		// Increase cpu's score and reset
		cpu.score++;
		resetBall();
	// If user scored
	} else if (ball.x + ball.radius > canvas.width) {
		// Increase user's score
		user.score++;
		resetBall();
	}
}

// Render the game
function render() {
	// Clear canvas aka draw a black rectangle of size canvas over everything
	drawRect(0, 0, canvas.width, canvas.height, "BLACK")

	// Draw the net
	drawNet();

	// Draw the scores
	drawText(canvas.width / 4, canvas.height / 5, "WHITE", user.score);
	drawText(3 * canvas.width / 4, canvas.height / 5, "WHITE", cpu.score);

	// Draw the paddles
	drawRect(user.x, user.y, user.width, user.height, user.color);
	drawRect(cpu.x, cpu.y, cpu.width, cpu.height, cpu.color);

	// Draw the ball
	drawCircle(ball.x, ball.y, ball.radius, ball.color)
}

// Game init
function game() {
	update();
	render();
}


// Select canvas
const canvas = document.getElementById("pong-canvas");
const context = canvas.getContext("2d");

// Game update rate
const framesPerSecond = 50;
setInterval(game, 1000 / framesPerSecond);

// Define user's paddle
const user = {
	x: 0,
	y: canvas.height / 2 - 100 / 2,
	width: 10,
	height: 100,
	color: "WHITE",
	score: 0
}

// Define CPU's paddle
const cpu = {
	x: canvas.width - 10,
	y: canvas.height / 2 - 100 / 2,
	width: 10,
	height: 100,
	color: "WHITE",
	score: 0,
	skill: 0.2
}

// Define ball
const ball = {
	x: canvas.width / 2,
	y: canvas.height / 2,
	radius: 10,
	speed: 5,
	velocityX: 5,
	velocityY: 5,
	color: "WHITE"
}

// Listen for mouse move events and execute movePaddle function whenever event happens
canvas.addEventListener("mousemove", movePaddle);

// Run game
game();