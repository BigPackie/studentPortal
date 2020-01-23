import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { Observable } from 'rxjs';
import { AppVersionInfo } from './models';
import { compare } from 'compare-versions';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(private api: Api) { }

  getUpdates(): Observable<AppVersionInfo> {
    return this.api.get<AppVersionInfo>(undefined, "update/newestAppVersion").pipe(take(1));
  }

  isAppOld(appVersionNumber: string, newAppVersionNumber: string){
    return compare(appVersionNumber, newAppVersionNumber,'<');   
  }
}
