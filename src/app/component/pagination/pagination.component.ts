import { Component } from '@angular/core';

@Component({
  selector: 'app-component-pagination',
  templateUrl: 'pagination.component.html',
  providers: [],
  styleUrls: ['./pagination.component.scss']
})
export class ComponentPaginationComponent {
  pageIndex = 1;
  pageCount = 10;
  total = 30;
  constructor() { }

  onPage() {
    console.log('onPage');
  }
}
