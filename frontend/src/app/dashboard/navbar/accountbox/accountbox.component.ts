import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BackendService } from '../../../backend.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-accountbox',
  templateUrl: './accountbox.component.html',
  styleUrls: ['./accountbox.component.css']
})
export class AccountboxComponent implements OnInit {

  loggedIn = false;
  username = '';

  constructor(private backendService: BackendService, private cookieService: CookieService,
              private router: Router) { }

  ngOnInit() {
    const sessionCookieExists = this.cookieService.check('sessionId');
    if(!sessionCookieExists) {
      this.loggedIn = false;
      return;
    }

    const token = this.cookieService.get('sessionId');
    this.backendService.accountInfo(token).subscribe(res => {
      this.loggedIn = true;
      this.username = (<any>res).username;
    },
    error => {
      this.loggedIn = false;
    });
  }

  onLogoutClicked() {
    this.cookieService.delete('sessionId');
    window.location.reload();
  }

  onLoginNavClicked() {
    this.router.navigateByUrl('/login');
  }

  onRegisterNavClicked() {
    this.router.navigateByUrl('/register');
  }
}
