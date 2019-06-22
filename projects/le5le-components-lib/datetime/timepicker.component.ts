import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewEncapsulation,
  forwardRef,
  OnInit
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'ui-timepicker',
  template: `
    <div class="ui-timepicker" (click)="onShow(true)">
      <div class="flex middle input" [class.readonly]="readonly">
        <span class="full">{{getDateStr()}}</span>
        <i *ngIf="!readonly" class="iconfont icon-triangle-down"></i>
      </div>
      <div class="dropdown" [class.block]="!readonly && showDropdown">
        <ui-calendar [(ngModel)]="_value" (change)="onChange()" [options]="opts" [readonly]="readonly"  class="block"></ui-calendar>
        <ui-time *ngIf="!options.hideTime" [(ngModel)]="_value" (change)="onChange()" [options]="opts" [readonly]="readonly"
          class="block text-center"></ui-time>
        <div class="p10" *ngIf="!options.hideOk">
          <button type="button" class="button primary full" (click)="onShow(false, $event)">确定</button>
        </div>
      </div>
    </div>
  `,
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '(document:click)': 'onClickDocument($event)'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimepickerComponent),
      multi: true
    }
  ],
  styleUrls: ['./datetime.css'],
  encapsulation: ViewEncapsulation.None
})
export class TimepickerComponent implements OnInit, ControlValueAccessor {
  @Input()
  options: any = {
    init: 'now',
    showSecond: false,
    hideTime: false,
    hideOk: false
  };
  @Input()
  readonly = false;

  @Output()
  change = new EventEmitter<any>();

  opts: any;
  showDropdown: boolean;

  // ngModeld的实际值
  _value: any;

  private valueChange = (value: any) => {};
  private touch = () => {};

  constructor(private _elemRef: ElementRef) {}

  ngOnInit() {
    this.opts = Object.assign({}, this.options);
    delete this.opts.init;

    setTimeout(() => {
      if (!this._value) {
        this._value = new Date();
      }

      if (this.options.init === 'now') {
        this.valueChange(this._value);
        this.change.emit(this._value);
      }
    }, 500);
  }

  get value(): any {
    return this._value;
  }

  set value(v: any) {
    if (v && v !== this._value) {
      let now = new Date(v);
      if (now + '' === 'Invalid Date') {
        now = new Date();
      }
      this._value = now;
    }
  }

  // model -> view
  writeValue(value) {
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

  onChange() {
    if (this.readonly) {
      return;
    }

    this.valueChange(this._value);

    if (this.options.hideOk) {
      this.change.emit(this._value);
      this.showDropdown = false;
    }
  }

  getDateStr() {
    if (!this._value) {
      return '';
    }

    const year = this._value.getFullYear();
    const month = this._value.getMonth() + 1;
    const day = this._value.getDate();
    const hour = this._value.getHours();
    const minute = this._value.getMinutes();
    const second = this._value.getSeconds();

    if (this.options.hideTime || this.options.mobile) {
      return [year, month, day].map(this.formatDateNumber).join('-');
    } else {
      return (
        [year, month, day].map(this.formatDateNumber).join('-') +
        ' ' +
        [hour, minute, second].map(this.formatDateNumber).join(':')
      );
    }
  }

  onShow(show: boolean, event?) {
    if (!show) {
      this.valueChange(this._value);
      this.change.emit(this._value);
      this.showDropdown = false;
    } else {
      this.showDropdown = true;
    }

    if (event) {
      event.stopPropagation();
    }
  }

  onClickDocument(event) {
    if (!this._elemRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }

  formatDateNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
  }
}
