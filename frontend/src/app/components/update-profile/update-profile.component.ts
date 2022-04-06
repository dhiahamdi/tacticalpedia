import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { Profile } from 'app/interfaces/profile';
import { ErrorService } from 'app/services/error.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

// Import the locale files
import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { locale as portuguese } from '../i18n/pt';

import { Subject } from 'rxjs';
import { ProfileService } from 'app/services/profile.service';
import { TranslateService } from '@ngx-translate/core';

var L = require('app/utils/lists');

@Component({
    selector   : 'update-profile',
    templateUrl: './update-profile.component.html',
    styleUrls  : ['./update-profile.component.scss'],
    animations   : fuseAnimations
})
export class UpdateProfileComponent implements OnInit, OnDestroy
{
    form: FormGroup;
    url: string;
    image: any;

    fileUploaded: boolean;
    disciplines = L.disciplines;
    roles = L.roles;
    qualifications = L.qualifications;


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
        private profileService: ProfileService,
        private router: Router,
        private translationLoader: FuseTranslationLoaderService,
        private translate: TranslateService,
        private errorService: ErrorService
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

        //this.url = "/assets/images/avatars/profile.jpg";
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {   
        this.fileUploaded = false;

        // Reactive Form
        this.form = this._formBuilder.group({
            name : ['', Validators.required],
            surname  : ['', Validators.required],
            address : [''],
            discipline: ['', Validators.required],
            role: ['', Validators.required],
            qualification: ['', Validators.required]
        });

        this.profileService.getProfile().subscribe(
            data => {
                
                this.form.get('name').setValue(data.name);
                this.form.get('surname').setValue(data.surname);
                this.form.get('address').setValue(data.address);

                this.form.get('discipline').setValue(data.discipline);
                this.form.get('role').setValue(data.role);
                this.form.get('qualification').setValue(data.qualification);

            },
            error => {
                this.handleError(error);
            }
        );

        this.profileService.getProfilePic().subscribe(

            data => {
                
                var reader = new FileReader();

                reader.readAsDataURL(data); // read file as data url

                this.image = data;

                reader.onload = (event) => { // called once readAsDataURL is completed
                    this.url = String(event.target.result);
                    }

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

            const updatedProfile = new FormData();

            updatedProfile.set('name', f.get('name').value);
            updatedProfile.set('surname', f.get('surname').value);
            updatedProfile.set('address', f.get('address').value);
            updatedProfile.set('discipline', f.get('discipline').value);
            updatedProfile.set('role', f.get('role').value);
            updatedProfile.set('qualification', f.get('qualification').value);

            if (this.fileUploaded)
                updatedProfile.set('image', this.image);

            this.profileService.updateProfile(updatedProfile).subscribe({
                next: data => {
                    window.location.reload();
                    //this.router.navigate(['/home']);
                },
                error: error => {
                    this.handleError(error);
                    throw error;
                }
            });
        }
    }

    handleError(error: any) : void {
        this.errorMessage = this.errorService.getErrorCode(error);
    }

    onSelectFile(event) {
        if (event.target.files && event.target.files[0]) {

          this.fileUploaded = true;

          var reader = new FileReader();
    
          reader.readAsDataURL(event.target.files[0]); // read file as data url

          this.image = event.target.files[0];

          reader.onload = (event) => { // called once readAsDataURL is completed
            this.url = String(event.target.result);
            }
        }

    }
    
}
