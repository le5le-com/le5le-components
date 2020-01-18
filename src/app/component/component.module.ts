import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { ComponentComponent } from './component.component';
import { ComponentRoutingModule } from './component-routing.module';
import { ComponentAvatarComponent } from './avatar/avatar.component';
import { ComponentNoticeComponent } from './notice/notice.component';
import { ComponentXtermComponent } from './xterm/xterm.component';
import { ComponentCodeComponent } from './code/code.component';
import { ComponentRateComponent } from './rate/rate.component';
import { ComponentEchartsComponent } from './echarts/echarts.component';
import { ComponentSelectComponent } from './select/select.component';
import { ComponentSliderComponent } from './slider/slider.component';
import { ComponentCalendarComponent } from './calendar/calendar.component';
import { ComponentUploadComponent } from './upload/upload.component';
import { ComponentEditorComponent } from './editor/editor.component';
import { ComponentPaginationComponent } from './pagination/pagination.component';
import { ComponentFormComponent } from './form/form.component';
import { ComponentProgressComponent } from './progress/progress.component';

@NgModule({
  imports: [SharedModule, ComponentRoutingModule],
  declarations: [
    ComponentComponent,
    ComponentAvatarComponent,
    ComponentNoticeComponent,
    ComponentXtermComponent,
    ComponentCodeComponent,
    ComponentRateComponent,
    ComponentEchartsComponent,
    ComponentSelectComponent,
    ComponentSliderComponent,
    ComponentCalendarComponent,
    ComponentUploadComponent,
    ComponentEditorComponent,
    ComponentPaginationComponent,
    ComponentFormComponent,
    ComponentProgressComponent
  ],
  providers: []
})
export class ComponentModule { }
