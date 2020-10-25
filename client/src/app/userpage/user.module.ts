import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module'

import { UserComponent } from './user.component';
import { UserRoutes } from './user.routing';
import { CoursesComponent } from './courses/courses.component';
import { AssignmentsComponent } from './assignments/assignments.component';
import { Forms } from '../forms/forms.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(UserRoutes),
        FormsModule,
        MaterialModule,
        Forms
    ],
    declarations: [
      UserComponent, 
      CoursesComponent, 
      AssignmentsComponent
    ]
})

export class UserModule {}
