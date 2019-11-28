import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { map } from "rxjs/operators";
import { TimedItem, NewsItem, NewsItemDetail } from './models';
import { toBase64String } from '@angular/compiler/src/output/source_map';

export enum IMG_SRC_TYPE_PREFIX {
  Base64 = "data:image/jpeg;base64,"
}

enum DATA_RESOURCES {
    News = 'dummy/dummy-news.json',
    Promotions = 'dummy/dummy-promotions.json'
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

   constructor(private api: Api) { }

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
    return this.api.get("http://localhost:3000", "messages", {id: id});
  }

  getAllNews(): Observable<NewsItem[]> {
    return this.api.get<NewsItem[]>("http://localhost:3000", "database/news");
  }

  getNewsDetail(id: string): Observable<NewsItemDetail> {
    return this.api.get<NewsItemDetail>("http://localhost:3000", "database/newsDetail", {id});
  }
}
