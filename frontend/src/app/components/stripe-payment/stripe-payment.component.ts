import { Component, OnInit, ViewChild } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

// Import the locale files
import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { locale as portuguese } from '../i18n/pt';

import { StripeCardComponent, StripeService } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StripeBackendService } from 'app/services/stripe-backend.service';
import { ErrorService } from 'app/services/error.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendRoutes } from 'app/utils/backend-routes';
import { AuthenticationService } from 'app/services/authentication.service';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.scss']
})
export class StripePaymentComponent implements OnInit {

  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  stripeTest: FormGroup;

  loading: boolean;
  errorMessage: string;

  private subscription_type;

  constructor(
    private translationLoader: FuseTranslationLoaderService,
    private stripeService: StripeService,
    private stripeBackendService: StripeBackendService,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private errorService: ErrorService,
    private router: Router,
    private route: ActivatedRoute
  ) 
  { 
    this.translationLoader.loadTranslations(english, italian, portuguese);

    this.loading = false;

    this.route.queryParams.subscribe(params => {
      this.subscription_type = params['type'];
    });
  }

  ngOnInit(): void {
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });
  }

  async createPaymentMethod(): Promise<void> {
    
    this.loading = true;

    const name = this.stripeTest.get('name').value;
 
    const user = await this.authService.getUser().toPromise();

    if (!user.billing) {
      this.handleError('MISSING_BILLING_INFO');
      return;
    }

    const billingName = user.billing.userType == 'private' ? user.billing.name + ' ' + user.billing.surname : user.billing.companyName;

    const billingDetails = {
      name: billingName,
      email: user.email,
      address: {
        city: user.billing.city,
        country: user.billing.country,
        line1: user.billing.address,
        postal_code: user.billing.zip,
        state: user.billing.state
      }
    }
    
    
    /* Create your 'card' payment method */
    this.stripeService.createPaymentMethod({
      type: 'card',
      card: this.card.element,
      /* Reference: https://stripe.com/docs/api/payment_methods/create#create_payment_method-billing_details */
      billing_details: billingDetails,
    }).subscribe(
      data => {
        if(data.error){
          this.loading = false;
          this.handleError(data.error);
          return;
        }

        this.stripePaymentMethodHandler(data.paymentMethod, this.subscription_type, billingDetails);
      },
      error => {
          this.handleError(error);
      }
    );
  }


  stripePaymentMethodHandler(paymentMethod : any, subscription_type: String, billingDetails: any) : void {

    // Show loading status

    const paymentMethodData = {
      email: billingDetails.email,
      name: billingDetails.name,
      paymentMethodId: paymentMethod.id,
      subscription_type: subscription_type,
      billing_details: billingDetails
    }

    this.stripeBackendService.stripePaymentMethodHandler(paymentMethodData).subscribe(
      data => {
          this.manageSubscriptionStatus(data);
          this.loading = false;
      },
      error => {
          this.handleError(error);
      }
    );


  }


  manageSubscriptionStatus(subscription) {
    const { latest_invoice } = subscription;
    const { payment_intent } = latest_invoice;

    if (payment_intent) {
      /* Do NOT share or embed your client_secret anywhere */
      const { client_secret, status } = payment_intent;
      if (status === "requires_action" || status === "requires_payment_method") {
        this.stripeService.confirmCardPayment(client_secret)
        .subscribe(
          data => {
            if (data.error) {
              this.loading = false;
              this.handleError(data.error);
              return;

            } else {
              // success
              this.router.navigate([BackendRoutes.MANAGE_SUBCRIPTION], { queryParams: { success: 'PAYMENT_SUCCES' }});
            }
          },
          error => {
            this.handleError(error)
            console.error('Error confirming card payment:', error);
          }
        )
      } else if (status === 'succeeded'){
        this.router.navigate([BackendRoutes.MANAGE_SUBCRIPTION], { queryParams: { success: 'PAYMENT_SUCCES' }});

      } else if (status === 'requires_payment_method'){
        this.handleError({message: 'PAYMENT_DECLINED'});

      }

    } else {
      /* If no payment intent exists, show the success state
       * Usually in this case if you set up a trial with the subscription
       */
      this.router.navigate([BackendRoutes.MANAGE_SUBCRIPTION], { queryParams: { success: 'PAYMENT_SUCCES' }});
    }
  }

  handleError(error: any) : void {
    this.errorMessage = this.errorService.getErrorCode(error);
}
  

}
