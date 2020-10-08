import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PagesRoutes } from './pages.routing';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ValidationFormsComponent } from '../forms/validationforms/validationforms.component'
import { FieldErrorDisplayComponent } from '../forms/validationforms/field-error-display/field-error-display.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PagesRoutes),
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    ValidationFormsComponent,
    FieldErrorDisplayComponent
  ]
})

export class PagesModule {}
