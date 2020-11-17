import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';

@Component({
  selector: 'app-course-tile',
  templateUrl: './course-tile.component.html',
  styleUrls: ['./course-tile.component.css']
})
export class CourseTileComponent implements OnInit {

  icons: string[] = [
    'assignment',
    'book',
    'science',
    'calculate'];
  courseNumber: string[] = [
    '4750',
    '3110',
    '4990',
    '2400',
    '4310'];
  courseName: string[] = [
    'Operating Systems',
    'Formal Languages and Automata',
    'Mobile Applications Development',
    'Social Computing',
    'Data Structures'];
  courseDiscipline: string[] = ['CS'];
  courseInstructor: string[] = [
    'Fuh Sang',
    'David Johannsen',
    'John Korah',
    'Yu Sun',
    'Gilbert Young'];
  courseTerm: string[] = [
    'Fall',
    'Winter',
    'Spring',
    'Summer'];
  courseYear: string[] = ['2020', '2021', '2022'];

  selectedIcon: string;
  selectedCourseNumber: string;
  selectedCourseName: string;
  selectedCourseDiscipline: string;
  selectedCourseInstructor: string;
  selectedCourseTerm: string;
  selectedCourseYear: string;

  constructor() { }

  ngOnInit(): void {
    this.selectedIcon = this.icons[Math.floor(Math.random() * this.icons.length)];
    this.selectedCourseNumber = this.courseNumber[Math.floor(Math.random() * this.courseNumber.length)];
    this.selectedCourseName = this.courseName[Math.floor(Math.random() * this.courseName.length)];
    this.selectedCourseDiscipline = this.courseDiscipline[Math.floor(Math.random() * this.courseDiscipline.length)];
    this.selectedCourseInstructor = this.courseInstructor[Math.floor(Math.random() * this.courseInstructor.length)];
    this.selectedCourseTerm = this.courseTerm[Math.floor(Math.random() * this.courseTerm.length)];
    this.selectedCourseYear = this.courseYear[Math.floor(Math.random() * this.courseYear.length)];
  }

  showSwal(type) {
    if (type == 'warning-message-and-confirmation') {
      swal({
        title: 'Are you sure?',
        text: "You can always re-enroll later!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-danger',
        cancelButtonClass: 'btn btn-info',
        confirmButtonText: 'Yes, drop it!',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          swal(
            {
              title: 'Dropped!',
              text: 'You have successfully dropped the course.',
              type: 'success',
              confirmButtonClass: "btn btn-info",
              buttonsStyling: false
            }
          )
        }
      })
    } else if (type == 'subscribe') {
      swal({
        title: "Notifications Enabled!",
        text: "Notfications can be disabled at any time.",
        timer: 2000,
        showConfirmButton: false
      }).catch(swal.noop)
    } else if (type == 'unsubscribe') {
      swal({
        title: "Notifications Disabled!",
        text: "Notifications can be re-enabled at any time.",
        timer: 2000,
        showConfirmButton: false
      }).catch(swal.noop)
    }
  }

}
