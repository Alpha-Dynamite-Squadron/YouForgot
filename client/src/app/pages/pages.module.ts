import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PagesRoutes } from './pages.routing';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { VerifyComponent } from './verify/verify.component';
import { FinishRegisterComponent } from './finish-register/finish-register.component';
import { Forms } from '../forms/forms.module';
import { PasswordVerifyComponent } from './password-verify/password-verify.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PagesRoutes),
    FormsModule,
    Forms,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    VerifyComponent,
    FinishRegisterComponent,
    PasswordVerifyComponent,
    PasswordResetComponent
  ]
})

export class PagesModule {}
