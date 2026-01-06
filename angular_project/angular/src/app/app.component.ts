
import {
  Component,
  OnInit
} from '@angular/core';

import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SharedEventService } from './shared-event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public user: any;

  public isLoggedIn: boolean

  constructor(
    private location: Location,
    private router: Router,
    private authService: AuthService,
    public jwtHelper: JwtHelperService,
    private eventservice:SharedEventService
  ) {
    this.isLoggedIn = false
  }

  public login(){
    this.router.navigate(['login']);
  }

  public logout(){
    this.authService.logout();
  }

  public isLoggedInReal(): boolean {
    return this.authService._loggedIn
  }

  public navLink(link: String){
    this.router.navigate([link]);
  }

  public ngOnInit(): void {
    const user = window.localStorage.getItem('doings-user')
    this.isLoggedIn = user !== null
    if(this.jwtHelper.isTokenExpired()){
      this.eventservice.openSnackBar('Login Expired', 'Close');
      this.router.navigate(['login']);
    }
    else console.log("TOKEN OK", this.jwtHelper.getTokenExpirationDate());
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  public openSettings() {

  }

}
