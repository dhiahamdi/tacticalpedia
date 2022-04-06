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
import { Stripe } from '@stripe/stripe-js';
import { StripeService } from 'ngx-stripe';
import { StripeProration } from 'app/interfaces/stripe-prorations';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StripeProrationConfirmDialogComponent } from '@fuse/components/stripe-proration-confirm-dialog/stripe-proration-confirm-dialog.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

const paypal_plans = require('app/utils/plans').paypal_plans;


@Component({
  selector: 'app-manage-subscription',
  templateUrl: './manage-subscription.component.html',
  styleUrls: ['./manage-subscription.component.scss']
})
export class ManageSubscriptionComponent implements OnInit {
  
  private plans; //paypal plans
  private subscription_type;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  successMessage: boolean;
  errorMessage: boolean;
  paypalCancelSubcripttionMessage: boolean;

  public configs = {};

  public data; //Data retrieved from route snapshot - subscription inside

  public subscription;

  @ViewChild("basic") basicSubscription?: NgxPaypalComponent;

  constructor(
    private translationLoader: FuseTranslationLoaderService,
    private stripeService: StripeBackendService,
    private router: Router,
    private route: ActivatedRoute,
    private payPalScriptService: PayPalScriptService,
    private paypalService: PaypalService,
    private subscriptionService: SubscriptionService,
    private _matDialog: MatDialog,
    private snackbar: MatSnackBar,
  ) 
  { 
    this.translationLoader.loadTranslations(english, italian, portuguese);

    this.route.queryParams.subscribe(params => {
      this.successMessage = params['success'] ? true : false;
    });

    //determine if subscription is monthly or yearly
    this.route.queryParams.subscribe(params => {
      
      this.subscription_type = params['type'];
      
      if(this.subscription_type === 'monthly'){
        this.plans = [paypal_plans['monthly']];

      } else if (this.subscription_type === 'yearly'){
        this.plans = [paypal_plans.yearly];
      }

    });

  }

  ngOnInit(): void {
      this.subscription = this.route.snapshot.data.subscription;
  }


  async stripePortal() {
    this.stripeService.stripePortal().subscribe(
      response => {
        window.location.href = response.url;
      },
      error => {
        this.errorMessage = true;
      }
    );
  }


  async getSubscription() {
    this.subscription = await this.subscriptionService.getSubscription();
  }


  async upgradeStripePlan(new_price?: String) {

    const subscriptionInfo = await this.subscriptionService.getSubscriptionInfo();

    const price = new_price ? new_price : 'yearly';

    // Prepare data for proration
    const stripeProration: StripeProration = {
      customer_id: subscriptionInfo.stripe.stripe_customer_id,
      subscription_id: subscriptionInfo.stripe.stripe_subscription_id,
      new_price: price
    };

    // Get proration overview
    const proration = await this.stripeService.getProration(stripeProration);
      proration.subscribe(invoice => {

        if (invoice.lines.data && invoice.total) {

          const discount = this.formatStripePrice(invoice.lines.data[0].amount);
          const total = this.formatStripePrice(invoice.total);
          const confirmMessage = 'L\'importo rimanente del tuo attuale abbonamento verrà detratto dal nuovo piano.';

          // Open dialog with charges overview
          this.openProrationDialog(confirmMessage, discount, total, price);

        } else {
          this.errorMessage = true;
        }

      } );
  }
  

  openProrationDialog(confirmMessage, discount, total, newPrice?) {

    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = confirmMessage;
    this.confirmDialogRef.componentInstance.discount = discount;
    this.confirmDialogRef.componentInstance.amount = total;

    this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result)
          this.confirmProration(newPrice);
        this.confirmDialogRef = null;
    });
  }


  confirmProration(newPrice?: String) {
    this.stripeService.updatePlan(newPrice).subscribe(
      data => { 
        this.errorMessage = false;
        this.successMessage = true
      },
      error => { 
        this.successMessage = false;
        this.errorMessage = true; }
    );
  }



  /* PAYPAL */
  upgradePaypalPlan(newPlan?: string) {
    const plan = newPlan ? newPlan : 'yearly';
    this.paypalService.upgradePlan(plan).subscribe(
      data => {
        window.location.href = data.response;
      },
      error => {
        this.errorMessage = true;
      }
    );
  }


  cancelPaypalSubscription() {
    this.paypalService.cancelSubscription().subscribe(
      data => {
        this.paypalCancelSubcripttionMessage = true;
      },
      error => {
        this.errorMessage = true;
      }
    );
  }


  formatStripePrice(price: number): string {
    if (price < 0)
      price = -price;

    return '€' + (price/100).toFixed(2);
  }

}
