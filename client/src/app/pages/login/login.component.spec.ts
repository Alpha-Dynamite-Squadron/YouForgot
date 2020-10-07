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
  import {LoginComponent } from './login.component';
  
  
  describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let de: DebugElement;
  
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [ RouterTestingModule ],
        declarations: [LoginComponent ]
      })
      .compileComponents(); //compiles the template and css
    }));
  
    beforeEach(() => {
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      fixture.detectChanges();
    });

    //Spec Definitions
    it('should be created', () => {
        expect(component).toBeTruthy();
    });
    //testing the login method. 
    it('should set userResponse when login button is clicked', () => {
        expect(component.userResponse).toBeUndefined();
        let btn = fixture.debugElement.nativeElement.querySelector('#loginBtn');
        //btn.click();
        component.login();
        expect(component.userResponse).toBe('login');
        expect(btn.innerHTML).toBe('Login');
      });

      // it('login button should call login function', fakeAsync(() => {
      //   spyOn(component, 'login');
      
      //   let button = fixture.debugElement.nativeElement.querySelector('#loginBtn');
      //   button.click();
      //   tick();
      //   expect(component.login).toHaveBeenCalled();
      
      // }));
});