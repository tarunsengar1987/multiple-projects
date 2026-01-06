import { Injectable } from '@angular/core';
import { AuthGuardService, AuthService, clientGetToken } from './auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class AdminGuardService extends AuthGuardService {
    extendedRouter: Router;
    authServiceExtended: AuthService;

    constructor(router: Router, authService: AuthService, private jwtHelper: JwtHelperService) {
        super(router, authService);
        this.extendedRouter = router;
        this.authServiceExtended = authService;
    }

    //check admin logic
    isAdmin() : boolean{
        const token = clientGetToken()

        if(token){
            const decoded = this.jwtHelper.decodeToken(token);
            console.log("DECODED:", decoded);
            if(decoded["auth"][0]["authority"] == "APP_ADMIN") return true;
        }

        return false;
    }

    override canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        // Call the base canActivate method from AuthGuardService
        const isAuth = super.canActivate(route, state);

        if(!this.isAdmin()){
            this.extendedRouter.navigate(['/error']);
            return false
        }

        // Return true if both conditions are met
        return isAuth;
    }
}
