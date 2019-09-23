import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[uiMin]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MinValidator,
      multi: true
    }
  ]
})
export class MinValidator implements Validator {
  @Input() uiMin: number;
  validate(c: AbstractControl): { [key: string]: any } {
    if (+c.value < this.uiMin) {
      if (c.value && c.value.length) {
        c.patchValue(this.uiMin);
        return;
      }

      return { min: true };
    }
  }
}
