import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Api } from '../api/api';
import { Observable } from 'rxjs';
import { UserData, LoginData } from './models';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { verify } from 'crypto';

enum STORAGE_KEY {
  HAS_LOGGED_IN = "hasLoggedIn",
  USER = "user",
  TOKEN = "api_token",
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private api: Api, private storage: Storage) { }


   login(loginData: LoginData): Observable<any> {

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type':  'application/x-www-form-urlencoded',
    //   })
    // };
    return this.api.post(environment.rewardServicesUrl,'authen', loginData /*,httpOptions*/);
  }

  saveLoggedInUser(userData: UserData, token: string){
    return this.setToken(token)
    .then(() => this.storage.set(STORAGE_KEY.HAS_LOGGED_IN, true))
    .then(() => this.setUserData(userData))
    .then(() => window.dispatchEvent(new CustomEvent('user:login')));
  }

  logout(): Promise<any> {
    return this.storage.clear().then(() => {
      window.dispatchEvent(new CustomEvent('user:logout'));
    });
  }

  private setUserData(userData: UserData): Promise<any> {

    if (!userData) {
      return Promise.reject("userData is null");
    }

    const userDataAsString = JSON.stringify(userData);

    return this.storage.set(STORAGE_KEY.USER, userDataAsString);
  }

  //TODO maybe hash token before use and unhash on load, using some symetric algorithm and salt. Maybe the user pid can be used as salt or something.
  // if we have secure storage then we dont have to be concerned about this.
  private setToken(token : string): Promise<any> {

    if (!this.verifyToken(token)){
      return Promise.reject("user token is invalid");
    }

    return this.storage.set(STORAGE_KEY.TOKEN, token);
  }

  getToken(): Promise<string> {
    return this.storage.get(STORAGE_KEY.TOKEN).then((value) => {
      return value;
    });
  }

  verifyToken(token: string): boolean {
    //TODO maybe need to verify the token validty, the last part is the first two parts hashed, so if we hash with the same alghoritm, the result should be same as last part
      return true;
  }

  getUserData(): Promise<UserData> {
    return this.storage.get(STORAGE_KEY.USER).then((value) => {
      return JSON.parse(value);
    });
  }

  isLoggedIn(): Promise<boolean> {
    return this.storage.get(STORAGE_KEY.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  }
}
