// IMPORTANT: this is a plugin which requires jQuery for initialisation and data manipulation
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Course } from 'src/app/models/course.model';
import { UserService } from 'src/app/services/user.service';
import swal from 'sweetalert2';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: Course[];
}

declare const $: any;

@Component({
  selector: 'app-course-table',
  templateUrl: './course-table.component.html',
  styleUrls: ['./course-table.component.css']
})
export class CourseTableComponent implements OnInit, AfterViewInit {

  public dataTable: DataTable;
  public dataRows: Course[] = [];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.fetchInstitutionCourses().subscribe((institutions) => {
      institutions.array.forEach(element => {
        this.dataRows.push(new Course(
          element.nameOfClass,
          element.imageID,
          element.courseEnrollment,
          element.instructorName,
          element.disciplineLetters,
          element.courseNumber,
          element.sectionNumber,
          element.academicTerm,
          element.academicYear
        ));
      });
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
      dataRows: this.dataRows
    };
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

    // Edit record
    // table.on('click', '.edit', function (e) {
    //   let $tr = $(this).closest('tr');
    //   if ($($tr).hasClass('child')) {
    //     $tr = $tr.prev('.parent');
    //   }
    //   var data = table.row($tr).data();
    //   alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
    //   e.preventDefault();
    // });

    // Delete a record
    // table.on('click', '.remove', function (e) {
    //   const $tr = $(this).closest('tr');
    //   table.row($tr).remove().draw();
    //   e.preventDefault();
    // });

    const table = $('#datatables').DataTable();
    //Enroll in record
    table.on('click', '.enroll', function (e) {
      e.preventDefault();
    });
    //Enroll with notifications
    table.on('click', '.enrollWithNotifications', function (e) {
      e.preventDefault();
    });
    $('.card .material-datatables label').addClass('form-group');
  }

  showSwal(type) {
    if (type == 'enrolledNotifications') {
      swal({
        title: "Successfully Enrolled!",
        text: "You enrolled in the course with notifications enabled.",
        timer: 2000,
        showConfirmButton: false
      }).catch(swal.noop)
    } else if (type == 'enrolled') {
      swal({
        title: "Successfully Enrolled!",
        text: "You enrolled in the course with notifications disabled.",
        timer: 2000,
        showConfirmButton: false
      }).catch(swal.noop)
    }
  }
}
