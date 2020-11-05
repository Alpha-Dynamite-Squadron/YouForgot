import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';
import { Forms } from '../forms/forms.module';

import { CourseSearchRoutes } from './course-search.routing';
import { CourseSearchComponent } from './course-search.component';
import { TablesModule } from '../tables/tables.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(CourseSearchRoutes),
      FormsModule,
      MaterialModule,
      Forms,
      TablesModule
  ],
  declarations: [
    CourseSearchComponent
  ],
  exports: [CourseSearchComponent]
})

export class CourseSearchModule {}