import { Component, OnInit } from '@angular/core';
import { TranslateConfigService } from 'src/app/services/translate-config.service';

@Component({
  selector: 'app-settings-container',
  templateUrl: './settings-container.component.html',
  styleUrls: ['./settings-container.component.scss'],
})
export class SettingsContainerComponent implements OnInit {

  chosenLanguage : string;

  constructor(private translateConfigService: TranslateConfigService) { }

  ngOnInit() {
    this.chosenLanguage = this.translateConfigService.getLanguage();
  }

  languageChanged(){
    this.translateConfigService.setLanguage(this.chosenLanguage);
  }
}
