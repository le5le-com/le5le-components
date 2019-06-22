import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-loading',
  template: `<div class="text-center" style="height: 100%">
    <div class="full"><i class="iconfont icon-loading icon-spin"></i>&nbsp; {{tip}}</div>
  </div>`
})
export class UiLoadingComponent {
  @Input() tip = 'Loading...';
  constructor() {}
}
