import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ui-switch',
  template: `
    <span class="ui-switch" [class.on]="checked" [class.off]="!checked" [class.disabled]="disabled" (click)="onCheck()">
    </span>
  `
})
export class SwitchComponent {
  @Input() checked: boolean;
  @Output() checkedChange = new EventEmitter<any>();
  @Output() change = new EventEmitter<any>();
  @Input() disabled = false;
  constructor() {}

  onCheck() {
    if (this.disabled) {
      return;
    }

    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
    this.change.emit(this.checked);
  }
}
