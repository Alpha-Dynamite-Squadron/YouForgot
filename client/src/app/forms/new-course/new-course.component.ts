import { Component, Injectable, OnInit } from '@angular/core';

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
  selector: 'app-new-course',
  templateUrl: './new-course.component.html',
  styleUrls: ['./new-course.component.css']
})
export class NewCourseComponent implements OnInit {

  selectedInstitutionValue: string;
  currentInstitution: string[];
  institutions = [
    { value: 'school-1', viewValue: 'California Polytechnic Institute - Pomona' },
    { value: 'school-2', viewValue: 'University of Southern California' },
    { value: 'school-3', viewValue: 'Grand Canyon University' },
  ];

  selectedTermValue: string;
  currentTerm: string[];
  terms = [
    { value: 'term-fall', viewValue: 'Fall' },
    { value: 'term-winter', viewValue: 'Winter' },
    { value: 'term-spring', viewValue: 'Spring' },
    { value: 'term-summer', viewValue: 'Summer' },
  ];

  selectedYearValue: string;
  currentYear: string[];
  years = [
    { value: 'year-2020', viewValue: '2020' },
    { value: 'year-2021', viewValue: '2021' },
    { value: 'year-2022', viewValue: '2022' },
    { value: 'year-2023', viewValue: '2023' },
    { value: 'year-2024', viewValue: '2024' },
  ];

  validTextType: boolean = false;
  validNumberType: boolean = false;
  validUrlType: boolean = false;
  pattern = "https?://.+";
  validSourceType: boolean = false;
  validDestinationType: boolean = false;

  matcher = new MyErrorStateMatcher();
  createCourseForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field).valid && form.get(field).touched;
  }
  displayFieldCss(form: FormGroup, field: string) {
    return {
      'has-error': this.isFieldValid(form, field),
      'has-feedback': this.isFieldValid(form, field)
    };
  }
  onType() {
    if (this.createCourseForm.valid) {
    } else {
      this.validateAllFormFields(this.createCourseForm);
    }
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
  ngOnInit() {
    this.createCourseForm = this.formBuilder.group({
      courseName: ['', Validators.required],
      courseDiscipline: ['', Validators.required],
      courseNumber: ['', Validators.required],
      courseInstructor: ['', Validators.required],
      courseTerm: ['', Validators.required],
      courseYear:['', Validators.required]
    });
  }

  textValidationType(e) {
    if (e) {
      this.validTextType = true;
    } else {
      this.validTextType = false;
    }
  }
  numberValidationType(e) {
    if (e) {
      this.validNumberType = true;
    } else {
      this.validNumberType = false;
    }
  }
  onSubmit() {
    console.log('Form Submitted.');
  }
}
