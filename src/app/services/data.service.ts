import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { map, delay } from "rxjs/operators";
import { TimedItem, NewsItem, NewsItemDetail, Promotion, PromotionDetail } from './models';
import { Storage } from '@ionic/storage';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { environment } from 'src/environments/environment';

export enum IMG_SRC_TYPE_PREFIX {
  Base64 = "data:image/jpeg;base64,"
}

enum DATA_RESOURCES {
    News = 'dummy/dummy-news.json',
    Promotions = 'dummy/dummy-promotions.json',
    RewardsList = 'dummy/rewards_list.json',
    RewardsHistory = 'dummy/rewards_history.json'
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

  getRewardsList(): Observable<any> {
    return this.api.get<any>('assets', DATA_RESOURCES.RewardsList);
    //return this.api.get<any>(environment.rewardServicesUrl,'getRewardList');
  }

  getRewardsHistory(): Observable<any> {
    //return this.api.get<any>('assets', DATA_RESOURCES.RewardsHistory);
    return this.api.get<any>(environment.rewardServicesUrl,'getExchangeHistory');
  }

  getUserPoints(): Observable<any> {
    return this.api.get<any>(environment.rewardServicesUrl,'getUserPoint');
  }

  getRewardExchangeToken(id: any): Observable<any> {
    return of({exchange_token: "88888888"}).pipe(delay(2000));
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
}
