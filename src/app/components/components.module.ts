import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SettingsPopoverComponent } from "./settings/settings-popover/settings-popover.component";
import { SettingsContainerComponent } from './settings/settings-container/settings-container.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { ItemOptionLoadingComponent } from './item-option-loading/item-option-loading.component';

const COMPONENTS = [
  SettingsPopoverComponent,
  SettingsContainerComponent,
  ItemOptionLoadingComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
    TranslateModule,
    RouterModule,
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
