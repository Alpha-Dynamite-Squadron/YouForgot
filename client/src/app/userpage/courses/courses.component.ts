import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  myCourses: boolean;
  location: Location;
  courses: number[] = [1, 2, 3, 4, 5];

  constructor(location: Location) { 
    this.location = location;
  }

  ngOnInit(): void {
    var title = this.location.prepareExternalUrl(this.location.path());
    if(title === '/user/mycourses') {
      this.myCourses = true;
    }
  }

}
