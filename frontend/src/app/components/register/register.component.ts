import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, AsyncValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { AuthenticationService } from 'app/services/authentication.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Import the locale files
import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { locale as portuguese } from '../i18n/pt';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { MatStepper } from '@angular/material/stepper';
import { ErrorService } from 'app/services/error.service';

var L = require('app/utils/lists');


@Component({
    selector   : 'register',
    templateUrl: './register.component.html',
    styleUrls  : ['./register.component.scss'],
    animations: fuseAnimations
})
export class RegisterComponent implements OnInit, OnDestroy
{
    form: FormGroup;
    error: boolean;
    errorMessage: String;
    image: any;
    loading: boolean;
    accept_terms: boolean;

    // Horizontal Stepper
    @ViewChild('stepper') private stepper: MatStepper;

    horizontalStepperStep1: FormGroup;
    horizontalStepperStep2: FormGroup;

    disciplines = L.disciplines;
    roles = L.roles;
    qualifications = L.qualifications;

    // Private
    private _unsubscribeAll: Subject<any>;
    //errorService: any;
    url = '';


    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _fuseConfigService: FuseConfigService,
        private authService: AuthenticationService,
        private router: Router,
        private translationLoader: FuseTranslationLoaderService,
        private translate: TranslateService,
        private errorService: ErrorService,
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
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.translationLoader.loadTranslations(english, italian, portuguese);

        this.error = false;

        this.accept_terms = false;

        this.url = 'assets/images/avatars/profile.jpg'
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {

        // Horizontal Stepper form steps
        this.horizontalStepperStep1 = this._formBuilder.group({
            username: ['', [Validators.required, Validators.minLength(5)], this.authService.usernameValidator()],
            email: ['', [Validators.required, Validators.email], this.authService.emailValidator()],
            password : ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword : ['', [Validators.required, confirmPasswordValidator]],
            check: ['', Validators.required],
        });

        this.horizontalStepperStep2 = this._formBuilder.group({

            name: ['', Validators.required],
            surname: ['', Validators.required],
            address: [''],
            discipline: ['', Validators.required],
            role: ['', Validators.required],
            qualification: ['', Validators.required],
            lang: [this.translate.currentLang]
        });

        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.horizontalStepperStep1.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.horizontalStepperStep1.get('confirmPassword').updateValueAndValidity();
            });

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    checkTerms(): void {
        if (this.horizontalStepperStep1.get('check').hasError('required')) this.accept_terms=true;
    }

    checkBoxStatus(): void {
        this.accept_terms = this.horizontalStepperStep1.get('check').hasError('required');
    }

    /**
     * Finish the horizontal stepper
     */
    finishHorizontalStepper(): void

    {
        this.loading = true;

        const s1 = this.horizontalStepperStep1;
        const s2 = this.horizontalStepperStep2;

        if(s1.valid && s2.valid){

            const signUpInfo = new FormData();

            signUpInfo.set('username', s1.get('username').value);
            signUpInfo.set('email', s1.get('email').value);
            signUpInfo.set('password', s1.get('password').value);

            signUpInfo.set('image', this.image);

            signUpInfo.set('name', s2.get('name').value);
            signUpInfo.set('surname', s2.get('surname').value);
            signUpInfo.set('address', s2.get('address').value);
            signUpInfo.set('discipline', s2.get('discipline').value);
            signUpInfo.set('role', s2.get('role').value);
            signUpInfo.set('qualification', s2.get('qualification').value);
            signUpInfo.set('lang', this.translate.currentLang);

        
            this.authService.signup(signUpInfo).subscribe(
                data => {
                    this.error=false;
                    this.stepper.next();
                    this.loading = false;
                    //this.router.navigate(['/login']);
                },
                error => {
                    this.handleError(error);
                    throw error;    
                }
            );

        } 
    }

    toLogin(): void
    {
        this.router.navigate(['login']);
    }


    handleError(error: any) : void {
        this.errorMessage = this.errorService.getErrorCode(error);
    }

    onSelectFile(event) {

        if (event.target.files && event.target.files[0]) {
            
            var reader = new FileReader();
        
            reader.readAsDataURL(event.target.files[0]); // read file as data url

            this.image = event.target.files[0];
        
            reader.onload = (event) => { // called once readAsDataURL is completed
                this.url = String(event.target.result);

            }
        }
    }

    
    /**
     * Checks if username is already taken
     *
     * @param {AbstractControl} control
     * @returns {ValidationErrors | null}
    
    export const checkUsernameAlreadyTaken: AsyncValidatorFn = (control: AbstractControl): Promise<ValidationErrors | null> => {

        if ( !control.parent || !control )
        {
            return null;
        }

        const username = control.parent.get('username');

        return this.authService.checkUsernameAlreadyTaken(username)
            .map(res => {
              // if username is taken
              if (true) {
                // return error (key: value)
                return { 'usernameAlreadyTaken': res};
              }
            });

    };

 */
}


/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
 export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if ( !control.parent || !control )
    {
        return null;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('confirmPassword');

    if ( !password || !passwordConfirm )
    {
        return null;
    }

    if ( passwordConfirm.value === '' )
    {
        return null;
    }

    if ( password.value === passwordConfirm.value )
    {
        return null;
    }

    return {passwordsNotMatching: true};
};


