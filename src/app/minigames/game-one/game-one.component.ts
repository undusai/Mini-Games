import {
  Component,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  HostListener,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-game-one',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-one.component.html',
  styleUrls: ['./game-one.component.css']
})
export class GameOneComponent implements AfterViewInit, OnDestroy {
  score: number = 0;

  @ViewChild('screen', { static: false })
  canvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private snake: { x: number; y: number }[] = [];
  private xVelocity: number = 20;
  private yVelocity: number = 0;
  private foodX: number = 0;
  private foodY: number = 0;
  private gameOver: boolean = false;
  private intervalId: any;

  isPaused: boolean = false;
  private alertShown: boolean = false;
  isBrowser: boolean;
  gameStarted: boolean = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      // Pause game when window out of focus
      window.addEventListener('blur', () => {
        this.isPaused = true;
      });

      // Resume game when window focused
      window.addEventListener('focus', () => {
        if (this.isPaused && !this.gameOver) {
          this.isPaused = false;
        }
      });
    }
  }

    /** 🎮 Start button */
startGame() {
  if (!this.isBrowser) return;
  this.gameStarted = true;

  // Wait for Angular to render the canvas
  setTimeout(() => {
    this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.resetGame();
  });
}


  /** 🔄 Restart game */
  resetGame() {
    if (!this.isBrowser) return;

    this.alertShown = false;
    this.gameOver = false;
    this.isPaused = false;
    this.score = 0;
    this.snake = [
      { x: 80, y: 0 },
      { x: 60, y: 0 },
      { x: 40, y: 0 },
      { x: 20, y: 0 },
      { x: 0, y: 0 }
    ];
    this.xVelocity = 20;
    this.yVelocity = 0;
    this.createFood();

    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      if (!this.isPaused && !this.gameOver) {
        this.gameLoop();
      }
    }, 200);
  }

  /** 🍎 Create food */
  createFood() {
    this.foodX = Math.floor(Math.random() * 20) * 20;
    this.foodY = Math.floor(Math.random() * 20) * 20;
  }

  drawFood() {
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(this.foodX, this.foodY, 20, 20);
  }

  drawSnake() {
    this.ctx.fillStyle = 'black';
    for (const part of this.snake) {
      this.ctx.fillRect(part.x, part.y, 20, 20);
    }
  }

  moveSnake() {
    const head = {
      x: this.snake[0].x + this.xVelocity,
      y: this.snake[0].y + this.yVelocity
    };
    this.snake.unshift(head);

    if (head.x === this.foodX && head.y === this.foodY) {
      this.score++;
      this.createFood();
    } else {
      this.snake.pop();
    }
  }

  checkCollision() {
    const head = this.snake[0];

    // Walls
    if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400) {
      this.gameOver = true;
    }

    // Self
    for (let i = 1; i < this.snake.length; i++) {
      if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
        this.gameOver = true;
      }
    }
  }

  gameLoop() {
    if (this.isPaused || this.gameOver) return;

    this.ctx.clearRect(0, 0, 400, 400);
    this.drawFood();
    this.moveSnake();
    this.drawSnake();
    this.checkCollision();

    if (this.gameOver && !this.alertShown) {
      this.alertShown = true;
      clearInterval(this.intervalId);
      alert('Game Over! Your score: ' + this.score);

      // Return to start screen
      this.gameStarted = false;
    }
  }

  /** 🎮 Arrow key controls */
  @HostListener('window:keydown', ['$event'])
changeDirection(event: KeyboardEvent) {
  const keyPressed = event.key;

  // prevent page scrolling when using arrow keys
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(keyPressed)) {
    event.preventDefault();
  }

  const goingUp = this.yVelocity === -20;
  const goingDown = this.yVelocity === 20;
  const goingRight = this.xVelocity === 20;
  const goingLeft = this.xVelocity === -20;

  if (keyPressed === 'ArrowLeft' && !goingRight) {
    this.xVelocity = -20;
    this.yVelocity = 0;
  } else if (keyPressed === 'ArrowUp' && !goingDown) {
    this.xVelocity = 0;
    this.yVelocity = -20;
  } else if (keyPressed === 'ArrowRight' && !goingLeft) {
    this.xVelocity = 20;
    this.yVelocity = 0;
  } else if (keyPressed === 'ArrowDown' && !goingUp) {
    this.xVelocity = 0;
    this.yVelocity = 20;
  }
}


  /** ⏸ Pause */
  pauseGame() {
    this.isPaused = !this.isPaused;
  }

  /** 🛑 Stop */
  stopGame() {
    this.gameOver = true;
    clearInterval(this.intervalId);
    alert('Game Stopped! Your score: ' + this.score);

    // Go back to start screen
    this.gameStarted = false;
  }

  /** ⬅️ Back to home */
  goBack() {
    clearInterval(this.intervalId);
    this.gameOver = false;
    this.alertShown = false;
    this.isPaused = false;
    this.router.navigate(['/']); // Change as needed
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
