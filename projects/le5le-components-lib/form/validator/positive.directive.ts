import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[uiIsPositive]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PositiveValidator,
      multi: true
    }
  ]
})
export class PositiveValidator implements Validator {
  constructor() {}

  validate(c: AbstractControl): { [key: string]: any } {
    if (c.value !== undefined && c.value !== null && !(c.value > 0)) {
      return { positive: true };
    }
  }
}
