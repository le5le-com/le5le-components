import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[required]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MyRequiredValidator,
      multi: true
    }
  ]
})
export class MyRequiredValidator implements Validator {
  @Input() required: boolean;

  validate(c: AbstractControl): { [key: string]: any } {
    if (c.value === null || c.value === undefined || (typeof c.value.trim === 'function' && !c.value.trim())) {
      return { required: true };
    }
  }
}
