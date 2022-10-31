import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../../shared/shared.module';
import { UserListPage } from './user-list.page';

import 'hammerjs';import { ChartsModule } from '@progress/kendo-angular-charts'; //for pie chat
import 'hammerjs';

const routes: Routes = [
  {
    path: '',
    component: UserListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChartsModule, //for pie chat
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserListPage]
})
export class UserListPageModule {}
