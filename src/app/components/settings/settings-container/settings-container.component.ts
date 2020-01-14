import { Component, OnInit } from '@angular/core';
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { TouchSequence } from 'selenium-webdriver';
import { UserService } from 'src/app/services/user.service';
import { AppVersion } from '@ionic-native/app-version/ngx';

@Component({
  selector: 'app-settings-container',
  templateUrl: './settings-container.component.html',
  styleUrls: ['./settings-container.component.scss'],
})
export class SettingsContainerComponent implements OnInit {

  chosenLanguage : string;
  isLoggedIn : Promise<boolean>;
  username: string;

  version : string;

  constructor(private popoverController: PopoverController, 
    private translateConfigService: TranslateConfigService, 
    private userService: UserService, 
    private router: Router,
    private appVersion: AppVersion) { }

  ionViewDidEnter() {
    this.isLoggedIn = this.userService.isLoggedIn();
    this.userService.getUserData().then((userData) => {this.username = userData ? userData.username : null});
  }

  ngOnInit() {
    this.chosenLanguage = this.translateConfigService.getLanguage();
    this.appVersion.getVersionNumber().then((version) =>   this.version = version);
  }

  languageChanged(){
    this.translateConfigService.setLanguage(this.chosenLanguage);
  }

  goToLogin(){
    this.popoverController.dismiss().then(() => this.router.navigateByUrl('/login'));
  }

  goToProfile(){
    this.popoverController.dismiss().then(() => this.router.navigateByUrl('/profile'));
  }
}
