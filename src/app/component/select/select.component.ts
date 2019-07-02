import { Component } from '@angular/core';

@Component({
  selector: 'app-component-select',
  templateUrl: 'select.component.html',
  providers: [],
  styleUrls: ['./select.component.scss']
})
export class ComponentSelectComponent {
  single = '';
  multi: any;
  options = [
    {
      id: '1',
      name: '选项一'
    },
    {
      id: '2',
      name: '选项二'
    },
    {
      id: '3',
      name: '选项三'
    },
    {
      id: '4',
      name: '选项四'
    },
    {
      id: '5',
      name: '选项五'
    }
  ];
  constructor() {}

  onChange(data) {
    console.log('select change:', data);
  }

  onInput(text: string) {
    console.log('input:', text);
  }
}
