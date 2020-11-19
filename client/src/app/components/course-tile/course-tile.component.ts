import { Component, Input, OnInit } from '@angular/core';
import { Course } from 'src/app/models/course.model';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';
import swal from 'sweetalert2';

@Component({
  selector: 'app-course-tile',
  templateUrl: './course-tile.component.html',
  styleUrls: ['./course-tile.component.css']
})
export class CourseTileComponent implements OnInit {

  @Input() course: Course;
  location: Location;

  constructor(
    private userService: UserService,
    location: Location
    ) { 
      this.location = location;
    }

  ngOnInit(): void { }

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

  //In Case we want to add code to turn off notifications without dropping course
  showSwal(type) {
    if (type == 'subscribe') {
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
