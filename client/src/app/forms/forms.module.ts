import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { TagInputModule } from 'ngx-chips';
import { SelectModule } from 'ng2-select';
import { MaterialModule } from '../app.module';
import { FormsRoutes } from './forms.routing';

import { ExtendedFormsComponent } from './extendedforms/extendedforms.component';
import { RegularFormsComponent } from './regularforms/regularforms.component';
import { ValidationFormsComponent } from './validationforms/validationforms.component';
import { WizardComponent } from './wizard/wizard.component';
import { FieldErrorDisplayComponent } from './validationforms/field-error-display/field-error-display.component';
import { NewAssignmentComponent } from './new-assignment/new-assignment.component';
import { NewCourseComponent } from './new-course/new-course.component';
import { NewInstitutionComponent } from './new-institution/new-institution.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(FormsRoutes),
    FormsModule,
    ReactiveFormsModule,
    NouisliderModule,
    TagInputModule,
    MaterialModule
  ],
  declarations: [
    ExtendedFormsComponent,
    RegularFormsComponent,
    ValidationFormsComponent,
    WizardComponent,
    FieldErrorDisplayComponent,
    NewAssignmentComponent,
    NewCourseComponent,
    NewInstitutionComponent,
    UpdateProfileComponent
  ],
  exports: [
    ExtendedFormsComponent,
    RegularFormsComponent,
    ValidationFormsComponent,
    FieldErrorDisplayComponent,
    NewAssignmentComponent,
    NewCourseComponent,
    NewAssignmentComponent,
    NewInstitutionComponent,
    WizardComponent,
    UpdateProfileComponent
  ]
})

export class Forms { }
