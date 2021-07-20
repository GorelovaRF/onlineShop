import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { Router } from '@angular/router';
import { SharedService } from '../shared/shared.service';
import { Usuario } from '../shared/md.model';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {

  public usuario!: Usuario;
  public cestaLista: any[] = [];
  cartTotal = 0
  constructor(private router: Router,private service:SharedService,private location: Location) { }

  ngOnInit(): void {

    this.service.getUsuario(sessionStorage.getItem('token')!).subscribe(res => {
      this.usuario = res;
      console.log(this.usuario);
      this.service.getUserBasketWithPr(this.usuario.id).subscribe(res => {
         this.cestaLista = res;
        console.log("BASKET: ",this.cestaLista);
        this.cartTotal = 0
        this.cestaLista.forEach(item => {
       this.cartTotal += item.precio
      
       })
       console.log("TOTAL: ",this.cartTotal)

      })
    })

  

  }


  goBack() {
    this.location.back();
  }
}
