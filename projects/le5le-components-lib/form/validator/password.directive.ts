import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

import { ValidatorService } from './validator.service';

@Directive({
  selector: '[uiIsPassword]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordValidator,
      multi: true
    }
  ]
})
export class PasswordValidator implements Validator {
  constructor(private service: ValidatorService) {}

  validate(c: AbstractControl): { [key: string]: any } {
    if (c.value && !this.service.isPassword(c.value)) {
      return { password: true };
    }
  }
}
