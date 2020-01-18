import { Component, Input, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ui-progress-circle',
  template: `
    <div class="ui-progress-circle" [style.width.px]="size" [style.height.px]="size">
      <svg [attr.width.px]="size" [attr.height.px]="size" viewBox="0 0 220 220">
        <circle r="100" cx="110" cy="110" stroke-width="10"
          [attr.stroke]="bkColor" fill="none"></circle>
        <circle *ngIf="percent > 0" r="100" cx="110" cy="110" stroke-width="10"
          [attr.stroke]="color" [attr.stroke-dasharray]="dasharray"
          stroke-linecap="round" fill="none"></circle>
      </svg>
      <div class="flex middle">
        <div *ngIf="icon" class="full">
          <i [class]="icon" [ngStyle]="iconStyle"></i>
        </div>
        <div *ngIf="!icon"  class="full">
          <div [ngStyle]="textStyle">{{text}}</div>
          <div [ngStyle]="descStyle">{{desc}}</div>
        </div>
      </div>
    </div>
    <div>
  `,
  styleUrls: ['./progress.circle.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProgressCircleComponent implements OnChanges {
  @Input() percent: number;
  @Input() decimal = 0;
  @Input() text: string;
  @Input() icon: string;
  @Input() desc: string;
  @Input() color = '#1890ff';
  @Input() bkColor = '#eee';
  @Input() size = 44;
  @Input() borderSize = 3;

  @Input() colors: any = {};
  @Input() textStyle: any = {};
  @Input() descStyle: any = {};
  @Input() iconStyle: any = {};

  dasharray = '';

  constructor() { }

  round(num: number, n: number) {
    return Math.round(num * Math.pow(10, n)) / Math.pow(10, n);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.percent) {
      if (!this.text) {
        this.text = this.round(this.percent, this.decimal) + '%';
      }

      this.dasharray = 2 * Math.PI * this.percent + ',' + 2 * Math.PI * (100 - this.percent);
    }

    if (changes.colors) {
      for (const key in this.colors) {
        if (this.percent < +key) {
          this.color = this.colors[key];
          break;
        }
      }
    }

    if (changes.iconStyle && !this.iconStyle.color) {
      this.iconStyle.color = this.color;
    }
  }
}
