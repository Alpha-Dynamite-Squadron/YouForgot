import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/authentication.service';

@Component({
    selector: 'app-register-cmp',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit, OnDestroy {
    test: Date = new Date();
    registerInfo: string = '';

    constructor(
      private authService: AuthenticationService,
      private router: Router) {}

    ngOnInit() {
      const body = document.getElementsByTagName('body')[0];
      body.classList.add('register-page');
      body.classList.add('off-canvas-sidebar');
    }
    ngOnDestroy(){
      const body = document.getElementsByTagName('body')[0];
      body.classList.remove('register-page');
      body.classList.remove('off-canvas-sidebar');
    }
    
    public register() {
      console.log('Attemping to Register...');
      console.log("Registering with email: " + this.registerInfo);
      // this.authService.preregister(this.registerInfo)
      // .subscribe(() => {
      //   this.router.navigateByUrl('/verify');
      // }, (error) => {
      //   console.log(error);
      // });
      this.router.navigateByUrl('/verify');
    }
}
