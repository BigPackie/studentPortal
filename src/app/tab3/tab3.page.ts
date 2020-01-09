import { Component, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../services/data.service';
import { take, tap, finalize } from 'rxjs/operators';
import { Reward, RewardHistory, RewardStatus } from '../services/models';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, forkJoin } from 'rxjs';
import { IonItemSliding } from '@ionic/angular';

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

  RewardStatus = RewardStatus; //to make the enum work in the template

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
        this.loadRewardsData();
        break;
      case Mode.HISTORY:
        this.loadRewardsHistory();
        break;
    
      default:
        this.loadRewardsData();
        break;
    }

  }

  loadRewardsData() {
    forkJoin([
      this.loadRewards(),
      this.loadPoints()
    ]
    ).subscribe(
        (data) => {
          console.log(`Getting reward list and user point finished successfully`);
          if (this.accumulativePointRewards && this.accumulativePointRewards[0]) {
            this.milestoneFirst = this.accumulativePointRewards[0];
            this.milestoneFirst.status = this.isMileStoneUnlocked(this.milestoneFirst.point) ? RewardStatus.UNLOCKED : RewardStatus.LOCKED;
          }
        },
        (err) => {
          console.error(`Retrieving reward list or user points failed`);
        }
      )
  }

  private loadRewards() {
    console.log(`loading rewards`);
    return this.dataService.getRewardsList().pipe(
      take(1),
      tap((res) => {
        console.log(res);
        this.currentPointRewards = res.current_point_reward;
        this.accumulativePointRewards = res.accumulative_point_reward;
      })
    )
  }

  private loadPoints() {
    console.log(`loading points`);
    return this.dataService.getUserPoints().pipe(
      take(1),
      tap((res) => {
        console.log(res);
        this.currentPoint = res.current_point;
        // this.accumulativePoint = res.accumulative_point;
        this.accumulativePoint = 500;
      })
    )
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

  getMilestoneStatusIconName(reward: Reward): string{

    console.log(`Milestone: ${JSON.stringify(this.milestoneFirst)}`);

    if(reward.status == RewardStatus.LOCKED){
      return "lock";
    } else {
      return "md-arrow-dropleft";
    }
  }

  async getMilestoneRedemptionCode(milestone: Reward, slidingItem: IonItemSliding) {

    console.log("triggered swipe event");

    if (milestone.id == null || milestone.id == undefined) {
      console.error(`Reward has no id. Cannot redeem.`);
      return;
    }

    if( milestone.status == RewardStatus.REDEEMING){
      console.warn(`Already redeeming code, wait a moment.`);
      return;
    }

    if (milestone.status == RewardStatus.UNLOCKED) {
      milestone.status = RewardStatus.REDEEMING;
      await this.refreshSlider(slidingItem);
      this.dataService.getRewardExchangeToken(milestone.id)
        .pipe(
          take(1),
        )
        .subscribe((res) => {
          milestone.redemptionCode = res.exchange_token;
          milestone.status = RewardStatus.REDEEMED;
          this.refreshSlider(slidingItem);
          console.log(`Redemption code ${milestone.redemptionCode} set for reward ${milestone.id}`)
        },
        error => {milestone.status = RewardStatus.UNLOCKED;});

    }
  }

  getMilestonesPointsText(milestone: Reward, latestMilestone: boolean){
    //if not enough accumulated points, return:  "x points needed" in red; x = reward points - current points
    //if enough current poinst, return: Unlocked
    //if latestMilestone = true && unlocked then  return: "Claim previous first"

    let element = "";

   // console.log(`accumated points: ${this.accumulativePoint}, milestone required: ${milestonePoints}`);

    if ( milestone.status == RewardStatus.UNLOCKED ) {
      if (latestMilestone) {
        element = `<ion-text color="warning"><h3>Redeem previous first</h3></ion-text>`;
      } else {
        element = `<ion-text color="success"><h3>Unlocked</h3></ion-text>`;
      }
    } else if ( milestone.status == RewardStatus.LOCKED ) {
      element = `<ion-text color="danger"><h3>Needs ${milestone.point - this.accumulativePoint} more to unlock </h3></ion-text>`;
    }
  
    return this.sanitizer.bypassSecurityTrustHtml(element);
  }


  getRewardPointsText(points: number){

  }

  isMileStoneUnlocked(points: number): boolean{
   // console.log(`milestone points: ${points} and accumulated points: ${this.accumulativePoint} result: ${this.accumulativePoint >= points}`)
    return  this.accumulativePoint >= points;
  }

  /**
   * If the <ion-item-sliding> is open, and you change the with of a the <ion-item-option> (for example make it smaller)
   * then the amount of opennes is not adjusted. This method adjusts the openned of the sliding item relative to the new width of it's option
   * 
   * @param slidingItem <ion-item-sliding> element marked with "#slidingCase"
   */
  private refreshSlider(slidingItem: IonItemSliding): Promise<any>{
    return slidingItem.close().finally(() =>  slidingItem.open("end"));
  }

}
