import { Component, OnInit,  } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ErrorPictures } from '../services/errorPictures';
import { DataService, IMG_SRC_TYPE_PREFIX } from '../services/data.service';
import { Observable } from 'rxjs';
import { TimedItem, NewsItem } from '../services/models';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  // news = [];
  newsObservable : Observable<NewsItem[]>;

  slideOpts = {
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
  }


  constructor(private httpClient: HttpClient, private dataService: DataService) {}

  //reload data every time the user enters this tab
  ionViewWillEnter(){
    this.loadNews();
  }

  

  private loadNews() {
    // this.dataService.getNews()
    //   .subscribe((res : any[]) => {
    //     this.news = res;
    //   });
    this.newsObservable = this.dataService.getNews();
  }

  showNewsErrorPicture(imgElement){
    console.warn("Picture loading failed, loading error picture.");
    imgElement.src = ErrorPictures.newsErrorPicture;
  }

  getNewsItemPicture(newsItem: NewsItem): string{ 
    return IMG_SRC_TYPE_PREFIX.Base64 + newsItem.overviewImageBase64;
  }

  showNewsDetail(){
    alert(`News detail not yet imlpemented.`);
  }

  showPromotionDetail(){
    alert(`Promotion detail not yet imlpemented.`);
  }

}
