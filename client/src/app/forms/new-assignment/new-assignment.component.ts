import { Component, Injectable, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormBuilder, AbstractControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Course } from 'src/app/models/course.model';
import swal from 'sweetalert2';

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
  courses: Course[];

  validTextType: boolean = false;
  validNumberType: boolean = false;
  matcher = new MyErrorStateMatcher();
  createAssignmentForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService) { }

  ngOnInit() {
    this.userService.fetchUserCourses().subscribe((courses) => {
      this.courses = courses;
    });
    this.createAssignmentForm = this.formBuilder.group({
      assignmentTitle: ['', Validators.required],
      // assignmentDesc: ['', Validators.required],
      assignmentDueDate: ['', Validators.required],
      assignmentTimeDueDate: ['', Validators.required],
      assignmentGrading: [0, Validators],
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
    if (this.createAssignmentForm.valid) {
      console.log('Form Valid, sending POST Request: ' + JSON.stringify(this.createAssignmentForm.value))
      //Combine User Date and User Time into one String
      let assignmentDueDate: string = this.combineDateAndTime(
        this.createAssignmentForm.value.assignmentDueDate, 
        this.createAssignmentForm.value.assignmentTimeDueDate
        );
      this.userService.createAssignment(
        this.createAssignmentForm.value.assignmentCourse,
        this.createAssignmentForm.value.assignmentTitle,
        this.createAssignmentForm.value.assignmentGrading,
        assignmentDueDate
      ).subscribe(() => {
        formDirective.resetForm();
        this.createAssignmentForm.reset();
        swal({
          title: "Assignment Created!",
          text: "You have successfully created an assignment in this course and are subscribed to it.",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-info",
          type: "success"
        }).then(() => {
          window.location.reload();
        }).catch(swal.noop)
      }, (error) => {
        console.log(error);
        swal({
          title: "Creation Failed!",
          text: "Oops! Something went wrong. Please try again later.",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-info",
          type: "error"
        }).catch(swal.noop)
      });
    } else {
      this.validateAllFormFields(this.createAssignmentForm);
    }
  }

  private combineDateAndTime(dueDate: string, timeDueDate: string): string {
    let combinedDueDate: Date;
    let temp = dueDate.toString().replace('00:00:00', timeDueDate);
    combinedDueDate = new Date(temp);
    return combinedDueDate.toString();
  }

}
