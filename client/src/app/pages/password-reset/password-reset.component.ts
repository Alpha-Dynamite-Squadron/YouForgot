import { Component, Injectable, OnInit } from '@angular/core';
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
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  validConfirmPasswordReset: boolean = false;
  validPasswordReset: boolean = false;
  validTextType: boolean = false;

  matcher = new MyErrorStateMatcher();
  passwordResetForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService) { }

  ngOnInit() {
    this.passwordResetForm = this.formBuilder.group({
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      confirmPassword: ['', Validators.required],
    }, {
      validator: PasswordValidation.MatchPassword
    });
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

  passwordValidationReset(e) {
    if (e.length > 8) {
      this.validPasswordReset = true;
    } else {
      this.validPasswordReset = false;
    }
  }
  confirmPasswordValidationReset(e) {
    if (this.passwordResetForm.controls['password'].value === e) {
      this.validConfirmPasswordReset = true;
    } else {
      this.validConfirmPasswordReset = false;
    }
  }

  onResetPassword() {
    if (this.passwordResetForm.valid) {
      console.log('Form Submitted.');
      console.log('Submission Valid, sending POST Request: ' + JSON.stringify(this.passwordResetForm.value));
      alert('Submission Valid, sending POST Request: ' + JSON.stringify(this.passwordResetForm.value));
      //Add endpoint code here
      this.router.navigateByUrl('/login');
    } else {
      this.validateAllFormFields(this.passwordResetForm);
    }
  }
  
}
