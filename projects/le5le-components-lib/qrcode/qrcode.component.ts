import { Component, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';

import { QrCode } from './qrcode';

@Component({
  selector: 'ui-qrcode',
  template: ''
})
export class QRCodeComponent implements OnChanges {
  @Input() data = '';
  @Input() size = 128;
  @Input() level = 'M';
  private qr: QrCode;
  // tslint:disable-next-line: max-line-length
  private limits = [[17, 14, 11, 7], [32, 26, 20, 14], [53, 42, 32, 24], [78, 62, 46, 34], [106, 84, 60, 44], [134, 106, 74, 58], [154, 122, 86, 64], [192, 152, 108, 84], [230, 180, 130, 98], [271, 213, 151, 119], [321, 251, 177, 137], [367, 287, 203, 155], [425, 331, 241, 177], [458, 362, 258, 194], [520, 412, 292, 220], [586, 450, 322, 250], [644, 504, 364, 280], [718, 560, 394, 310], [792, 624, 442, 338], [858, 666, 482, 382], [929, 711, 509, 403], [1003, 779, 565, 439], [1091, 857, 611, 461], [1171, 911, 661, 511], [1273, 997, 715, 535], [1367, 1059, 751, 593], [1465, 1125, 805, 625], [1528, 1190, 868, 658], [1628, 1264, 908, 698], [1732, 1370, 982, 742], [1840, 1452, 1030, 790], [1952, 1538, 1112, 842], [2068, 1628, 1168, 898], [2188, 1722, 1228, 958], [2303, 1809, 1283, 983], [2431, 1911, 1351, 1051], [2563, 1989, 1423, 1093], [2699, 2099, 1499, 1139], [2809, 2213, 1579, 1219], [2953, 2331, 1663, 1273]];
  constructor(private elementRef: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.data && changes.data) {
      this.makeQr();
    }
  }

  getType(text: string) {
    let t = 1;
    const length = this.getUTF8Length(text);
    for (let i = 0, len = this.limits.length; i <= len; i++) {
      let limit = 0;
      switch (this.level) {
        case 'L':
          limit = this.limits[i][0];
          break;
        case 'M':
          limit = this.limits[i][1];
          break;
        case 'Q':
          limit = this.limits[i][2];
          break;
        case 'H':
          limit = this.limits[i][3];
          break;
      }
      if (length <= limit) {
        break;
      } else {
        ++t;
      }
    }

    if (t > this.limits.length) {
      throw new Error('Too long data');
    }

    return t > 4 ? t : 4;
  }

  getUTF8Length(text: string) {
    const t = encodeURI(text).toString().replace(/\%[0-9a-fA-F]{2}/g, 'a');
    return t.length + (t !== text ? 3 : 0);
  }

  makeQr() {
    const type = this.getType(this.data);
    this.qr = new QrCode(type, this.level);
    this.qr.addData(this.data);
    this.qr.make();

    const imgTagString: string = this.qr.createImgTag(type, 0);
    const el: HTMLElement = this.elementRef.nativeElement;
    el.innerHTML = imgTagString;
    const imgTagObject: HTMLImageElement = el.firstElementChild as HTMLImageElement;
    imgTagObject.width = this.size;
    imgTagObject.height = this.size;
  }
}
