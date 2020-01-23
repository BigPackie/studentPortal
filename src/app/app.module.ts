import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateConfigService } from './services/translate-config.service';
import { ComponentsModule } from './components/components.module';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { AuthRequestInterceptor } from './interceptors/authRequestInterceptor';
import { AuthResponseInterceptor } from './interceptors/authResponseInterceptor';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { UpdateService } from './services/update.service';
import { Api } from './api/api';
import { Market } from '@ionic-native/market/ngx';

export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: LanguageLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UpdateService,
    TranslateConfigService,
    AppVersion,
    Api,
    Market,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthRequestInterceptor, multi: true}, //order of interceptors matters
    { provide: HTTP_INTERCEPTORS, useClass: AuthResponseInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
