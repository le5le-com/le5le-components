import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImageLazyLoadDirective } from './imgLazyLoad.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [ImageLazyLoadDirective],
  exports: [ImageLazyLoadDirective]
})
export class LazyLoadModule {}
