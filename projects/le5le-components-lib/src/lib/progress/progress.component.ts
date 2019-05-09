import { Component, Input, forwardRef, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-progress',
  template: `
    <div class="ui-progress">
      <div class="desc" *ngIf="!options.customDesc && options.customDesc !== ''">
        <label class="progress" *ngIf="options.unit!=='%'">{{ value }} {{ options.unit }}</label>
        <label class="progress" *ngIf="options.unit==='%'">{{ progress| number:'.0-2' }} {{ options.unit }}</label>
        <label *ngIf="options.showRemainder && value < total">
          <span class="gray mh10">/</span>
          <span class="remainder">{{ total - value | number:'.0-2' }} {{ options.remainderUnit }}</span>
         </label>
      </div>
      <div class="desc" *ngIf="options.customDesc">
        {{ options.customDesc }}
      </div>
      <div class="bk">
        <div [ngStyle]="getProgressStyle()"></div>
      </div>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProgressComponent),
      multi: true
    }
  ],
  styleUrls: ['./progress.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProgressComponent implements ControlValueAccessor {
  @Input()
  total = 0;
  @Input()
  options: any = { unit: '%' };

  // ngModeld的实际值
  private _value: any;

  progress: number;

  private valueChange = (value: any) => {};
  private touch = () => {};

  constructor() {}

  get value(): any {
    return this._value;
  }

  set value(v: any) {
    if (!v) {
      v = 0;
    }
    if (v !== this._value) {
      this._value = v;
      if (this.total) {
        this.progress = Math.round((v / this.total) * 10000) / 100;
      } else {
        this.progress = v;
      }

      if (
        (this.total && this._value < this.total) ||
        (!this.total && this._value < 100)
      ) {
        if (
          this.options.maxProgress &&
          this.progress > this.options.maxProgress
        ) {
          this.progress = this.options.maxProgress;
        }
      }
    }
    this.valueChange(this._value);
  }

  // model -> view
  writeValue(value: any) {
    this.value = value;
  }

  // view -> model，当控件change后，调用的函数通知改变model
  registerOnChange(fn: any) {
    this.valueChange = fn;
  }

  // 通知touched调用的函数
  registerOnTouched(fn: any) {
    this.touch = fn;
  }

  getProgressStyle() {
    return {
      width: this.progress + '%'
    };
  }
}
