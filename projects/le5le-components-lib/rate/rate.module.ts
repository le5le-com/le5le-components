import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RateComponent } from './rate.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [RateComponent],
  exports: [RateComponent]
})
export class RateModule {}
