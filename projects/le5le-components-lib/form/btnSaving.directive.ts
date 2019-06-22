import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[uiBtnSaving]'
})
export class BtnSavingDirective {
  @Input() savingText = '保存中...';
  text: string;
  constructor(private element: ElementRef) {}

  @Input()
  set uiBtnSaving(condition: boolean) {
    if (!this.text) {
      this.text = this.element.nativeElement.innerHTML;
    }
    if (condition) {
      this.element.nativeElement.innerHTML = this.savingText;
      this.element.nativeElement.disabled = true;
    } else {
      this.element.nativeElement.innerHTML = this.text;
      this.element.nativeElement.disabled = false;
    }
  }
}
