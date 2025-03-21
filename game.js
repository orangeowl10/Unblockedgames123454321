import pygame
import random

# Initialize Pygame
pygame.init()

# Game Constants
WIDTH, HEIGHT = 500, 700
GRAVITY = 0.5
JUMP_STRENGTH = -10
BUBBLE_SPEED = 2
BUBBLE_COUNT = 10
POWERUP_JUMP_STRENGTH = -20
POWERUP_DURATION = 1800  # 30 seconds at 60 FPS

# Colors
WHITE = (255, 255, 255)
BLUE = (50, 150, 255)
RED = (255, 50, 50)
GREEN = (50, 255, 50)

# Screen Setup
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Bubble Jumper")
clock = pygame.time.Clock()

# Load Player
player = pygame.Rect(WIDTH//2 - 20, HEIGHT - 60, 40, 40)
player_velocity = 0
score = 0
powerup_active = False
powerup_timer = 0

# Bubble Setup
bubbles = [pygame.Rect(random.randint(0, WIDTH - 50), random.randint(100, HEIGHT - 50), 50, 10) for _ in range(BUBBLE_COUNT)]

# Power-up Setup
powerup = pygame.Rect(random.randint(0, WIDTH - 30), random.randint(100, HEIGHT - 30), 30, 30)

# Game Loop
running = True
while running:
    screen.fill(WHITE)
    
    # Event Handling
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
    
    # Player Movement
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        player.x -= 5
    if keys[pygame.K_RIGHT]:
        player.x += 5
    
    # Gravity
    player_velocity += GRAVITY
    player.y += player_velocity
    
    # Bubble Collision
    for bubble in bubbles:
        if player.colliderect(bubble) and player_velocity > 0:
            player_velocity = POWERUP_JUMP_STRENGTH if powerup_active else JUMP_STRENGTH
            score += 10
            break  # Jump only once per collision
    
    # Move Bubbles Downward
    for bubble in bubbles:
        bubble.y += BUBBLE_SPEED
        if bubble.y > HEIGHT:
            bubble.y = random.randint(-50, -10)
            bubble.x = random.randint(0, WIDTH - 50)
    
    # Power-up Collision
    if player.colliderect(powerup):
        powerup_active = True
        powerup_timer = POWERUP_DURATION
        powerup.x, powerup.y = random.randint(0, WIDTH - 30), random.randint(-50, -10)  # Respawn power-up
    
    # Power-up Timer
    if powerup_active:
        powerup_timer -= 1
        if powerup_timer <= 0:
            powerup_active = False
    
    # Game Over Condition
    if player.y > HEIGHT:
        print(f"Game Over! Final Score: {score}")
        running = False
    
    # Draw Elements
    pygame.draw.rect(screen, RED, player)
    for bubble in bubbles:
        pygame.draw.ellipse(screen, BLUE, bubble)
    pygame.draw.rect(screen, GREEN, powerup)
    
    # Display Score
    font = pygame.font.Font(None, 36)
    score_text = font.render(f"Score: {score}", True, (0, 0, 0))
    screen.blit(score_text, (10, 10))
    
    # Refresh Screen
    pygame.display.flip()
    clock.tick(60)

pygame.quit()
