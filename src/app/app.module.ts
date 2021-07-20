import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CestaComponent } from './cesta/cesta.component';
import { LoginComponent } from './login/login.component';
import { PagoComponent } from './pago/pago.component';
import { FinCompraComponent } from './fin-compra/fin-compra.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { DetalleComponent } from './detalle/detalle.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CestaComponent,
    LoginComponent,
    PagoComponent,
    FinCompraComponent,
    DetalleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, 
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
