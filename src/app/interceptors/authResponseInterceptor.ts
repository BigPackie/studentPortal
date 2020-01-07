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
import { switchMap, filter, tap, catchError } from 'rxjs/operators';


@Injectable()
export class AuthResponseInterceptor implements HttpInterceptor {

    constructor(public userService: UserService) { 

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).pipe(
            filter(event => event instanceof HttpResponse), // proceed when there is a response; ignore other events
            filter(event => request.url.includes(environment.rewardServicesUrl)),
            tap(
                (event: HttpResponse<any>) => {
                    console.log("Intercepting successful secured response from server ");
                },
                // Operation failed; error is an HttpErrorResponse
                (error) => {
                    console.error(`Secured request failed. Probably authorization issue: ${error}`)
                    return event;
                }
            )
        )
    }
}