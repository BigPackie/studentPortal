import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DataService } from '../services/data.service';
import { LoginData } from '../services/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  submitted :boolean = false;

  loginDetails : LoginData = new LoginData();
  

  constructor(private router: Router,private dataService : DataService) { }

  ngOnInit() {
  }

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.dataService.login(this.loginDetails.username).then(() => this.router.navigateByUrl('/profile'));
    }
  }

}
