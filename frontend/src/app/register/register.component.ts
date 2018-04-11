import { Component, ViewChild } from '@angular/core';
import { BackendService } from '../backend.service';
import { RegisterModel } from '../models/register.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @ViewChild('firstName') firstNameField;
  @ViewChild('lastName') lastNameField;
  @ViewChild('username') usernameField;
  @ViewChild('email') emailField;
  @ViewChild('password') passwordField;
  @ViewChild('confirmPassword') confirmPasswordField;

  confirmPasswordErrMsg = 'Valid confirm password is required!';
  registerComplete = false;

  model = new RegisterModel();

  backendErrors = [];

  constructor(private backendService: BackendService) {}

  onRegisterClick() {
    // Validate input
    let modelValid = true;
    if(this.model.firstName === '') {
      this.firstNameField.control.markAsDirty();
      modelValid = false;
    }

    if(this.model.lastName === '') {
      this.lastNameField.control.markAsDirty();
      modelValid = false;
    }

    if(this.model.username === '') {
      this.usernameField.control.markAsDirty();
      modelValid = false;
    }

    if(this.model.email === '') {
      this.emailField.control.markAsDirty();
      modelValid = false;
    }

    if(this.model.password === '') {
      this.passwordField.control.markAsDirty();
      modelValid = false;
    }

    if(this.model.confirmPassword === '') {
      this.confirmPasswordField.control.markAsDirty();
      modelValid = false;
    }

    if(!modelValid) {
      return;
    }

    // Check if passwords match
    if(this.model.password !== this.model.confirmPassword) {
      this.confirmPasswordErrMsg = 'Passwords don\'t match!';
      this.confirmPasswordField.control.setErrors({ 'invalid': true });
      return;
    }

    this.backendService.register(this.model.firstName, this.model.lastName, this.model.username, this.model.email,
      this.model.password, (this.model.address === '' ? null : this.model.address),
      (this.model.country === '' ? null : this.model.country),
      (this.model.city === '' ? null : this.model.city),
      (this.model.zipcode === '' ? null : this.model.zipcode)).subscribe(res => {
        this.registerComplete = true;
      },
      error => { this.backendErrors = error.error; });
  }
}


