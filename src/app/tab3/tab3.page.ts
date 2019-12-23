import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  slidingItemOpacity: number = 0;

  constructor() {}

  drag(eventDetail, item){
    this.slidingItemOpacity = Math.pow(10, eventDetail.ratio*2 - 1) / 10;
    // console.log('dragging:' + JSON.stringify(eventDetail));
    // console.log('item:' + JSON.stringify(item.style));
  }

}
