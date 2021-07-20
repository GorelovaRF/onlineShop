import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../shared/shared.service';
import { Electrodomestico, Usuario } from '../shared/md.model';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  public electrodomestico!: Electrodomestico;
  public usuario!: Usuario;
 

  constructor(private location: Location,
    private activateRoute: ActivatedRoute,private service:SharedService) {
      this.service.getUsuario(sessionStorage.getItem('token')!).subscribe(res => {
        this.usuario = res;
        console.log(this.usuario);
      })
     
     }

  ngOnInit(): void {
    const id = this.activateRoute.snapshot.paramMap.get('id');
    this.service.getDetalleProduct(id).subscribe(res => {
      this.electrodomestico = res;
      console.warn(this.electrodomestico);
      
    })
    
  }

  goBack() {
    this.location.back();
  }


  addToBacket(idPr:any){

    const item = {
      id_pr: idPr,
      id_usu: this.usuario.id,
      cantidad: 1
    }
    this.service.addItemToBasket(item).subscribe(res=> {
      console.warn("ITEM ADDED: ",res)
    })
    window.alert('Ya lo tienes en la cesta');

  }

  

//   addToBacket(electrodomestico:Electrodomestico){
// this.service.addToBacket(electrodomestico);
// window.alert('El producto ya esta en la cesta!')
//   }
  // addToCesta(idPr:any){
  //   this.service.getDetalleProduct(idPr).subscribe(res => {
  //     console.log("PR: ",res)
  //    this.productosEnCesta.push(res)
     
  //   })
    
  //   console.log(this.productosEnCesta);

  // }


}
