import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Banco, Cesta, Electrodomestico, Usuario } from '../shared/md.model';
import { SharedService } from '../shared/shared.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-cesta',
  templateUrl: './cesta.component.html',
  styleUrls: ['./cesta.component.css']
})
export class CestaComponent implements OnInit {
  bankForm!: FormGroup;
  cartTotal = 0
  public token2!: string;
  public cuentaBancaria!: Banco;
  public errorMessage!: string;
  public usuario!: Usuario;
  public cestaLista: any[] = [];
  


  constructor(private router: Router,private service:SharedService,private fb:FormBuilder,private location: Location) { 

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

  ngOnInit() {

    this.bankForm = this.fb.group({
      cardHolder: ['',Validators.compose([
        Validators.required])],
      cardNumber: ['',Validators.compose([
          Validators.required])],
      exprDate: ['',Validators.compose([
            Validators.required, Validators.pattern('[0-9]{2}/[0-9]{2}')])],
      cvv: ['',Validators.compose([
              Validators.required])],
    }
    );
  }

  get f() { return this.bankForm.controls; }


  pagar() {
this.service.checkBankData(this.f.cardHolder.value,this.f.cardNumber.value,this.f.exprDate.value,this.f.cvv.value).subscribe(tok => {
  this.token2 = tok;
  sessionStorage.setItem('token2',this.token2.toString())
  this.service.getCount(this.token2).subscribe(
    (cuentaBancaria:Banco) => {
      this.cuentaBancaria = cuentaBancaria;
      var sum = {
        id: this.cuentaBancaria.id,
        saldo: this.cuentaBancaria.saldo! - this.cartTotal
      }
      this.service.updateAmount(this.token2,sum).subscribe(res => {
        console.log("UPDATE SALDO: ",res)
      })

      sessionStorage.setItem('banco',JSON.stringify(this.cuentaBancaria))
     // localStorage.setItem('usuario',this.usuario.toString());
      console.log(this.cuentaBancaria)
      this.router.navigate(['/pago']);
      
    }
    
  )
},(error) =>{
  this.errorMessage = "Datos bancarios introducidos incorrectos"
  throw error;
}
)

  }

  goBack() {
    this.location.back();
  }


  delete(id:any) {
    console.log("ID ",id);
    this.service.removeItemFromBasket(id).subscribe(res => {
      console.log("DELETED: ",res)
      
    })

    window.location.reload();

  }
}
