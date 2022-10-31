import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LeaveEmplistPage } from './leave-emplist.page';
import { SharedModule } from '../../../shared/shared.module';


const routes: Routes = [
  {
    path: '',
    component: LeaveEmplistPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LeaveEmplistPage]
})
export class LeaveEmplistPageModule {}
