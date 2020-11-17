import { Component, Injectable, OnInit, AfterViewInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormBuilder, AbstractControl } from '@angular/forms';
import { PasswordValidation } from '../../forms/validationforms/password-validator';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { take, takeUntil } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface Institution {
  id: string;
  name: string;
}

@Component({
  selector: 'app-finish-register',
  templateUrl: './finish-register.component.html',
  styleUrls: ['./finish-register.component.css']
})
export class FinishRegisterComponent implements OnInit, OnDestroy, AfterViewInit {

  email: string = 'studentemail@edu.com';

  validTextType: boolean = false;
  validPasswordRegister: boolean = false;
  validConfirmPasswordRegister: boolean = false;
  matcher = new MyErrorStateMatcher();
  finishRegisterForm: FormGroup;

  //Replace this with a database query and populate list with *ngFor
  protected institutions: Institution[] = [
    { name: 'California Polytechnic Institute - Pomona', id: 'A' },
    { name: 'University of Southern California', id: 'B' },
    { name: 'Grand Canyon University', id: 'C' }
  ];
  //Control for the selected institution
  public institutionCtrl: FormControl = new FormControl('', Validators.required);
  //Control for MatSelect filter keyword
  public institutionFilterCtrl: FormControl = new FormControl();
  //List of Institutions filtered by search keyword
  public filteredInstitutions: ReplaySubject<Institution[]> = new
    ReplaySubject<Institution[]>(1);

  @ViewChild("singleSelect", { static: true }) singleSelect: MatSelect;
  //Subject that emits when the component has been destroyed
  protected _onDestroy = new Subject<void>();

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    console.log("Requesting Email from Server by AccessKey...");
    // this.authService.verifyAccessKey(this.route.snapshot.paramMap.get('id'))
    //   .subscribe(
    //     (email) => {
    //       console.log("Found Email: " + email);
    //       this.email = email;
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );
    //Create registration form
    this.finishRegisterForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      confirmPassword: ['', Validators.required],
      termsAndConditions: ['', Validators.required],
      receiveNotifications: [true, Validators.required]
    }, {
      validator: PasswordValidation.MatchPassword // your validation method
    });
    //Set Initial Institution Selection
    this.institutionCtrl.setValue(null);
    //Load the initial institutions list
    this.filteredInstitutions.next(this.institutions.slice());
    //Listen for text changes in the search field
    this.institutionFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterInstitutions();
      });
  }

  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field).valid && form.get(field).touched;
  }

  displayFieldCss(form: FormGroup, field: string) {
    return {
      'has-error': this.isFieldValid(form, field),
      'has-feedback': this.isFieldValid(form, field)
    };
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  textValidationType(e) {
    if (e) {
      this.validTextType = true;
    } else {
      this.validTextType = false;
    }
  }

  passwordValidationRegister(e) {
    if (e.length > 8) {
      this.validPasswordRegister = true;
    } else {
      this.validPasswordRegister = false;
    }
  }

  confirmPasswordValidationRegister(e) {
    if (this.finishRegisterForm.controls['password'].value === e) {
      this.validConfirmPasswordRegister = true;
    } else {
      this.validConfirmPasswordRegister = false;
    }
  }

  protected setInitialValue() {
    this.filteredInstitutions
      .pipe(
        take(1),
        takeUntil(this._onDestroy)
      )
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredInstitutions are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: Institution, b: Institution) =>
          a && b && a.id === b.id;
      });
  }

  protected filterInstitutions() {
    if (!this.institutions) {
      return;
    }
    //get the search keyword
    let search = this.institutionFilterCtrl.value;
    if (!search) {
      this.filteredInstitutions.next(this.institutions.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    //filter the institutions
    this.filteredInstitutions.next(
      this.institutions.filter(institution => institution.name.toLowerCase().indexOf(search) > -1)
    )
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  onFinishRegistration() {
    if (this.finishRegisterForm.valid) {
      console.log('Form Submitted. Institution Selected: ' + JSON.stringify(this.institutionCtrl.value));
      console.log('Submission Valid, sending POST Request: ' + JSON.stringify(this.finishRegisterForm.value));
      alert('Submission Valid, sending POST Request: ' + JSON.stringify(this.finishRegisterForm.value));
      //AuthService.completeRegistration() needs updating
      // this.authService.completeRegistration(
      //   this.email,
      //   this.finishRegisterForm.value.username,
      //   this.finishRegisterForm.value.confirmPassword,
      //   this.institutionCtrl.value.institution,
      //   this.route.snapshot.paramMap.get('id')
      // ).subscribe(() => {
      //   this.router.navigateByUrl('/home/main');
      // }, (error) => {
      //   console.log(error);
      // });
    } else {
      this.validateAllFormFields(this.finishRegisterForm);
    }
  }

}
