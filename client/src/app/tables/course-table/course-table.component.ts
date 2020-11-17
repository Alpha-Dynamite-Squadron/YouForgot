// IMPORTANT: this is a plugin which requires jQuery for initialisation and data manipulation

import { Component, OnInit, AfterViewInit } from '@angular/core';

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
      headerRow: ['Course Name', 'Course Number', 'Course Instructor', 'Course Term', 'Current Enrollment', 'Enroll'],
      footerRow: ['Course Name', 'Course Number', 'Course Instructor', 'Course Term', 'Current Enrollment', 'Enroll'],

      dataRows: [
        ['Airi Satou', 'Andrew Mike', 'Develop', '2013', '99,225', ''],
        ['Angelica Ramos', 'John Doe', 'Design', '2012', '89,241', 'btn-round'],
        ['Ashton Cox', 'Alex Mike', 'Design', '2010', '92,144', 'btn-simple'],
        ['Bradley Greer', 'Mike Monday', 'Marketing', '2013', '49,990', 'btn-round'],
        ['Brenden Wagner', 'Paul Dickens', 'Communication', '2015', '69,201', ''],
        ['Brielle Williamson', 'Mike Monday', 'Marketing', '2013', '49,990', 'btn-round'],
        ['Caesar Vance', 'Mike Monday', 'Marketing', '2013', '49,990', 'btn-round'],
        ['Cedric Kelly', 'Mike Monday', 'Marketing', '2013', '49,990', 'btn-round'],
        ['Charde Marshall', 'Mike Monday', 'Marketing', '2013', '49,990', 'btn-round'],
        ['Colleen Hurst', 'Mike Monday', 'Marketing', '2013', '49,990', 'btn-round'],
        ['Dai Rios', 'Andrew Mike', 'Develop', '2013', '99,225', ''],
        ['Doris Wilder', 'John Doe', 'Design', '2012', '89,241', 'btn-round'],
        ['Fiona Green', 'Alex Mike', 'Design', '2010', '92,144', 'btn-simple'],
        ['Garrett Winters', 'Mike Monday', 'Marketing', '2013', '49,990', 'btn-round'],
        ['Gavin Cortez', 'Paul Dickens', 'Communication', '2015', '69,201', ''],
        ['Gavin Joyce', 'Mike Monday', 'Marketing', '2013', '49,990', 'btn-round'],
        ['Gloria Little', 'Mike Monday', 'Marketing', '2013', '49,990', 'btn-round'],
        ['Haley Kennedy', 'Mike Monday', 'Marketing', '2013', '49,990', 'btn-round'],
        ['Herrod Chandler', 'Mike Monday', 'Marketing', '2013', '49,990', 'btn-round'],
        ['Hope Fuentes', 'Mike Monday', 'Marketing', '2013', '49,990', 'btn-round'],
        ['Howard Hatfield', 'Andrew Mike', 'Develop', '2013', '99,225', ''],
        ['Jena Gaines', 'John Doe', 'Design', '2012', '89,241', 'btn-round'],
        ['Jenette Caldwell', 'Alex Mike', 'Design', '2010', '92,144', 'btn-simple'],
        ['Jennifer Chang', 'Mike Monday', 'Marketing', '2013', '49,990', 'btn-round'],
        ['Martena Mccray', 'Paul Dickens', 'Communication', '2015', '69,201', ''],
        ['Michael Silva', 'Mike Monday', 'Marketing', '2013', '49,990', 'btn-round'],
        ['Michelle House', 'Mike Monday', 'Marketing', '2013', '49,990', 'btn-round'],
        ['Paul Byrd', 'Mike Monday', 'Marketing', '2013', '49,990', 'btn-round'],
        ['Prescott Bartlett', 'Mike Monday', 'Marketing', '2013', '49,990', 'btn-round'],
        ['Quinn Flynn', 'Mike Monday', 'Marketing', '2013', '49,990', 'btn-round'],
        ['Rhona Davidson', 'Andrew Mike', 'Develop', '2013', '99,225', ''],
        ['Shou Itou', 'John Doe', 'Design', '2012', '89,241', 'btn-round'],
        ['Sonya Frost', 'Alex Mike', 'Design', '2010', '92,144', 'btn-simple'],
        ['Suki Burks', 'Mike Monday', 'Marketing', '2013', '49,990', 'btn-round'],
        ['Tatyana Fitzpatrick', 'Paul Dickens', 'Communication', '2015', '69,201', ''],
        ['Tiger Nixon', 'Mike Monday', 'Marketing', '2013', '49,990', 'btn-round'],
        ['Timothy Mooney', 'Mike Monday', 'Marketing', '2013', '49,990', 'btn-round'],
        ['Unity Butler', 'Mike Monday', 'Marketing', '2013', '49,990', 'btn-round'],
        ['Vivian Harrell', 'Mike Monday', 'Marketing', '2013', '49,990', 'btn-round'],
        ['Yuri Berry', 'Mike Monday', 'Marketing', '2013', '49,990', 'btn-round']
      ]
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
      alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
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
      alert('You enrolled in the course with notifications disabled.');
      e.preventDefault();
    });

    //Enroll with notifications
    table.on('click', '.enrollWithNotifications', function (e) {
      alert('You enrolled in the course with notifications enabled.');
      e.preventDefault();
    });

    $('.card .material-datatables label').addClass('form-group');
  }
}
