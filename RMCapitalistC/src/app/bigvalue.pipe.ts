import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bigvalue'
})
export class BigvaluePipe implements PipeTransform {

  transform(valeur: number, args?: any): string {
    let res: string;
    if (valeur < 1000)
      res = valeur.toFixed(2);
    else if (valeur < 1000000)
      res = (valeur / 1000).toFixed(2) + " Millier";
    else if (valeur < 1000000000)
      res = (valeur / 1000000).toFixed(2) + " Million";
    else if (valeur < 1000000000000)
      res = (valeur / 1000000000).toFixed(2) + " Milliard";
    else if (valeur < 1000000000000000)
      res = (valeur / 1000000000000).toFixed(2) + " Billion";
    else if (valeur < 1000000000000000000)
      res = (valeur / 1000000000000000).toFixed(2) + " Billiard";
    else if (valeur < 1000000000000000000000)
      res = (valeur / 1000000000000000000).toFixed(2) + "	Trillion";
    else if (valeur >= 1000000000000000000) {
      res = valeur.toPrecision(4);
      res = res.replace(/e\+(.*)/, " 10<sup>$1</sup>");
    }
    return res;
  }
}