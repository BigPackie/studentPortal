import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Api } from '../api/api';

enum STORAGE_KEY {
  HAS_LOGGED_IN = "hasLoggedIn",
  USER_NAME = "username"
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private api: Api, private storage: Storage) { }

   // --- user related data ---

   login(username: string): Promise<any> {
    return this.storage.set(STORAGE_KEY.HAS_LOGGED_IN, true).then(() => {
      this.setUsername(username);
      return window.dispatchEvent(new CustomEvent('user:login'));
    });
  }

  logout(): Promise<any> {
    return this.storage.remove(STORAGE_KEY.HAS_LOGGED_IN).then(() => {
      return this.storage.remove(STORAGE_KEY.USER_NAME);
    }).then(() => {
      window.dispatchEvent(new CustomEvent('user:logout'));
    });
  }

  setUsername(username: string): Promise<any> {
    return this.storage.set(STORAGE_KEY.USER_NAME, username);
  }

  getUsername(): Promise<string> {
    return this.storage.get(STORAGE_KEY.USER_NAME).then((value) => {
      return value;
    });
  }

  isLoggedIn(): Promise<boolean> {
    return this.storage.get(STORAGE_KEY.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  }
}
