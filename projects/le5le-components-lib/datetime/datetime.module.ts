import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarComponent } from './calendar.component';
import { TimeComponent } from './time.component';
import { TimepickerComponent } from './timepicker.component';
import { SelectModule } from 'le5le-components/select';

@NgModule({
  imports: [CommonModule, FormsModule, SelectModule],
  declarations: [CalendarComponent, TimeComponent, TimepickerComponent],
  exports: [CalendarComponent, TimeComponent, TimepickerComponent]
})
export class DatetimeModule {}
