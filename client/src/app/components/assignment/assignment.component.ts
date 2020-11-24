import { Component, Input, OnInit } from '@angular/core';
import { Course } from 'src/app/models/course.model';
import { PublicAssignment } from 'src/app/models/public-assignment.model';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';
import swal from 'sweetalert2';

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
  public location: Location;

  constructor(
    private userService: UserService,
    location: Location) { 
      this.location = location;
    }

  ngOnInit(): void {
    this.formattedUploadDate = new Date(this.assignment.uploadDate).toLocaleString();
    this.formattedDueDate = new Date(this.assignment.assignmentDueDate).toLocaleString();
  }

  onForgot() {
    console.log("Clicked iForgot Button");
    this.userService.updateForgotStatus(this.assignment.assignmentID).subscribe(() => {
      window.location.reload();
    }, (error) => {
      console.log(error);
        swal({
          title: "Oops! Something went wrong.",
          text: "Please try again later.",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-info",
          type: "error"
        }).then(() => {
          window.location.reload();
        }).catch(swal.noop)
    });
  }

  onIncomplete() {
    console.log("Marked Post as Incompleted Button");
    this.userService.markAssignmentIncomplete(this.assignment.assignmentID).subscribe(() => {
      window.location.reload();
    }, (error) => {
      console.log(error);
      swal({
        title: "Oops! Something went wrong.",
        text: "Please try again later.",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-info",
        type: "error"
      }).catch(swal.noop)
    });
  }

  onSubscribe() {
    console.log("Clicked Subscribe to Post Button");
    this.userService.subscribeToPost(this.assignment.assignmentID).subscribe(() => {
      window.location.reload();
    }, (error) => {
      console.log(error);
      swal({
        title: "Oops! Something went wrong.",
        text: "Please try again later.",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-info",
        type: "error"
      }).catch(swal.noop)
    });
  }

}
