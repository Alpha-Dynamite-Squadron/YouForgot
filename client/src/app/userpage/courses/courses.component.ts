import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  findNewCourse: boolean = false;

  constructor() { }

  @HostListener('click', ['$event.target']) onClick(btn: HTMLButtonElement) {
    if(btn.textContent === 'Cancel'){
      this.findNewCourse = !this.findNewCourse
    }
  }

  ngOnInit(): void {
  }

}
