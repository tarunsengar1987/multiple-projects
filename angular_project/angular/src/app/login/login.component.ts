import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {CredentialResponse} from "google-one-tap";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public hasError: boolean
  private clientId = environment.clientId

  constructor(
    private authService: AuthService,
    private _ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {
    this.hasError = false
  }

  ngOnInit(): void {
    //this.auth.jwtTokenIsExpired("google");
    console.log("Login");
    //query params
    this.route.queryParamMap.subscribe(queryParamMap => {
      console.log("Query param map", queryParamMap);
      //route params
      this.route.paramMap.subscribe(routeParamMap => {
        console.log("Params: ", routeParamMap, queryParamMap);
        //Authorization token is handled
        if(queryParamMap.has("code")) {
          const code = queryParamMap.get("code");
          if(code !== null && code !== undefined){
            if(routeParamMap.has("apiName")) {
              console.log("API", routeParamMap.get("apiName"));
              const apiName = routeParamMap.get("apiName") as string;
              this.authService.getAccessTokenFromAuthCode(code, apiName);
            }
            else {
              console.log("Atlassian");
              this.authService.getAccessTokenFromAuthCode(code, "atlassian");
            }
          }
        } //TODO handle null && undefined //(code !== null && code !== undefined)
      });

      
    });

  }

  login = 'test';
  password = '';
  returnUrl = '';

  onLoginClick() {
    console.log(this.login, this.password);
    this.authService.login(this.login, this.password)
      .then(() => {
        this.router.navigateByUrl('/home')
      })
      .catch(() => {
        this.hasError = true
      })
  }

}
