
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class BackendService {
  apiAddress = 'http://localhost:5000/';

  constructor(private httpClient: HttpClient) {}

  register(firstName: string, lastName: string, username: string, email: string, password: string, address: string,
           country: string, city: string, zipCode: string) {
    const headers = new HttpHeaders();
    const json = {
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: password,
      address: address,
      country: country,
      city: city,
      zipCode: zipCode
    };

    headers.append('Content-Type', 'application/json');
    return this.httpClient.post(this.apiAddress + 'account', json, { headers: headers });
  }
}
