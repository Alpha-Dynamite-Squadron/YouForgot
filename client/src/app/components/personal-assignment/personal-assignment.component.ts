import { Component, Input, OnInit } from '@angular/core';
import { PersonalAssignment } from 'src/app/models/personal-assignment.model';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';
import swal from 'sweetalert2';

@Component({
  selector: 'app-personal-assignment',
  templateUrl: './personal-assignment.component.html',
  styleUrls: ['./personal-assignment.component.css']
})
export class PersonalAssignmentComponent implements OnInit {


  selectedIcon: string = 'assignment';
  @Input() assignment: PersonalAssignment;
  formattedUploadDate: string;
  formattedDueDate: string;
  public location: Location;

  constructor(
    private userService: UserService,
    location: Location) {
    this.location = location;
  }

  ngOnInit(): void {
    this.formattedUploadDate = new Date(this.assignment.customUploadDate).toLocaleString();
    this.formattedDueDate = new Date(this.assignment.customDueDate).toLocaleString();
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

  onComplete() {
    console.log("User is Attempting to Mark Assignment as Complete.");
    this.userService.completeAssignment(this.assignment.assignmentID).subscribe(() => {
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
