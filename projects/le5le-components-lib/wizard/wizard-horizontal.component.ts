import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'ui-wizard-horizontal',
  template: `
    <div class="wizard horizontal">
      <ng-template ngFor let-item let-i="index" [ngForOf]="steps">
        <div *ngIf="!item.hidden" class="item" [ngStyle]="getStepStyle()"
             [class.error]="item.invalid" [title]="item.invalid || ''"
             [class.success]="(i+1) < step" [class.active]="(i+1) === step">
          <div class="desc" [class.click]="item.enable || (i+1) < step" (click)="onStep(item, i+1)">
            <div class="icon"></div>
            <i class="{{item.class}}"></i>
            <div class="name">{{item.name}}</div>
          </div>
          <div *ngIf="i < steps.length - 1" class="line"></div>
        </div>
      </ng-template>
    </div>
  `,
  styleUrls: ['./wizard.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WizardHorizontalComponent {
  @Input() step = 1;
  @Output() stepChange = new EventEmitter<number>();
  @Input() steps: any[] = [{}, {}, {}];
  constructor() {}

  getStepStyle(): any {
    let len: number = this.steps.length - 1;
    for (const item of this.steps) {
      if (item.hidden) {
        --len;
      }
    }

    return {
      'flex-shrink': 0,
      width: 'calc(100% / ' + len + ')'
    };
  }

  onStep(stepObj: any, stepIndex: number) {
    if (this.step <= stepIndex && !stepObj.enable) {
      return;
    }

    this.stepChange.emit(stepIndex);
  }
}
