import { Injectable } from '@angular/core';
import {environment} from "../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ForgotPassService {
  private BASE_URL: string = environment.getApiUrl() + '/user'

  constructor(private http: HttpClient) { }
  forgotPassword(email: string) {
    const params = new HttpParams().set('email', email);
    return this.http.post(`${this.BASE_URL}/forgot-password`, null, { params });
  }



  getResetToken(token: string) {
    return this.http.get(`${this.BASE_URL}/reset-password/${token}`);
  }

  resetPassword(dto: { token: string, password: string }) {
    return this.http.put(`${this.BASE_URL}/reset-password`, dto);
  }
}
