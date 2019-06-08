
import { Injectable } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {BackendService} from './backend.service';
import {Observable} from 'rxjs/Observable';

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

  isLogged(): any {
    const observable = new Observable(res => {
      let result = true;

      const sessionCookieExists = this.cookieService.check('sessionId');
      if(!sessionCookieExists) {
        result = false;
      }

      if(result === true) {
        const token = this.cookieService.get('sessionId');
        this.backendService.pingToken(token).subscribe(res2 => {
            result = true;
          },
          error => {
            result = false;
          },
          () => res.next(result));
      } else {
        res.next(false);
      }
    });

    return observable;
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
