import {
  Directive,
  Input,
  HostListener,
  Renderer2,
  ElementRef
} from '@angular/core';
import { NgForm } from '@angular/forms';

@Directive({
  selector: '[uiTouchForm]'
})
export class TouchFormDirective {
  @Input()
  uiTouchForm: NgForm;
  @Input()
  scrollSelector = 'form';
  @Input()
  scrollTop = -10;
  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  @HostListener('submit')
  onSubmit() {
    // tslint:disable-next-line:forin
    for (const i in this.uiTouchForm.controls) {
      this.uiTouchForm.controls[i].markAsTouched();
    }

    let elem = this.elementRef.nativeElement.querySelector('.ng-invalid');
    if (elem) {
      let parentElem = elem;
      while (
        parentElem &&
        parentElem.className.indexOf('ng-invalid-parent') > -1
      ) {
        parentElem = elem.querySelector('.ng-invalid');
        if (parentElem) {
          elem = parentElem;
        }
      }
      let top = elem.offsetTop;
      const scrollElem =
        this.elementRef.nativeElement.querySelector('.js-scroll') ||
        document.querySelector(this.scrollSelector) ||
        this.elementRef.nativeElement;

      while (elem.offsetParent) {
        elem = elem.offsetParent;
        if (scrollElem !== elem && scrollElem.contains(elem)) {
          top += elem.offsetTop;
        } else {
          break;
        }
      }
      scrollElem.scrollTop = top + this.scrollTop;
    }

    this.renderer.addClass(this.elementRef.nativeElement, 'submited');
  }
}
