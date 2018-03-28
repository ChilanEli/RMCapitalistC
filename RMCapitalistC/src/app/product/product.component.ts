import { Component, OnInit, Input, ViewChild } from '@angular/core';
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

  @ViewChild('bar') progressBarItem;

  @Input() set prod(value: Product) {
    this.product = value;
  }

  constructor(private service: RestserviceService) {
    this.path = service.server;
  }

  ngOnInit() {
    this.progressbar = new ProgressBar.Line(this.progressBarItem.nativeElement, { strokeWidth: 50, color: '#00ff00' });
    this.progressbar.animate(1, { duration: this.product.vitesse });
  }

}
