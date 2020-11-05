import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-course-search',
  templateUrl: './course-search.component.html',
  styleUrls: ['./course-search.component.css']
})
export class CourseSearchComponent implements OnInit {

  createNewCourse: boolean = false;

  constructor() {}

  @HostListener('click', ['$event.target']) onClick(btn: HTMLButtonElement) {
    if (btn.textContent === 'Cancel') {
      this.createNewCourse = !this.createNewCourse;
    }
  }

  ngOnInit(): void {
  }

}
