import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { StripeBackendService } from 'app/services/stripe-backend.service';

// Import the locale files
import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { locale as portuguese } from '../i18n/pt';

import {
  PayPalScriptService,
  IPayPalConfig,
  NgxPaypalComponent,
} from "ngx-paypal";
import { PaypalService } from 'app/services/paypal.service';
import { SubscriptionService } from 'app/services/subscription.service';
import { BackendRoutes } from 'app/utils/backend-routes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

const paypal_plans = require('app/utils/plans').paypal_plans;


@Component({
  selector: 'paypal-payment',
  templateUrl: './paypal-payment.component.html',
  styleUrls: ['./paypal-payment.component.scss']
})
export class PaypalPaymentComponent implements OnInit {
  
  private plans; //paypal plans
  public subscription_type;

  public configs = {};

  public  subscription;

  @ViewChild("monthly") monthlySubscription?: NgxPaypalComponent;
  @ViewChild("yearly") yearlySubscription?: NgxPaypalComponent;
  @ViewChild("company") companySubscription?: NgxPaypalComponent;

  constructor(
    private translationLoader: FuseTranslationLoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private payPalScriptService: PayPalScriptService,
    private paypalService: PaypalService,
    private subscriptionService: SubscriptionService,
    private snackbar: MatSnackBar,
    private translate: TranslateService,
  ) 
  { 
    this.translationLoader.loadTranslations(english, italian, portuguese);

    this.plans = [paypal_plans['monthly'], paypal_plans['yearly'], paypal_plans['company']]

    //determine if subscription is monthly or yearly
    this.route.queryParams.subscribe(params => {
      
      this.subscription_type = params['type'];
      
    });

  }

  ngOnInit(): void {
  
    this.plans.map((plan) => {
      this.configs[plan.name] = this.getConfig(plan.id, this.paypalService, plan.name, this.router);
    });

    this.payPalScriptService.registerPayPalScript(
      {
        clientId: 'Ads0TvWm8j9gYVUIN3aGKf98qaRGHAWav52NFSBPd74NvZH1koMWAZN1OlT9AppX2Xl6HjG722kGa_6X',
        currency: "EUR",
        vault: "true",
      },
      (payPalApi) => {
        if (this.monthlySubscription) {
          this.monthlySubscription.customInit(payPalApi);
        }
        if (this.yearlySubscription) {
          this.yearlySubscription.customInit(payPalApi);
        }
        if (this.companySubscription) {
          this.companySubscription.customInit(payPalApi);
        }
      }
    );

    this.subscriptionService.getSubscription().then((subscription)=>{
      this.subscription = subscription;
    });
  }

  
  getConfig(plan_id: string, payPalService: PaypalService, plan_name: String, router: Router): IPayPalConfig {

    return {
      clientId: 'Ads0TvWm8j9gYVUIN3aGKf98qaRGHAWav52NFSBPd74NvZH1koMWAZN1OlT9AppX2Xl6HjG722kGa_6X',
      currency: "EUR",
      vault: "true",
      style: {
        label: "paypal",
        layout: "vertical",
        size: "small",
        shape: "pill",
        color: "silver",
        tagline: false,
      },
      
      createSubscription: function (data, actions) {
        return actions.subscription.create({
          plan_id,
        });
      },
      onApprove: function (data, actions) {
        actions.subscription.get().then((details) => {

          payPalService.savePayPalSubscription(details.subscriber.payer_id, details.id, plan_name).subscribe(
            data =>{ 
              router.navigate([BackendRoutes.MANAGE_SUBCRIPTION], { queryParams: { success: 'PAYMENT_SUCCES' }});
            },
            error => {
              this.handleError(error);
            }
          );
        });

      },
      onCancel: (data, actions) => {
        console.log("OnCancel", data, actions);
      },
      onError: (err) => {
        console.log("OnError", err);
      },
      onClick: (data, actions) => {
        console.log("Clicked:", data, actions);
      },
    };
  }

  handleError(error: any) {
    this.snackbar.open(this.translate.instant('ERROR.GENERIC_ERROR_MESSAGE'), this.translate.instant('SHARED.CLOSE'), {
      duration: 3000
    });
  }

}
