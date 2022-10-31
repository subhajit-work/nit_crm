import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../../shared/shared.module';
import { AddUserPage } from './add-user.page';
import {MatCheckboxModule} from '@angular/material/checkbox';

const routes: Routes = [
  {
    path: '',
    component: AddUserPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MatCheckboxModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddUserPage]
})
export class AddUserPageModule {}
