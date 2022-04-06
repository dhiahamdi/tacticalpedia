import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ProfileService } from 'app/services/profile.service';
import { SubscriptionService } from 'app/services/subscription.service';


@Injectable({ providedIn: 'root' })
export class CanInsertTrainingGuard implements CanActivate {
    constructor(
        private router: Router,
        private subscriptionService: SubscriptionService,
        private profileService: ProfileService

    ) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

        try{
            const canPublish = await this.profileService.canPublish();
            const subscriptionInfo = await this.subscriptionService.getSubscription();

            const isSubscribed = subscriptionInfo.status === 'active';

            if(!(canPublish || isSubscribed)){
                this.router.navigate(['subscription/create'], { queryParams: { returnUrl: state.url } });
                return false;
            }

            return true;
        
        }catch(e){
            console.log(e);
            this.router.navigate(['subscription/create'], { queryParams: { returnUrl: state.url } });
            return false;
        }
    }
}