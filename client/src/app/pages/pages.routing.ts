import { Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { VerifyComponent } from './verify/verify.component';
import { FinishRegisterComponent } from './finish-register/finish-register.component';

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
      redirectTo: '/login',
      pathMatch: 'full'
    },
    {
      path: 'finish_registration/:id',
      component: FinishRegisterComponent
    }]
  }
];
