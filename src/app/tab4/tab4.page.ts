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
  version: string | number;
  versionCode: any;

  mailHrefBase: string = "mailto:icit_support@kmutnb.ac.th?Subject=ICIT%20App%20user%20report";

  mailHref: string = this.mailHrefBase;

  constructor(private appVersion: AppVersion, public platform: Platform, private userService: UserService) { }

  ngOnInit() {
    this.appVersion.getAppName()
    .then((name) => this.appName = name);

    Promise.all([this.appVersion.getVersionNumber(), this.appVersion.getVersionCode()])
    .then((values) => {
      this.version = values[0];
      this.versionCode = values[1];
      this.mailHrefBase = this.mailHrefBase + encodeURIComponent(", version:" + values[0] + "(" + values[1] +")");
    })
  }

  ionViewDidEnter(){
    this.mailHref = this.mailHrefBase;
    this.userService.getUserData()
      .then((userData: UserData) => {
        if(userData){
          this.mailHref = this.mailHrefBase + encodeURIComponent(", user:" + userData.username);
        }
    })
  }

}
