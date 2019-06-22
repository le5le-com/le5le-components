import { Component, Input, ElementRef, OnInit } from '@angular/core';

import { QrCode } from './qrcode';

@Component({
  selector: 'ui-qrcode',
  template: ''
})
export class QRCodeComponent implements OnInit {
  @Input() data = '';
  @Input() size = 128;
  @Input() type = 4;
  @Input() level = 'M';
  private qr: QrCode;
  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.qr = new QrCode(this.type, this.level);
    this.qr.addData(this.data);
    this.qr.make();

    const imgTagString: string = this.qr.createImgTag(this.type, 0);
    const el: HTMLElement = this.elementRef.nativeElement;
    el.innerHTML = imgTagString;
    const imgTagObject: HTMLImageElement = <HTMLImageElement>(
      el.firstElementChild
    );
    imgTagObject.width = this.size;
    imgTagObject.height = this.size;
  }
}
