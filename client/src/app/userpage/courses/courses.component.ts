import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  myCourses: boolean;
  location: Location;
  courses: any[];

  constructor(
    location: Location,
    private userService: UserService) {
    this.location = location;
  }

  ngOnInit(): void {
    var title = this.location.prepareExternalUrl(this.location.path());
    if (title === '/user/mycourses') {
      this.myCourses = true;
    }
    this.userService.fetchUserCourses().subscribe((courses) => {
      this.courses = courses;
    });
  }

}
