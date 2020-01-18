import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProgressComponent } from './progress.component';
import { ProgressCircleComponent } from './progress.circle.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [ProgressComponent, ProgressCircleComponent],
  exports: [ProgressComponent, ProgressCircleComponent]
})
export class ProgressModule { }
