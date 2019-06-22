import {
  OnInit,
  OnChanges,
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChange,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ui-pagination',
  template: `
    <div class="pagination" *ngIf="pages.length > 1">
      <div class="buttons">
        <a (click)="goPage(pageIndex - 1)"><i class="iconfont icon-angle-left"></i></a>
        <ng-template ngFor let-item let-i="index" [ngForOf]="pages">
          <a *ngIf="item === 1 && !canShow(1)" (click)="goPage(pageIndex - 4)">...</a>
          <a *ngIf="canShow(item)" (click)="goPage(item)" [class.active]="pageIndex === item">{{ item }}</a>
        </ng-template>
        <a *ngIf="pages.length > 10 && pages.length - pageIndex > 4" (click)="goPage(pageIndex + 4)">...</a>
        <a (click)="goPage(pageIndex + 1)"><i class="iconfont icon-angle-right"></i></a>
      </div>
      <div class="full">
        <ui-select
          *ngIf="options.pageCount"
          class="ml10"
          style="width: .85rem"
          [(ngModel)]="pageCount"
          [options]="countOptions"
          [multi]="false"
          (change)="onCountChange()"
        ></ui-select>
        <span class="nowrap ml10">
          跳至
          <input
            type="number"
            class="input inline"
            style="width: .5rem"
            [(ngModel)]="goIndex"
            (keydown.enter)="onGo()"
            uiIsPositiveInteger
          />
          页
        </span>
      </div>
      <div>共{{ pages.length }}页，{{ pageTotal }}条记录</div>
    </div>
  `,
  styleUrls: ['./pagination.css'],
  encapsulation: ViewEncapsulation.None
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() pageIndex = 1;
  @Output() pageIndexChange = new EventEmitter<any>();
  @Input() pageCount = 1;
  @Output() pageCountChange = new EventEmitter<any>();
  @Input() pageTotal = 1;
  @Output() change = new EventEmitter<any>();
  @Input() options = {
    pageCount: true,
    query: true
  };
  pages: number[] = [1];
  goIndex: number;
  countOptions = {
    id: 'id',
    name: 'name',
    list: [
      {
        id: 10,
        name: '10条/页'
      },
      {
        id: 15,
        name: '15条/页'
      },
      {
        id: 20,
        name: '20条/页'
      },
      {
        id: 30,
        name: '30条/页'
      },
      {
        id: 50,
        name: '50条/页'
      }
    ],
    noDefaultOption: true
  };
  constructor(private _router: Router, private _activateRoute: ActivatedRoute) {}

  ngOnInit() {
    if (this.options.pageCount === undefined) {
      this.options.pageCount = true;
    }
    if (this.options.query === undefined) {
      this.options.query = true;
    }
  }

  setPages() {
    this.pages = [1];
    if (this.pageTotal && this.pageTotal > 1) {
      const size = Math.ceil(this.pageTotal / this.pageCount);
      for (let i = 1; i < size; ++i) {
        this.pages.push(i + 1);
      }
    }
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    this.setPages();
  }

  goPage(pageIndex: number) {
    if (pageIndex < 1) {
      return;
    }

    this.pageIndex = pageIndex;
    this.pageIndexChange.emit(pageIndex);
    this.change.emit(pageIndex);

    if (this.options.query) {
      let paths = window.location.pathname.split('/');
      paths[0] = '/' + paths[0];
      if (!paths[paths.length - 1]) {
        paths = paths.splice(paths.length - 1, 1);
      }
      const queryParams: any = {};
      // tslint:disable-next-line:forin
      for (const key in this._activateRoute.snapshot.queryParams) {
        queryParams[key] = this._activateRoute.snapshot.queryParams[key];
      }
      queryParams['pageIndex'] = this.pageIndex;
      queryParams['pageCount'] = this.pageCount;
      this._router.navigate(paths, { queryParams });
    }
  }

  canShow(index: number) {
    if (this.pages.length <= 10 || index === this.pageIndex) {
      return true;
    }

    if (this.pageIndex < 6) {
      if (index <= 10) {
        return true;
      }

      return false;
    }

    if (this.pages.length - this.pageIndex < 4) {
      if (index > this.pageIndex || this.pageIndex - index < 10 - this.pages.length + this.pageIndex) {
        return true;
      }

      return false;
    }

    if (index < this.pageIndex && this.pageIndex - index < 6) {
      return true;
    }
    if (index > this.pageIndex && index - this.pageIndex < 5) {
      return true;
    }

    return false;
  }

  onCountChange() {
    this.setPages();
    if ((this.pageIndex - 1) * this.pageCount >= this.pageTotal) {
      this.pageIndex = this.pages.length;
    }
    this.pageCountChange.emit(this.pageCount);
    this.goPage(this.pageIndex);
  }

  onGo() {
    if (
      !this.goIndex ||
      this.goIndex < 1 ||
      (this.goIndex + '').indexOf('.') > -1 ||
      this.goIndex > this.pages.length
    ) {
      return;
    }
    this.goPage(+this.goIndex);
  }
}
