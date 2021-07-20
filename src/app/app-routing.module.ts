import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CestaComponent } from './cesta/cesta.component';
import { DetalleComponent } from './detalle/detalle.component';
import { FinCompraComponent } from './fin-compra/fin-compra.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PagoComponent } from './pago/pago.component';


const routes: Routes = [
  {path: '', component: HomeComponent },
  {path: 'cesta', component: CestaComponent },
  {path: 'finCompra', component: FinCompraComponent },
  {path: 'login', component: LoginComponent },
  {path: 'pago', component: PagoComponent },
  {path: 'electrodomesticos/:id', component: DetalleComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
