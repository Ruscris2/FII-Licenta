import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditorComponent } from './dashboard/editor/editor.component';
import { SettingsComponent } from './dashboard/settings/settings.component';
import { HomeComponent } from './dashboard/home/home.component';
import { UploadComponent } from './dashboard/upload/upload.component';
import { GalleryComponent } from './dashboard/gallery/gallery.component';
import { PhotoComponent } from './dashboard/photo/photo.component';
import { PhotoeditComponent } from './dashboard/photoedit/photoedit.component';
import { ExploreComponent } from './dashboard/explore/explore.component';
import { FindComponent } from './dashboard/explore/find/find.component';

export const router: Routes = [
  { path: '', component: DashboardComponent, children: [
      { path: '', redirectTo: 'home', pathMatch:  'full' },
      { path: 'home', component: HomeComponent },
      { path: 'editor', component: EditorComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'upload', component: UploadComponent },
      { path: 'gallery', component: GalleryComponent },
      { path: 'explore', component: ExploreComponent },
      { path: 'explore/find/:name/:startdate/:enddate/:minrating/:maxrating', component: FindComponent },
      { path: 'photo/:id', component: PhotoComponent },
      { path: 'photo/:id/edit', component: PhotoeditComponent }
    ]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
