import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorPictures } from '../services/errorPictures';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  private localAssetsUrl = "assets/";

  news = [];


  constructor(private httpClient: HttpClient) {}

  ngOnInit(){
    this.getNews();
  }

  getNews(){
    this.httpClient.get(this.localAssetsUrl + 'dummy/dummy-news.json').subscribe((res : any[])=>{
      console.log(res);
      this.news = res;
    });
  }

  getNewsErrorPicture(imgElement){
    console.warn("Picture loading failed, loading error picture.");
    imgElement.src = ErrorPictures.newsErrorPicture;
  }
}
