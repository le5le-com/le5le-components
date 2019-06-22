import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ImageUploadComponent } from './imageUpload.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [ImageUploadComponent],
  exports: [ImageUploadComponent]
})
export class FileUploadModule {}
