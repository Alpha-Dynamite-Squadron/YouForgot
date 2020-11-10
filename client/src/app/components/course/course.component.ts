import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  assignments: number[] = [1, 2, 3, 4, 5]; 
  courseName: string = 'Course Name';
  
  constructor() { }

  ngOnInit(): void {
  }

}
