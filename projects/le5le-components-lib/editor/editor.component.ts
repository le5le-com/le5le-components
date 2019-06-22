import { Component, Input, Output, EventEmitter, OnChanges, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { toolbarItems } from './config';
import { FileUploader, UploadParam } from 'le5le-components/fileUpload';

import { NoticeService } from 'le5le-components/notice';

@Component({
  selector: 'ui-editor',
  templateUrl: 'editor.component.html',
  styleUrls: ['./editor.css'],
  encapsulation: ViewEncapsulation.None
})
export class EditorComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  content = '';
  @Output()
  contentChange = new EventEmitter<any>();
  @Input()
  title = '';
  @Output()
  titleChange = new EventEmitter<any>();
  @Input()
  abstract = '';
  @Output()
  abstractChange = new EventEmitter<any>();
  @Input()
  images: string[] = [];
  @Output()
  imagesChange = new EventEmitter<any>();
  @Input()
  options: any = {
    templates: [],
    canEditTemplates: false,
    url: '',
    headers: {}
  };
  @Output()
  selectTemplateChange: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  editTemplateChange: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  deleteTemplateChange: EventEmitter<any> = new EventEmitter<any>();
  editor: HTMLElement;
  editable = true;
  private timer: any;
  private uploader: FileUploader;
  filename: string;
  progress: number;
  link: any = { show: false, text: '', href: '', blank: true };
  img: any = { show: false, src: '' };
  toolbarItems: any[] = toolbarItems;
  private selectedRange: any;
  keySubject = new Subject<string>();
  constructor(private noticeService: NoticeService) {
    // 仅仅为了检测内容是否为空，配合错误提示
    this.keySubject.pipe(debounceTime(300)).subscribe(async () => {
      // 移除html标签
      this.getContent();
    });
  }

  ngOnInit() {
    if (this.options.toolbarItems && this.options.toolbarItems.length) {
      this.toolbarItems = this.options.toolbarItems;
    }

    const params: UploadParam = new UploadParam(this.options.url, this.options.headers, true);
    this.uploader = new FileUploader(params);
    this.uploader.emitter.subscribe(ret => {
      this.editor.focus();
      switch (ret.event) {
        case 'progress':
          this.filename = ret.fileItem.file.name;
          this.progress = ret.fileItem.progress;
          break;
        case 'complete':
          if (!this.images) {
            this.images = [];
          }
          if (this.options.cdn) {
            ret.fileItem.url = this.options.cdn + ret.fileItem.url;
          }
          this.images.push(ret.fileItem.url);
          this.imagesChange.emit(this.images);
          document.execCommand('insertImage', false, ret.fileItem.url + '?w=450&h=300');
          this.progress = 0;
          break;
        case 'error':
        case 'filterError':
          this.progress = 0;
          this.noticeService.notice({
            theme: 'error',
            body: '上传图片' + ret.fileItem.file.name + '失败：' + ret.fileItem.error
          });
          break;
      }
    });

    this.editor = document.querySelector('.ui-editor .editor .article') as HTMLElement;
    if (this.content) {
      this.editor.innerHTML = this.content;
    }
  }

  ngOnChanges(changes: any) {
    if (this.editor && changes.content && changes.content.currentValue !== changes.content.previousValue) {
      this.onContentEdit();
    }
  }

  getSelectRange(): any {
    if (!window.getSelection()) {
      return null;
    }
    this.selectedRange = window.getSelection().getRangeAt(0);

    return this.selectedRange;
  }

  command(event: any, cmd: string, val: string) {
    event.stopPropagation();

    this.editor.focus();

    switch (cmd) {
      case 'formatBlock':
        // 如果已经是blockquote，则取消。
        const select = window.getSelection();
        if (!select) {
          return;
        }
        if (
          select.focusNode &&
          select.focusNode.parentNode &&
          select.focusNode.parentNode.nodeName &&
          select.focusNode.parentNode.nodeName.toLowerCase() === 'blockquote'
        ) {
          val = 'div';
        }
        break;
      case 'createLink':
        if (this.getSelectRange()) {
          this.link.show = true;
        }
        return;
      case 'insertImage':
        if (this.getSelectRange()) {
          this.img.show = true;
        }
        return;
      case 'localImage':
        return;
      case 'remoteImage':
        return;
      case 'html':
        this.editable = !this.editable;
        this.getContent();
        this.getTitle();
        this.getAbstract();
        return;
      case 'templates':
        return;
    }
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    document.execCommand(cmd, false, val);
  }

  onAddLink() {
    if (!this.link.href || !this.selectedRange) {
      return;
    }

    this.link.show = false;

    const node = document.createElement('A');
    node.innerHTML = this.link.text || this.link.href;
    node.setAttribute('href', this.link.href);
    if (this.link.blank) {
      node.setAttribute('target', '_blank');
    }
    this.selectedRange.deleteContents();
    this.selectedRange.insertNode(node);
    this.link.text = this.link.href = '';
  }

  onAddImage() {
    if (!this.img.src || !this.selectedRange) {
      return;
    }

    this.img.show = false;

    const node = document.createElement('IMG');
    node.setAttribute('src', this.img.src);
    this.selectedRange.deleteContents();
    this.selectedRange.insertNode(node);
    this.img.src = '';

    this.images.push(this.img.src);
    this.imagesChange.emit(this.images);
  }

  getContent(): string {
    // 移除html标签
    const tmp = this.editor.innerHTML.replace(/<[^>]*>|/g, '').replace(/ /g, '');
    if (tmp) {
      this.content = this.editor.innerHTML;
    } else {
      this.content = '';
    }
    this.contentChange.emit(this.content);
    return this.content;
  }

  onContentEdit() {
    if (this.editor.innerHTML !== this.content) {
      this.editor.innerHTML = this.content;
    }
    this.getTitle();
    this.getAbstract();
  }

  getTitle(): string {
    for (let i = 0; i < this.editor.childNodes.length; i++) {
      if (this.editor.childNodes[i].nodeName && this.editor.childNodes[i].nodeName.toLowerCase() === 'h1') {
        this.title = (this.editor.childNodes[i] as HTMLElement).innerHTML;
        this.titleChange.emit(this.title);
        break;
      }
    }

    return this.title;
  }

  setTitle(data: string) {
    if (!data || data === 'undefined') {
      return;
    }

    let i = 0;
    for (; i < this.editor.childNodes.length; i++) {
      if (this.editor.childNodes[i].nodeName && this.editor.childNodes[i].nodeName.toLowerCase() === 'h1') {
        (this.editor.childNodes[i] as HTMLElement).innerHTML = data;
        this.title = data;
        break;
      }
    }

    if (i >= this.editor.childNodes.length) {
      const e = document.createElement('h1');
      e.innerHTML = data;
      if (this.editor.childNodes.length) {
        this.editor.insertBefore(e, this.editor.childNodes[0]);
      } else {
        this.editor.appendChild(e);
      }
      this.title = data;
    }
  }

  getAbstract(): string {
    for (let i = 0; i < this.editor.childNodes.length; i++) {
      if ((this.editor.childNodes[i] as HTMLElement).className === 'abstract') {
        this.abstract = (this.editor.childNodes[i] as HTMLElement).innerHTML;
        this.abstractChange.emit(this.abstract);
        break;
      }
    }

    return this.abstract;
  }

  setAbstract(data: string) {
    if (!data || data === 'undefined') {
      return;
    }

    let i = 0;
    for (; i < this.editor.childNodes.length; i++) {
      if ((this.editor.childNodes[i] as HTMLElement).className === 'abstract') {
        (this.editor.childNodes[i] as HTMLElement).innerHTML = data;
        this.abstract = data;
        break;
      }
    }

    if (i >= this.editor.childNodes.length) {
      const e = document.createElement('div');
      e.innerHTML = data;
      e.className = 'abstract';
      if (this.editor.childNodes.length) {
        if (this.editor.childNodes[0].nodeName && this.editor.childNodes[0].nodeName.toLowerCase() === 'h1') {
          if (this.editor.childNodes.length > 1) {
            this.editor.insertBefore(document.createElement('br'), this.editor.childNodes[1]);
            this.editor.insertBefore(e, this.editor.childNodes[1]);
          } else {
            this.editor.appendChild(e);
            this.editor.appendChild(document.createElement('br'));
          }
        } else {
          this.editor.insertBefore(document.createElement('br'), this.editor.childNodes[0]);
          this.editor.insertBefore(e, this.editor.childNodes[0]);
        }
      } else {
        this.editor.appendChild(e);
        this.editor.appendChild(document.createElement('br'));
      }
      this.abstract = data;
    }
  }

  selectTemplate(template: any) {
    this.selectTemplateChange.emit(template);
  }

  editTemplate(template: any, event: any) {
    event.stopPropagation();

    this.editTemplateChange.emit(template);
  }

  delTemplate(template: any, event: any) {
    event.stopPropagation();

    this.deleteTemplateChange.emit(template);
  }

  onBlur() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.timer = setTimeout(() => {
      this.timer = null;
      this.getContent();
      this.getTitle();
      this.getAbstract();
    }, 300);
  }

  onFileChange(event: any) {
    const elem: any = event.srcElement || event.target;
    this.uploader.addFiles(elem.files);
  }

  ngOnDestroy() {
    if (this.keySubject) {
      this.keySubject.unsubscribe();
    }
  }
}
