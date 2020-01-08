import { Component, ChangeDetectorRef } from '@angular/core';
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

  milestoneFirst: Reward;

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

      if(res.accumulative_point_reward && res.accumulative_point_reward[0]) {
        this.milestoneFirst = res.accumulative_point_reward[0];
      }
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
      this.currentPoint = res.current_point;
     // this.accumulativePoint = res.accumulative_point;
      this.accumulativePoint = 500;
    });
  }

  getMilestoneStatusIconName(reward: Reward){
    
    let icon = "lock";

    if(this.isMileStoneUnlocked(reward.point) && reward.redemptionCode){
      icon = "md-arrow-dropleft";
    } else if (this.isMileStoneUnlocked(reward.point) && !reward.redemptionCode) {
      icon = "unlock"
    }

    return icon;
  }

  getMilestoneRedemptionCode(milestone: Reward) {

    if(milestone.id == null || milestone.id == undefined) {
      console.error(`Reward has no id. Cannot redeem.`);
      return;
    }

    if(this.isMileStoneUnlocked(milestone.point) && !milestone.redemptionCode){
      this.dataService.getRewardExchangeToken(milestone.id).pipe(take(1))
      .subscribe((res) => {
        milestone.redemptionCode = res.exchange_token;
        console.log(`Redemption code ${milestone.redemptionCode} set for reward ${milestone.id}`)
      });
     
    }
  }

  getMilestonesPointsText(milestonePoints: number, latestMilestone: boolean){
    //if not enough accumulated points, return:  "x points needed" in red; x = reward points - current points
    //if enough current poinst, return: Unlocked
    //if latestMilestone = true && unlocked then  return: "Claim previous first"

    let element = "";

   // console.log(`accumated points: ${this.accumulativePoint}, milestone required: ${milestonePoints}`);

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

  isMileStoneUnlocked(points: number): boolean{
   // console.log(`milestone points: ${points} and accumulated points: ${this.accumulativePoint} result: ${this.accumulativePoint >= points}`)
    return  this.accumulativePoint >= points;
  }

}
