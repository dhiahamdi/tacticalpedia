import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { TranslateService } from '@ngx-translate/core';
import { Billing } from 'app/interfaces/billing';
import { AuthenticationService } from 'app/services/authentication.service';
import { BillingInfoService } from 'app/services/billing-info.service';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {

  public billingForm: FormGroup;

  // Horizontal Stepper
  @ViewChild('stepper') private stepper: MatStepper;

  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private translate: TranslateService,
    private authService: AuthenticationService,
    private billingInfoService: BillingInfoService,
    private snackbar: MatSnackBar,
    ) {
    
    // Configure the layout
    this._fuseConfigService.config = {
      layout: {
          navbar   : {
              hidden: false
          },
          toolbar  : {
              hidden: false
          },
          footer   : {
              hidden: true
          },
          sidepanel: {
              hidden: true
          }
      }
    };
  
  }

  ngOnInit(): void {

     // Reactive Form
     this.billingForm = this._formBuilder.group({
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
          this.billingForm.get('user-type').setValue(user.billing.userType);
          this.billingForm.get('name').setValue(user.billing.name);
          this.billingForm.get('surname').setValue(user.billing.surname);
          this.billingForm.get('company-name').setValue(user.billing.companyName);
          this.billingForm.get('p-iva').setValue(user.billing.pIva);
          this.billingForm.get('codice-fiscale').setValue(user.billing.codiceFiscale);
          this.billingForm.get('address').setValue(user.billing.address);
          this.billingForm.get('city').setValue(user.billing.city);
          this.billingForm.get('zip').setValue(user.billing.zip);
          this.billingForm.get('state').setValue(user.billing.state);
          this.billingForm.get('country').setValue(user.billing.country);
        }
      },
      error => {
          this.handleError(error);
      }
    );
    
  }


  update(): void{

    const f = this.billingForm;

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
                console.log(data);
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
