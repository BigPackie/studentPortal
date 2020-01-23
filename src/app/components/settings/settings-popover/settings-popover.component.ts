import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { SettingsContainerComponent } from '../settings-container/settings-container.component';

@Component({
  selector: 'app-settings-popover',
  templateUrl: './settings-popover.component.html',
  styleUrls: ['./settings-popover.component.scss'],
})
export class SettingsPopoverComponent implements OnInit {

  constructor(public popoverController: PopoverController) { }

  ngOnInit() {}

  async presentPopover() {
    const popover = await this.popoverController.create({
      component: SettingsContainerComponent,
      translucent: true
    });
    return await popover.present();
  }

}
