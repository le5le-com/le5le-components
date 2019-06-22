import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiLoadingComponent } from './ui.loading.component';

@NgModule({
  imports: [CommonModule],
  declarations: [UiLoadingComponent],
  exports: [UiLoadingComponent]
})
export class LoadingModule {}
