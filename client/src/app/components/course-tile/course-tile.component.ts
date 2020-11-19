import { Component, Input, OnInit } from '@angular/core';
import { Course } from 'src/app/models/course.model';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-tile',
  templateUrl: './course-tile.component.html',
  styleUrls: ['./course-tile.component.css']
})
export class CourseTileComponent implements OnInit {

  @Input() course: Course;
  location: Location;
  courseIcon: string;

  constructor(
    private userService: UserService,
    private router: Router,
    location: Location
    ) { 
      this.location = location;
    }

  ngOnInit(): void { 
    //Assigns Material Icon to Course Tile based on Course Image ID
    if (this.course.imageID === 1) {
      this.courseIcon = 'assignment';
    } else if (this.course.imageID === 2) {
      this.courseIcon = 'book';
    } else if (this.course.imageID === 3) {
      this.courseIcon = 'science';
    } else if (this.course.imageID === 4) {
      this.courseIcon = 'calculate';
    } else {
      this.courseIcon = 'assignment';
    }
  }

  dropCourse() {
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
        this.userService.unenrollUser(this.course.instanceID).subscribe(() => {
          swal(
            {
              title: 'Dropped!',
              text: 'You have successfully dropped the course.',
              type: 'success',
              confirmButtonClass: "btn btn-info",
              buttonsStyling: false
            }
          ).then(() => {
            window.location.reload();
          });
        });
      }
    })
  }

  goToCourse() {
    console.log("Navigating to Course: ", this.course.nameOfClass);
    this.router.navigate(['/components/course', this.course.instanceID]);
  }

  //In Case we want to add code to turn off notifications without dropping course
  // showSwal(type) {
  //   if (type == 'subscribe') {
  //     swal({
  //       title: "Notifications Enabled!",
  //       text: "Notfications can be disabled at any time.",
  //       timer: 2000,
  //       showConfirmButton: false
  //     }).catch(swal.noop)
  //   } else if (type == 'unsubscribe') {
  //     swal({
  //       title: "Notifications Disabled!",
  //       text: "Notifications can be re-enabled at any time.",
  //       timer: 2000,
  //       showConfirmButton: false
  //     }).catch(swal.noop)
  //   }
  // }

}
