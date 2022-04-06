import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from 'app/services/authentication.service';
import { ProfileService } from 'app/services/profile.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

        const logged = this.authenticationService.isLogged();

        if(!logged){
            this.router.navigate(['/']);
            return false;
        }

        return this.authenticationService.isAdmin();
        
    }
}