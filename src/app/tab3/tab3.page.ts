import { Component } from '@angular/core';

enum Mode { 
  REWARDS = "rewards",
  HISTORY = "history"
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  slidingItemOpacity: number = 0;

  mode : Mode = Mode.REWARDS;

  constructor() {}

  ionViewDidEnter(){
    this.updatePageContent();
  }

  drag(eventDetail, item){
    this.slidingItemOpacity = Math.pow(10, eventDetail.ratio*2 - 1) / 10;
    // console.log('dragging:' + JSON.stringify(eventDetail));
    // console.log('item:' + JSON.stringify(item.style));
  }

  updatePageContent() {

    switch (this.mode) {
      case Mode.REWARDS:
        this.loadRewards();
        break;
      case Mode.HISTORY:
        this.loadRewardsHistory();
        break;
    
      default:
        this.loadRewards();
        break;
    }

  }

  loadRewards(){
    console.log(`loading rewards`);
  }

  loadRewardsHistory(){
    console.log(`loading history of rewads`)
  }

}
