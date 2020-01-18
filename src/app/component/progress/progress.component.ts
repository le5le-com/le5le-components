import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ComponentProgressComponent implements OnInit {
  colors = {
    40: '#87d068',
    70: '#faad14',
    101: '#f50000',
  };
  textStyle = { 'font-size': '16px', 'font-weight': 700 };
  descStyle = { 'font-size': '12px' };
  iconStyle = { 'font-size': '30px' };
  constructor() { }

  ngOnInit() { }
}
