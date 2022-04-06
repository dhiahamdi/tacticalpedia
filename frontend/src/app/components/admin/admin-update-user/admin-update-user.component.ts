import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { ErrorService } from 'app/services/error.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

// Import the locale files
import { locale as english } from '../../i18n/en';
import { locale as italian } from '../../i18n/it';
import { locale as portuguese } from '../../i18n/pt';

import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ManageUsersService } from 'app/services/admin/manage-users.service';
import { AuthenticationService } from 'app/services/authentication.service';
import { SubscriptionService } from 'app/services/subscription.service';

var L = require('app/utils/lists');

@Component({
    selector   : 'admin-update-user',
    templateUrl: './admin-update-user.component.html',
    styleUrls  : ['./admin-update-user.component.scss'],
    animations   : fuseAnimations
})
export class AdminUpdateUserComponent implements OnInit, OnDestroy
{
    form: FormGroup;
    url: string;
    image: any;

    user_id: string;

    subscriptionStatus: string;
    createdAt: string;
    updatedAt: string;
    customCategories: string;
    customTaxonomies: string;

    disciplines = L.disciplines;
    roles = L.roles;
    qualifications = L.qualifications;

    confirmUpdatedProfile: boolean;
    errorUpdatedProfile: boolean;


    // Private
    private _unsubscribeAll: Subject<any>;
    errorMessage: any;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _fuseConfigService: FuseConfigService,
        private manageUsersService: ManageUsersService,
        private router: Router,
        private translationLoader: FuseTranslationLoaderService,
        private translate: TranslateService,
        private errorService: ErrorService,
        private authService: AuthenticationService,
        private subscriptionService: SubscriptionService,
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

        // Set the private defaults
        this._unsubscribeAll = new Subject();

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
        this.user_id = this.route.snapshot.paramMap.get('id');

        // Reactive Form
        this.form = this._formBuilder.group({
            name : ['', Validators.required],
            surname  : ['', Validators.required],
            username: ['', [Validators.required, Validators.minLength(5)]],
            email: ['', [Validators.required, Validators.email]],
            emailVerified: ['', Validators.required],
            userRole: ['', Validators.required],
            canPublish: ['', Validators.required],
            address : [''],
            discipline: ['', Validators.required],
            role: ['', Validators.required],
            qualification: ['', Validators.required]
        });

        this.manageUsersService.getUserInfo(this.user_id).subscribe(
            user => {

                console.log(user);

                const status = this.subscriptionService.getSubscriptionStatus({paypal: user.paypal, stripe: user.stripe}) 
                this.subscriptionStatus = status.status == 'inactive' ? 'NON ATTIVO' : 'ATTIVO (' + status.type + ')';
                this.createdAt = new Date(user.createdAt).toLocaleString();
                this.updatedAt = new Date(user.updatedAt).toLocaleString();
                this.customCategories = user.custom_categories.map(category => category.label).join(', ');
                this.customTaxonomies = user.custom_taxonomies.map(tax => tax.label).join(', ');
 
                this.form.get('name').setValue(user.profile.name);
                this.form.get('surname').setValue(user.profile.surname);
                this.form.get('username').setValue(user.username);
                this.form.get('email').setValue(user.email);
                this.form.get('emailVerified').setValue( (user.emailVerified == 'verified') ? 'yes' : 'no' );
                this.form.get('userRole').setValue(user.role);
                this.form.get('canPublish').setValue(user.canPublish == true ? 'yes' : 'no');
                console.log(user.canPublish);
                this.form.get('address').setValue(user.profile.address);
                this.form.get('discipline').setValue(user.profile.discipline);
                this.form.get('role').setValue(user.profile.role);
                this.form.get('qualification').setValue(user.profile.qualification);

            },
            error => {
                this.handleError(error);
            }
        );


        
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
    update(): void{

        const f = this.form;

        if(f.valid){

            const updatedUser = new FormData();

            updatedUser.set('_id', this.user_id);
            updatedUser.set('name', f.get('name').value);
            updatedUser.set('surname', f.get('surname').value);
            updatedUser.set('username', f.get('username').value);
            updatedUser.set('email', f.get('email').value);
            updatedUser.set('emailVerified', f.get('emailVerified').value);
            updatedUser.set('userRole', f.get('userRole').value);
            updatedUser.set('canPublish', f.get('canPublish').value == "yes" ? "true" : "false");
            updatedUser.set('address', f.get('address').value);
            updatedUser.set('discipline', f.get('discipline').value);
            updatedUser.set('role', f.get('role').value);
            updatedUser.set('qualification', f.get('qualification').value);
            updatedUser.set('image', this.image);
            
            this.manageUsersService.updateUser(updatedUser).subscribe({
                next: data => {
                    this.confirmUpdatedProfile = true;
                    this.errorUpdatedProfile = false;
                },
                error: error => {
                    this.handleError(error);
                    throw error;
                }
            });

            
        }
    }

    handleError(error: any) : void {
        this.confirmUpdatedProfile = false;
        this.errorUpdatedProfile = true;
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

    
}
