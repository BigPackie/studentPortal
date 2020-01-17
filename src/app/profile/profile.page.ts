import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { UserData } from '../services/models';
import { take, catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user$: Promise<UserData>;

  //TODO: check the server, if the user is still logged in, if no, show toast and navigate to login page
  //TODO: other sensitive pages should be guarded by a similar mechanic.
  constructor(private router: Router,
    private userService: UserService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController) {

  }

  ngOnInit() {
    this.loadUserData();
  }


  loadUserData(){
    this.user$ = this.userService.getUserData();
  }

  async logoutFailed(err: any) {
    console.error(`Logout failed, reason: ${JSON.stringify(err)}`);
    
    const toast = await this.toastController.create({
      header: 'Logout failed.',
      message: "You are not completely logged out, reason: " +  (err && err.api_message ? err.api_message : "unknown"),
      position: 'top',
      duration: 3000
    });

    toast.present();
  }

  async logout() {

    const logOut = await this.loadingController.create({
      message: 'Logging out...',
    });

    await logOut.present();

    this.userService.logout()
      .pipe(
        take(1),
        catchError((err) => this.logoutFailed(err)),
        finalize(async () => {
          //even if the server part logout failed, we logout user at the client, so he can relogin.
          logOut.dismiss();
          await this.userService.deleteUser();
     
          this.router.navigateByUrl('/tabs/tab1', {replaceUrl: true});
        })
      ).subscribe(async (response) => {
        console.log(response);

        if (response.api_status_code != 200) {
          return await this.logoutFailed(response);
        }

        
      })
  }

  support() {
    this.router.navigateByUrl('/support');
  }

  async presentLogoutConfirm() {
    const alert = await this.alertController.create({
      header: 'Logout?',
      message: 'Are you <strong>sure</strong> you want to logout?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Logout',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

}
