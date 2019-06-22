import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

import { ValidatorService } from './validator.service';

@Directive({
  selector: '[uiIsEmail]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: EmailValidator,
      multi: true
    }
  ]
})
export class EmailValidator implements Validator {
  constructor(private service: ValidatorService) {}
  validate(c: AbstractControl): { [key: string]: any } {
    if (c.value && !this.service.isEmail(c.value)) {
      return { email: true };
    }
  }
}
