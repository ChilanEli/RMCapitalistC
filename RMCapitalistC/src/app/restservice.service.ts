import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http'
import { World, Pallier, Product } from './world';

@Injectable()
export class RestserviceService {

  // on injecte le service http via le constructeur
  constructor(private http: Http) { }

  server = "http://localhost:8080/RMCapitalistS/"
  user = "";

  getServer() {
    return this.server;
  }

  getUser() {
    return this.user;
  }

  setUser(user) {
    this.user = user;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  getWorld(): Promise<World> {
    return this.http.get(this.server + "webresources/world"
      , {headers: this.setHeaders(this.user)}
    ).toPromise().then(response =>
      response.json()).catch(this.handleError);
  };

  private setHeaders(user: string): Headers {
    var headers = new Headers();
    headers.append("X-User", user);
    headers.append("Access-Control-Allow-Origin","true");
    return headers;
  }


  putProduct(product: Product) {
    return this.http.put(this.server + "webresources/product", product, { headers: this.setHeaders(this.user) }).toPromise();
  }

  putUpgrade(upgrade: Pallier) {
    return this.http.put(this.server + "webresources/upgrade", upgrade, { headers: this.setHeaders(this.user) }).toPromise();
  }

  putManager(manager: Pallier) {
    return this.http.put(this.server + "webresources/manager", manager, { headers: this.setHeaders(this.user) }).toPromise();
  }

  putAngel(angel: Pallier) {
    return this.http.put(this.server + "webresources/angelupgrade", angel, { headers: this.setHeaders(this.user) }).toPromise();
  }

  removeWorld() {
    return this.http.delete(this.server + "webresources/world", { headers: this.setHeaders(this.user) });
  }
}
