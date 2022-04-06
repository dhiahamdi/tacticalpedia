import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Import the locale files
import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { locale as portuguese } from '../i18n/pt';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/services/authentication.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ErrorService } from 'app/services/error.service';


@Component({
    selector     : 'forgot-password',
    templateUrl  : './forgot-password.component.html',
    styleUrls    : ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ForgotPasswordComponent implements OnInit
{
    forgotPasswordForm: FormGroup;
    
    error: boolean;
    errorMessage: String;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthenticationService,
        private errorService: ErrorService,
        private translationLoader: FuseTranslationLoaderService,
        private translate: TranslateService,
        private snackBar: MatSnackBar
    )
    {
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
        
        //load translations
        this.translationLoader.loadTranslations(english, italian, portuguese);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {   
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    sendResetLink(): void{
        
        if(this.forgotPasswordForm.valid) {
        
            const email = this.forgotPasswordForm.get('email').value;

            //send link for reset password
            this.authService.sendResetLink(email).subscribe(
                data => {
                    const message = this.translate.instant('FORGOT.EMAIL_SENT');
                    const close = this.translate.instant('SHARED.CLOSE');
                    this.snackBar.open(message, close);
                },
                error => {
                    this.handleError(error);
                    throw error;
                }
            );

        }
    }


    handleError(error: any) : void {
        this.errorMessage = this.errorService.getErrorCode(error);
    }
}
