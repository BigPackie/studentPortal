import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { take } from 'rxjs/operators';
import { NewsItemDetail } from '../services/models';
import { Observable } from 'rxjs';
import { ErrorPictures } from '../services/errorPictures';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss'],
})
export class NewsDetailPage implements OnInit {

  newsItemDetail$: Observable<NewsItemDetail>;

  zoomSlideOpts = {
    zoom: true,
    watchOverflow : true,
  }

  constructor(private route: ActivatedRoute, private dataService: DataService) { }

  ngOnInit() {
    const newsDetailId = this.route.snapshot.paramMap.get('id');
    console.log(`Getting data for news detail ${newsDetailId}`);
    this.newsItemDetail$ = this.dataService.getNewsDetail(newsDetailId).pipe(take(1))
  }

  showNewsDetailErrorPicture(imgElement) {
    console.warn("Picture loading failed, loading error picture.");
    imgElement.src = ErrorPictures.newsDetailErrorPicture;
  }

  getNewsDetailPicture(newsDetail: NewsItemDetail): string {
    return newsDetail.imageBase64;
  }

}
