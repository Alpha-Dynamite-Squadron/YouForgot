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
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      }, {
        path: 'components',
        loadChildren: './components/components.module#ComponentsModule'
      }, {
        path: 'forms',
        loadChildren: './forms/forms.module#Forms'
      }, {
        path: 'tables',
        loadChildren: './tables/tables.module#TablesModule'
      }, {
        path: 'widgets',
        loadChildren: './widgets/widgets.module#WidgetsModule'
      }, {
        path: 'charts',
        loadChildren: './charts/charts.module#ChartsModule'
      }, {
        path: 'calendar',
        loadChildren: './calendar/calendar.module#CalendarModule'
      }, {
        path: 'courses',
        loadChildren: './course-search/course-search.module#CourseSearchModule'
      }, {
        path: 'user',
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
