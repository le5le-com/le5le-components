import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-component-qrcode',
  templateUrl: 'qrcode.component.html',
  providers: [],
  styleUrls: ['./qrcode.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ComponentQrcodeComponent {
  text: string;
  constructor() { }
}
