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
  selector: 'ui-calendar',
  template: `
    <div class="ui-calendar" [class.readonly]="readonly">
      <div class="caption" *ngIf="!options.hideCaption">
        <ui-select class="inline" [(ngModel)]="year" [options]="{id: 'id', name: 'name', list: years, noDefaultOption: true}"
          (change)="onChange()" [multi]="false" [readonly]="readonly"></ui-select>

        <ui-select class="inline" [(ngModel)]="month" [options]="{id: 'id', name: 'name', list: months, noDefaultOption: true}"
          (change)="onChange()" [multi]="false" [readonly]="readonly"></ui-select>
      </div>
      <div class="week" *ngFor="let week of calendar">
        <div class="day"  *ngFor="let item of week" (click)="$event.stopPropagation();onChange(item)"
             [class.gray]="item.month !== month " [class.active]="item.year === year && item.month === month && item.day === day">
          <span>{{item.day}}</span>
        </div>
      </div>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CalendarComponent),
      multi: true
    }
  ],
  styleUrls: ['./datetime.css'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit, ControlValueAccessor {
  @Input()
  options: any = { init: 'now' };
  @Input()
  readonly = false;

  @Output()
  change = new EventEmitter<any>();

  year = 2018;
  month = 0; // 从0开始
  day = 1;
  calendar: any[] = [];
  years: any[] = [];
  months: any[] = [];

  // ngModeld的实际值
  _value: Date;

  private valueChange = (value: any) => {};
  private touch = () => {};

  constructor() {
    for (let i = 0; i < 12; ++i) {
      this.months.push({
        id: i,
        name: i + 1
      });
    }

    const now = new Date();
    for (
      let i = this.options.maxYear || now.getFullYear();
      i >= (this.options.minYear || now.getFullYear() - 10);
      --i
    ) {
      this.years.push({
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

      this.year = this._value.getFullYear();
      this.month = this._value.getMonth();
      this.getCalendar(this.year, this.month);
      this.day = this._value.getDate();
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
      this.year = now.getFullYear();
      this.month = now.getMonth();
      this.getCalendar(this.year, this.month);
      this.day = now.getDate();
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

  isLeap(year: number): number {
    return year % 4 === 0
      ? year % 100 !== 0
        ? 1
        : year % 400 === 0
          ? 1
          : 0
      : 0;
  }

  getCalendar(year: number, month: number) {
    this.calendar = [];
    const firstDay = new Date(this.year, this.month, 1);
    const dayOfWeek = firstDay.getDay();
    const daysOfMonth = new Array(
      31,
      28 + this.isLeap(this.year),
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31
    );
    const rows = Math.ceil((dayOfWeek + daysOfMonth[month]) / 7);
    for (let i = 0; i < rows; ++i) {
      const row: any[] = [];
      for (let j = 0; j < 7; ++j) {
        // 单元格自然序列号
        const index = i * 7 + j;
        const day = index - dayOfWeek + 1;
        if (day <= 0) {
          if (month > 1) {
            row.push({
              year: year,
              month: month - 1,
              day: daysOfMonth[month - 1] + day
            });
          } else {
            row.push({
              year: year - 1,
              month: 12,
              day: 31 + day
            });
          }
        } else if (day > daysOfMonth[month]) {
          if (month < 12) {
            row.push({
              year: year,
              month: month + 1,
              day: day - daysOfMonth[month]
            });
          } else {
            row.push({
              year: year + 1,
              month: 1,
              day: day - daysOfMonth[month]
            });
          }
        } else {
          row.push({
            year: year,
            month: month,
            day: day
          });
        }
      }
      this.calendar.push(row);
    }
  }

  onChange(item?: any) {
    if (this.readonly || !this._value) {
      return;
    }

    if (item) {
      this.year = item.year;
      this.month = item.month;
      this.day = item.day;
    }
    this.getCalendar(this.year, this.month);
    this._value = new Date(
      this.year,
      this.month,
      this.day,
      this._value.getHours(),
      this._value.getMinutes(),
      this._value.getSeconds()
    );
    this.valueChange(this._value);

    if (item) {
      this.change.emit(this._value);
    }
  }
}
