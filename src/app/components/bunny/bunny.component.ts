import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-bunny',
  templateUrl: './bunny.component.html',
  styleUrls: ['./bunny.component.less'],
})
export class BunnyComponent implements OnInit {
  @Input() speed;
  public isActive = false;
  private bunnyInterval: any;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {}

  public start(): void {
    const bunny = this.elementRef.nativeElement.querySelector('.bunny');
    addEventListener('keydown', (ev) => {
      if (ev.code === 'Space') {
        if (this.isActive) {
          return;
        }

        this.isActive = true;
        setTimeout(() => {
          this.isActive = false;
          this.renderer.removeClass(bunny, 'jump');
        }, 700);
      }
    });

    let positionX = -346;
    this.bunnyInterval = setInterval(() => {
      positionX = positionX + 117;
      if (positionX > 0) {
        positionX = -346;
      }
      this.renderer.setStyle(bunny, 'background-position-x', positionX + 'px');
    }, 100);
  }

  public flash(): void {
    const bunny = this.elementRef.nativeElement.querySelector('.bunny');
    this.renderer.addClass(bunny, 'bunny--flash');
    setTimeout(() => this.renderer.removeClass(bunny, 'bunny--flash'), 1000);
  }

  public stop(): void {
    clearInterval(this.bunnyInterval);
  }
}
