import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module'

import { UserComponent } from './user.component';
import { UserRoutes } from './user.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(UserRoutes),
        FormsModule,
        MaterialModule
    ],
    declarations: [UserComponent]
})

export class UserModule {}
