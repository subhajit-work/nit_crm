import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { IonicModule } from '@ionic/angular';

import { LeaveListPage } from './leave-list.page';

const routes: Routes = [
  {
    path: '',
    component: LeaveListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LeaveListPage]
})
export class LeaveListPageModule {}
