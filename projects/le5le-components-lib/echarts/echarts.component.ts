import {
  OnInit,
  OnChanges,
  OnDestroy,
  Component,
  Input,
  ViewChild,
  ElementRef,
  NgZone,
  SimpleChange,
  ViewEncapsulation
} from '@angular/core';

import { EchartsLoaderService } from './echarts-loader.service';

declare var echarts: any;

@Component({
  selector: 'ui-echarts',
  template: `
    <div class="ui-echarts" #echarts></div>
  `,
  styleUrls: ['./echarts.css'],
  encapsulation: ViewEncapsulation.None
})
export class EchartsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() options: any = {};
  @Input() initOpt: any = {};
  @Input() theme: any = 'default';
  @Input() redraw: any;

  @Input() outObject: any = {};

  @Input()
  public set winStatus(v: any) {
    this.onResize();
  }

  @ViewChild('echarts', { static: true }) echartsElem: ElementRef;

  private chart: any;

  constructor(private ngZone: NgZone, private loadService: EchartsLoaderService) {
    this.loadService.load();
  }

  ngOnInit() {
    this.loadService.loaded.subscribe(ret => {
      if (ret) {
        this.ngZone.runOutsideAngular(() => {
          this.chart = (echarts as any).init(this.echartsElem.nativeElement, this.theme, this.initOpt);
          this.chart.setOption(this.options);

          this.outObject.echarts = this.chart;
        });

        this.onResize();
      }
    });
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    // tslint:disable-next-line:no-string-literal
    if (this.chart && changes['redraw']) {
      this.chart.setOption(this.options);
    }
  }

  onResize() {
    setTimeout(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    setTimeout(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 500);
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  }
}
