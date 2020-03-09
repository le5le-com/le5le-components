import { OnInit, Directive, Input, Renderer, ElementRef } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[uiImageLazyLoad]'
})
export class ImageLazyLoadDirective implements OnInit {
  @Input() uiImageLazyLoad = '';
  @Input() parentDom: any;
  @Input() imageLazyLoadParams = '';
  @Input() threshold = 0;
  private scrollSubscription: Subscription;
  constructor(private el: ElementRef, private renderer: Renderer) {
  }

  ngOnInit() {
    const scrollStream = fromEvent(this.parentDom || window, 'scroll').pipe(debounceTime(100));
    this.scrollSubscription = scrollStream.subscribe(() => {
      this.loadInView();
    });
    this.loadInView();
  }

  loadInView(): void {
    const pos = this.getPosition();
    if (
      pos.bottom > 0 &&
      pos.bottom >= window.pageYOffset - this.threshold &&
      pos.top <= window.pageYOffset + window.innerHeight + this.threshold
    ) {
      this.setImage();
    }
  }

  getPosition() {
    const box = this.el.nativeElement.getBoundingClientRect();
    const top = box.top + (window.pageYOffset - document.documentElement.clientTop);
    return {
      top,
      left: box.left + (window.pageXOffset - document.documentElement.clientLeft),
      bottom: top + this.el.nativeElement.clientHeight
    };
  }

  setImage() {
    this.scrollSubscription.unsubscribe();
    this.scrollSubscription = null;
    this.renderer.setElementAttribute(this.el.nativeElement, 'src', this.uiImageLazyLoad + this.imageLazyLoadParams);
  }
}
