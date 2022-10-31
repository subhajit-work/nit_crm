import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddCommonModelPage } from './add-common-model.page';
import { SharedModule } from '../../../shared/shared.module';
import {MatDialogModule} from '@angular/material/dialog';

const routes: Routes = [
  {
    path: '',
    component: AddCommonModelPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MatDialogModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddCommonModelPage]
})
export class AddCommonModelPageModule {}
