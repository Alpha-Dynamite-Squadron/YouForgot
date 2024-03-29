// IMPORTANT: this is a plugin which requires jQuery for initialisation and data manipulation
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';
import swal from 'sweetalert2';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}

declare const $: any;

@Component({
  selector: 'app-course-table',
  templateUrl: './course-table.component.html',
  styleUrls: ['./course-table.component.css']
})
export class CourseTableComponent implements OnInit, AfterViewInit {

  public dataTable: DataTable;
  public courses: string[][];
  public location: Location;

  constructor(
    private userService: UserService,
    location: Location) {
      this.location = location;
     }

  ngOnInit() {
    this.userService.fetchInstitutionCourses().subscribe((institutions) => {
      this.courses = [];
      institutions.forEach(element => {
        this.courses.push([
          element.nameOfClass,
          element.disciplineLetters,
          element.courseNumber,
          element.sectionNumber,
          element.instructorName,
          element.academicTerm,
          element.academicYear,
          element.courseEnrollment,
          element.imageID,
          element.sectionInstanceID
        ]);
      });
      this.dataTable = {
        headerRow: [
          'Course Name',
          'Course Number',
          'Section Number',
          'Course Instructor',
          'Course Term',
          'Current Enrollment',
          'Enroll'],
        footerRow: [
          'Course Name',
          'Course Number',
          'Section Number',
          'Course Instructor',
          'Course Term',
          'Current Enrollment',
          'Enroll'],
        dataRows: this.courses
      };
    });
  }

  ngAfterViewInit() {
    $('#datatables').DataTable({
      "pagingType": "full_numbers",
      "lengthMenu": [
        [10, 25, 50, -1],
        [10, 25, 50, "All"]
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search Courses...",
      }
    });
    //Intialize Table
    const table = $('#datatables').DataTable();
    $('.card .material-datatables label').addClass('form-group');
  }

  enroll(instanceID: number, notifications: boolean) {
    this.userService.enrollUser(instanceID, notifications).subscribe(() => {
      console.log(notifications);
      if(notifications) {
        swal({
          title: "Successfully Enrolled!",
          text: "You enrolled in the course with notifications enabled.",
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          window.location.reload();
        }).catch(swal.noop)
      }
      else {
        swal({
          title: "Successfully Enrolled!",
          text: "You enrolled in the course with notifications disabled.",
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          window.location.reload();
        }).catch(swal.noop)
      }
    }, (err) => {
      if (err.status === 400) {
        swal({
          title: "Enrolling Failed!",
          text: "You are already enrolled in this course.",
          timer: 2000,
          showConfirmButton: false
        }).catch(swal.noop)
      }
    });
  }

}
