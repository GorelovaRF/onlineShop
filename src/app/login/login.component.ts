import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../shared/md.model';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public token!: string;
  public usuario!: Usuario;
  public errorMessage!: string;
  
  constructor(private service:SharedService,private router: Router,private fb: FormBuilder,) { }

  ngOnInit() {
    
    this.loginForm = this.fb.group({
      'email': ['', Validators.compose([
        Validators.required
      ])],
      'pass': ['', Validators.compose([
        Validators.required
      ])]
    });



  }

get f() { return this.loginForm.controls; }



  goHome() {
    this.router.navigate(['/'])
  }


  login(){ 

this.service.login(this.f.email.value,this.f.pass.value).subscribe(token => {
this.token = token;
//localStorage.setItem('token',this.token);
sessionStorage.setItem('token',this.token.toString())
this.service.getUsuario(token).subscribe(
  (usuario:Usuario) => {
    this.usuario = usuario;
    sessionStorage.setItem('usuario',JSON.stringify(this.usuario))
   // localStorage.setItem('usuario',this.usuario.toString());
    console.log(this.usuario)
    this.router.navigate(['']);
    
  }
)
},(error) =>{
  this.errorMessage = "Email o contrasena incorectos"
  throw error;
}
)
  }

}


