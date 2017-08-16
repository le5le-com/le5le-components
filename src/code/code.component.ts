import { Component, Input, forwardRef, ElementRef, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

declare const monaco: any;
declare const require: any;

@Component({
  selector: 'ui-code',
  template: `<div #editor class="ui-code"></div>`,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CodeComponent),
    multi: true
  }],
})
export class CodeComponent implements OnInit, AfterViewInit {
  @ViewChild('editor') editorContent: ElementRef;
  @Input() options: any = {};
  @Output() change = new EventEmitter();

  editor: any;
  private _value = '';
  constructor() {

  }

  get value(): string { return this._value; };
  set value(v: string) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    let onGotAmdLoader = () => {
      // Load monaco
      (<any>window).require.config({ paths: { 'vs': 'assets/monaco/vs' } });
      (<any>window).require(['vs/editor/editor.main'], () => {
        this.initMonaco();
      });
    };

    // Load AMD loader if necessary
    if (!(<any>window).require) {
      let loaderScript = document.createElement('script');
      loaderScript.type = 'text/javascript';
      loaderScript.src = 'assets/monaco/vs/loader.js';
      loaderScript.addEventListener('load', onGotAmdLoader);
      document.body.appendChild(loaderScript);
    } else {
      onGotAmdLoader();
    }
  }

  /**
   * Upon destruction of the component we make sure to dispose both the editor and the extra libs that we might've loaded
   */
  ngOnDestroy() {
    this.editor.dispose();
  }

  // Will be called once monaco library is available
  initMonaco() {
    let options = this.options;
    options.value = this._value;
    this.editor = monaco.editor.create(this.editorContent.nativeElement, options);

    // Currently setting this option prevents the autocomplete selection with the "Enter" key
    // TODO make sure to propagate the event to the autocomplete
    if (this.options.customPreventCarriageReturn === true) {
      let preventCarriageReturn = this.editor.addCommand(monaco.KeyCode.Enter, function () {
        return false;
      });
    }

    this.editor.getModel().onDidChangeContent((e) => {
      this.updateValue(this.editor.getModel().getValue());
    });
  }

  /**
   * UpdateValue
   *
   * @param value
   */
  updateValue(value: string) {
    this.value = value;
    this.onChange(value);
    this.onTouched();
    this.change.emit(value);
  }

  /**
   * WriteValue
   * Implements ControlValueAccessor
   *
   * @param value
   */
  writeValue(value: string) {
    this._value = value || '';
    if (this.editor) {
      this.editor.getModel().setValue(this._value);
    }
  }

  onChange(_) { }
  onTouched() { }
  registerOnChange(fn) { this.onChange = fn; }
  registerOnTouched(fn) { this.onTouched = fn; }

}

require('./code.pcss');
