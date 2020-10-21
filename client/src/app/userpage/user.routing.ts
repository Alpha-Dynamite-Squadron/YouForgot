import { Routes } from '@angular/router';
import { AssignmentsComponent } from './assignments/assignments.component';
import { CoursesComponent } from './courses/courses.component';

import { UserComponent } from './user.component';

export const UserRoutes: Routes = [
  {
    path: '',
    children: [ 
      { path: 'pages/user', component: UserComponent },
      { path: 'pages/courses', component: CoursesComponent },
      { path: 'pages/assignments', component: AssignmentsComponent }
    ]
  }
];
