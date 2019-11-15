import { Observable, of, throwError } from "rxjs";
import { delay, mergeMap, retryWhen } from "rxjs/operators";

const getErrorMessage = (maxRetry: number) => `Tried to load resource over XHR for ${maxRetry} times without success. Giving up.`;

const DEFAULT_MAX_RETRIES = 2;
const DEFAULT_BACKOFF_TIME_INCREMENT = 1000;

export function smartRetry(maxRetry = DEFAULT_MAX_RETRIES, backoffTimeIncrement = DEFAULT_BACKOFF_TIME_INCREMENT){
    let retries = 0;

    return (src : Observable<any>) => src.pipe(
        retryWhen((errors: Observable<any>) => errors.pipe(
            mergeMap(error => {
                retries++;
                if(retries <= maxRetry){
                    const backoffTime = retries * backoffTimeIncrement;
                    console.log(`backofftime ${backoffTime}`)
                    return of(error).pipe(delay(backoffTime));
                }

                return throwError(getErrorMessage(maxRetry));
            })
        ))
    )
}