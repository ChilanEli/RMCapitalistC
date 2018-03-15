import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http'
import { World, Pallier, Product } from './world';

@Injectable()
export class RestserviceService {

  // on injecte le service http via le constructeur
  constructor(private http: Http) { }

  server = "http://localhost:8080/RMCapitalistS/"
  user = "";

getServer(){
  return this.server;
}

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  getWorld(): Promise<World> {
    return this.http.get(this.server + "webresources/world").toPromise().then(response => response.json()).catch(this.handleError);
  };
}
