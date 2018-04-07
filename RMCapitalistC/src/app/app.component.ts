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
  badgeCashUpgrades: string;
  username: string;

  constructor(private service: RestserviceService, private toasterService: ToasterService) {
    this.server = service.getServer();
    this.username = localStorage.getItem("username");
    if (this.username == null || this.username == "") {
      this.newUser();
    }    
    this.service.getWorld().then(data => {
      this.world = data;
    });
    this.devise = "img/Schmeckles.png";
    this.qtmulti = 1;
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
  }

  hireManager(manager): void {
    this.world.money -= manager.seuil;
    manager.unlocked = true;
    this.world.products.product[manager.idcible - 1].managerUnlocked = true;
    this.checkBadges();
    this.toasterService.pop('success', 'Manager hired ! ', manager.name);
  }

  checkBadges(): void {
    this.badgeManager = "";
    this.badgeUnlock = "";
    this.badgeCashUpgrades = "";
    var m = this.world.money;
    for (let mPallier of this.world.managers.pallier) {
      if (m >= mPallier.seuil && !mPallier.unlocked) {
        this.badgeManager = "NEW";
      }
    }
    for (let uPallier of this.world.allunlocks.pallier) {
      if (m >= uPallier.seuil && !uPallier.unlocked) {
        this.badgeUnlock = "NEW";
      }
    }
    for (let aPallier of this.world.allunlocks.pallier) {
      if (m >= aPallier.seuil && !aPallier.unlocked) {
        this.badgeCashUpgrades = "NEW";
      }
    }
  }

  onUsernameChanged(user): void {
    this.username = user;
    // if (this.username == null || this.username == "") {
    //   this.newUser();
    // }
    if (this.username == null || this.username == "") {
       this.username = "Rick C-137";
     }
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