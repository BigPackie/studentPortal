import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UpdateService } from './services/update.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { AppVersionInfo } from './services/models';
import { Market } from '@ionic-native/market/ngx';
import { TranslateConfigService } from './services/translate-config.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {


  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private updateService: UpdateService,
    private appVersion: AppVersion,
    public alertController: AlertController,
    private market: Market,
    private translateConfigService: TranslateConfigService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      console.log("platform ready:", this.platform.platforms())
      
      this.statusBar.styleLightContent();
      this.splashScreen.hide();

      if(!this.platform.is("android") &&  !this.platform.is("ios")){
        //browser desktop, just development
        console.log("Running in browser, no updates will be checked.")
        return;
      }

      console.log("Checking for new version...");

      const actualVersion = await this.appVersion.getVersionNumber();
      
      const newVersionInfo = await this.updateService.getUpdates().toPromise();

      if (this.updateService.isAppOld(actualVersion, newVersionInfo.version)) {
        if(newVersionInfo.updateRequired){
          await this.presentUpdateRequiredAllert(actualVersion, newVersionInfo);
        } else {
          this.presentUpdateAllert(actualVersion, newVersionInfo);
        }
      } else{
         //do nothing
      };
    });
  }

  async presentUpdateAllert(actualVersion: string, newVersionInfo: AppVersionInfo){
    const downloadLink = `Download new version at: ${this.platform.is("android") ? newVersionInfo.playStoreLink : newVersionInfo.appleStoreLink}`;

    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'New version available',
      subHeader: `${actualVersion} -> ${newVersionInfo.version}`,
      message: "For better experience, consider updating now.",
      buttons: [
        {
          text: 'Later',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Update now',
          handler: async () => await this.onUpdate(newVersionInfo),
        }
      ]
    });

    await alert.present();
  }

  async presentUpdateRequiredAllert(actualVersion: string, newVersionInfo: AppVersionInfo){
    const downloadLink = `Download new version at: ${this.platform.is("android") ? newVersionInfo.playStoreLink : newVersionInfo.appleStoreLink}`;

    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: 'New version available',
      subHeader: `Update is required, ${actualVersion} -> ${newVersionInfo.version}`,
      message: `The app cannot be used unless you update to the latest version.`,
      buttons: [
        {
          text: 'Exit app',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => this.onExit(),  
        }, {
          text: 'Update now',
          handler: async () => await this.onUpdate(newVersionInfo),    
        }
      ]
    });

    await alert.present();
  }

  async onUpdate(versionInfo: AppVersionInfo){
    const marketLink = this.platform.is("android") ? versionInfo.playStoreLink : versionInfo.appleStoreLink
    await this.market.open(marketLink).finally(() => navigator['app'].exitApp());
  }

  onExit(){
    navigator['app'].exitApp();
  }
}
