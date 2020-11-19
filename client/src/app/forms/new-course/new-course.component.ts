import { Component, Injectable, OnInit } from '@angular/core';

import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

import swal from 'sweetalert2';

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

  selectedTermValue: string;
  terms = [
    { value: 'fall', viewValue: 'Fall' },
    { value: 'winter', viewValue: 'Winter' },
    { value: 'spring', viewValue: 'Spring' },
    { value: 'summer', viewValue: 'Summer' }
  ];

  selectedYearValue: string;
  years = [
    { value: '2020', viewValue: '2020' },
    { value: '2021', viewValue: '2021' },
    { value: '2022', viewValue: '2022' },
    { value: '2023', viewValue: '2023' },
    { value: '2024', viewValue: '2024' }
  ];
  selectedIconValue: string;
  icons = [
    { value: 1, viewValue: 'assignment'},
    { value: 2, viewValue:'book'},
    { value: 3, viewValue:'science'},
    { value: 4, viewValue:'calculate'}];

  validTextType: boolean = false;
  validNumberType: boolean = false;
  matcher = new MyErrorStateMatcher();
  createCourseForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService) { }

  ngOnInit() {
    this.createCourseForm = this.formBuilder.group({
      courseName: ['', Validators.required],
      courseDiscipline: ['', Validators.compose([Validators.required, Validators.maxLength(4)])],
      courseNumber: ['', Validators.compose([Validators.required, Validators.maxLength(6)])],
      sectionNumber: ['', Validators.compose([Validators.required, Validators.maxLength(2)])],
      courseInstructor: ['', Validators.required],
      courseIcon: ['', Validators.required],
      courseTerm: ['', Validators.required],
      courseYear: ['', Validators.required]
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
  numberValidationType(e) {
    if (e) {
      this.validNumberType = true;
    } else {
      this.validNumberType = false;
    }
  }
  
  onSubmit(formDirective: FormGroupDirective) {
    if (this.createCourseForm.valid) {
      console.log('Form Valid, sending POST Request: ' + JSON.stringify(this.createCourseForm.value));
      this.userService.createCourse(
        this.createCourseForm.value.courseName,
        this.createCourseForm.value.courseIcon,
        this.createCourseForm.value.courseInstructor,
        this.createCourseForm.value.courseDiscipline,
        this.createCourseForm.value.courseNumber,
        this.createCourseForm.value.sectionNumber,
        this.createCourseForm.value.courseTerm,
        this.createCourseForm.value.courseYear
      ).subscribe(() => {
        formDirective.resetForm();
        this.createCourseForm.reset();
        swal({
          title: "Course Created!",
          text: "You are now enrolled in the course with notifications enabled.",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-info",
          type: "success"
        }).catch(swal.noop)
      });
    } else {
      this.validateAllFormFields(this.createCourseForm);
    }
  }
}
