import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'le5le-components/select';

import { PaginationComponent } from './pagination.component';

@NgModule({
  imports: [CommonModule, FormsModule, SelectModule],
  declarations: [PaginationComponent],
  exports: [PaginationComponent]
})
export class PaginationModule {}
