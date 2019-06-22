import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DivMoveDirective } from './divMove.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [DivMoveDirective],
  exports: [DivMoveDirective]
})
export class MoveModule {}
