import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StripeProration } from 'app/interfaces/stripe-prorations';
import { BackendRoutes } from 'app/utils/backend-routes';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StripeBackendService {

  constructor(
    private http: HttpClient,
  ) { }

  stripePortal(): Observable<any> {
    return this.http.post<any>(environment.apiUrl + BackendRoutes.STRIPE_CREATE_PORTAL, {});
  }

  stripePaymentMethodHandler(paymentMethodData): Observable<any> {
    return this.http.post<any>(environment.apiUrl + BackendRoutes.STRIPE_PAYMENT_METHOD_HANDLER, paymentMethodData);
  }

  getProration(stripeProration: StripeProration): Observable<any> {
    return this.http.post<any>(environment.apiUrl + BackendRoutes.STRIPE_GET_PRORATION, stripeProration);
  }

  updatePlan(newPrice: String): Observable<any> {
    return this.http.post<any>(environment.apiUrl + BackendRoutes.STRIPE_UPDATE_PLAN, {new_price: newPrice});
  }
  
}
