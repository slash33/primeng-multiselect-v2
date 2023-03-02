import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http
      .get<any>('assets/user-group.json')
      .toPromise()
      .then((res) => <any[]>res.data)
      .then((data) => {
        return data;
      });
  }

  getContrats() {
    return this.http
      .get<any>('assets/group-contrat.json')
      .toPromise()
      .then((res) => <any[]>res.data)
      .then((data) => {
        return data;
      });
  }
}
