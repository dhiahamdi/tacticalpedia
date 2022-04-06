import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { SubscriptionService } from "app/services/subscription.service";
import { AdminCustomizeService } from 'app/services/admin-customize.service';

@Injectable({
providedIn: 'root'
})
export class defaultSelectTaxonomiesResolverService implements Resolve<any> {
    constructor(private adminCustomizeService: AdminCustomizeService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.adminCustomizeService.getSelectTaxonomies().toPromise();
    }
}