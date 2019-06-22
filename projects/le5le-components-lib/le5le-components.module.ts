import { NgModule } from '@angular/core';

import { EscModule } from 'le5le-components/esc';
import { LazyLoadModule } from 'le5le-components/lazyLoad';
import { SwitchModule } from 'le5le-components/switch';
import { QrcodeModule } from 'le5le-components/qrcode';
import { FileUploadModule } from 'le5le-components/fileUpload';
import { EditorModule } from 'le5le-components/editor';
import { LoadingModule } from 'le5le-components/loading';
import { FormModule } from 'le5le-components/form';
import { SelectModule } from 'le5le-components/select';
import { PaginationModule } from 'le5le-components/pagination';
import { WizardModule } from 'le5le-components/wizard';
import { MoveModule } from 'le5le-components/move';
import { DatetimeModule } from 'le5le-components/datetime';
import { CodeModule } from 'le5le-components/code';
import { XtermModule } from 'le5le-components/ng-xterm';
import { SliderModule } from 'le5le-components/slider';
import { EchartsModule } from 'le5le-components/echarts';
import { ProgressModule } from 'le5le-components/progress';
import { AvatarModule } from 'le5le-components/avatar';
import { RateModule } from 'le5le-components/rate';

@NgModule({
  exports: [
    EscModule,
    LazyLoadModule,
    SwitchModule,
    QrcodeModule,
    FileUploadModule,
    EditorModule,
    LoadingModule,
    FormModule,
    SelectModule,
    PaginationModule,
    WizardModule,
    MoveModule,
    DatetimeModule,
    CodeModule,
    XtermModule,
    SliderModule,
    EchartsModule,
    ProgressModule,
    AvatarModule,
    RateModule
  ]
})
export class Le5leComponentsModule {}
