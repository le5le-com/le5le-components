import { Injectable, EventEmitter } from '@angular/core';
import { FileItem, FileStatus, UploadParam } from './fileUpload.model';

@Injectable()
export class FileUploader {
  fileList: FileItem[] = [];
  emitter: EventEmitter<any> = new EventEmitter(true);
  constructor(public params: UploadParam) {}

  addFiles(files: any[]) {
    for (const file of files) {
      const fileItem = new FileItem(file);
      if (this._isValidFile(fileItem)) {
        const reader = new FileReader();
        reader.onload = () => {
          fileItem.url = reader.result;
          fileItem.status = FileStatus.Ready;
          this._onMessage('ready', fileItem);
        };
        reader.readAsDataURL(file);
        this.fileList.push(fileItem);
      }
    }

    if (this.params.autoUpload) {
      this.uploadAll();
    }
  }

  uploadAll() {
    const items = this.fileList.filter(item => item.status === FileStatus.Ready);
    if (!items.length) {
      return;
    }

    this.uploadFile(items[0]);
  }

  private _isValidFile(item: FileItem): boolean {
    item.id = item.file.size + item.file.name;
    if (item.file.size > this.params.maxLength) {
      item.status = FileStatus.Fail;
      item.error = `文件大小不能超过${this.params.maxLength / 1024 / 1024}M
        <br>文件名：${item.file.name}`;
      this._onMessage('error', item);
      return false;
    }

    if (this.params.exts) {
      const exts = this.params.exts.split(',');
      let reg = '(';
      let i = 0;
      for (const e of exts) {
        if (i++ < 1) {
          reg += '.' + e;
        } else {
          reg += '|.' + e;
        }
      }
      reg += ')$';
      if (!new RegExp(reg).test(item.file.name)) {
        item.status = FileStatus.Fail;
        item.error = '图片格式必须为：' + this.params.exts;
        this._onMessage('error', item);
        return false;
      }
    }

    return true;
  }

  private uploadFile(fileItem: FileItem): void {
    fileItem.status = FileStatus.Uploading;

    const xhr = new XMLHttpRequest();
    const form = new FormData();
    form.append(this.params.field, fileItem.file, fileItem.file.name);

    xhr.upload.onprogress = event => {
      fileItem.progress = Math.round(event.lengthComputable ? (event.loaded * 100) / event.total : 0);
      this._onMessage('progress', fileItem);
    };

    xhr.upload.onabort = e => {
      fileItem.status = FileStatus.Cancel;
      this._onMessage('cancel', fileItem);
      this._onNext();
    };

    xhr.upload.onerror = e => {
      fileItem.status = FileStatus.Fail;
      fileItem.error = '文件上传错误';
      this._onMessage('error', fileItem);
      this._onNext();
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        fileItem.status = FileStatus.Success;
        try {
          // tslint:disable-next-line:triple-equals
          if (xhr.status == 404) {
            fileItem.status = FileStatus.Fail;
            fileItem.error = '文件上传错误：404';
            this._onMessage('error', fileItem);
            // tslint:disable-next-line:triple-equals
          } else if (xhr.status == 413) {
            fileItem.status = FileStatus.Fail;
            fileItem.error = '上传文件太大';
            try {
              const response = JSON.parse(xhr.responseText);
              if (response && response.error) {
                fileItem.error = '上传文件太大：' + response.error;
              }
            } catch (e) {}
            this._onMessage('error', fileItem);
          } else {
            const response = JSON.parse(xhr.responseText);
            // tslint:disable-next-line:triple-equals
            if (xhr.status == 200) {
              if (response && response.error) {
                fileItem.status = FileStatus.Fail;
                fileItem.error = '文件上传错误：' + response.error;
                this._onMessage('error', fileItem);
              } else {
                fileItem.url = response.url;
                fileItem.status = FileStatus.Success;
                this._onMessage('complete', fileItem);
              }
            } else {
              fileItem.status = FileStatus.Fail;
              if (response && response.error) {
                fileItem.error = '文件上传错误：' + response.error;
              }
              this._onMessage('error', fileItem);
            }
          }
          this._onNext();
        } catch (e) {
          fileItem.status = FileStatus.Fail;
          fileItem.error = '文件上传错误';
          this._onMessage('error', fileItem);
        }
      }
    };

    xhr.open('POST', this.params.url, true);
    if (this.params.withCredentials) {
      xhr.withCredentials = true;
    }

    if (this.params.headers) {
      Object.keys(this.params.headers).forEach(key => {
        xhr.setRequestHeader(key, this.params.headers[key]);
      });
    }
    xhr.send(form);
  }

  private _onNext() {
    const items = this.fileList.filter(item => item.status === FileStatus.Ready);
    if (!items.length) {
      return this._onMessage('completeAll', null);
    }

    this.uploadFile(items[0]);
  }

  private _onMessage(event: string, fileItem: FileItem) {
    this.emitter.emit({
      event,
      fileItem
    });
  }
}
