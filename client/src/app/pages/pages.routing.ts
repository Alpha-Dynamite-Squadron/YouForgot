import { Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { VerifyComponent } from './verify/verify.component';
import { FinishRegisterComponent } from './finish-register/finish-register.component';
import { PasswordVerifyComponent } from './password-verify/password-verify.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';

export const PagesRoutes: Routes = [

  {
    path: '',
    children: [{
      path: 'login',
      component: LoginComponent
    },
    {
      path: 'register',
      component: RegisterComponent
    },
    {
      path: 'verify',
      component: VerifyComponent
    },
    {
      path: 'finish_registration',
      component: FinishRegisterComponent,
      redirectTo: '/login',
      pathMatch: 'full'
    },
    {
      path: 'finish_registration/:id',
      component: FinishRegisterComponent
    },
    {
      path: 'verify_password',
      component: PasswordVerifyComponent
    },
    {
      path: 'reset_password',
      component: PasswordResetComponent,
      redirectTo: 'login',
      pathMatch: 'full'
    },
    {
      path: 'reset_password/:id',
      component: PasswordResetComponent
    }]
  }
];
