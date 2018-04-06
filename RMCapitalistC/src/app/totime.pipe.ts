import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'totime'
})
export class TotimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let ret: string;
    let s: number;
    let m: number;
    let h: number
    let retH: string;
    let retM: string;
    let retS: string;
    s = (value / 1000);
    m = (s / 60);
    h = (m / 60);
    s = s % 60;
    m = m % 60;
    if (h <= 9) {
      retH = "0" + Math.floor(h);
    }
    else {
      retH = "" + Math.floor(h);
    }
    if (m <= 9) {
      retM = "0" + Math.floor(m);
    }
    else {
      retM = "" + Math.floor(m);
    }
    if (s <= 9) {
      retS = "0" + Math.round(s);
    }
    else {
      retS = "" + Math.round(s);
    }
    ret = retH + " : " + retM + " : " + retS;
    return ret;
  }

}
