import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CodeComponent } from './code.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [CodeComponent],
  exports: [CodeComponent]
})
export class CodeModule { }
