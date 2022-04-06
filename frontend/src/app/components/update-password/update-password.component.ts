import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, EmailValidator, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Import the locale files
import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { locale as portuguese } from '../i18n/pt';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorService } from 'app/services/error.service';
import { UpdatePasswordRequest } from 'app/interfaces/update-password-request';
import { ProfileService } from 'app/services/profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector     : 'update-password',
    templateUrl  : './update-password.component.html',
    styleUrls    : ['./update-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class UpdatePasswordComponent implements OnInit, OnDestroy
{
    updatePasswordForm: FormGroup;
    error: boolean;
    errorMessage: String;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private profileService: ProfileService,
        private router: Router,
        private translationLoader: FuseTranslationLoaderService,
        private translate: TranslateService,
        private errorService: ErrorService,
        private snackbar: MatSnackBar
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
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.updatePasswordForm = this._formBuilder.group({
            oldPassword       : ['', Validators.required],
            password       : ['', Validators.required],
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator]]
        });

        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.updatePasswordForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.updatePasswordForm.get('passwordConfirm').updateValueAndValidity();
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

    updatePassword(): void{

        if(this.updatePasswordForm.valid){

            const passwordInfo : UpdatePasswordRequest ={
                oldPassword: this.updatePasswordForm.get('oldPassword').value,
                pass : this.updatePasswordForm.get('password').value
            }

            this.profileService.updatePassword(passwordInfo).subscribe(
            data => {
                this.updatePasswordForm.reset();
                
                this.updatePasswordForm.controls['oldPassword'].setErrors(null);
                this.updatePasswordForm.controls['password'].setErrors(null);
                this.updatePasswordForm.controls['passwordConfirm'].setErrors(null);

                this.snackbar.open(this.translate.instant('RESET.SUCCESS_MESSAGE'), this.translate.instant('SHARED.CLOSE'), {
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

    
    handleError(error: any) : void {
        this.snackbar.open(this.translate.instant('RESET.' + error), this.translate.instant('SHARED.CLOSE'), {
            duration: 3000
        });
    }
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
    const passwordConfirm = control.parent.get('passwordConfirm');

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
