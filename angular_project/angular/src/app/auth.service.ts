import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { environment } from '../environments/environment';
import { AppUser } from 'src/app/model/appuser.model';
import { Observable, catchError, lastValueFrom } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpService } from './http.service';
import { Api } from './model/api.model';

const defaultPath = '/home';

export interface AccessContext {
  user: AppUser;
}

interface LoginResult {
  jwt: string;
  accessContext: AccessContext;
}

@Injectable()
export class AuthService {

  public _loggedIn: boolean = false;

  private BASE_URL: string = environment.getApiUrl() + '/me';

  get loggedIn(): boolean {
    if (!this._loggedIn) {
      let cookieValue = this.cookieService.get('isLoggedIn');
      if (cookieValue && cookieValue === 'true') {
        this._loggedIn = true;
        return true;
      }
    }
    return this._loggedIn;
  }

  private _lastAuthenticatedPath: string = defaultPath;
  set lastAuthenticatedPath(value: string) {
    this._lastAuthenticatedPath = value;
  }

  constructor(private router: Router, private cookieService: CookieService, private http: HttpClient, private jwtHelper: JwtHelperService, private httpService: HttpService) { }

  login(alias: string, password: string) {
    this.clearSessionData();
    return this.loginRequest(alias, password)
      .toPromise()
      .then((loginResult: LoginResult | undefined) => {
        if(loginResult){
          console.log("Login successfull...", loginResult.accessContext, loginResult.jwt);
          this.clientSaveToken(loginResult.jwt);
          this.clientSaveMe(loginResult.accessContext);
          return loginResult;
        }else{
          return null; //TODO resolve this so its not null?
        }

      })

      .then(()=> {
        if (this._loggedIn) {
          //this.navigateToBestPossibleDestination(returnUrl);
        }
      });
  }

  //Deprecated
  jwtTokenIsExpired(token: string, apiName: string) : boolean{
    console.log("Checking JWT...");
    let userId;
    const currentTimestamp = Date.now();

    if(this.me() != null){
      userId = this.me().user.id;

      if(apiName == "google"){ //google is different
        console.log("Google expiration time check", token, apiName);


        console.log("Token info", localStorage.getItem("google_expires"));
        const expTime = localStorage.getItem("google_expires");
        if(!expTime || parseFloat(expTime) < currentTimestamp) return true; //thats the google way to tell the token is expired

        return false;

      }else if(token){
        const decoded = this.jwtHelper.decodeToken(token);
        const expirationTimestampInSeconds = decoded.exp; // Convert expiration timestamp to seconds
        console.log("JWT expired other", expirationTimestampInSeconds, currentTimestamp, expirationTimestampInSeconds > currentTimestamp);
        
        return expirationTimestampInSeconds < currentTimestamp;
      }else{
        console.log("No token found", apiName);
        return true;
      }
    }else{
      console.log("No user found");
      return true;
    }
  }

  //deprecated
  getAuthHead(){
    return "Bearer " + clientGetToken("atlassian");
  }

  private loginRequest(alias: string, password: string) {
    var formData: any = new FormData();
    formData.append('alias', alias);
    formData.append('password', password);
    console.log("Login URL used: " + this.BASE_URL + '/login')
    let test = this.http.post<LoginResult>(this.BASE_URL + '/login', formData);
    test.subscribe(req => {
      console.log("LoginRequest", req)
    })
    return test;
  }

  private loadMe() {
    return this.http.get(this.BASE_URL);
  }

  private clientSaveMe(accessContext: AccessContext) {
    this._loggedIn = true;
    // Get the current date and time
    let currentDate = new Date();

    // Add 48 hours (48 * 60 * 60 * 1000 milliseconds) to the current date
    let futureDate = new Date(currentDate.getTime() + (48 * 60 * 60 * 1000));

    this.cookieService.put('isLoggedIn', 'true', {expires:futureDate}); //, {httpOnly:true,secure:environment.getCookieSecure(),expires:futureDate} {expires:futureDate}
    if (accessContext) {
      this.cookieService.put('doings_me', encodeURI(JSON.stringify(accessContext)), {expires:futureDate});
    } else {
      this.cookieService.remove('doings_me');
    }
    return accessContext;
  }
  //---------------------------------- OAuth ---------------------------------------------------------
  //used to call the OAuth consent screen, that will redirect to doings with an authorization code
  oAuthInit(api: Api){

    //let scopes = "read%3Aconfluence-content.summary%20read%3Apage%3Aconfluence%20offline_access"; 
    let scopes = api.scope;
    console.log("OAuth2", api);

    const FRONTEND_URL_ENCODED = encodeURIComponent(environment.getBaseLink());
    const link = api.authurl+scopes+"&redirect_uri="+FRONTEND_URL_ENCODED+"%2Fintegrations%2Fapis%2F" + api.authkey;
    console.log("OAuth Link", link);
    //"https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=qMI5cuasnqQIOWUCtsjY3R75Fo2yQgGi&state=test&response_type=code&prompt=consent&scope="
    window.location.href = (link);    
  
  }

  saveNewRefreshToken(authkey: string, refreshToken: string, userId: string){
    const header = new HttpHeaders({"Content-Type":"application/json"});
    this.http.post(this.BASE_URL + "/oauth/saveRefreshToken/" + authkey + "/" + userId, refreshToken, {headers:header}).subscribe(data => {
      console.log("Refresh token saved", authkey, userId);
    });
  }

