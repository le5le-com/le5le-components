import { NgModule, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CodeComponent } from './code.component';
import { MonacoEditorLoaderService } from './monaco-loader.service';

export function monacoFactory(ngZone: NgZone) {
  return new MonacoEditorLoaderService(ngZone);
}

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [CodeComponent],
  exports: [CodeComponent],
  providers: [
    {
      provide: MonacoEditorLoaderService,
      deps: [NgZone],
      useFactory: monacoFactory
    }
  ]
})
export class CodeModule {}
