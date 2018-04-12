import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { BackendService } from '../../backend.service';
import { AccountModel } from '../../models/account.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  username = '';
  firstName = '';
  lastName = '';
  email = '';
  country = '';
  city = '';
  address = '';
  zipcode = '';

  firstNameEditMode = false;
  lastNameEditMode = false;
  countryEditMode = false;
  cityEditMode = false;
  addressEditMode = false;
  zipcodeEditMode = false;

  accountData = new AccountModel();

  constructor(private authService: AuthService, private backendService: BackendService) { }

  ngOnInit() {
    this.authService.redirectInvalidSession();

    this.backendService.accountInfo(this.authService.getToken()).subscribe(res => {
      // Map to model
      this.accountData.username = (<any>res).username;
      this.accountData.firstName = (<any>res).firstName;
      this.accountData.lastName = (<any>res).lastName;
      this.accountData.email = (<any>res).email;
      this.accountData.country = (<any>res).country;
      this.accountData.city = (<any>res).city;
      this.accountData.address = (<any>res).address;
      this.accountData.zipcode = (<any>res).zipcode;

      this.updateViewsFromModel();
    });
  }

  updateViewsFromModel() {
    // Map to views
    this.username = this.accountData.username;
    this.firstName = this.accountData.firstName;
    this.lastName = this.accountData.lastName;
    this.email = this.accountData.email;
    this.country = this.accountData.country === null ? 'No information' : this.accountData.country;
    this.city = this.accountData.city === null ? 'No information' : this.accountData.city;
    this.address = this.accountData.address === null ? 'No information' : this.accountData.address;
    this.zipcode = this.accountData.zipcode === null ? 'No information' : this.accountData.zipcode;
  }

  onSaveChangesClicked(source: string) {
    // Update the model based on source
    switch (source) {
      case 'firstname':
        this.accountData.firstName = this.firstName;
        break;
      case 'lastname':
        this.accountData.lastName = this.lastName;
        break;
      case 'country':
        this.accountData.country = this.country;
        break;
      case 'city':
        this.accountData.city = this.city;
        break;
      case 'address':
        this.accountData.address = this.address;
        break;
      case 'zipcode':
        this.accountData.zipcode = this.zipcode;
        break;
    }

    this.backendService.updateAccountInfo(this.authService.getToken(), this.accountData.firstName,
      this.accountData.lastName, this.accountData.country, this.accountData.city, this.accountData.address,
      this.accountData.zipcode).subscribe(res => {
        // TODO: Somekind of confirmation message?
    });
  }

}
