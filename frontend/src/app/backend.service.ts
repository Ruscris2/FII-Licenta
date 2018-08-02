
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class BackendService {
  private apiAddress = 'http://localhost:5000/';
  private fileApiAddress = 'http://localhost:5001/';

  constructor(private httpClient: HttpClient) {}

  register(firstName: string, lastName: string, username: string, email: string, password: string, address: string,
           country: string, city: string, zipCode: string) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

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

    return this.httpClient.post(this.apiAddress + 'account', json, { headers: headers });
  }

  login(identifier: string, password: string) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    const json = {
      accountIdentifier: identifier,
      password: password
    };

    return this.httpClient.post(this.apiAddress + 'token', json, { headers: headers });
  }

  accountInfo(token: string) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + token);

    return this.httpClient.get(this.apiAddress + 'account', { headers: headers });
  }

  pingToken(token: string) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + token);

    return this.httpClient.get(this.apiAddress + 'token', { headers: headers });
  }

  updateAccountInfo(token: string, firstName: string, lastName: string, country: string, city: string, address: string, zipcode: string) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + token);

    const json = {
      firstName: firstName,
      lastName: lastName,
      country: country,
      city: city,
      address: address,
      zipCode: zipcode
    };

    return this.httpClient.put(this.apiAddress + 'account', json, { headers: headers });
  }

  uploadRequest(token: string) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + token);

    return this.httpClient.get(this.apiAddress + 'upload', { headers: headers });
  }

  uploadFiles(filesJson: any) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    return this.httpClient.post(this.fileApiAddress + 'file', filesJson, { headers: headers });
  }
}
