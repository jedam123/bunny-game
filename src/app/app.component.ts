import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { BunnyComponent } from './components/bunny/bunny.component';

const GAME_BOX_CLASS = 'game-box';
const ROCK_CLASS = 'rock';
const CARROT_CLASS = 'carrot';
const BUNNY_CLASS = 'bunny';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'game';

  @ViewChild(BunnyComponent) bunny;

  public score = 0;
  public lives = 3;
  public isFirstLoad = true;
  public isStart = false;
  public tryAgain = false;
  public isGameOver = false;
  public isPaused = false;
  private rockSetted = false;
  private moveInterval: any;
  private checkInterval: any;
  private speed = 6;
  private level = 1;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  public ngOnInit(): void {
    addEventListener('keydown', (ev) => {
      if (ev.which === 80) {
        if (this.isGameOver || this.tryAgain || this.isFirstLoad) {
          return;
        }

        this.isPaused = !this.isPaused;

        if (this.isPaused) {
          this.pauseAnimation();
        } else {
          this.runAnimation();
        }
      }
    });
  }

  public ngOnDestroy(): void {
    clearInterval(this.moveInterval);
  }

  public startGame(resetGameOver: boolean): void {
    if (resetGameOver) {
      this.lives = 3;
      this.score = 0;
      this.speed = 6;
      this.isGameOver = false;
    }

    this.bunny.start();
    this.runAnimation();
    this.isFirstLoad = false;
    this.tryAgain = false;
    this.rockSetted = false;
    this.renderer.removeClass(this.gameBox, 'stop');
    this.renderer.setStyle(this.carrot, 'display', 'block');
    this.setInterval();
  }

  private setInterval(): void {
    this.moveInterval = setInterval(() => {
      const rock = this.rock;
      const carrot = this.carrot;
      this.setRock(rock, carrot);
      this.checkCollision(rock);
    }, 10);
  }

  private setRock(rock: HTMLElement, carrot: HTMLElement): void {
    if (rock.offsetLeft > (1100 * this.speed) / 6 && !this.rockSetted) {
      this.renderer.setStyle(carrot, 'display', 'block');
      this.clearRocks(rock);
      const rockId = Math.floor(Math.random() * (3 - 1 + 1) + 1);
      this.renderer.addClass(rock, `${ROCK_CLASS}--${rockId}`);
      this.rockSetted = true;
    } else if (rock.offsetLeft < 0) {
      this.rockSetted = false;
    }
  }

  private clearRocks(rock: HTMLElement): void {
    this.renderer.removeClass(rock, `${ROCK_CLASS}--1`);
    this.renderer.removeClass(rock, `${ROCK_CLASS}--2`);
    this.renderer.removeClass(rock, `${ROCK_CLASS}--3`);
  }

  private checkCollision(rock: HTMLElement): void {
    const bunny = this.animal;
    const bunnyTopPosition = bunny.offsetTop + window.scrollX;
    const rockLeftPosition = rock.offsetLeft;

    if (
      rockLeftPosition < this.position &&
      rockLeftPosition > 0 &&
      bunnyTopPosition >= -50
    ) {
      clearInterval(this.moveInterval);

      if (this.lives > 0) {
        this.lives--;
        this.bunny.flash();
        this.checkInterval = setInterval(() => {
          if (this.carrot.offsetLeft < 0 || this.carrot.offsetLeft > 1200) {
            this.setInterval();
            clearInterval(this.checkInterval);
          }
        }, 10);
      } else {
        this.lives--;
        this.stopGame();
        this.isGameOver = true;
      }
    } else {
      this.checkCarrot();
    }
  }

  private stopGame(): void {
    this.renderer.addClass(this.gameBox, 'stop');
    this.isStart = false;
    this.bunny.stop();
    clearInterval(this.moveInterval);
    this.rockSetted = false;
    this.renderer.setStyle(this.rock, 'animation', 'none');
    this.renderer.setStyle(this.carrot, 'animation', 'none');
    this.renderer.setStyle(this.background, 'animation', 'none');
  }

  private checkCarrot(): void {
    if (this.isPaused) {
      return;
    }

    const bunny = this.animal;
    const carrot = this.carrot;
    const bunnyTopPosition = bunny.offsetTop + window.scrollY;
    const carrotLeftPosition = carrot.offsetLeft;

    if (
      carrotLeftPosition < this.position &&
      carrotLeftPosition > 0 &&
      bunnyTopPosition >= -50
    ) {
      this.renderer.setStyle(carrot, 'display', 'none');
      this.score = this.score + 1;
      this.setSpeed();
    }
  }

  private get position(): number {
    return (140 * this.speed) / 6;
  }

  private setSpeed(): void {
    if (this.score === 5) {
      this.speed = 5.5;
      this.level = 2;
      this.stopGame();
      this.tryAgain = true;
    } else if (this.score === 10) {
      this.speed = 5;
      this.level = 3;
      this.stopGame();
      this.tryAgain = true;
    } else if (this.score === 15) {
      this.speed = 4.5;
      this.level = 4;
      this.stopGame();
      this.tryAgain = true;
    } else if (this.score === 20) {
      this.speed = 4;
      this.level = 5;
      this.stopGame();
      this.tryAgain = true;
    }
  }

  private get gameBox(): HTMLElement {
    return this.elementRef.nativeElement.querySelector(`.${GAME_BOX_CLASS}`);
  }

  private get background(): HTMLElement {
    return this.elementRef.nativeElement.querySelector(
      `.${GAME_BOX_CLASS}__background`
    );
  }

  private get rock(): HTMLElement {
    return this.elementRef.nativeElement.querySelector(`.${ROCK_CLASS}`);
  }

  private get carrot(): HTMLElement {
    return this.elementRef.nativeElement.querySelector(`.${CARROT_CLASS}`);
  }

  private get animal(): HTMLElement {
    return this.elementRef.nativeElement.querySelector(`.${BUNNY_CLASS}`);
  }

  private runAnimation(): void {
    this.renderer.setStyle(
      this.carrot,
      'animation',
      `${this.speed}s linear 0s infinite normal none running rock`
    );
    this.renderer.setStyle(
      this.rock,
      'animation',
      `${this.speed}s linear 0s infinite normal none running rock`
    );
    this.renderer.setStyle(
      this.background,
      'animation',
      `${this.speed / 2}s linear 0s infinite normal none running background`
    );
  }

  private pauseAnimation(): void {
    this.renderer.setStyle(
      this.carrot,
      'animation',
      `${this.speed}s linear 0s infinite normal none paused rock`
    );
    this.renderer.setStyle(
      this.rock,
      'animation',
      `${this.speed}s linear 0s infinite normal none paused rock`
    );
    this.renderer.setStyle(
      this.background,
      'animation',
      `${this.speed / 2}s linear 0s infinite normal none paused background`
    );
  }
}
