import { Component, OnInit } from '@angular/core';
import { PromotionDetail } from '../services/models';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { take } from 'rxjs/operators';
import { ErrorPictures } from '../services/errorPictures';

@Component({
  selector: 'app-promotion-detail',
  templateUrl: './promotion-detail.page.html',
  styleUrls: ['./promotion-detail.page.scss'],
})
export class PromotionDetailPage implements OnInit {

  promotionDetail: PromotionDetail;

  zoomSlideOpts = {
    zoom: true,
    watchOverflow : true,
  }

  constructor(private route: ActivatedRoute, private dataService: DataService) { }

  ngOnInit() {
    const promotionDetailId = this.route.snapshot.paramMap.get('id');
    console.log(`Getting data for promotion detail ${promotionDetailId}`);
    this.dataService.getPromotionDetail(promotionDetailId)
      .pipe(take(1))
      .subscribe((detail) => {
        this.promotionDetail = detail;
      });
  }

  showPromotionDetailErrorPicture(imgElement) {
    if (!this.promotionDetail) {
      return;
    }

    console.warn("Picture loading failed, loading error picture.");

    if (this.promotionDetail.description) {
      imgElement.src = ErrorPictures.promotionHalfDetailErrorPicture;
    } else {
      imgElement.src = ErrorPictures.promotionDetailErrorPicture;
    }
  }

  getDetailImageHeight(): string{
    if(this.promotionDetail.description){
      return '50vh';
    }

    return '100vh'
  }

}
