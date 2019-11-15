import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

enum DATA_RESOURCES {
    News = 'dummy/dummy-news.json',
    Promotions = 'dummy/dummy-promotions.json'
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

   constructor(private api: Api) { }

  getNews(): Observable<any>{
    return this.api.get(undefined, DATA_RESOURCES.News);
  }
}
