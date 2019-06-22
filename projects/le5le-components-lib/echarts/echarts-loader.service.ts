import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

enum LoadStatus {
  Loading = 1,
  Loaded
}

@Injectable()
export class EchartsLoaderService {
  loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private path = '/assets/echarts.min.js';

  constructor(private ngZone: NgZone) {
    this.load();
  }

  load() {
    if ((window as any).echartsLoad === LoadStatus.Loading) {
      return;
    }
    if ((window as any).echartsLoad > LoadStatus.Loading && (window as any).echarts) {
      this.ngZone.run(() => this.loaded.next(true));
    } else {
      this.loadJs();
    }
  }

  loadJs() {
    if ((window as any).echartsLoad) {
      return;
    }
    (window as any).echartsLoad = LoadStatus.Loading;
    const loaderScript = document.createElement('script');
    loaderScript.type = 'text/javascript';
    loaderScript.src = this.path;
    document.body.appendChild(loaderScript);
    loaderScript.addEventListener('load', () => {
      (window as any).echartsLoad = LoadStatus.Loaded;
      this.ngZone.run(() => this.loaded.next(true));
    });
  }
}
