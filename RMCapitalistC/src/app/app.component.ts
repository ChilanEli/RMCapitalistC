import { Component } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string;
  world: World = new World();
  server: string;
  devise: string;
  allProducts : Product[]

  constructor(private service: RestserviceService) {
    this.server = service.getServer();
    this.service.getWorld().then(
      data => {
        this.world = data;
        console.log(this.world);
        this.allProducts = this.world.products.product;
      });
    this.devise = "img/Schmeckles.png";
  }

}


