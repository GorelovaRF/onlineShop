import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Electrodomestico, Usuario } from '../shared/md.model';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tokenHome!: string;
  usuario!: Usuario;
  public electoDomesticos!: Electrodomestico[];
  constructor(private service:SharedService,private router:Router) {

  

   }

  ngOnInit(): void {
  
  // console.log("TOKEN: ",sessionStorage.getItem('token'))
  // console.log("USUARIO : ",sessionStorage.getItem('usuario'))

    this.service.getUsuario(sessionStorage.getItem('token')!).subscribe(res => {
      this.usuario = res;
      console.log(this.usuario);
    })
    
    this.service.getAllProducts().subscribe(res => {
      this.electoDomesticos = res;
      console.warn(this.electoDomesticos)
    })
  }


  goDetalle(id: any):void {
    this.router.navigate(['/electrodomesticos',id]);
  }




}
