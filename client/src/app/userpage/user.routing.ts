import { Routes } from '@angular/router';
import { AssignmentsComponent } from './assignments/assignments.component';
import { CoursesComponent } from './courses/courses.component';

import { UserComponent } from './user.component';

export const UserRoutes: Routes = [
  {
    path: '',
    children: [ 
      { path: 'myprofile', component: UserComponent },
      { path: 'mycourses', component: CoursesComponent },
      { path: 'myassignments', component: AssignmentsComponent }
    ]
  }
];
