import { Component, Injectable, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormBuilder, AbstractControl } from '@angular/forms';
import { PasswordValidation } from '../../forms/validationforms/password-validator';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';

import swal from 'sweetalert2';

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

  email: string = '';
  validConfirmPasswordReset: boolean = false;
  validPasswordReset: boolean = false;
  validTextType: boolean = false;

  matcher = new MyErrorStateMatcher();
  passwordResetForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.authService.verifyAccessKey(this.route.snapshot.paramMap.get('id'))
    .subscribe(
      (email) => {
        console.log("Found Email: " + email);
        this.email = email;
      },
      (error) => {
        console.log(error);
        this.router.navigateByUrl('/register');
      }
    );
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
      console.log('Form Valid, sending POST Request to reset password ');
      this.authService.completePasswordReset(
        this.email,
        this.passwordResetForm.value.password,
        this.route.snapshot.paramMap.get('id')
      ).subscribe(() => {
          console.log("Successfully Reset Password");
          swal({
              title: "Password Reset!",
              text: "You will be sent to the Login page now!",
              buttonsStyling: false,
              confirmButtonClass: "btn btn-success",
              type: "success"
          }).then(() => {
            this.router.navigateByUrl('/login');
          }).catch(swal.noop);
        }, (error) => {
          if(error.status === 403) {
            this.router.navigateByUrl('/login');//Should not be possible by accessKeyRequest
          } else if (error.status === 406) {
            this.router.navigateByUrl('/login');//Should not be possible by accessKeyRequest
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
      this.validateAllFormFields(this.passwordResetForm);
    }
  }

}
