import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QRCodeComponent } from './qrcode.component';

@NgModule({
  imports: [CommonModule],
  declarations: [QRCodeComponent],
  exports: [QRCodeComponent]
})
export class QrcodeModule {}
