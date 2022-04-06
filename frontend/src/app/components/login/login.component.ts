import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Import the locale files
import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { locale as portuguese } from '../i18n/pt';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'app/services/authentication.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { checkServerIdentity } from 'tls';
import { LoginRequest } from 'app/interfaces/login-request';
import { ErrorService } from 'app/services/error.service';



@Component({
    selector     : 'login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LoginComponent implements OnInit
{
    loginForm: FormGroup;
    error: boolean;
    errorMessage: String;
    emailNotConfirmed: boolean;
    confirmEmailsuccess: String;
    email: String;
    confirmMailSent: boolean;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private authService : AuthenticationService,
        private router: Router,
        private translationLoader: FuseTranslationLoaderService,
        private translate: TranslateService,
        private errorService: ErrorService,
        private route: ActivatedRoute
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

        //needed to show errors when invalid form is submitted
        this.error = false;

        //if redirected to login from e mail confirmation
        this.route.queryParams.subscribe(params => {
            this.confirmEmailsuccess = params['success'];
          });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {

        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            remember: [false]
        });
        
    }

    
    login(): void {
        if (this.loginForm.valid) {

            const loginInfo : LoginRequest ={
                email: this.loginForm.get('email').value,
                pass: this.loginForm.get('password').value,
                remember: this.loginForm.get('remember').value
            }
            console.log(loginInfo);
            //login

            this.authService.login(loginInfo).subscribe(
                
                data => {
                   
                    if (this.confirmEmailsuccess) {
                        
                        window.location.href = '/profile/manage-subscription';
                    }
                    else
                        window.location.href = '/';
                    
                },
                
                error => {
                    this.handleError(error);

                    //show send confirmation email again
                    if (error == 'EMAIL_NOT_VERIFIED') {
                        this.emailNotConfirmed = true;
                        this.email = this.loginForm.get('email').value;
                    }
                }
            );  
        }      
    }

    //send confirmation
    sendConfirm(): void {

        this.authService.sendConfirm({email: this.email}).subscribe(
            data => {
                this.confirmMailSent = true;
                this.errorMessage = undefined;
                      
                
            },
            error =>{

                this.handleError('CONFIRM_EMAIL_NOT_SENT');

            }
        );
    }


    handleError(error: any) : void {
        this.errorMessage = this.errorService.getErrorCode(error);
    }

}
