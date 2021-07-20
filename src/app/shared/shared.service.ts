import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Banco, Cesta, Electrodomestico, Usuario } from './md.model';
import { Observable, throwError } from 'rxjs';
import {catchError} from 'rxjs/operators';
import {map} from 'rxjs/operators';
import { Router } from '@angular/router';
import { taggedTemplate } from '@angular/compiler/src/output/output_ast';



export interface UserDetails {
  exp: number;
  email: string;
  contrasena: string;
}

interface TokenResponse {
  token: string;
}
export interface TokenPayload {
  email: string;
  contrasena: string;
}




const httpOptionsLogin = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  }) 
};


@Injectable({
  providedIn: 'root'
})


// const httpOptionsCreate = {
//   headers: new HttpHeaders({
//     'Accept': 'application/json',
//     'Content-Type': 'application/json'
//   })
// };

// const httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type':  'application/json',
//     'Access-Control-Allow-Origin' : 'http://localhost:3000'

//   })
// };



export class SharedService {
  private readonly HS_API_URL='http://localhost:3000';
  private headers = new HttpHeaders;
  private usuario?: Usuario; 
  private banco!: Banco;
  private cesta!: Cesta;
  private token!: string | null;
  public backetList: Electrodomestico[] = [];
  
  constructor(private http:HttpClient,private router: Router) {}


public getAllProducts(): Observable<Electrodomestico[]> {

  return this.http.get<Electrodomestico[]>(`${this.HS_API_URL}/electrodomesticos`,{headers:this.headers});
    }

public getDetalleProduct(id: any): Observable<Electrodomestico>{
  return this.http.get<Electrodomestico>(`${this.HS_API_URL}/electrodomesticos/${id}`,{headers:this.headers});

}

addToBacket(el: Electrodomestico) {
  this.backetList.push(el);
}

getBacketList() {
  return this.backetList;
}

clearBacket(){
  this.backetList = [];
  return this.backetList;
}
 


//USUARIO


public RecuperarToken (){
    
  var promise = localStorage.getItem('token')
  return promise;
}



public login(email: string, pass: string): Observable<any> {
 
  let cli:Usuario = {email: email, pass: pass};
 
   return this.http.post<any>(`${this.HS_API_URL}/api/login`, cli, httpOptionsLogin)
  .pipe(
      catchError((err) => {
        console.log("Error en el login");
        console.error(err);
        return throwError(err);
      }
      )
    );
}

public getUsuario(token:string): Observable<Usuario>{

  this.headers = new HttpHeaders ({'x-access-token': token});
  return this.http.get<Usuario>(`${this.HS_API_URL}/api/usuarioRegistrado`, {headers:this.headers});   
}

//BANCO


public RecuperarTokenBanco (){
    
  var _promise = localStorage.getItem('token2')
  return _promise;
}

public checkBankData(cardHolder:string,cardNum:string,dateExp:string,cvv:number): Observable<any> {
  let bn: Banco = {cardHolder:cardHolder,cardNum:cardNum,dateExp:dateExp,cvv:cvv};
  return this.http.post<any>(`${this.HS_API_URL}/api/banco/pagar`, bn, httpOptionsLogin)
  .pipe(
      catchError((err) => {
        console.log("Error al pagar");
        console.error(err);
        return throwError(err);
      }
      )
    );
}

public getCount(token2:string): Observable<Banco>{

  this.headers = new HttpHeaders ({'x-access-token': token2});
  return this.http.get<Banco>(`${this.HS_API_URL}/api/banco/pagoFin`, {headers:this.headers});   
}

public updateAmount(token2:string,sum:any):Observable<Banco> {

  this.headers = new HttpHeaders ({'x-access-token': token2});
  return this.http.put<Banco>(`${this.HS_API_URL}/api/banco/pagar`,sum, {headers:this.headers});  
}

//CESTA

public getUserBasket(id: any): Observable<Cesta[]>{
  return this.http.get<Cesta[]>(`${this.HS_API_URL}/cesta/${id}`,{headers:this.headers});

}

public addItemToBasket(item:any):Observable<Cesta>{
  
  return this.http.post<Cesta>(`${this.HS_API_URL}/cesta`, item,  {headers:this.headers});
}

public removeItemFromBasket(id:any) {
  return this.http.delete<Cesta[]>(`${this.HS_API_URL}/cesta/${id}`, {headers:this.headers});

}


public getUserBasketWithPr(id: any): Observable<any[]>{
  return this.http.get<any[]>(`${this.HS_API_URL}/cestaProduct/${id}`,{headers:this.headers});

}





}
