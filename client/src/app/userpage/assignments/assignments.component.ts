import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit {

  createNewAssignment: boolean = false

  constructor() { }

  @HostListener('click', ['$event.target']) onClick(btn: HTMLButtonElement) {
    if(btn.textContent === 'Cancel'){
      this.createNewAssignment = !this.createNewAssignment
    }
  }

  ngOnInit(): void {
  }

}
