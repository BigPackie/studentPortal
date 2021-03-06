import { Injectable } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class TranslateConfigService {

  //TODO move to config;
  _allowedLanguages = ["en", "th"];

  constructor(private translate: TranslateService) {
    translate.addLangs(this._allowedLanguages);
    this.translate.setDefaultLang('en'); //setting english as default fallback language
  
    this.setLanguage(this.translate.getBrowserLang());

  }

  setLanguage(language: string) {
    console.log(`Trying to set language to '${language}'`);
    if (this._isAllowedLanguage(language)) {
      this.translate.use(language);
      console.log(`Language set to '${language}'`);
    } else {
      console.warn(`${language} is not available!`);
    }
  }

  _isAllowedLanguage(language: string): boolean {
    return this._allowedLanguages.includes(language);
  }

  getLanguage() : string {
    return this.translate.currentLang;
  }
}
