import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[uiRegExp]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: RegExpValidator,
      multi: true
    }
  ]
})
export class RegExpValidator implements Validator {
  @Input() uiRegExp: string;

  validate(c: AbstractControl): { [key: string]: any } {
    const pat = new RegExp(this.uiRegExp);
    if (c.value && !pat.test(c.value)) {
      return { repExp: true };
    }
  }
}
