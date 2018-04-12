import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { Product } from '../world';
import { RestserviceService } from '../restservice.service';

declare var require;
const ProgressBar = require("progressbar.js");

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  path: string;
  product: Product;
  progressbar: any;
  lastupdate: any;
  _isqtmulmax: boolean;
  _qtmulti: any;
  _cout: any;
  money: number;

  @ViewChild('bar') progressBarItem;

  @Input() set prod(value: Product) {
    this.product = value;
  }

  @Input() set qtmulti(value: string) {
    if (value == "MAX") {
      this._isqtmulmax = true;
    }
    else {
      this._isqtmulmax = false;
    }
    this._qtmulti = value;
    if (this._qtmulti && this.product) {
      this.calcMaxCanBuy();
      this._qtmulti = this.calcMaxCanBuy()[0];
      this._cout = this.calcMaxCanBuy()[1];
    }
  }

  @Input()
  set pmoney(value: number) {
    this.money = value;
  }

  @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() notifyAchat: EventEmitter<Product> = new EventEmitter<Product>();

  constructor(private service: RestserviceService) {
    this.path = service.server;
  }

  ngOnInit() {
    this.progressbar = new ProgressBar.Line(this.progressBarItem.nativeElement, { strokeWidth: 50, color: '#00ff00' });
    setInterval(() => {
      this.calcScore();
      this._qtmulti = this.calcMaxCanBuy()[0];
      this._cout = this.calcMaxCanBuy()[1];;
    }, 100);
  }

  produir(): void {
    if (this.product.timeleft == 0 && this.product.quantite > 0) {
      this.progressbar.animate(1, { duration: this.product.vitesse });
      this.product.timeleft = this.product.vitesse;
      this.lastupdate = Date.now();
    }
    if (this._isqtmulmax == true) {
      this._qtmulti = this.calcMaxCanBuy()[0];
    }
  }

  acheter(): void {
    //console.log(this.product.name + " acheter !")
    var qt = this.calcMaxCanBuy()[0];
    this.product.quantite += qt;
    this.notifyAchat.emit(this._cout);
    this.service.putProduct(this.product);

  }

  calcScore(): void {
    if (this.product.timeleft != 0) {
      this.product.timeleft -= Date.now() - this.lastupdate;
      this.lastupdate = Date.now();
      if (this.product.timeleft <= 0) {
        this.product.timeleft = 0;
        this.progressbar.set(0);
        this.notifyProduction.emit(this.product);
      }
    }
    if (this.product.managerUnlocked == true && this.product.timeleft == 0 && this.product.quantite > 0) {
      this.progressbar.animate(1, { duration: this.product.vitesse });
      this.product.timeleft = this.product.vitesse;
      this.lastupdate = Date.now();
    }
    this._qtmulti = this.calcMaxCanBuy()[0];
    this._cout = this.calcMaxCanBuy()[1];
  }

  calcMaxCanBuy(): any {
    //console.log("CalcMaxCanBuy")
    var PU = this.product.cout;
    var PM = this.money;
    var QTE = this.product.quantite;
    var TAUX = this.product.croissance
    if (this._qtmulti == "MAX") {
      this._isqtmulmax = true;
      var cpt = 0;
      var PF = 0;
      do {
        cpt++;
        PF = PU * Math.pow(TAUX, QTE) * ((1 - Math.pow(TAUX, cpt)) / (1 - TAUX));
      } while (PF < PM);
      if (cpt > 1) {
        cpt--;
        PF = PU * Math.pow(TAUX, QTE) * ((1 - Math.pow(TAUX, cpt)) / (1 - TAUX));
      }
      return [cpt, PF];
    } else {
      this._isqtmulmax = false;
      PF = PU * Math.pow(TAUX, QTE) * ((1 - Math.pow(TAUX, this._qtmulti)) / (1 - TAUX));
      return [this._qtmulti, PF];
    }
  }
}