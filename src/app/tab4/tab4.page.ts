import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Platform } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { UserData } from '../services/models';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
})
export class Tab4Page {

  appName: string;
  version: string;
  versionCode: any;

  mailHref: string = "mailto:icit_support@kmutnb.ac.th?Subject=ICIT%20App%20user%20report";

  constructor(private appVersion: AppVersion, public platform: Platform, private userService: UserService) { }

  ngOnInit() {
    this.appVersion.getAppName()
    .then((name) => this.appName = name)
    .then();
    this.appVersion.getVersionNumber().then((version) => this.version = version);
    this.appVersion.getVersionCode().then((versionCode) => this.versionCode = versionCode);

    Promise.all([this.appVersion.getVersionNumber(), this.appVersion.getVersionCode()])
    .then((values) => {
      this.mailHref = this.mailHref + encodeURIComponent(", version:" + values[0] + "(" + values[1] +")");
      return  this.userService.getUserData();
    }).then((userData: UserData) => {
      this.mailHref = this.mailHref + encodeURIComponent(", user:" + userData.username);
    })
  }

}
