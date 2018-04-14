import { Component } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';
import { ToasterService } from 'angular5-toaster';
import { element, by } from 'protractor';
import { SSL_OP_NETSCAPE_CHALLENGE_BUG } from 'constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string;
  world: World = new World();
  server: string;
  backangels1: string;
  backangels2: string;
  devise: string;
  qtmulti: any;
  allProducts: Product[]
  badgeManager: string;
  badgeUnlock: string;
  badgeCashUpgrades: string;
  username: string;
  song: string;

  constructor(private service: RestserviceService, private toasterService: ToasterService) {
    this.server = service.getServer();
    this.username = localStorage.getItem("username");
    this.service.setUser(this.username);
    this.song = "music/theme.mp3";
    if (this.username == null || this.username == "") {
      this.newUser();
    }
    this.service.getWorld().then(data => {
      this.world = data;
    });
    this.devise = "img/Schmeckles.png";
    this.backangels1 = "img/birdangel.png";
    this.backangels2 = "img/birdangel1.png";
    this.qtmulti = 1;
  }

  setMulti(): void {
    if (this.qtmulti == 1) { this.qtmulti = 10; }
    else if (this.qtmulti == 10) { this.qtmulti = 100; }
    else if (this.qtmulti == 100) { this.qtmulti = "MAX"; }
    else if (this.qtmulti == "MAX") { this.qtmulti = 1; }
  }

  onProductionDone(p: Product): void {
    this.world.money += (1 + (this.world.activeangels * this.world.angelbonus)) * (p.revenu * p.quantite);
    this.world.score += (1 + (this.world.activeangels * this.world.angelbonus)) * (p.revenu * p.quantite);
    this.world.totalangels = Math.round(150 * Math.sqrt(this.world.score / Math.pow(10,15)) - this.world.totalangels);
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
    this.toasterService.pop('success', 'Manager Hired ! ', manager.name);
    this.service.putManager(manager);
  }

  checkBadges(): void {
    this.badgeManager = "";
    this.badgeUnlock = "";
    this.badgeCashUpgrades = "";
    var m = this.world.money;
    //var qteMin = this.world.allunlocks.pallier[0].seuil;
    var qteMin = 999999999999999999999999999999999999;

    for (let mPallier of this.world.managers.pallier) {
      if (m >= mPallier.seuil && !mPallier.unlocked) {
        this.badgeManager = "NEW";
      }
    }

    for (let uPallier of this.world.upgrades.pallier) {
      if (m >= uPallier.seuil && !uPallier.unlocked) {
        this.badgeCashUpgrades = "NEW";
      }
    }

    for (let p of this.world.products.product) {
      if (qteMin > p.quantite)
        qteMin = p.quantite;
      for (let pPallier of p.palliers.pallier) {
        if (pPallier.seuil <= p.quantite && !pPallier.unlocked) {
          this.badgeUnlock = "NEW";
          this.activePallierId(pPallier, p);
        }
      }
    }

    for (let cuPallier of this.world.allunlocks.pallier) {
      if (cuPallier.seuil <= qteMin && !cuPallier.unlocked) {
        this.badgeUnlock = "NEW";
        this.activePallier(cuPallier);
      }
    }
  }

  onUsernameChanged(user): void {
    this.username = user;
    if (this.username == null || this.username == "") {
      this.newUser();
    }
    localStorage.setItem("username", this.username);
    this.service.user = this.username;
    this.toasterService.pop('info', "Welcome !", this.username);
    this.service.getWorld();

    setTimeout(function () { window.location.reload(); }, 2000);


  }

  newUser(): void {
    var possiblepseudo = ["Rick ", "Morty ", "Summer ", "Beth ", "Jerry "];
    var pseudo = possiblepseudo[Math.floor(Math.random() * possiblepseudo.length)];
    var possibleid1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var id1 = possibleid1.charAt(Math.floor(Math.random() * possibleid1.length))
    var id2 = Math.floor(Math.random() * 10000);
    this.username = pseudo + id1 + "-" + id2;
  }

  activeUpgrade(u): void {
    u.unlocked = true;
    this.world.money -= u.seuil;
    this.world.products.product[u.idcible - 1].revenu *= u.ratio;
    this.toasterService.pop('success', "Upgrade Activate !", u.name);
    this.service.putUpgrade(u);
    this.checkBadges();
  }

  activePallierId(p, i): void {
    p.unlocked = true;
    //console.log(p.typeratio.equals("gain"));
    // if (p.typeratio.equals("gain")) {
    //   this.world.products.product[p.idcible-1].revenu *= p.ratio;
    // }
    // else if (p.typeratio.equals("vitesse")) {
    //     this.world.products.product[p.idcible-1].vitesse = Math.floor(this.world.products.product[p.idcible-1].vitesse / p.ratio);
    //     this.world.products.product[p.idcible-1].timeleft = Math.floor(this.world.products.product[p.idcible-1].timeleft / p.ratio);
    // }
    switch (p.typeratio) {
      case "GAIN":
        this.world.products.product[p.idcible - 1].revenu *= p.ratio;
        break;
      case "VITESSE":
        this.world.products.product[p.idcible - 1].vitesse = Math.floor(this.world.products.product[p.idcible - 1].vitesse / p.ratio);
        this.world.products.product[p.idcible - 1].timeleft = Math.floor(this.world.products.product[p.idcible - 1].timeleft / p.ratio);
        break;
    }
    this.toasterService.pop('success', "Pallier Reach !", p.name);
  }


  activePallier(p): void {
    p.unlocked = true;
    // if (p.typeratio.equals("gain")) {
    //   this.world.products.product.forEach(pr => {
    //     pr.revenu *= p.ratio;
    //   });
    // }
    // else if (p.typeratio.equals("vitesse")) {
    //   this.world.products.product.forEach(pr => {
    //     pr.vitesse = Math.floor(pr.vitesse / p.ratio);
    //     pr.timeleft = Math.floor(pr.timeleft / p.ratio);
    //   });
    // }
    switch (p.typeratio) {
      case "GAIN":
        this.world.products.product.forEach(pr => {
          pr.revenu *= p.ratio;
        });
        break;
      case "VITESSE":
        this.world.products.product.forEach(pr => {
          pr.vitesse = Math.floor(pr.vitesse / p.ratio);
          pr.timeleft = Math.floor(pr.timeleft / p.ratio);
        });
        break;
    }
    this.toasterService.pop('success', "Pallier Reach !", p.name);
  }

  tryAgain(): void {
    this.service.removeWorld();
    window.location.reload();
  }

  buyAngels(angel): void {
    this.world.money -= angel.seuil;
    switch (angel.typeratio) {
      case "GAIN":
        this.world.products.product.forEach(pr => {
          pr.revenu *= angel.ratio;
        });
        break;
      case "VITESSE":
        this.world.products.product.forEach(pr => {
          pr.vitesse = Math.floor(pr.vitesse / angel.ratio);
          pr.timeleft = Math.floor(pr.timeleft / angel.ratio);
        });
        break;
      case "ANGE":
        this.world.angelbonus *= angel.ratio;
        break;
    }
    this.checkBadges();
    this.toasterService.pop('success', 'Angel Bought ! ', angel.name);
    this.service.putAngel(angel);
  }
}