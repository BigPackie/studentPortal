import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
})
export class Tab4Page {

  appName: string;
  version: string;
  versionCode: any;

  constructor(private appVersion: AppVersion, public platform: Platform) { }

  ngOnInit() {
    this.appVersion.getAppName().then((name) => this.appName = name);
    this.appVersion.getVersionNumber().then((version) => this.version = version);
    this.appVersion.getVersionCode().then((versionCode) => this.versionCode = versionCode);
  }

}
