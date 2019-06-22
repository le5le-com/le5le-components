import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

import { ValidatorService } from './validator.service';

@Directive({
  selector: '[uiIsUrl]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: UrlValidator,
      multi: true
    }
  ]
})
export class UrlValidator implements Validator {
  constructor(private service: ValidatorService) {}

  validate(c: AbstractControl): { [key: string]: any } {
    if (c.value && !this.service.isUrl(c.value)) {
      return { url: true };
    }
  }
}
