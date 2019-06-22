import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WizardHorizontalComponent } from './wizard-horizontal.component';

@NgModule({
  imports: [CommonModule],
  declarations: [WizardHorizontalComponent],
  exports: [WizardHorizontalComponent]
})
export class WizardModule {}
