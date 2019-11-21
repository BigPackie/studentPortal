import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SettingsPopoverComponent } from "./settings/settings-popover/settings-popover.component";
import { SettingsContainerComponent } from './settings/settings-container/settings-container.component';
import { TranslateModule } from '@ngx-translate/core';

const COMPONENTS = [
  SettingsPopoverComponent,
  SettingsContainerComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
    TranslateModule
  ],
  declarations: [
    COMPONENTS
  ],
  exports: [
    COMPONENTS
  ],
  entryComponents: [SettingsContainerComponent]
})
export class ComponentsModule { }
