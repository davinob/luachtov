import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ShiurimSettingsPage } from './shiurim-settings.page';

const routes: Routes = [
  {
    path: '',
    component: ShiurimSettingsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ShiurimSettingsPage]
})
export class ShiurimSettingsPageModule {}
