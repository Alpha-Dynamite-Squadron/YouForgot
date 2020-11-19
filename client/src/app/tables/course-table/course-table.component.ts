// IMPORTANT: this is a plugin which requires jQuery for initialisation and data manipulation
import { Component, OnInit, AfterViewInit } from '@angular/core';
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

  ngOnInit() {
    this.dataTable = {
      headerRow: [
      'Course Name', 
      'Course Number', 
      'Course Instructor', 
      'Course Term', 
      'Current Enrollment', 
      'Enroll'],
      footerRow: [
      'Course Name', 
      'Course Number', 
      'Course Instructor', 
      'Course Term', 
      'Current Enrollment', 
      'Enroll'],

      dataRows: []
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

    const table = $('#datatables').DataTable();

    // Edit record
    table.on('click', '.edit', function (e) {
      let $tr = $(this).closest('tr');
      if ($($tr).hasClass('child')) {
        $tr = $tr.prev('.parent');
      }
      var data = table.row($tr).data();
      //alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
      e.preventDefault();
    });

    // Delete a record
    table.on('click', '.remove', function (e) {
      const $tr = $(this).closest('tr');
      table.row($tr).remove().draw();
      e.preventDefault();
    });

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
