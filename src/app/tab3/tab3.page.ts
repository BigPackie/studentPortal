import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { take } from 'rxjs/operators';
import { Reward, RewardHistory } from '../services/models';
import { DomSanitizer } from '@angular/platform-browser';

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

  currentPoint: number = 0;
  accumulativePoint: number = 0;

  currentPointRewards: Reward[];
  accumulativePointRewards: Reward[]; //do not contains already claimed rewards

  currentPointRewardsHistory: RewardHistory[];
  accumulativePointRewardsHistory: RewardHistory[];

  constructor(private dataService: DataService, private sanitizer: DomSanitizer) {}

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
        this.loadPoints();
        this.loadRewards();
        break;
      case Mode.HISTORY:
        this.loadRewardsHistory();
        break;
    
      default:
        this.loadPoints();
        this.loadRewards();
        break;
    }

  }

  loadRewards(){
    console.log(`loading rewards`);
    this.dataService.getRewardsList().pipe(take(1))
    .subscribe((res) => {
      console.log(res);
      this.currentPointRewards = res.current_point_reward;
      this.accumulativePointRewards = res.accumulative_point_reward;
    });
  }

  loadRewardsHistory(){
    console.log(`loading history of rewads`);
    this.dataService.getRewardsHistory().pipe(take(1))
    .subscribe((res) => {
      console.log(res);
      this.currentPointRewardsHistory = res.current_point_exchanged;
      this.accumulativePointRewardsHistory = res.accumulative_point_exchanged;
    });
  }

  loadPoints(){
    console.log(`loading points`);
    this.dataService.getUserPoints().pipe(take(1))
    .subscribe((res) => {
      console.log(res);
      this.currentPoint = res.current_point
     // this.accumulativePoint = res.accumulative_point;
     this.accumulativePoint = 500;
    });
  }

  getMilestonesPointsText(milestonePoints: number, latestMilestone: boolean){
    //if not enough accumulated points, return:  "x points needed" in red; x = reward points - current points
    //if enough current poinst, return: Unlocked
    //if latestMilestone = true && unlocked then  return: "Claim previous first"

    let element = "";

    console.log(`accumated points: ${this.accumulativePoint}, milestone required: ${milestonePoints}`);

    if (this.accumulativePoint >= milestonePoints) {
      if (latestMilestone) {
        element = `<ion-text color="warning"><h3>Redeem previous first</h3></ion-text>`;
      } else {
        element = `<ion-text color="success"><h3>Unlocked</h3></ion-text>`;
      }
    } else if (this.accumulativePoint < milestonePoints) {
      element = `<ion-text color="danger"><h3>Needs ${milestonePoints - this.accumulativePoint} more to unlock </h3></ion-text>`;
    }
  
    return this.sanitizer.bypassSecurityTrustHtml(element);
  }

  getRewardPointsText(points: number){

    

  }

  mileStoneUnlocked(points: number): boolean{
    console.log(`milestone points: ${points} and accumulated points: ${this.accumulativePoint} result: ${this.accumulativePoint >= points}`)
    return  this.accumulativePoint >= points;
  }

}
