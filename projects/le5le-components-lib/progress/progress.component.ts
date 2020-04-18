import { Component, Input, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ui-progress',
  template: `
    <div class="ui-progress">
      <div class="bar" [style.background-color]="bkColor">
        <div  [style.background-color]="color" [style.width.%]="percent"></div>
      </div>
      <div class="desc">
        <span *ngIf="!icon" [ngStyle]="textStyle">{{text}}</span>
        <i [class]="icon" [ngStyle]="iconStyle"></i>
      </div>
    </div>
  `,
  styleUrls: ['./progress.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProgressComponent implements OnChanges {
  @Input() percent: number;
  @Input() decimal = 0;
  @Input() text: string;
  @Input() icon: string;
  @Input() color = '';
  @Input() bkColor = '';
  @Input() colors: any = {};
  @Input() textStyle: any = {};
  @Input() iconStyle: any = {};

  constructor() { }

  round(num: number, n: number) {
    return Math.round(num * Math.pow(10, n)) / Math.pow(10, n);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.text === undefined) {
      this.text = this.round(+this.percent || 0, this.decimal) + '%';
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
