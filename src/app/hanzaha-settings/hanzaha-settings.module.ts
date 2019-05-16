import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HanzahaSettingsPage } from './hanzaha-settings.page';

const routes: Routes = [
  {
    path: '',
    component: HanzahaSettingsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HanzahaSettingsPage]
})
export class HanzahaSettingsPageModule {}
