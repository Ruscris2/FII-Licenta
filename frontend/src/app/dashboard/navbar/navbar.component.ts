import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isCollapsed = true;
  isLogged = true;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.isLogged().subscribe(res => {
      this.isLogged = res;
    });
  }
}
