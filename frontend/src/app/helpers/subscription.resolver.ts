import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { SubscriptionService } from "app/services/subscription.service";

@Injectable({
providedIn: 'root'
})
export class SubscriptionResolverService implements Resolve<any> {
    constructor(private subscriptionService: SubscriptionService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.subscriptionService.getSubscription();
    }
}