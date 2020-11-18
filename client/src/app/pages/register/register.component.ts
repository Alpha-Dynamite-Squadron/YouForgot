import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';

import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormBuilder, AbstractControl } from '@angular/forms';
import { PasswordValidation } from '../../forms/validationforms/password-validator';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

import swal from 'sweetalert2';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register-cmp',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit, OnDestroy {
  test: Date = new Date();
  registerEmail: string = '';

  validEmailRegister: boolean = false;
  matcher = new MyErrorStateMatcher();
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router) { }

  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('register-page');
    body.classList.add('off-canvas-sidebar');

    this.registerForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.edu$")]
      ]
    });
  }

  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('register-page');
    body.classList.remove('off-canvas-sidebar');
  }

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

  emailValidationRegister(e) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(e).toLowerCase())) {
      this.validEmailRegister = true;
    } else {
      this.validEmailRegister = false;
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      console.log('Form Valid, sending preregister Request: ' + this.registerForm.controls.email.value);
      this.authService.preregister(this.registerForm.controls.email.value).subscribe(
        () => {
          console.log("Redirecting to /verify");
          this.router.navigateByUrl('/verify');
        }, (error) => {
          console.log(error);
          if(error.status === 406) {
            if(error.message === "Non-edu address provided.") {
              swal({
                  title: "Bad Email!",
                  text: "Please provide a proper .edu address",
                  timer: 2000,
                  showConfirmButton: false
              }).catch(swal.noop);
            } else {
              swal({
                  title: "Already registered!",
                  text: "Please provide a different .edu address",
                  timer: 2000,
                  showConfirmButton: false
              }).catch(swal.noop);
            }
          } else {
            swal({
                title: "Server Offline",
                text: "YouForgot service appears to be down, please try again later.",
                timer: 2000,
                showConfirmButton: false
            }).catch(swal.noop);
          }
      });
    } else {
      this.validateAllFormFields(this.registerForm);
    }
  }

}
