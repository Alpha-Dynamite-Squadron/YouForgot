import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'you-forgot-app',
    templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  private _router: Subscription;

  constructor( private router: Router ) {}

  ngOnInit() {
    this._router = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const body = document.getElementsByTagName('body')[0];
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      console.log(body);
      console.log('*****************')
      console.log(modalBackdrop);
      if (body.classList.contains('modal-open')) {
        body.classList.remove('modal-open');
        modalBackdrop.remove();
      }
    });
  }
}
