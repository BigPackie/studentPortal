import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { smartRetry } from './smartRetry';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class Api {
  
  //private baseUrl: string = 'assets';

  private baseUrl: string = environment.newsServicesUrl;

  constructor(public http: HttpClient) {

  }
  
  get<T>(baseUrl: string = this.baseUrl, resource: string, params?: any, reqOpts?: any): Observable<any> {
   // debugger;
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }

    return this.http.get<T>(baseUrl + '/' + resource, reqOpts).pipe(
      smartRetry(),
      catchError(error => {
        console.error(error);
        //TODO error handling
        return EMPTY;
      })
    );
  }

  post(baseUrl: string = this.baseUrl, resource: string, body: any, reqOpts?: any) {
    return this.http.post(baseUrl + '/' + resource, body, reqOpts);
  }

  put(baseUrl: string = this.baseUrl, resource: string, body: any, reqOpts?: any) {
    return this.http.put(baseUrl + '/' + resource, body, reqOpts);
  }

  delete(baseUrl: string = this.baseUrl, resource: string, reqOpts?: any) {
    return this.http.delete(baseUrl + '/' + resource, reqOpts);
  }

  patch(baseUrl: string = this.baseUrl, resource: string, body: any, reqOpts?: any) {
    return this.http.patch(baseUrl + '/' + resource, body, reqOpts);
  }
}
