import { Component, Input, OnInit } from '@angular/core';
import { Course } from 'src/app/models/course.model';
import { PublicAssignment } from 'src/app/models/public-assignment.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent implements OnInit {

  @Input() assignment: PublicAssignment;
  assignmentIcon: string;
  formattedUploadDate: string;
  formattedDueDate: string;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.formattedUploadDate = new Date(this.assignment.uploadDate).toLocaleString();
    this.formattedDueDate = new Date(this.assignment.assignmentDueDate).toLocaleString();
  }

  onForgot() {
    console.log('Clicked iForgot Button');
    this.userService.updateForgotStatus(this.assignment.assignmentID).subscribe(() => {

    }, (error) => {
      
    });
  }

  // onReport() {
  //   console.log('Assignment Reported.');
  // }

}
