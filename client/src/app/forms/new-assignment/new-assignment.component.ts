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
  selector: 'app-new-assignment',
  templateUrl: './new-assignment.component.html',
  styleUrls: ['./new-assignment.component.css']
})
export class NewAssignmentComponent implements OnInit {

  selectedValue: string;
  currentCourse: string[];
  courses = [
    { value: 'course-1520', viewValue: 'Physics 1520: Electronegativity and Magnetism' },
    { value: 'course-3110', viewValue: 'CS3110: Formal Languages and Automata' },
    { value: 'course-4750', viewValue: 'CS4750: Mobile Applications Development' },
  ];

  validTextType: boolean = false;
  validNumberType: boolean = false;
  matcher = new MyErrorStateMatcher();
  createAssignmentForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    //For the time being it will be assumed all assignments are due at 11:59pm
    //This can be replaced once the datepicker has a timepicker as well
    this.createAssignmentForm = this.formBuilder.group({
      assignmentTitle: ['', Validators.required],
      assignmentDesc: ['', Validators.required],
      assignmentDueDate: ['', Validators.required],
      assignmentGrading: ['', Validators.required],
      assignmentCourse: ['', Validators.required]
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

  onType() {
    if (this.createAssignmentForm.valid) {
    } else {
      this.validateAllFormFields(this.createAssignmentForm);
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
    console.log('Submission Valid, sending POST Request: ' + JSON.stringify(this.createAssignmentForm.value));
    alert('Submission Valid, sending POST Request: ' + JSON.stringify(this.createAssignmentForm.value));
  }

}
