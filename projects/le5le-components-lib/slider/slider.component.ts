import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  ElementRef,
  HostListener,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'ui-slider',
  template: `
  <div class="ui-slider" [class.readonly]="options.readonly" (click)="onClick($event)">
    <div class="bk"></div>
    <div class="bk-gray" [ngStyle]="getLeftBkStyle()" [class.hidden]="!options.range"></div>
    <div class="bk-gray" [ngStyle]="getPosStyle(options.range)"></div>
    <div class="min" [ngStyle]="getPosStyle()" (mousedown)="onMouseDown($event)" (click)="$event.stopPropagation()"></div>
    <div class="max" [ngStyle]="getPosStyle(true)" (mousedown)="onMouseDown($event, true)" (click)="$event.stopPropagation()"
      [class.hidden]="!options.range">
    </div>
    <div class="desc">{{min}} <span *ngIf="options.range">- {{max}}</span></div>
  </div>
  `,
  styleUrls: ['./slider.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SliderComponent implements OnInit {
  @Input()
  min = 20;
  @Output()
  minChange = new EventEmitter<number>();
  @Input()
  max = 50;
  @Output()
  maxChange = new EventEmitter<number>();
  @Input()
  options: any = {
    range: false, // 是否是区间选择
    readonly: false, // 是否只读
    min: 0, // 可设置值的最小值
    max: 100 // 可设置值的最大值
  };
  @Output()
  change = new EventEmitter<any>();

  private isMouseDown = 0;
  private initEvent: MouseEvent;
  private initMin: number;
  private initMax: number;
  constructor(private element: ElementRef) {}

  ngOnInit() {
    if (!this.options.min) {
      this.options.min = 0;
    }
    if (!this.options.max) {
      this.options.max = 100;
    }
    if (!this.min) {
      this.min = this.options.min;
      setTimeout(() => {
        this.minChange.emit(this.min);
      });
    }
    if (!this.max || this.max > this.options.max) {
      this.max = this.options.max;
      setTimeout(() => {
        this.maxChange.emit(this.max);
      });
    }
  }

  getPosStyle(isMax?: boolean) {
    if (!this.options.max) {
      this.options.max = 100;
    }
    let pos: number = this.min;
    if (isMax) {
      pos = this.max;
    }

    // tslint:disable-next-line:triple-equals
    if (this.options.max == this.options.min) {
      return;
    }
    const w =
      ((pos - this.options.min) / (this.options.max - this.options.min)) * 100;
    return {
      left: `calc(${w}% - .05rem)`
    };
  }

  getLeftBkStyle() {
    if (!this.options.max) {
      this.options.max = 100;
    }
    // tslint:disable-next-line:triple-equals
    if (this.options.max == this.options.min) {
      return;
    }

    const w =
      ((this.min - this.options.min) / (this.options.max - this.options.min)) *
      100;
    return {
      width: `${w}%`
    };
  }

  onClick(event: MouseEvent) {
    if (this.options.readonly) {
      return;
    }

    if (!this.options.max) {
      this.options.max = 100;
    }

    const pos: number = event.offsetX / this.element.nativeElement.clientWidth;
    const posMin: number = this.min / (this.options.max - this.options.min);
    const posMax: number = this.max / (this.options.max - this.options.min);

    if (!this.options.range) {
      this.min = Math.round(
        pos * (this.options.max - this.options.min) + this.options.min
      );
      this.checkMin();
    } else {
      if (pos < posMin) {
        this.min = Math.round(
          pos * (this.options.max - this.options.min) + this.options.min
        );
        this.checkMin();
      } else if (pos > posMax) {
        this.max = Math.round(
          pos * (this.options.max - this.options.min) + this.options.min
        );
        this.checkMax();
      } else {
        if (pos - posMin < posMax - pos) {
          this.min = Math.round(
            pos * (this.options.max - this.options.min) + this.options.min
          );
          this.checkMin();
        } else {
          this.max = Math.round(
            pos * (this.options.max - this.options.min) + this.options.min
          );
          this.checkMax();
        }
      }
    }

    this.minChange.emit(this.min);
    this.maxChange.emit(this.max);
    this.change.emit({ min: this.min, max: this.max });
  }

  checkMin() {
    if (this.min < this.options.min) {
      this.min = this.options.min;
    }
    if (this.options.range) {
      if (this.min >= this.max) {
        this.min = this.max - 1;
      }
    } else {
      if (this.min > this.options.max) {
        this.min = this.options.max;
      }
    }
  }
  checkMax() {
    if (this.max > this.options.max) {
      this.max = this.options.max;
    }
    if (this.max <= this.min) {
      this.max = this.min + 1;
    }
  }

  onMouseDown(event: MouseEvent, isMax?: boolean) {
    if (this.options.readonly) {
      return;
    }

    this.isMouseDown = 1;
    if (isMax) {
      this.isMouseDown = 2;
    }

    this.initMin = this.min;
    this.initMax = this.max;

    this.initEvent = event;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isMouseDown) {
      return;
    }

    if (!this.options.max) {
      this.options.max = 100;
    }

    if (this.isMouseDown === 1) {
      const pos: number = event.clientX - this.initEvent.clientX;
      this.min =
        this.initMin +
        Math.round(
          (pos * (this.options.max - this.options.min)) /
            this.element.nativeElement.clientWidth
        );
      this.checkMin();
    } else {
      const pos: number = event.clientX - this.initEvent.clientX;
      this.max =
        this.initMax +
        Math.round(
          (pos * (this.options.max - this.options.min)) /
            this.element.nativeElement.clientWidth
        );
      this.checkMax();
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (!this.isMouseDown) {
      return;
    }

    this.isMouseDown = 0;
    this.minChange.emit(this.min);
    this.maxChange.emit(this.max);
    this.change.emit({ min: this.min, max: this.max });
  }
}
