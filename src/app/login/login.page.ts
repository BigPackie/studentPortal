import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DataService } from '../services/data.service';
import { LoginData } from '../services/models';
import { LoadingController, ToastController } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { take, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  submitted :boolean = false;

  redirectUrl : string = '/profile'; //dfault redirect after succesfull login
  loginDetails : LoginData = new LoginData();
  

  constructor(private router: Router,
     private route: ActivatedRoute,
     private userService : UserService, 
     private toastController: ToastController,
     private loadingController: LoadingController) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    //if redirected to the login page from a page, after successful login return back
    this.route.queryParams.subscribe(params => {
      if (params && params.returnUrl) {
        this.redirectUrl = params.returnUrl;
      }
    });
  }
  
  async onLogin(form: NgForm) {
    this.submitted = true;

    const loggingIn = await this.loadingController.create({
      message: 'Authenticating...',
    });

    await loggingIn.present();

    // await new Promise(resolve => {
    //   setTimeout(resolve, 2000);
    // });

    this.userService.login(this.loginDetails)
      .pipe(
        take(1),
        catchError((err) => this.loginFailed(err)),
        finalize(() => {
          this.loginDetails.password = "";
          loggingIn.dismiss();
        })
      ).subscribe(async (response) => {
        console.log(response);

        if (response.api_status_code != 202) {
          return await this.loginFailed(response);
        }

        await this.userService.saveLoggedInUser(response.userInfo, response.api_token)
     
        this.router.navigateByUrl(this.redirectUrl, { replaceUrl: true })
      })

  }

  async loginFailed(err: any) {
    console.error(`login failed, reason: ${JSON.stringify(err)}`);
    
    const toast = await this.toastController.create({
      header: 'Login failed.',
      message: err && err.api_message ? err.api_message : "",
      position: 'top',
      duration: 3000
    });

    toast.present();
  }

}
