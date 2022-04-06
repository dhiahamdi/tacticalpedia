import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Billing } from 'app/interfaces/billing';
import { BackendRoutes } from 'app/utils/backend-routes';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillingInfoService {

  constructor(
    private http: HttpClient,
  ) { }

  updateBilling(updatedBilling: Billing): Observable<any>{
    return this.http.post<any>(environment.apiUrl + BackendRoutes.BILLING_UPDATE, updatedBilling);
  }

}
