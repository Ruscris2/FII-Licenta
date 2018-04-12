import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { routes } from './app.router';
import { BackendService } from './backend.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth.service';

import { AppComponent } from './app.component';
import { NavbarComponent } from './dashboard/navbar/navbar.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditorComponent } from './dashboard/editor/editor.component';
import { AccountboxComponent } from './dashboard/navbar/accountbox/accountbox.component';
import { SettingsComponent } from './dashboard/settings/settings.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    EditorComponent,
    AccountboxComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    routes
  ],
  providers: [ BackendService, CookieService, AuthService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
