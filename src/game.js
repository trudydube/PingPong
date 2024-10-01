// Select canvas element
const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

// Set the width and height of the canvas
canvas.width = 800;
canvas.height = 600;

// Create the player paddle and ball objects
const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 10;

let playerScore = 0;
let aiScore = 0;
const winningScore = 5;

let gameOver = false;  // Game over state

const player = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "purple",
    dy: 5 // Paddle speed
};

const ai = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "purple",
    dy: 3
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    speed: 4,
    dx: 4, // Ball's horizontal speed
    dy: 4, // Ball's vertical speed
    color: "white"
};

// Player control flags
let upPressed = false;
let downPressed = false;

// Draw rectangle (used for paddles)
function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

// Draw circle (used for ball)
function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

// Draw net in the middle
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 30) {
        drawRect(canvas.width / 2 - 1, i, 2, 20, "white");
    }
}

// Draw the scores at the top
function drawScore() {
    context.fillStyle = "white";
    context.font = "32px Arial";
    context.fillText("Player: " + playerScore, canvas.width / 4, 50);
    context.fillText("AI: " + aiScore, (3 * canvas.width) / 4, 50);
}

// Display "Game Over" message and "Play Again" button
function showGameOver(winner) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
    context.font = "40px Arial";
    context.textAlign = "center";
    context.fillText(`Game Over! ${winner} Wins!`, canvas.width / 2, canvas.height / 2 - 50);

    // Create Play Again button
    const playAgainButton = document.createElement("button");
    playAgainButton.innerText = "Play Again";
    playAgainButton.style.position = "absolute";
    playAgainButton.style.top = canvas.getBoundingClientRect().top + 30 + "px";
    playAgainButton.style.left = canvas.getBoundingClientRect().left + (canvas.width / 2) - 40 + "px";
    document.body.appendChild(playAgainButton);

    // Restart the game when Play Again is clicked
    playAgainButton.addEventListener("click", () => {
        playerScore = 0;
        aiScore = 0;
        gameOver = false;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = 4;
        ball.dy = 4;
        document.body.removeChild(playAgainButton);  // Remove button after restart
    });
}

// Handle player input
function movePlayer() {
    // Move up
    if (upPressed && player.y > 0) {
        player.y -= player.dy;
    }
    // Move down
    if (downPressed && player.y < canvas.height - player.height) {
        player.y += player.dy;
    }
}

// Event listeners for key presses
document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp") {
        upPressed = true;
    } else if (event.key === "ArrowDown") {
        downPressed = true;
    }
});

document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowUp") {
        upPressed = false;
    } else if (event.key === "ArrowDown") {
        downPressed = false;
    }
});

// Move AI paddle
function moveAI() {
    if (ball.y < ai.y + ai.height / 2) {
        ai.y -= ai.dy;
    } else if (ball.y > ai.y + ai.height / 2) {
        ai.y += ai.dy;
    }
}

// Move the ball and update score
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Collision with top and bottom borders
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
    }

    // Collision with paddles
    if (ball.x - ball.radius < player.x + player.width && 
        ball.y > player.y && ball.y < player.y + player.height) {
        ball.dx = -ball.dx;
    } else if (ball.x + ball.radius > ai.x && 
               ball.y > ai.y && ball.y < ai.y + ai.height) {
        ball.dx = -ball.dx;
    }

    // Reset the ball and update score if it goes beyond the paddles
    if (ball.x - ball.radius < 0) {
        aiScore++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        resetBall();
    }

    // Check if the game is over
    if (playerScore === winningScore) {
        gameOver = true;
        showGameOver("Player");
    } else if (aiScore === winningScore) {
        gameOver = true;
        showGameOver("AI");
    }
}

// Reset the ball to the center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx;
}

// Draw everything on the canvas
function draw() {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles, ball, and net
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
    drawNet();
    drawScore();  // Draw the scores
}

// Update game objects
function update() {
    if (!gameOver) {
        moveBall();
        movePlayer(); // Move player based on keypresses
        moveAI();
    }
}

// Game loop
function gameLoop() {
    draw();
    update();
}

// Set the frame rate to 60 frames per second
setInterval(gameLoop, 1000 / 60);
