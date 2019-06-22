import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EscDirective } from './esc.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [EscDirective],
  exports: [EscDirective]
})
export class EscModule {}
