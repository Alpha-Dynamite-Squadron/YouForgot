import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-course-tile',
  templateUrl: './course-tile.component.html',
  styleUrls: ['./course-tile.component.css']
})
export class CourseTileComponent implements OnInit {

  icons: string[] = [
    'assignment',
    'book',
    'science',
    'calculate'];
  courseNumber: string[] = [
    '4750',
    '3110',
    '4990',
    '2400',
    '4310'];
  courseName: string[] = [
    'Operating Systems',
    'Formal Languages and Automata',
    'Mobile Applications Development',
    'Social Computing',
    'Data Structures'];
  courseDiscipline: string[] = ['CS'];
  courseInstructor: string[] = [
    'Fuh Sang',
    'David Johannsen',
    'John Korah',
    'Yu Sun',
    'Gilbert Young'];
  courseTerm: string[] = [
    'Fall',
    'Winter',
    'Spring',
    'Summer'];
  courseYear: string[] = ['2020', '2021', '2022'];

  selectedIcon: string;
  selectedCourseNumber: string;
  selectedCourseName: string;
  selectedCourseDiscipline: string;
  selectedCourseInstructor: string;
  selectedCourseTerm: string;
  selectedCourseYear: string;

  constructor() { }

  ngOnInit(): void {
    this.selectedIcon = this.icons[Math.floor(Math.random() * this.icons.length)];
    this.selectedCourseNumber = this.courseNumber[Math.floor(Math.random() * this.courseNumber.length)];
    this.selectedCourseName = this.courseName[Math.floor(Math.random() * this.courseName.length)];
    this.selectedCourseDiscipline = this.courseDiscipline[Math.floor(Math.random() * this.courseDiscipline.length)];
    this.selectedCourseInstructor = this.courseInstructor[Math.floor(Math.random() * this.courseInstructor.length)];
    this.selectedCourseTerm = this.courseTerm[Math.floor(Math.random() * this.courseTerm.length)];
    this.selectedCourseYear = this.courseYear[Math.floor(Math.random() * this.courseYear.length)];
  }

}
