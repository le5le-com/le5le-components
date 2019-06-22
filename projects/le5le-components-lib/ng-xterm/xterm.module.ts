import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XTermComponent } from './xterm.component';

@NgModule({
  imports: [CommonModule],
  declarations: [XTermComponent],
  exports: [XTermComponent]
})
export class XtermModule {}
