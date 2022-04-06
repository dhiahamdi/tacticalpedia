import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { Billing } from 'app/interfaces/billing';
import { AuthenticationService } from 'app/services/authentication.service';
import { BillingInfoService } from 'app/services/billing-info.service';
import {MatSnackBar} from '@angular/material/snack-bar';

// Import the locale files
import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { locale as portuguese } from '../i18n/pt';

@Component({
  selector: 'app-edit-billing-info',
  templateUrl: './edit-billing-info.component.html',
  styleUrls: ['./edit-billing-info.component.scss']
})
export class EditBillingInfoComponent implements OnInit {

  form: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private translationLoader: FuseTranslationLoaderService,
    private translate: TranslateService,
    private authService: AuthenticationService,
    private billingInfoService: BillingInfoService,
    private snackbar: MatSnackBar
  ) { 
    this.translationLoader.loadTranslations(english, italian, portuguese);
  }

  ngOnInit(): void {

    // Reactive Form
    this.form = this._formBuilder.group({
      'user-type' : [''],
      name: [''],
      surname: [''],
      'company-name': [''],
      'p-iva': [''],
      'codice-fiscale': [''],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required]
    });


    // Populate form with database data
    this.authService.getUser().subscribe(
      user => {

        if (user.billing) {
          this.form.get('user-type').setValue(user.billing.userType);
          this.form.get('name').setValue(user.billing.name);
          this.form.get('surname').setValue(user.billing.surname);
          this.form.get('company-name').setValue(user.billing.companyName);
          this.form.get('p-iva').setValue(user.billing.pIva);
          this.form.get('codice-fiscale').setValue(user.billing.codiceFiscale);
          this.form.get('address').setValue(user.billing.address);
          this.form.get('city').setValue(user.billing.city);
          this.form.get('zip').setValue(user.billing.zip);
          this.form.get('state').setValue(user.billing.state);
          this.form.get('country').setValue(user.billing.country);
        }
      },
      error => {
        this.handleError(error);
      }
    );
  }


  update(): void{

    const f = this.form;

    if(f.valid){

        const updatedBilling : Billing = {
           userType: f.get('user-type').value,
           name: f.get('name').value,
           surname: f.get('surname').value,
           companyName: f.get('company-name').value,
           pIva: f.get('p-iva').value,
           codiceFiscale: f.get('codice-fiscale').value,
           address: f.get('address').value,
           city: f.get('city').value,
           zip: f.get('zip').value,
           state: f.get('state').value,
           country: f.get('country').value,
        }

        this.billingInfoService.updateBilling(updatedBilling).subscribe(
            data => {
                this.snackbar.open(this.translate.instant('PROFILE.BILLING_INFO_UPDATED'), this.translate.instant('SHARED.CLOSE'), {
                  duration: 3000
                });
            },
            error => {
                this.handleError(error);
                throw error;
            }
        );

        
    }
  }


  handleError(error: any) {
    this.snackbar.open(this.translate.instant('ERROR.GENERIC_ERROR_MESSAGE'), this.translate.instant('SHARED.CLOSE'), {
      duration: 3000
    });
  }



}
