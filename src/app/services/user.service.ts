import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Api } from '../api/api';
import { Observable } from 'rxjs';
import { UserData, LoginData } from './models';
import { environment } from 'src/environments/environment';
import { AES, enc } from 'crypto-ts';


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
    return this.api.post(environment.rewardServicesUrl,'authen', loginData);
  }

  saveLoggedInUser(userData: UserData, token: string){
    return this.verifyToken(token)
    .then(() => this.encryptToken(token, userData))
    .then(enT => this.setToken(enT))
    .then(() => this.setUserData(userData))
    .then(() => this.storage.set(STORAGE_KEY.HAS_LOGGED_IN, true))
    .then(() => window.dispatchEvent(new CustomEvent('user:login')));
  }

  logout(): Observable<any> {
      // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Authorization':  'Bearer <JWT>',
    //   })
    // };

    //TODO: call api to clear/rewoke token
    return this.api.post(environment.rewardServicesUrl,'logout', null);
  }

  deleteUser(){
    return this.storage.clear()
    .then(() => {
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
    return this.storage.set(STORAGE_KEY.TOKEN, token);
  }

  getToken(): Promise<string> {
   return Promise.all([this.storage.get(STORAGE_KEY.TOKEN), this.getUserData()])
      .then(([enT, user]) => {
        //there is no saved token or user, probably because he did not log in yet, just return empty string""
        if (!enT || user == null || user == undefined){
          return enT;  
        } else {
          return this.decryptToken(enT, user)
        }
      }).catch(() => console.warn("Something went wrong when retrieving the token"));
  }
  
  verifyToken(token: string): Promise<boolean> {
    //TODO maybe need to verify the token validty, the last part is the first two parts hashed, so if we hash with the same alghoritm, the result should be same as last part
      return Promise.resolve(true);
  }

  private encryptToken(token : string, userData: UserData): Promise<any>{
    const secureKey ="hakuna matata " + userData.username + userData.birthdate;

    return Promise.resolve(AES.encrypt(token, secureKey).toString());
  }

  private decryptToken(enT : string, userData: UserData): Promise<any>{
    const secureKey ="hakuna matata " + userData.username + userData.birthdate;

    return Promise.resolve((AES.decrypt(enT, secureKey)).toString(enc.Utf8));
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
