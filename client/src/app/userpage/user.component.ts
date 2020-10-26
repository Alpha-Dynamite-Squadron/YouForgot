import { Component, HostListener } from '@angular/core';

@Component({
    selector: 'app-user-cmp',
    templateUrl: 'user.component.html',
    styleUrls: ['user.component.css']
})

export class UserComponent {

  addNewInstitution: boolean = false;

  constructor() {}

  @HostListener('click', ['$event.target']) onClick(btn: HTMLButtonElement) {
    if(btn.textContent === 'Cancel'){
      this.addNewInstitution = !this.addNewInstitution
    }
  }

}
