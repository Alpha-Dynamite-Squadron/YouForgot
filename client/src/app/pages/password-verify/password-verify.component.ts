import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-password-verify',
  templateUrl: './password-verify.component.html',
  styleUrls: ['./password-verify.component.css']
})
export class PasswordVerifyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('Awaiting Password Email Verification...')
  }

}
