import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getUsers(): Observable<any> {
    return this.http.get(`${this.api}/users`);
  }

  getUser(id: number): Observable<any> {
    return this.http.get(`${this.api}/users/${id}`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post(`${this.api}/users`, user);
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.put(`${this.api}/users/${id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.api}/users/${id}`);
  }
}