import { Component, ElementRef, Injectable, OnDestroy, OnInit } from '@angular/core';

import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormBuilder, AbstractControl } from '@angular/forms';
import { PasswordValidation } from '../../forms/validationforms/password-validator';
import { AuthenticationService, TokenPayload } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

import swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-login-cmp',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {
  test: Date = new Date();
  private toggleButton: any;
  private sidebarVisible: boolean;
  private nativeElement: Node;
  public loginInfo: TokenPayload = { email: '', password: '' };

  constructor(
    private element: ElementRef,
    private authService: AuthenticationService,
    private router: Router,
    private formBuilder: FormBuilder) {
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
  }

  ngOnInit() {
    var navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');
    body.classList.add('off-canvas-sidebar');
    const card = document.getElementsByClassName('card')[0];

    this.loginForm = this.formBuilder.group({
      //Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")
      email: [null, Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });
  }
  sidebarToggle() {
    var toggleButton = this.toggleButton;
    var body = document.getElementsByTagName('body')[0];
    var sidebar = document.getElementsByClassName('navbar-collapse')[0];
    if (this.sidebarVisible == false) {
      setTimeout(function () {
        toggleButton.classList.add('toggled');
      }, 500);
      body.classList.add('nav-open');
      this.sidebarVisible = true;
    } else {
      this.toggleButton.classList.remove('toggled');
      this.sidebarVisible = false;
      body.classList.remove('nav-open');
    }
  }
  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');
    body.classList.remove('off-canvas-sidebar');
  }

  validEmailLogin: boolean = false;
  validPasswordLogin: boolean = false;
  matcher = new MyErrorStateMatcher();
  loginForm: FormGroup;

  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field).valid && form.get(field).touched;
  }

  displayFieldCss(form: FormGroup, field: string) {
    return {
      'has-error': this.isFieldValid(form, field),
      'has-feedback': this.isFieldValid(form, field)
    };
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  emailValidationLogin(e) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(e).toLowerCase())) {
      this.validEmailLogin = true;
    } else {
      this.validEmailLogin = false;
    }
  }

  passwordValidationLogin(e) {
    if (e.length > 8) {
      this.validPasswordLogin = true;
    } else {
      this.validPasswordLogin = false;
    }
  }

  forgotPassword() {
    //Add backend endpoint code here
    this.router.navigateByUrl('/verify_password');
  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log('Form Valid, sending Login Request: ' + this.loginForm.controls.email);
      this.authService.requestLogin({
        email: this.loginForm.controls.email.value,
        password: this.loginForm.controls.password.value
      })
        .subscribe(() => {
          this.router.navigateByUrl('/home/main');
        }, (error) => {
          if(error.status === 401) {
            swal({
                title: "Bad Login!",
                text: "Please try another username or password.",
                timer: 2000,
                showConfirmButton: false
            }).catch(swal.noop)
          } else {
            swal({
                title: "Server Offline",
                text: "YouForgot service appears to be down, please try again later.",
                timer: 2000,
                showConfirmButton: false
            }).catch(swal.noop)
          }
        });

    } else {
      this.validateAllFormFields(this.loginForm);
    }
  }

}
