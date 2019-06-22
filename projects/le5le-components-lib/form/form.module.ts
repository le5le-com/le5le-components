import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { BtnSavingDirective } from './btnSaving.directive';
import { TouchFormDirective } from './touchForm.directive';
import { PhoneValidator } from './validator/phone.directive';
import { PasswordValidator } from './validator/password.directive';
import { PositiveValidator } from './validator/positive.directive';
import { PositiveIntegerValidator } from './validator/positiveInteger.directive';
import { SameValidator } from './validator/same.directive';
import { EmailValidator } from './validator/email.directive';
import { UrlValidator } from './validator/url.directive';
import { MinValidator } from './validator/min.directive';
import { MaxValidator } from './validator/max.directive';
import { RegExpValidator } from './validator/regExp.directive';
import { MyRequiredValidator } from './validator/required.directive';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [
    BtnSavingDirective,
    TouchFormDirective,
    PhoneValidator,
    PasswordValidator,
    PositiveValidator,
    PositiveIntegerValidator,
    SameValidator,
    EmailValidator,
    UrlValidator,
    MinValidator,
    MaxValidator,
    RegExpValidator,
    MyRequiredValidator
  ],
  exports: [
    BtnSavingDirective,
    TouchFormDirective,
    PhoneValidator,
    PasswordValidator,
    PositiveValidator,
    PositiveIntegerValidator,
    SameValidator,
    EmailValidator,
    UrlValidator,
    MinValidator,
    MaxValidator,
    RegExpValidator,
    MyRequiredValidator
  ]
})
export class FormModule {}
