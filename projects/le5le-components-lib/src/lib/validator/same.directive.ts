import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[uiSameTo]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: SameValidator,
      multi: true
    }
  ]
})
export class SameValidator implements Validator {
  @Input() uisameTo: string;

  validate(c: AbstractControl): { [key: string]: any } {
    if (c.value !== this.uisameTo) {
      return { same: true };
    }
  }
}
