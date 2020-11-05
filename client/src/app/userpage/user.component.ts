import { Component, HostListener } from '@angular/core';
import { AuthenticationService } from '../../authentication.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-cmp',
    templateUrl: 'user.component.html',
    styleUrls: ['user.component.css']
})

export class UserComponent {

  addNewInstitution: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  @HostListener('click', ['$event.target']) onClick(btn: HTMLButtonElement) {
    if(btn.textContent === 'Cancel'){
      this.addNewInstitution = !this.addNewInstitution
    }
  }

  logout() {
    console.log('Logging User Out...');
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

}
