import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[uiMax]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MaxValidator,
      multi: true
    }
  ]
})
export class MaxValidator implements Validator {
  @Input() uiMax: number;

  validate(c: AbstractControl): { [key: string]: any } {
    if (+c.value > this.uiMax) {
      return { max: true };
    }
  }
}
