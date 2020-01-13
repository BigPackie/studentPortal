import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
  } from '@angular/common/http';

import { UserService } from '../services/user.service';
import { Observable, from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { switchMap, filter, tap, catchError, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';


@Injectable()
export class AuthResponseInterceptor implements HttpInterceptor {

    constructor(private router: Router, private userService: UserService, private toastController: ToastController) { 

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        //if not a response from a secured request, just let it pass
        if(!request.url.includes(environment.rewardServicesUrl)){
            return next.handle(request);
        }
        //TODO: properly handle error, redirect user if authorization error occurs
        //otherwise tap into it
        return next.handle(request).pipe(
            //filter here seemed to complete stop the response, but why?
            tap(
                async (event) => {
                    // There may be other events besides the response.
                    if (event instanceof HttpResponse){
                        console.log(`Intercepting successful secured response from server`);
                        
                        if (event.body.success == false && event.body.api_status_code == 401) {
                            console.error("Not authorized!");
                            //authorization failed, 
                            const toast = await this.toastController.create({
                                header: 'Not Logged in.',
                                message: 'Please log in.',
                                position: 'top',
                                duration: 3000
                              });
                            
                            await this.userService.deleteUser();
                            await toast.present();
                            this.router.navigateByUrl('/login', { replaceUrl: true });                 
                        }
                    
                    }
                },
                // Operation failed; error is an HttpErrorResponse
                (error) => {
                    console.error(`Secured request failed: ${error}`)
                    return event;
                }
            )
        )
    }
}