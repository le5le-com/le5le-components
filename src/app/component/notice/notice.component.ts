import { Component } from '@angular/core';
import { NoticeService } from 'le5le-components/notice';

@Component({
  selector: 'app-component-notice',
  templateUrl: 'notice.component.html',
  providers: [],
  styleUrls: ['./notice.component.scss']
})
export class ComponentNoticeComponent {
  showDlg = false;
  constructor() {}

  onMsgSystem() {
    const noticeService: NoticeService = new NoticeService();
    noticeService.notice({
      theme: 'system-notice',
      body: '乐吾乐 - angular UI 组件库。系统system消息。',
      timeout: 200000000
    });
  }

  onMsgDefault() {
    const noticeService: NoticeService = new NoticeService();
    noticeService.notice({
      body: '乐吾乐 - angular UI 组件库。缺省样式notice消息框。',
      buttons: [
        {
          text: '取消',
          cb: () => {
            noticeService.notice({
              theme: 'warning',
              body: '点击了calcel!',
              timeout: 2000
            });
          }
        },
        {
          text: '确定',
          cb: () => {
            noticeService.notice({
              theme: 'success',
              body: '点击了OK!',
              timeout: 2000
            });
          }
        }
      ],
      timeout: 200000000
    });
  }

  onMsgSuccess() {
    const noticeService: NoticeService = new NoticeService();
    noticeService.notice({
      theme: 'success',
      body: 'success!',
      timeout: 200000000
    });
  }

  onMsgWarning() {
    const noticeService: NoticeService = new NoticeService();
    noticeService.notice({
      theme: 'warning',
      body: 'warning!',
      timeout: 200000000
    });
  }

  onMsgError() {
    const noticeService: NoticeService = new NoticeService();
    noticeService.notice({
      theme: 'error',
      body: 'error!',
      timeout: 200000000
    });
  }

  onMsgDialog() {
    const noticeService: NoticeService = new NoticeService();
    noticeService.dialog({
      title: '关于',
      body: '乐吾乐 - angular UI 组件库',
      noCancel: true
    });
  }

  onMsgInput() {
    const noticeService: NoticeService = new NoticeService();
    noticeService.input({
      title: '名称',
      label: 'hello（规则：/^hello$/）',
      theme: 'default',
      text: '',
      placeholder: '请输入名称',
      required: true,
      regExp: /^hello$/,
      type: 'text',
      callback: (ret: string) => {
        noticeService.dialog({
          title: '你刚才的输入',
          body: ret,
          noCancel: true
        });
      }
    });
  }

  onDialog() {
    this.showDlg = true;
  }
}
