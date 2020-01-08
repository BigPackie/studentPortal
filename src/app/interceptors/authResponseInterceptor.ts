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

        //if not a response from a secured request, just let it pass
        if(!request.url.includes(environment.rewardServicesUrl)){
            return next.handle(request);
        }
        //TODO: properly handle error, redirect user if authorization error occurs
        //otherwise tap into it
        return next.handle(request).pipe(
            //filter here seemed to complete stop the response, but why?
            tap(
                (event) => {
                    // There may be other events besides the response.
                    if (event instanceof HttpResponse){
                        console.log("Intercepting successful secured response from server ");
                    }
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