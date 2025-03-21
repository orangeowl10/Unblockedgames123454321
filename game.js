let player;
let bubbles = [];
let gravity = 0.5;
let jumpStrength = -10;
let powerUpJump = -20;
let powerUpActive = false;
let powerUpTimer = 0;
let score = 0;
let powerUp;

function setup() {
    createCanvas(500, 700);
    player = new Player();
    
    // Create Bubbles
    for (let i = 0; i < 10; i++) {
        bubbles.push(new Bubble(random(width), random(height)));
    }

    // Create Power-up
    powerUp = new PowerUp(random(width), random(height / 2));
}

function draw() {
    background(255);
    
    // Display Score
    fill(0);
    textSize(20);
    text("Score: " + score, 10, 30);
    
    // Update and Show Player
    player.update();
    player.show();
    
    // Update and Show Bubbles
    for (let bubble of bubbles) {
        bubble.move();
        bubble.show();
        
        // Check for collision with player
        if (player.hits(bubble)) {
            player.jump();
            score += 10;
        }
    }
    
    // Power-up Logic
    powerUp.show();
    if (player.hits(powerUp)) {
        powerUpActive = true;
        powerUpTimer = 1800;
        powerUp.respawn();
    }

    if (powerUpActive) {
        powerUpTimer--;
        if (powerUpTimer <= 0) {
            powerUpActive = false;
        }
    }
}

// Player Class
class Player {
    constructor() {
        this.x = width / 2;
        this.y = height - 50;
        this.size = 40;
        this.velocity = 0;
    }

    update() {
        this.velocity += gravity;
        this.y += this.velocity;
        
        // Move left/right with arrow keys
        if (keyIsDown(LEFT_ARROW)) this.x -= 5;
        if (keyIsDown(RIGHT_ARROW)) this.x += 5;
        
        // Prevent going off-screen
        this.x = constrain(this.x, 0, width - this.size);
        
        // Game over if player falls off the screen
        if (this.y > height) {
            noLoop();
            textSize(32);
            fill(255, 0, 0);
            text("Game Over!", width / 2 - 80, height / 2);
        }
    }

    show() {
        fill(255, 0, 0);
        rect(this.x, this.y, this.size, this.size);
    }

    jump() {
        this.velocity = powerUpActive ? powerUpJump : jumpStrength;
    }

    hits(obj) {
        return (
            this.x + this.size > obj.x &&
            this.x < obj.x + obj.size &&
            this.y + this.size > obj.y &&
            this.y < obj.y + obj.size
        );
    }
}

// Bubble Class
class Bubble {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 50;
    }

    move() {
        this.y += 2;
        if (this.y > height) {
            this.y = random(-50, -10);
            this.x = random(width);
        }
    }

    show() {
        fill(50, 150, 255);
        ellipse(this.x, this.y, this.size, 15);
    }
}

// Power-up Class
class PowerUp {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 30;
    }

    show() {
        fill(50, 255, 50);
        rect(this.x, this.y, this.size, this.size);
    }

    respawn() {
        this.x = random(width);
        this.y = random(-50, -10);
    }
}
