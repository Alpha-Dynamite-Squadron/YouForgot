import { Routes } from '@angular/router';

import { DashboardLayoutComponent } from './layouts/dashboard/dashboard-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AuthenticationService } from './services/authentication.service';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  }, {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [AuthenticationService],
    children: [
      {
        path: 'home',
        canActivate: [AuthenticationService],
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      }, {
        path: 'components',
        canActivate: [AuthenticationService],
        loadChildren: './components/components.module#ComponentsModule'
      }, {
        path: 'forms',
        canActivate: [AuthenticationService],
        loadChildren: './forms/forms.module#Forms'
      }, {
        path: 'tables',
        canActivate: [AuthenticationService],
        loadChildren: './tables/tables.module#TablesModule'
      }, {
        path: 'widgets',
        canActivate: [AuthenticationService],
        loadChildren: './widgets/widgets.module#WidgetsModule'
      }, {
        path: 'charts',
        canActivate: [AuthenticationService],
        loadChildren: './charts/charts.module#ChartsModule'
      }, {
        path: 'calendar',
        canActivate: [AuthenticationService],
        loadChildren: './calendar/calendar.module#CalendarModule'
      }, {
        path: 'courses',
        canActivate: [AuthenticationService],
        loadChildren: './course-search/course-search.module#CourseSearchModule'
      }, {
        path: 'user',
        canActivate: [AuthenticationService],
        loadChildren: './userpage/user.module#UserModule'
      }
    ]
  }, {
    path: '',
    component: AuthLayoutComponent,
    children: [{
      path: '',
      loadChildren: './pages/pages.module#PagesModule'
    }]
  }
];
