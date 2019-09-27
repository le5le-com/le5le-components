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
      name: '选项一',
      desc: '关于选项一的描述'
    },
    {
      id: '2',
      name: '选项二',
      desc: '关于选项二的描述'
    },
    {
      id: '3',
      name: '选项三',
      desc: '关于选项三的描述'
    },
    {
      id: '4',
      name: '选项四',
      desc: '关于选项四的描述'
    },
    {
      id: '5',
      name: '选项五',
      desc: '关于选项五的描述'
    }
  ];
  list: any[] = [];
  count = 1;
  constructor() {
    this.getRandomList();
  }

  getRandomList() {
    this.list = [];
    for (let i = 0; i < 5; ++i) {
      this.list.push({
        id: i,
        name: '选项' + this.count++,
        desc: '累计选项'
      });
    }
  }

  onChange(data) {
    console.log('select change:', data);
  }

  onInput(text: string) {
    console.log('input:', text);
    this.getRandomList();
  }
}
