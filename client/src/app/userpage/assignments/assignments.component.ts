import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit {

  createNewAssignment: boolean = false
  myAssignments: boolean = false;
  location: Location;

  constructor(location: Location) {
    this.location = location;
   }

  @HostListener('click', ['$event.target']) onClick(btn: HTMLButtonElement) {
    if(btn.textContent === 'Cancel'){
      this.createNewAssignment = !this.createNewAssignment
    }
  }

  ngOnInit(): void {
    var title = this.location.prepareExternalUrl(this.location.path());
    console.log(title);
    if(title === '/user/myassignments') {
      this.myAssignments = true;
    }
    console.log(this.myAssignments);
  }

}
