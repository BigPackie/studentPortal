import { Component, OnInit,  } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ErrorPictures } from '../services/errorPictures';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  // news = [];
  newsObservable : Observable<any[]>;


  constructor(private httpClient: HttpClient, private dataService: DataService) {}

  //reload data every time the user enters this tab
  ionViewWillEnter(){
    this.loadNews();
  }

  

  loadNews() {
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
}
