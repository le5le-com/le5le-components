import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProgressComponent } from './progress.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [ProgressComponent],
  exports: [ProgressComponent]
})
export class ProgressModule {}
