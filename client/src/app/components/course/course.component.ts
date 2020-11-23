import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from 'src/app/models/course.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  assignments: [];
  courseName: string = 'Course Name';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(): void {
    let courseURL: string = this.route.snapshot.paramMap.get('id');
    this.courseName = this.route.snapshot.paramMap.get('name');
    if (isNaN(parseInt(courseURL))) {
      this.router.navigateByUrl('/user/mycourses');
    } else {
      this.userService.fetchCourseAssignments(parseInt(courseURL)).subscribe((data) => {
        this.assignments = data;
      });
    }
    console.log("Course Name in Course Component: ", this.courseName);
  }

}
