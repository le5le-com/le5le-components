import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

import { ValidatorService } from './validator.service';

@Directive({
  selector: '[uiIsPhone]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PhoneValidator,
      multi: true
    }
  ]
})
export class PhoneValidator implements Validator {
  @Input() uiIsPhone = 'zh-CN';
  constructor(private service: ValidatorService) {}

  validate(c: AbstractControl): { [key: string]: any } {
    if (c.value && !this.service.isPhone(c.value, this.uiIsPhone)) {
      return { phone: true };
    }
  }
}
