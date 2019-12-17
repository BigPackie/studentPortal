import { Component, OnInit } from '@angular/core';
import { TranslateConfigService } from 'src/app/services/translate-config.service';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { TouchSequence } from 'selenium-webdriver';

@Component({
  selector: 'app-settings-container',
  templateUrl: './settings-container.component.html',
  styleUrls: ['./settings-container.component.scss'],
})
export class SettingsContainerComponent implements OnInit {

  chosenLanguage : string;
  isLoggedIn : Promise<boolean>;

  constructor(private popoverController: PopoverController, private translateConfigService: TranslateConfigService, private dataService: DataService, private router: Router) { }

  ionViewDidEnter() {
    this.isLoggedIn = this.dataService.isLoggedIn();
  }

  ngOnInit() {
    this.chosenLanguage = this.translateConfigService.getLanguage();
    
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
