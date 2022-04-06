import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscription } from 'app/interfaces/subscription';
import { BackendRoutes } from 'app/utils/backend-routes';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { ProfileService } from './profile.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(
              private http: HttpClient,
              private cookieService: CookieService,
              private profileService: ProfileService) { }

  
  /**
   * Returns the subscription information for the current user
   */
  async getSubscription(): Promise<Subscription> {
    const subscriptionInfo = await this.getSubscriptionInfo();
    return this.getSubscriptionStatus(subscriptionInfo);
  }


  /**
   * Returns the stripe and paypal field of the current user
   */
  async getSubscriptionInfo() {
    return await this.http.get<any>(environment.apiUrl + BackendRoutes.SUBSCRIPTION_STATUS, {}).toPromise();
  }


  /**
   * Logic to calculate the subscription status
   * 
   * @param subscriptionInfo 
   * @returns 
   */
  getSubscriptionStatus(subscriptionInfo) {

    const stripe = subscriptionInfo.stripe;
    const paypal = subscriptionInfo.paypal;

    const stripeStatus: boolean = (stripe && stripe.stripe_subscription_status !== 'incomplete_expired' && stripe.stripe_subscription_status !== 'canceled');

    const paypalStatus: boolean = (paypal && paypal.paypal_subscription_status != 'incomplete_expired' && paypal.paypal_subscription_status != 'canceled');

    //stripe subscription
    if(stripeStatus) return {status: stripe.stripe_subscription_status, type: 'stripe', interval: stripe.stripe_subscription_interval};

    //paypal subscription
    else if(paypalStatus) return {status: paypal.paypal_subscription_status, type: 'paypal', interval: paypal.paypal_subscription_interval};

    //no subscription active
    else return {status: 'inactive'};

  }
  
}
