import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SubscriptionService } from 'app/services/subscription.service';



@Injectable({ providedIn: 'root' })
export class SubscriptionGuard implements CanActivate {
    constructor(
        private router: Router,
        private subscriptionService: SubscriptionService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        this.subscriptionService.getSubscription().then((subscription) => {

            if(subscription.status === 'inactive'){
                this.router.navigate(['/subscription/create'], { queryParams: { returnUrl: state.url } });
                return false;
            }

        });

        return true;
    }
}