import { NgModule, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EchartsComponent } from './echarts.component';
import { EchartsLoaderService } from './echarts-loader.service';

export function echartsFactory(ngZone: NgZone) {
  return new EchartsLoaderService(ngZone);
}

@NgModule({
  imports: [CommonModule],
  exports: [EchartsComponent],
  declarations: [EchartsComponent],
  providers: [
    {
      provide: EchartsLoaderService,
      deps: [NgZone],
      useFactory: echartsFactory
    }
  ]
})
export class EchartsModule {}
