import { Component, Injectable, OnInit, AfterViewInit, ViewChild, OnDestroy, Input } from '@angular/core';

import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormBuilder, AbstractControl } from '@angular/forms';
import { PasswordValidation } from '../validationforms/password-validator';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { take, takeUntil } from 'rxjs/operators';

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
  selector: 'app-new-institution',
  templateUrl: './new-institution.component.html',
  styleUrls: ['./new-institution.component.css']
})
export class NewInstitutionComponent implements OnInit, AfterViewInit, OnDestroy {

  //Replace this with a database query and populate list with *ngFor
  protected institutions: Institution[] = [
    {name: 'California Polytechnic Institute - Pomona', id: 'A'},
    {name: 'University of Southern California', id: 'B'},
    {name: 'Grand Canyon University', id: 'C'}
  ];
  //Control for the selected institution
  public institutionCtrl: FormControl = new FormControl();
  //Control for MatSelect filter keyword
  public institutionFilterCtrl: FormControl = new FormControl();
  //List of Institutions filtered by search keyword
  public filteredInstitutions: ReplaySubject<Institution[]> = new
    ReplaySubject<Institution[]>(1);

  @ViewChild("singleSelect", { static: true }) singleSelect: MatSelect;

  //Subject that emits when the component has been destroyed
  protected _onDestroy = new Subject<void>();

  matcher = new MyErrorStateMatcher();
  type: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field).valid && form.get(field).touched;
  }
  displayFieldCss(form: FormGroup, field: string) {
    return {
      'has-error': this.isFieldValid(form, field),
      'has-feedback': this.isFieldValid(form, field)
    };
  }

  onType() {
    if (this.type.valid) {
    } else {
      this.validateAllFormFields(this.type);
    }
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
  ngOnInit() {
    //Set Initial Selection
    this.institutionCtrl.setValue(this.institutions[0]);
    //Load the initial institutions list
    this.filteredInstitutions.next(this.institutions.slice());
    //Listen for text changes in the search field
    this.institutionFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() =>{
        this.filterInstitutions();
      });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
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
  
}
