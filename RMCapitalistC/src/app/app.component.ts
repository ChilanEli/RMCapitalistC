import { Component } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';
import { ToasterService } from 'angular5-toaster';
import { element, by } from 'protractor';

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
  qtmulti: any;
  allProducts: Product[]
  badgeManager: string;
  badgeUnlock: string;
  username: string;

  constructor(private service: RestserviceService, private toasterService: ToasterService) {
    this.server = service.getServer();
    this.service.getWorld().then(data => {
      this.world = data;
    });
    this.devise = "img/Schmeckles.png";
    this.qtmulti = 1;
    this.username = localStorage.getItem("username");
    if (this.username == null || this.username == "") {
      this.newUser();
    }
  }

  setMulti(): void {
    if (this.qtmulti == 1) { this.qtmulti = 10; }
    else if (this.qtmulti == 10) { this.qtmulti = 100; }
    else if (this.qtmulti == 100) { this.qtmulti = "MAX"; }
    else if (this.qtmulti == "MAX") { this.qtmulti = 1; }
  }

  onProductionDone(p: Product): void {
    this.world.money += (p.revenu * p.quantite);
    this.world.score += (p.revenu * p.quantite);
    this.checkBadges();
  }

  onBuy(p): void {
    this.world.money -= p;
    this.checkBadges();
    //this.notify();
  }

  hireManager(m): void {
    this.world.money -= m.seuil;
    m.unlocked = true;
    this.world.products.product[m.idcible - 1].managerUnlocked = true;
    this.checkBadges();
    this.toasterService.pop('success', 'Manager hired ! ', m.name);
  }

  checkBadges(): void {
    this.badgeManager = "";
    this.badgeUnlock = "";
    for (let mPallier of this.world.managers.pallier) {
      if (this.world.money >= mPallier.seuil && !mPallier.unlocked) {
        this.badgeManager = "NEW";
      }
    }
    for (let uPallier of this.world.upgrades.pallier) {
      if (this.world.money >= uPallier.seuil && !uPallier.unlocked) {
        this.badgeUnlock = "NEW";
      }
    }
  }

  onUsernameChanged(user): void {
    this.username = user;
    localStorage.setItem("username", this.username);
    this.service.user = this.username;
    this.service.getWorld();
  }

  newUser(): void {
    var possiblepseudo = ["Rick ", "Morty ", "Summer ", "Beth ", "Jerry "];
    var pseudo = possiblepseudo[Math.floor(Math.random() * possiblepseudo.length)];
    var possibleid1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var id1 = possibleid1.charAt(Math.floor(Math.random() * possibleid1.length))
    var id2 = Math.floor(Math.random() * 10000);
    this.username = pseudo + id1 + "-" + id2;
  }
}