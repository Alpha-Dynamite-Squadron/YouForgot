import { Component, HostListener, Injectable, OnInit } from '@angular/core';

import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormBuilder, AbstractControl } from '@angular/forms';
import { PasswordValidation } from '../validationforms/password-validator';

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

  username: string = 'Account Username';
  receiveNotifications: boolean = false;
  receiveDeadlineNotifications: boolean = false;
  receiveExcessiveNotifications: boolean = false;

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
  currentAvatar: string[];

  validTextType: boolean = false;
  matcher = new MyErrorStateMatcher();
  updateProfileForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.updateProfileForm = this.formBuilder.group({
      username: [this.username, Validators],
      avatar: [this.selectedAvatarValue, Validators],
      receiveNotifications: [this.receiveNotifications, Validators],
      receiveDeadlineNotifications: [this.receiveDeadlineNotifications, Validators],
      receiveExcessiveNotifications: [this.receiveExcessiveNotifications, Validators]
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
      console.log('Form Submitted.');
      console.log('Submission Valid, sending POST Request: ' + JSON.stringify(this.updateProfileForm.value));
      alert('Submission Valid, sending POST Request: ' + JSON.stringify(this.updateProfileForm.value));
    } else {
      this.validateAllFormFields(this.updateProfileForm);
    }
  }

}
