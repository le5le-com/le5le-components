import {
  OnInit,
  OnDestroy,
  Component,
  Input,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  AfterViewInit
} from '@angular/core';

import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { AttachAddon } from 'xterm-addon-attach';
import { SearchAddon } from 'xterm-addon-search';
import { WebLinksAddon } from 'xterm-addon-web-links';

@Component({
  selector: 'ui-xterm',
  template: `
    <div class="ui-xterm" #terminal></div>
  `,
  styleUrls: ['./xterm.css'],
  encapsulation: ViewEncapsulation.None
})
export class XTermComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  socketUrl: string;
  @Input()
  options: any = {};

  @ViewChild('terminal', { static: false })
  terminalHost: ElementRef;
  xterm: Terminal;
  fitAddon = new FitAddon();
  searchAddon = new SearchAddon();
  attachAddon: AttachAddon;
  socket: WebSocket;
  wsSuccess: boolean;
  constructor() { }

  @Input()
  public set winStatus(v: any) {
    this.onResize();
  }

  onResize() {
    if (!this.xterm) {
      return;
    }

    setTimeout(() => {
      this.fitAddon.fit();
    }, 100);
    setTimeout(() => {
      this.fitAddon.fit();
    }, 500);
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.xterm = new Terminal(this.options.config);
    this.xterm.loadAddon(this.fitAddon);
    this.xterm.loadAddon(new WebLinksAddon());
    this.xterm.loadAddon(this.searchAddon);

    this.xterm.setOption('fontSize', '14');
    this.xterm.open(this.terminalHost.nativeElement);
    this.xterm.focus();
    this.onResize();

    this.options.xterm = this.xterm;

    if (this.socketUrl) {
      this.socket = new WebSocket(this.socketUrl);
      this.attachAddon = new AttachAddon(this.socket);
      this.xterm.loadAddon(this.attachAddon);
      this.socket.onopen = this.attachTerminal;
      this.options.socket = this.socket;
    }
  }

  focus() {
    setTimeout(() => {
      this.xterm.focus();
    }, 300);
  }

  attachTerminal = () => {
    this.onResize();
    this.focus();

    this.xterm.attachCustomKeyEventHandler(e => {
      if (e.ctrlKey) {
        // Ctrl  + C
        if (e.keyCode === 67 && this.xterm.hasSelection()) {
          document.execCommand('copy');
          return false;
        } else if (e.keyCode === 86) {
          // Ctrl  + V
          document.execCommand('paste');
          return false;
        }
      }
    });
  };

  ngOnDestroy() {
    if (this.socket) {
      // detach(this.xterm, this.socket);
      this.socket.close();
    }
  }
}
