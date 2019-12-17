import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { NgForm } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  username: Promise<string>;

  //TODO: check the server, if the user is still logged in, if no, show toast and navigate to login page
  //TODO: other sensitive pages should be guarded by a similar mechanic.
  constructor(private router: Router,
    private dataService: DataService,
    private alertController: AlertController) {

  }

  ngOnInit() {
    this.loadUserData();
  }


  //TODO: maybe get always from the server and not locally cached?
  loadUserData(){
    this.username = this.dataService.getUsername();
  }

  logout() {
    this.dataService.logout().then(() => this.router.navigateByUrl('/tabs/tab1', {replaceUrl: true}));
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
