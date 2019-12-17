import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { map } from "rxjs/operators";
import { TimedItem, NewsItem, NewsItemDetail, Promotion, PromotionDetail } from './models';
import { Storage } from '@ionic/storage';
import { toBase64String } from '@angular/compiler/src/output/source_map';

export enum IMG_SRC_TYPE_PREFIX {
  Base64 = "data:image/jpeg;base64,"
}

enum DATA_RESOURCES {
    News = 'dummy/dummy-news.json',
    Promotions = 'dummy/dummy-promotions.json'
}

enum STORAGE_KEY {
  HAS_LOGGED_IN = "hasLoggedIn",
  USER_NAME = "username"
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

   constructor(private api: Api, private storage: Storage) { }

  getDummyNews(): Observable<NewsItem[]> {
    return this.api.get<NewsItem[]>(undefined, DATA_RESOURCES.News)
    //keeping it here as a reference on how to enrich data, so we can still use the async pipe in templates for auto unsubscription.
   // .pipe(
      // map((news: NewsItem[]) => {
      //   console.log(`Enriching data`);
      //   return news.map(newsItem => {
      //     console.log(newsItem.overviewImageBase64.toString('base64')); //not needed now, maybe because data already stored in buffer as base64 string ?
      //     return newsItem;
      //   });
      // })
   //  );
  }

  getTestMessage(id: number): Observable<any> {
    return this.api.get(undefined, "messages", {id: id});
  }

  getNews(): Observable<NewsItem[]> {
    return this.api.get<NewsItem[]>(undefined, "database/news/active");
  }

  getNewsDetail(id: string): Observable<NewsItemDetail> {
    return this.api.get<NewsItemDetail>(undefined, "database/newsDetail", {id});
  }

  getPromotions(): Observable<Promotion[]> {
    return this.api.get<NewsItem[]>(undefined, "database/promotions/active");
  }

  getPromotionDetail(id: string): Observable<PromotionDetail> {
    return this.api.get<NewsItemDetail>(undefined, "database/promotionDetail", {id});
  }

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
