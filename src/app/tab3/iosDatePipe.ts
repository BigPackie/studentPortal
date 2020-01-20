import { Pipe, PipeTransform } from '@angular/core';
/*
 * Changes the date string received by the server to a one accepted by safari WebView.
 * Usage:
 *   dateString | iosDateFormat
*/
@Pipe({name: 'iosDateFormat'})
export class IosDateStringFormatPipe implements PipeTransform {
  transform(value: string): string {

    if(value){
        return value.replace(/-/g, "/");
    }

    return value;
  }
}