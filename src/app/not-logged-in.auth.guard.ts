import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Injectable } from '@angular/core';
import { toastController } from '@ionic/core';
import { ToastController } from '@ionic/angular';
import { UserService } from './services/user.service';

@Injectable({
    providedIn: 'root'
})

export class NotLoggedInAuthGuard implements CanActivate {

    constructor(private router: Router, private userService: UserService, private toastController: ToastController) { }

    async canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot) {
        if (await this.userService.isLoggedIn()) {
            const toast = await this.toastController.create({
                header: 'Not possible',
                message: 'You are already logged in. <strong>Log out first!</strong>',
                position: 'top',
                duration: 3000
              });
    
            toast.present().then(() => this.router.navigate(['/profile']));
            
            return false;
        } 

        return true;
    }

}