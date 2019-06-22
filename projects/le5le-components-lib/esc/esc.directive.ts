import { Directive, Input, Output, EventEmitter } from '@angular/core';
import { NoticeService } from 'le5le-components/notice';

@Directive({
  selector: '[uiEsc]',
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    '(document:keydown)': 'onkeyDocument($event)'
  }
})
export class EscDirective {
  @Input() uiEsc: any;
  @Output() uiEscChange = new EventEmitter<any>();

  @Input() confirm = false;

  showConfirm = false;
  constructor() {}

  onkeyDocument(event: KeyboardEvent) {
    if (event.keyCode !== 27 || this.showConfirm) {
      return;
    }

    event.returnValue = false;
    event.stopPropagation();

    if (this.confirm) {
      this.showConfirm = true;
      const noticeService: NoticeService = new NoticeService();
      noticeService.dialog({
        title: '提示',
        body: '确定退出当前窗口？',
        callback: async (ret: boolean) => {
          if (ret) {
            this.uiEscChange.emit(null);
          }
          this.showConfirm = false;
        }
      });
    } else {
      this.uiEscChange.emit(null);
    }
  }
}
