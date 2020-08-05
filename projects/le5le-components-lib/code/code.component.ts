import {
  Component,
  Input,
  forwardRef,
  ElementRef,
  OnDestroy,
  ViewChild,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';


let loadingMonaco = false;

declare const monaco: any;

@Component({
  selector: 'ui-code',
  template: `
    <div #editor class="ui-code"></div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodeComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CodeComponent),
      multi: true
    }
  ],
  styleUrls: ['./code.css'],
  encapsulation: ViewEncapsulation.None
})
export class CodeComponent implements OnDestroy, ControlValueAccessor, Validator {
  @Input() required = false;
  @Input() options: any = { language: 'javascript' };

  // tslint:disable-next-line:no-output-native
  @Output() change = new EventEmitter<any>();

  @Input() monacoPath: string = '/assets/monaco/vs';

  editor: any;
  @ViewChild('editor', { static: false }) editorContent: ElementRef;

  // ngModeld的实际值
  // tslint:disable-next-line:variable-name
  private _value = '';

  private valueChange = (value: any) => { };
  private touch = () => { };

  constructor() {
    if (!(window as any).monaco && !loadingMonaco) {
      loadingMonaco = true;
      if (!(window as any).require) {
        const loaderScript = document.createElement('script');
        loaderScript.type = 'text/javascript';
        loaderScript.src = `${this.monacoPath}/loader.js`;
        loaderScript.addEventListener('load', this.loadMonaco);
        document.body.appendChild(loaderScript);
      }
    }
  }

  get value(): string {
    return this._value;
  }
  set value(v: string) {
    if (v !== this._value) {
      this._value = v;
    }
  }

  ngAfterViewInit() {
    if ((window as any).monaco) {
      this.initMonaco();
    } else if ((window as any).require) {
      this.loadMonaco();
    }
  }

  loadMonaco = () => {
    (window as any).require.config({ paths: { 'vs': this.monacoPath } });
    (window as any).require(['vs/editor/editor.main'], () => {
      loadingMonaco = false;
      this.initMonaco();
    });
  };

  initMonaco() {
    const options = Object.assign({}, this.options);
    options.value = this._value;
    this.editor = monaco.editor.create(this.editorContent.nativeElement, options);
    this.options.editor = this.editor;


    this.editor.getModel().onDidChangeContent(e => {
      this.updateValue(this.editor.getModel().getValue());
    });

    this.editor.onDidBlurEditorWidget(() => {
      this.change.emit(this._value);
      this.touch();
    });
  }

  updateValue(value: string) {
    this.value = value;
    this.valueChange(value);
    this.touch();
  }

  // model -> view
  writeValue(value: string) {
    this._value = value || '';
    if (this.editor && this.editor.getModel()) {
      this.editor.getModel().setValue(this._value);
    }
  }

  // view -> model，当控件change后，调用的函数通知改变model
  registerOnChange(fn: any) {
    this.valueChange = fn;
  }

  // 通知touched调用的函数
  registerOnTouched(fn: any) {
    this.touch = fn;
  }

  // 实现Validator接口，验证有效性
  validate(c: AbstractControl): { [key: string]: any; } {
    if (!this.required) {
      return;
    }

    if (!this._value) {
      return { required: true };
    }
  }

  ngOnDestroy() {
    if (this.editor) {
      this.editor.dispose();
    }
  }
}
