import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
  } from '@angular/common/http';

import { UserService } from '../services/user.service';
import { Observable, from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs/operators';


@Injectable()
export class AuthRequestInterceptor implements HttpInterceptor {

    constructor(public userService: UserService) { 

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        //if the request requires authorization we will append the token
        if (request.url.includes(environment.rewardServicesUrl)) {
            return from(this.userService.getToken())
                .pipe(
                    switchMap((jwtToken) => {
                        const authReq = request.clone({
                            headers: request.headers.set('Authorization', `Bearer ${jwtToken}`)
                        });

                        return next.handle(authReq);
                    })
                );
        }

        return next.handle(request);
    }
}