import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'zmanim-settings', loadChildren: './zmanim-settings/zmanim-settings.module#ZmanimSettingsPageModule' },
  { path: 'shiurim-settings', loadChildren: './shiurim-settings/shiurim-settings.module#ShiurimSettingsPageModule' },
  { path: 'hanzaha-settings', loadChildren: './hanzaha-settings/hanzaha-settings.module#HanzahaSettingsPageModule' },
  { path: 'general-settings', loadChildren: './general-settings/general-settings.module#GeneralSettingsPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
