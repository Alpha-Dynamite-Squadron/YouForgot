import { Routes } from '@angular/router';
import { AssignmentComponent } from './assignment/assignment.component';

import { ButtonsComponent } from './buttons/buttons.component';
import { CourseComponent } from './course/course.component';
import { GridSystemComponent } from './grid/grid.component';
import { IconsComponent } from './icons/icons.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PanelsComponent } from './panels/panels.component';
import { SweetAlertComponent } from './sweetalert/sweetalert.component';
import { TypographyComponent } from './typography/typography.component';


export const ComponentsRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'buttons',
      component: ButtonsComponent
    }]
  }, {
    path: '',
    children: [{
      path: 'grid',
      component: GridSystemComponent
    }]
  }, {
    path: '',
    children: [{
      path: 'icons',
      component: IconsComponent
    }]
  }, {
    path: '',
    children: [{
      path: 'notifications',
      component: NotificationsComponent
    }]
  }, {
    path: '',
    children: [{
      path: 'panels',
      component: PanelsComponent
    }]
  }, {
    path: '',
    children: [{
      path: 'sweet-alert',
      component: SweetAlertComponent
    }]
  }, {
    path: '',
    children: [{
      path: 'typography',
      component: TypographyComponent
    }]
  }, {
    path: '',
    children: [{
      path: 'assignment',
      component: AssignmentComponent
    }]
  }, {
    path: '',
    children: [{
      path: 'course/:id',
      component: CourseComponent
    }]
  }, {
    path: '',
    children: [{
      path: 'course',
      pathMatch: 'full',
      redirectTo: '/user/mycourses',
      component: CourseComponent
    }]
  }
];
