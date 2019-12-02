import { Component, OnInit,  } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ErrorPictures } from '../services/errorPictures';
import { DataService, IMG_SRC_TYPE_PREFIX } from '../services/data.service';
import { Observable, forkJoin } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TimedItem, NewsItem } from '../services/models';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  news : NewsItem[];

  slideOpts = {
    initialSlide: 1,
    speed: 1000,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    }
  }


  constructor(private httpClient: HttpClient, private dataService: DataService) {}

  //reload data every time the user enters this tab
  ionViewWillEnter(){
    this.loadNews();

    //just for testing, if subscribing like this also have to unsubscrie in ng on destroy
    // this.dataService.getTestMessage(666).subscribe((message) => console.log(message));
    // this.dataService.getAllNews().subscribe((news) => {
    //   console.log(news);
    //   news.forEach(item => console.log(item._id))
    // });
  }

  

  private loadNews() {
    this.dataService.getAllNews().pipe(take(1))
      .subscribe((res) => {
        this.news = res;
      });
    // this.news$ = forkJoin(this.dataService.getDummyNews(), this.dataService.getAllNews())
    //   .pipe(
    //     map(([s1, s2]) => [...s1, ...s2]),
    //   );
  }

  showNewsErrorPicture(imgElement){
    console.warn("Picture loading failed, loading error picture.");
    imgElement.src = ErrorPictures.newsErrorPicture;
  }

  getNewsItemPicture(newsItem: NewsItem): string{ 

    if(newsItem.overviewImageBase64.includes('base64')){
        //let base64string = "data:image/png;base64," + this.arrayBufferToBase64(newsItem.overviewImageBase64['data']);
        return newsItem.overviewImageBase64;
    }

    return IMG_SRC_TYPE_PREFIX.Base64 + newsItem.overviewImageBase64;
  }

  showPromotionDetail(){
    alert(`Promotion detail not yet imlpemented.`);
  }

 arrayBufferToBase64( buffer : ArrayBuffer ) {
	var binary = '';
	var bytes = new Uint8Array( buffer );
	var len = bytes.byteLength;
	for (var i = 0; i < len; i++) {
		binary += String.fromCharCode( bytes[ i ] );
	}
	return window.btoa( binary );
}

}
