import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Injectable } from '@angular/core';
import { DataService } from './services/data.service';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})

export class LoggedInAuthGuard implements CanActivate {

    constructor(private router: Router, private dataService: DataService, private toastController: ToastController) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (await this.dataService.isLoggedIn()) {
            return true;
        } 

        //not logged in, redirect to login with a return Url, after successfull login return to the original page
        const toast = await this.toastController.create({
            header: 'Not Logged in.',
            message: 'To access the page, you must be logged in.',
            position: 'top',
            duration: 3000
          });

        toast.present().then(() => this.router.navigate(['/login'], {queryParams: { returnUrl: state.url }}));

        return  false;
    }

}