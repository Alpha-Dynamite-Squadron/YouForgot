import {
  async,
  ComponentFixture,
  TestBed,
  inject,
  tick,
  fakeAsync
} from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

//Import Types Required for Writing Spec Tests
import {} from 'jasmine';

import { RouterTestingModule } from '@angular/router/testing';
import { RegisterComponent } from './register.component';


describe( 'RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture <RegisterComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ RegisterComponent ]
    })
    .compileComponents(); //compiles the template and css
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  //Spec Definitions
  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should start application', () => {
    spyOn(component, "ngOnInit");
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

});
