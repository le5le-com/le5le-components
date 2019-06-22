import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class MonacoEditorLoaderService {
  loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private patn = 'assets/monaco/vs';
  set monacoPath(value) {
    if (value) {
      this.patn = value + '/vs';
    }
  }

  constructor(private ngZone: NgZone) {
    this.load();
  }

  // Load monaco
  load() {
    const onGotAmdLoader = () => {
      (window as any).require.config({ paths: { vs: this.patn } });
      (window as any).require(['vs/editor/editor.main'], () => {
        this.ngZone.run(() => this.loaded.next(true));
      });
    };

    // Load AMD loader if necessary
    if (!(window as any).require) {
      const loaderScript = document.createElement('script');
      loaderScript.type = 'text/javascript';
      loaderScript.src = `${this.patn}/loader.js`;
      loaderScript.addEventListener('load', onGotAmdLoader);
      document.body.appendChild(loaderScript);
    } else {
      onGotAmdLoader();
    }
  }
}
