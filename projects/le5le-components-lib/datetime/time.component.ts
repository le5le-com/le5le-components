import {
  OnInit,
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  forwardRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'ui-time',
  template: `
    <div class="ui-time text-center" >
      <ui-select class="inline" [(ngModel)]="hour" [options]="{id: 'id', name: 'name', list: hours, noDefaultOption: true}"
        (change)="onChange()" [multi]="false" [readonly]="readonly"></ui-select>
        :
      <ui-select class="inline" [(ngModel)]="minute" [options]="{id: 'id', name: 'name', list: minutes, noDefaultOption: true}"
        (change)="onChange()" [multi]="false" [readonly]="readonly"></ui-select>


      <span *ngIf="options.showSecond">
        :
        <ui-select class="inline" [(ngModel)]="second" [options]="{id: 'id', name: 'name', list: seconds, noDefaultOption: true}"
          (change)="onChange()" [multi]="false" [readonly]="readonly"></ui-select>
      </span>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeComponent),
      multi: true
    }
  ],
  styleUrls: ['./datetime.css'],
  encapsulation: ViewEncapsulation.None
})
export class TimeComponent implements OnInit, ControlValueAccessor {
  @Input() options: any = { init: 'now', showSecond: false };
  @Input() readonly = false;

  @Output() change = new EventEmitter<any>();

  hour = 0;
  minute = 0; // 从0开始
  second = 0;
  hours: any[] = [];
  minutes: any[] = [];
  seconds: any[] = [];

  // ngModeld的实际值
  _value: Date;

  private valueChange = (value: any) => {};
  private touch = () => {};

  constructor() {
    for (let i = 0; i < 24; ++i) {
      this.hours.push({
        id: i,
        name: i
      });
    }
    for (let i = 0; i < 60; ++i) {
      this.minutes.push({
        id: i,
        name: i
      });
      this.seconds.push({
        id: i,
        name: i
      });
    }
  }

  ngOnInit() {
    if (this.options.init === 'now') {
      this._value = new Date();
      this.valueChange(this._value);
      this.change.emit(this._value);

      this.hour = this._value.getHours();
      this.minute = this._value.getMinutes();
      this.second = this._value.getSeconds();
      if (!this.options.showSecond) {
        this.second = 0;
        this._value.setSeconds(0);
      }
    }
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
      this.hour = now.getHours();
      this.minute = now.getMinutes();
      this.second = now.getSeconds();
      if (!this.options.showSecond) {
        this.second = 0;
        this._value.setSeconds(0);
      }
    }
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

  onChange() {
    if (this.readonly || !this._value) {
      return;
    }

    this._value = new Date(
      this._value.getFullYear(),
      this._value.getMonth(),
      this._value.getDate(),
      this.hour,
      this.minute,
      this.second
    );
    this.valueChange(this._value);
    this.change.emit(this._value);
  }
}
