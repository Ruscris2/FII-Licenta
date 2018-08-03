
import { Injectable } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {BackendService} from './backend.service';

@Injectable()
export class AuthService {

  constructor(private backendService: BackendService, private cookieService: CookieService, private router: Router) {}

  redirectInvalidSession() {
    const sessionCookieExists = this.cookieService.check('sessionId');
    if(!sessionCookieExists) {
      this.router.navigateByUrl('/');
      return;
    }

    const token = this.cookieService.get('sessionId');
    this.backendService.pingToken(token).subscribe(res => {
      // Do nothing, token is valid
    },
      error => { this.router.navigateByUrl('/'); });
  }

  redirectValidSession() {
    const token = this.cookieService.get('sessionId');
    this.backendService.pingToken(token).subscribe(res => {
        this.router.navigateByUrl('/');
      });
  }

  isLogged(): Promise<boolean> {
    const sessionCookieExists = this.cookieService.check('sessionId');
    if(!sessionCookieExists) {
      return new Promise<boolean>(resolve => resolve(false));
    }

    const token = this.cookieService.get('sessionId');
    this.backendService.pingToken(token).subscribe(res => {
        return new Promise<boolean>(resolve =>  resolve(true));
    },
      error => new Promise<boolean>(resolve =>  resolve(false)));
  }

  getToken() {
    return this.cookieService.get('sessionId');
  }

  getUsername() {
    const jwtData = this.getToken().split('.')[1];
    const jwtDecoded = window.atob(jwtData);
    const jwtJson = JSON.parse(jwtDecoded);

    return jwtJson.unique_name;
  }
}
