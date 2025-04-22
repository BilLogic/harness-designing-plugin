import pygame
import sys
import random

# Initialize Pygame
pygame.init()

# Constants
WINDOW_WIDTH = 800
WINDOW_HEIGHT = 400
PADDLE_WIDTH = 10
PADDLE_HEIGHT = 100
BALL_RADIUS = 10
PADDLE_SPEED = 8
BALL_SPEED = 5

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
BLUE = (0, 0, 255)

# Set up the game window
screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
pygame.display.set_caption("Ping Pong")
clock = pygame.time.Clock()

# Game objects
class Paddle:
    def __init__(self, x, y):
        self.rect = pygame.Rect(x, y, PADDLE_WIDTH, PADDLE_HEIGHT)
        self.score = 0
        self.speed = PADDLE_SPEED
        self.color = RED if x == 0 else BLUE

    def move(self, up, down):
        if up and self.rect.top > 0:
            self.rect.y -= self.speed
        if down and self.rect.bottom < WINDOW_HEIGHT:
            self.rect.y += self.speed

    def draw(self):
        pygame.draw.rect(screen, self.color, self.rect)

class Ball:
    def __init__(self):
        self.reset()

    def reset(self):
        self.x = WINDOW_WIDTH // 2
        self.y = WINDOW_HEIGHT // 2
        self.dx = BALL_SPEED * random.choice([-1, 1])
        self.dy = BALL_SPEED * random.choice([-1, 1])
        self.rect = pygame.Rect(self.x - BALL_RADIUS, self.y - BALL_RADIUS,
                              BALL_RADIUS * 2, BALL_RADIUS * 2)
        self.last_hit = None

    def move(self):
        self.x += self.dx
        self.y += self.dy
        self.rect.x = self.x - BALL_RADIUS
        self.rect.y = self.y - BALL_RADIUS

        # Wall collision
        if self.rect.top <= 0 or self.rect.bottom >= WINDOW_HEIGHT:
            self.dy *= -1

    def draw(self):
        pygame.draw.circle(screen, WHITE, (int(self.x), int(self.y)), BALL_RADIUS)

# Create game objects
left_paddle = Paddle(0, WINDOW_HEIGHT//2 - PADDLE_HEIGHT//2)
right_paddle = Paddle(WINDOW_WIDTH - PADDLE_WIDTH, WINDOW_HEIGHT//2 - PADDLE_HEIGHT//2)
ball = Ball()

# Font for score display
font = pygame.font.Font(None, 36)

def draw_center_line():
    pygame.draw.line(screen, WHITE, (WINDOW_WIDTH//2, 0), (WINDOW_WIDTH//2, WINDOW_HEIGHT), 2)

def main():
    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

        # Get keyboard input
        keys = pygame.key.get_pressed()
        
        # Move paddles
        left_paddle.move(keys[pygame.K_w], keys[pygame.K_s])
        right_paddle.move(keys[pygame.K_UP], keys[pygame.K_DOWN])

        # Move ball
        ball.move()

        # Ball collision with paddles
        if ball.rect.colliderect(left_paddle.rect):
            ball.dx *= -1
            ball.last_hit = left_paddle
        elif ball.rect.colliderect(right_paddle.rect):
            ball.dx *= -1
            ball.last_hit = right_paddle

        # Score points
        if ball.x <= 0:
            right_paddle.score += 1
            ball.reset()
        elif ball.x >= WINDOW_WIDTH:
            left_paddle.score += 1
            ball.reset()

        # Draw everything
        screen.fill(BLACK)
        left_paddle.draw()
        right_paddle.draw()
        ball.draw()
        draw_center_line()

        # Draw scores with colors based on last hit
        left_score_color = left_paddle.color if ball.last_hit == left_paddle else WHITE
        right_score_color = right_paddle.color if ball.last_hit == right_paddle else WHITE
        
        left_score = font.render(str(left_paddle.score), True, left_score_color)
        right_score = font.render(str(right_paddle.score), True, right_score_color)
        screen.blit(left_score, (WINDOW_WIDTH//4, 20))
        screen.blit(right_score, (3*WINDOW_WIDTH//4, 20))

        pygame.display.flip()
        clock.tick(60)

if __name__ == "__main__":
    main() 