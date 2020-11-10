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

  constructor(location: Location) { 
    this.location = location;
  }

  ngOnInit(): void {
    var title = this.location.prepareExternalUrl(this.location.path());
    console.log(title);
    if(title === '/user/mycourses') {
      this.myCourses = true;
    }
    console.log(this.myCourses);
  }

}
