import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
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
import { HomeComponent } from './dashboard/home/home.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { UploadComponent } from './dashboard/upload/upload.component';
import { FileUploadDirective } from './fileupload.directive';
import { GalleryComponent } from './dashboard/gallery/gallery.component';
import { GalleryEntryComponent } from './dashboard/gallery/gallery-entry/gallery-entry.component';
import { PhotoComponent } from './dashboard/photo/photo.component';
import { PhotoeditComponent } from './dashboard/photoedit/photoedit.component';
import { ExploreComponent } from './dashboard/explore/explore.component';
import { DragScrollModule } from 'ngx-drag-scroll';
import { FindComponent } from './dashboard/explore/find/find.component';
import { NewuploadsComponent } from './dashboard/newuploads/newuploads.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    EditorComponent,
    AccountboxComponent,
    SettingsComponent,
    HomeComponent,
    UploadComponent,
    FileUploadDirective,
    GalleryComponent,
    GalleryEntryComponent,
    PhotoComponent,
    PhotoeditComponent,
    ExploreComponent,
    FindComponent,
    NewuploadsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    routes,
    DragScrollModule
  ],
  providers: [ BackendService, CookieService, AuthService, NgbActiveModal ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
