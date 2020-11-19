import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PersonalAssignment } from 'src/app/models/personal-assignment.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit {

  createNewAssignment: boolean = false;
  myAssignments: boolean = false;
  assignments: PersonalAssignment[];
  location: Location;

  constructor(
    private userService: UserService,
    location: Location) {
    this.location = location;
   }

  @HostListener('click', ['$event.target']) onClick(btn: HTMLButtonElement) {
    if(btn.textContent === 'Cancel'){
      this.createNewAssignment = !this.createNewAssignment
    }
  }

  ngOnInit(): void {
    var title = this.location.prepareExternalUrl(this.location.path());
    if(title === '/user/myassignments') {
      this.myAssignments = true;
    }
    this.userService.fetchUserAssignments().subscribe((data) => {
      this.assignments = data;
    });
  }
}
