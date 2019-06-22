import {
  Component,
  Input,
  OnInit,
  OnChanges,
  ViewEncapsulation,
  SimpleChange
} from '@angular/core';

@Component({
  selector: 'ui-avatar',
  template: `
    <div class="ui-avatar" [ngStyle]="getStyle()">
      <img *ngIf="img" [src]="img">
      <span *ngIf="!img">{{ char }}</span>
    </div>
  `,
  providers: [],
  styleUrls: ['./avatar.css'],
  encapsulation: ViewEncapsulation.None
})
export class AvatarComponent implements OnInit, OnChanges {
  @Input() letters = '';
  @Input() img = '';

  colors = [
    '#673AB7',
    '#9C27B0',
    '#2196f3',
    '#178479',
    '#579015',
    '#038292',
    '#009688',
    '#4caf50',
    '#4169E1',
    '#228B22'
  ];
  color = '#673AB7';
  char: string;
  constructor() {}

  ngOnInit() {
    if (this.img) {
      return;
    }
    if (!this.letters) {
      this.letters = '';
    } else {
      this.char = this.letters[0].toUpperCase();
    }

    let num = 0;
    for (const item of this.letters) {
      num += item.charCodeAt(0);
    }
    this.color = this.colors[num % 10];
  }

  getStyle() {
    if (this.img) {
      this.color = 'transparent';
    }
    return {
      background: this.color
    };
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if (changes['letters'] || changes['img']) {
      this.ngOnInit();
    }
  }
}