  useRefreshToken(apiName: string, userId: string) : Observable<string>{
    console.log("Getting new access token with refresh token...");
    return this.http.get<string>(this.BASE_URL + "/oauth/useRefreshToken/" + apiName + "/" + userId);
  }

  saveSecureToken(newApiTokens: { [api: string]: any }){
    const authHeadersJson = this.cookieService.get('authHeaders');
    let authHeaders;

      authHeaders = this.cookieService.get('authHeaders') ? JSON.parse(authHeadersJson || "{}") : {};
      const updatedAuthHeaders = { ...authHeaders, ...newApiTokens }; //merging old and new object

      console.log("SAVING AUTH", updatedAuthHeaders);

      this.cookieService.put('authHeaders', JSON.stringify(updatedAuthHeaders), {
        secure: true, // Only send over HTTPS
        sameSite: 'strict', // Protects against CSRF
        path: '/', // Available throughout the app
      });

      console.log("oauth token stored in cookie");
    
  }

  //OAUTH Step 2: trade auth code for access token
  getAccessTokenFromAuthCode(code: string, authkey: string){ //authkey is the short API name from DB
    const header = new HttpHeaders({"Content-Type":"application/json"});
    const body = code;
    this.http.post(this.BASE_URL + "/oauth/accessToken/" + authkey, body, {headers:header}).subscribe((data : any) => {
      const expireStamp = Date.now() + 360000;
      console.log("expireStamp", expireStamp);
      let temp = {access_token: data["access_token"], expires_in: expireStamp}; 
      localStorage.setItem(authkey, JSON.stringify(temp));

      this.saveSecureToken({[authkey]:temp});

      const userId = this.me().user.id;
      this.saveNewRefreshToken(authkey, data["refresh_token"], userId);
      
    });
  }

  //---------------------------------- end OAuth -----------------------------------------------------

  private clientSaveToken(token: string) {
    localStorage.setItem("doings_a", encodeURI(token));
  }

  private navigateToBestPossibleDestination(returnUrl: string) {
    if (returnUrl) {
      this.router.navigate([returnUrl]);
    } else {
      this.router.navigate([this._lastAuthenticatedPath]);
    }
  }

  logout() {
    this.clearSessionData();
    this.router.navigate(['/login']);
  }

  private clearSessionData() {
    this._loggedIn = false;
    this.cookieService.remove('isLoggedIn');
    this.cookieService.remove('doings_me');
    localStorage.removeItem('doings_a');
  }

  healthCheck() {
    return this.http.get(this.BASE_URL + '/health', { responseType: 'text' });
  }

  me() {
    console.log("Eating cookie...");
    let meCookieValue = this.cookieService.get('doings_me');
    if (!meCookieValue) {
      console.log("Cookie is empty...");
      return null;
    }
    try {
      let me = JSON.parse(decodeURI(meCookieValue));
      console.log("Searching me ...", me);
      return me;
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  addGoogleAccount(credential: string): Observable<LoginResult> {
    const formData: FormData = new FormData();
    formData.append('credential', credential);
    return this.http.post<LoginResult>(environment.getApiUrl() + `/user/add/google`, formData)
      .pipe(
        catchError((error) => {
          console.error('Error during login:', error);
          throw error;
        })
      );
  }

  atlassianAuth(){
    this.http.get("https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=qMI5cuasnqQIOWUCtsjY3R75Fo2yQgGi&scope=read%3Ame&redirect_uri=https%3A%2F%2Flocalhost%3A4200&state=test&response_type=code&prompt=consent").subscribe();
  }

  forgotPassword(email: string) {
    const params = new HttpParams().set('email', email);
    return this.http.post(`${environment.getApiUrl()}/user/forgot-password`, null, {params});
  }


  getResetToken(token: string) {
    return this.http.get(`${this.BASE_URL}/reset-password/${token}`);
  }

  resetPassword(dto: { token: string, password: string }) {
    return this.http.put(`${this.BASE_URL}/reset-password`, dto);
  }

  addUser(dto: { username: string, email: string, password: string, customer: {id: number, customername: string} }): Observable<any> {
    return this.http.post<any>(`${environment.getApiUrl()}/user/add`, dto);
  }

}

//AUTHORIZATION this method is used in app module by JWT module to auto infuse JWT token
export function clientGetToken(item = "doings_a") {
  console.log("item", item);
  let valueRaw = localStorage.getItem(item);
  if (!valueRaw) {
    return null;
  }
  try {
    let value = decodeURI(valueRaw);
    return value;
  } catch (error) {
    console.error(error);
  }
  return null;
}

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    const isLoggedIn = this.authService.loggedIn;

    let isLoginForm;
    if(route.routeConfig) isLoginForm = route.routeConfig.path === 'login';
    else isLoginForm = null;

    if(isLoggedIn && isLoginForm) {
      console.log("TEEEEEEEST 534");
      this.authService.lastAuthenticatedPath = defaultPath;
      this.router.navigate([defaultPath]);
      return false;
    }

    if(!isLoggedIn && !isLoginForm) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: _state.url }});
    }

    if(isLoggedIn) {
      if(route.routeConfig && route.routeConfig.path) this.authService.lastAuthenticatedPath = route.routeConfig.path;
    }

    if(isLoggedIn) return isLoggedIn;
    else if(isLoginForm) return isLoginForm;
    else return false; //TODO To return false may be wrong
  }
}
