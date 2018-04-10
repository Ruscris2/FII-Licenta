import {Routes, RouterModule} from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditorComponent } from './dashboard/editor/editor.component';

export const router: Routes = [
  { path: '', component: DashboardComponent, children: [
      { path: '', redirectTo: 'editor', pathMatch:  'full' },
      { path: 'editor', component: EditorComponent }
    ]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
