import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DataService } from '../services/data.service';
import { LoginData } from '../services/models';
import { LoadingController } from '@ionic/angular';

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
     private dataService : DataService, 
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

    if (form.valid) {

      await new Promise(resolve => {
        setTimeout(resolve, 2000);
      });

      this.dataService.login(this.loginDetails.username)
      .then(() => this.router.navigateByUrl(this.redirectUrl, { replaceUrl: true })
      .finally(() => loggingIn.dismiss()));
    }
  }

}
