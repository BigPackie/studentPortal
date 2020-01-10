import { Component, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../services/data.service';
import { take, tap, finalize } from 'rxjs/operators';
import { Reward, RewardHistory, RewardStatus } from '../services/models';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, forkJoin } from 'rxjs';
import { IonItemSliding } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

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

  //always only the first milestone can be redeemed. If redeemed, needs to fetch data again, and second becomes first
  milestoneFirst: Reward;
  milestoneSecond: Reward;

  currentPointRewards: Reward[];
  accumulativePointRewards: Reward[]; //do not contains already claimed rewards

  currentPointRewardsHistory: RewardHistory[];
  accumulativePointRewardsHistory: RewardHistory[];

  constructor(private dataService: DataService, private sanitizer: DomSanitizer, private translate: TranslateService) {}

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

          if (this.accumulativePointRewards && this.accumulativePointRewards[1]) {
            this.milestoneSecond = this.accumulativePointRewards[1];
            this.milestoneSecond.status = this.isMileStoneUnlocked(this.milestoneSecond.point) ? RewardStatus.UNLOCKED : RewardStatus.LOCKED;
          }

          this.currentPointRewards.forEach(reward => {
           reward.status =  this.isRewardUnlocked(reward.point) ? RewardStatus.UNLOCKED : RewardStatus.LOCKED;
          });
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
        //this.currentPoint = res.current_point;
        this.currentPoint = 40;
        // this.accumulativePoint = res.accumulative_point;
        this.accumulativePoint = 525;
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

  getRewardStatusIconName(reward: Reward): string{
    if(reward.status == RewardStatus.LOCKED){
      return "lock";
    } else {
      return "md-arrow-dropleft";
    }
  }

  async getRewardRedemptionCode(reward: Reward, slidingItem: IonItemSliding) {

    console.log("triggered swipe event");

    if (reward.id == null || reward.id == undefined) {
      console.error(`Reward has no id. Cannot redeem.`);
      return;
    }

    if( reward.status == RewardStatus.REDEEMING){
      console.warn(`Already redeeming code, wait a moment.`);
      return;
    }

    if (reward.status == RewardStatus.UNLOCKED) {
      reward.status = RewardStatus.REDEEMING;
      await this.refreshSlider(slidingItem);
      this.dataService.getRewardExchangeToken(reward.id)
        .pipe(
          take(1),
        )
        .subscribe((res) => {
          reward.redemptionCode = res.exchange_token;
          reward.status = RewardStatus.REDEEMED;
          this.refreshSlider(slidingItem);
          console.log(`Redemption code ${reward.redemptionCode} set for reward ${reward.id}`)
        },
        error => {reward.status = RewardStatus.UNLOCKED;});

    }
  }

  //TODO: maybe redo in the template with ngIf directives
  getMilestonesPointsText(milestone: Reward, latestMilestone: boolean){
    //if not enough accumulated points, return:  "x points needed" in red; x = reward points - current points
    //if enough current poinst, return: Unlocked
    //if latestMilestone = true && unlocked then  return: "Claim previous first"

    let element = "";

   // console.log(`accumated points: ${this.accumulativePoint}, milestone required: ${milestonePoints}`);

    if (milestone.status == RewardStatus.UNLOCKED) {
      if (latestMilestone) {
        this.translate.get('REWARD.REDEEM_FIRST').pipe(take(1)).subscribe((res: string) => {
          element = `<ion-text color="warning"><h3>${res}</h3></ion-text>`;
        });
      } else {
        this.translate.get('REWARD.UNLOCKED').pipe(take(1)).subscribe((res: string) => {
          element = `<ion-text color="success"><h3>${res}</h3></ion-text>`;
        });
      }
    } else if (milestone.status == RewardStatus.REDEEMED) {
      this.translate.get('REWARD.CODE_RECEIVED').pipe(take(1)).subscribe((res: string) => {
        element = `<ion-text color="success"><h3>${res}</h3></ion-text>`;
      });
    } else if (milestone.status == RewardStatus.LOCKED) {
      this.translate.get('REWARD.POINTS_NEEDED').pipe(take(1)).subscribe((res: string) => {
        element = `<ion-text color="danger"><h3>${milestone.point - this.accumulativePoint} ${res}</h3></ion-text>`;
      });

    }
  
    return this.sanitizer.bypassSecurityTrustHtml(element);
  }

  getMissingRewardPoints(rewardPoints: number) : number{
    return rewardPoints - this.currentPoint;
  }

  isMileStoneUnlocked(points: number): boolean{
   // console.log(`milestone points: ${points} and accumulated points: ${this.accumulativePoint} result: ${this.accumulativePoint >= points}`)
    return  this.accumulativePoint >= points;
  }

  isRewardUnlocked(points: number): boolean{
    return this.currentPoint >= points;
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
