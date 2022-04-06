import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendRoutes } from 'app/utils/backend-routes';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  constructor(
              private http: HttpClient,
              private cookieService: CookieService) { }

  savePayPalSubscription(payerId: String, subscription_id: String, subscription_type: String): Observable<any>{
    return this.http.post<any>(environment.apiUrl + BackendRoutes.PAYPAL_SUBSCRIPTION, {payerId: payerId, paypal_subscription_id: subscription_id, subscription_type: subscription_type});
  }

  upgradePlan(newPlan): Observable<any>{
    return this.http.post<any>(environment.apiUrl + BackendRoutes.PAYPAL_UPGRADE_PLAN, {new_plan: newPlan});
  }

  cancelSubscription(): Observable<any>{
    return this.http.post<any>(environment.apiUrl + BackendRoutes.PAYPAL_CANCEL_SUBSCRIPTION, {});
  }
}
