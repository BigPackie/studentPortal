import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { take } from 'rxjs/operators';
import { Reward, RewardHistory } from '../services/models';

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

  currentPointRewards: Reward[];
  accumulativePointRewards: Reward[];

  currentPointRewardsHistory: RewardHistory[];
  accumulativePointRewardsHistory: RewardHistory[];

  constructor(private dataService: DataService) {}

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
    this.dataService.getDummyRewardsList().pipe(take(1))
    .subscribe((res) => {
      console.log(res);
      this.currentPointRewards = res.current_point_reward;
      this.accumulativePointRewards = res.accumulative_point_reward;
    });
  }

  loadRewardsHistory(){
    console.log(`loading history of rewads`);
    this.dataService.getDummyRewardsHistory().pipe(take(1))
    .subscribe((res) => {
      console.log(res);
      this.currentPointRewardsHistory = res.current_point_exchanged;
      this.accumulativePointRewardsHistory = res.accumulative_point_exchanged;
    });
  }

}
