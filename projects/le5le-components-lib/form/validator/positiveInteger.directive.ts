import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

import { ValidatorService } from './validator.service';

@Directive({
  selector: '[uiIsPositiveInteger]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PositiveIntegerValidator,
      multi: true
    }
  ]
})
export class PositiveIntegerValidator implements Validator {
  constructor(private service: ValidatorService) {}

  validate(c: AbstractControl): { [key: string]: any } {
    if (c.value && !this.service.isPositiveInteger(c.value)) {
      return { positiveInteger: true };
    }
  }
}
