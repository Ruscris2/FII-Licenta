import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoginModel } from '../models/login.model';
import { BackendService } from '../backend.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('identifier') identifierField;
  @ViewChild('password') passwordField;

  @ViewChild('loginLabelView')
  private loginLabelView: ElementRef;

  loginLabel = 'Welcome! Enter credentials to login:';

  model = new LoginModel();

  constructor(private backendService: BackendService,
              private cookieService: CookieService,
              private authService: AuthService,
              private router: Router) {}

  onLoginClick() {
    // Validate input
    let modelValid = true;
    if(this.model.identifier === '') {
      this.identifierField.control.markAsDirty();
      modelValid = false;
    }

    if(this.model.password === '') {
      this.passwordField.control.markAsDirty();
      modelValid = false;
    }

    if(!modelValid) {
      return;
    }

    this.backendService.login(this.model.identifier, this.model.password).subscribe(res => {
      this.cookieService.set('sessionId', (<any>res).token);
      this.router.navigateByUrl('/');
    },
    error => {
      this.loginLabel = error.error[0].errorMessage;
      this.loginLabelView.nativeElement.style.color = '#9b2323';
    });
  }

  ngOnInit() {
    this.authService.redirectValidSession();
  }
}
