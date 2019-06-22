import { OnInit, Directive, Input, Renderer, ElementRef } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[uiImageLazyLoad]'
})
export class ImageLazyLoadDirective implements OnInit {
  @Input() uiImageLazyLoad = '';
  @Input() imageLazyLoadParams = '';
  @Input() threshold = 0;
  private scrollSubscription: Subscription;
  constructor(private el: ElementRef, private renderer: Renderer) {
    const scrollStream = fromEvent(window, 'scroll').pipe(debounceTime(100));
    this.scrollSubscription = scrollStream.subscribe(() => {
      this.loadInView();
    });
  }

  ngOnInit() {
    this.loadInView();
  }

  loadInView(): void {
    const ePos = this.getPosition();
    if (
      ePos.bottom > 0 &&
      ePos.bottom >= window.pageYOffset - this.threshold &&
      ePos.top <= window.pageYOffset + window.innerHeight + this.threshold
    ) {
      this.setImage();
    }
  }

  getPosition() {
    const box = this.el.nativeElement.getBoundingClientRect();
    const top =
      box.top + (window.pageYOffset - document.documentElement.clientTop);
    return {
      top: top,
      left:
        box.left + (window.pageXOffset - document.documentElement.clientLeft),
      bottom: top + this.el.nativeElement.clientHeight
    };
  }

  setImage() {
    this.scrollSubscription.unsubscribe();
    this.scrollSubscription = null;
    this.renderer.setElementAttribute(
      this.el.nativeElement,
      'src',
      this.uiImageLazyLoad + this.imageLazyLoadParams
    );
  }
}
