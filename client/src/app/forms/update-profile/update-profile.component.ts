import { Component, HostListener, Injectable, OnInit } from '@angular/core';

import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormBuilder, AbstractControl } from '@angular/forms';
import { PasswordValidation } from '../validationforms/password-validator';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';

import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {

  user: User;

  avatars = [
    { value: 1, viewValue: 'Clipboard' },
    { value: 2, viewValue: 'Clock' },
    { value: 3, viewValue: 'Notepad' },
    { value: 4, viewValue: 'Pin' },
    { value: 5, viewValue: 'Thumbtack' }
  ];
  defaultAvatarValue = this.avatars[0].value;
  defaultAvatar: string = this.avatars[0].viewValue;
  selectedAvatarValue: number = this.defaultAvatarValue;

  validTextType: boolean = false;
  matcher = new MyErrorStateMatcher();
  updateProfileForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthenticationService
    ) { }

  ngOnInit() {
    this.userService.fetchUserInformation().subscribe((user) => {
      this.user = user;
      this.updateProfileForm = this.formBuilder.group({
        username: [user.username, Validators],
        avatar: [this.user.imageID, Validators],
        receiveNotifications: [this.user.receivePostNotifications, Validators],
        receiveDeadlineNotifications: [this.user.receiveDeadlineNotifications, Validators],
        receiveExcessiveNotifications: [this.user.receiveExcessiveDeadlineNotifications, Validators]
      });
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

  textValidationType(e) {
    if (e) {
      this.validTextType = true;
    } else {
      this.validTextType = false;
    }
  }

  onSaveChanges() {
    if (this.updateProfileForm.valid) {
      console.log('Form Valid, sending POST Request: ' + JSON.stringify(this.updateProfileForm.value));
      this.userService.submitProfileUpdate(
        this.updateProfileForm.value.username,
        this.updateProfileForm.value.avatar, 
        this.updateProfileForm.value.receiveNotifications, 
        this.updateProfileForm.value.receiveDeadlineNotifications, 
        this.updateProfileForm.value.receiveExcessiveNotifications, 
      ).subscribe(() => {
        swal({
          title: "Profile Updated!",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-success",
          type: "success"
        }).catch(swal.noop)
      }, (error) => {
        if(error.message === "username not unique") {
          swal({
            title: "Username Taken!",
            text: "Please select another username and try again.",
            timer: 2000,
            showConfirmButton: false
          }).catch(swal.noop)
        } else {
          console.log("Email deleted somehow?");
          this.authService.logout();
        }
      });
    } else {
      this.validateAllFormFields(this.updateProfileForm);
    }
  }

}
