import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';

import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormBuilder, AbstractControl } from '@angular/forms';
import { PasswordValidation } from '../../forms/validationforms/password-validator';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';


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

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
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
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]
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
      console.log('Form Submitted.');
      console.log('Submission Valid, sending POST Request: ' + JSON.stringify(this.registerForm.value));
      alert('Submission Valid, sending POST Request: ' + JSON.stringify(this.registerForm.value));
      // this.authService.preregister(this.registerInfo)
      // .subscribe(() => {
      //   this.router.navigateByUrl('/verify');
      // }, (error) => {
      //   console.log(error);
      // });
      this.router.navigateByUrl('/verify');
    } else {
      this.validateAllFormFields(this.registerForm);
    }
  }

}
