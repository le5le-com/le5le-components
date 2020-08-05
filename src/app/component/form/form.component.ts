import { Component } from '@angular/core';

@Component({
  selector: 'app-component-form',
  templateUrl: 'form.component.html',
  providers: [],
  styleUrls: ['./form.component.scss']
})
export class ComponentFormComponent {
  saving = false;
  min = 0;
  max = 100;
  constructor() { }

  onSubmit(invalid: boolean) { }
}
