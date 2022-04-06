import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { fuseAnimations } from '@fuse/animations';

// Import the locale files
import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { locale as portuguese } from '../i18n/pt';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { TrainingCustomizeService } from 'app/services/training-customize.service';
import { Training } from 'app/interfaces/training';
import { TrainingService } from 'app/services/training.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingTaxonomy } from 'app/interfaces/training-taxonomy';
import { AdminCustomizeService } from 'app/services/admin-customize.service';
import { ProfileService } from 'app/services/profile.service';
import { SubscriptionService } from 'app/services/subscription.service';
import { MatSnackBar } from '@angular/material/snack-bar';

var L = require('app/utils/lists');
var mime = require('mime-db');

@Component({
  selector: 'app-edit-training',
  templateUrl: './edit-training.component.html',
  styleUrls: ['./edit-training.component.scss'],
  animations: fuseAnimations
})
export class EditTrainingComponent implements OnInit {

  horizontalStepperStep1: FormGroup;
  horizontalStepperStep2: FormGroup;
  horizontalStepperStep3: FormGroup;
  horizontalStepperStep4: FormGroup;

  public canPublish;
  public isSubscribed;

  public defaultVisibility;
  public selectedVisibility;

  public image;
  public url;

  public categories;
  public defaultCategories;
  public categoriesLabels;
  
  public taxonomies;
  public customTaxonomies;
  public defaultTaxonomies;
  public taxonomiesLabels;

  public selectTaxonomies;
  public defaultSelectTaxonomies;

  public types;
  public contents;
  public goals;

  private trainingId;

  public loading: boolean;

  public dataIsLoaded: boolean;

  imgFiles: File[] = [];
  files: File[] = [];
  

  constructor(private _formBuilder: FormBuilder,
              private translationLoader: FuseTranslationLoaderService,
              private translate: TranslateService,
              private _fuseConfigService: FuseConfigService,
              private router: Router,
              private trainingCustomService:TrainingCustomizeService,
              private trainingService: TrainingService,
              private adminCustomizeService: AdminCustomizeService,
              private route: ActivatedRoute,
              private profileService: ProfileService,
              private subscriptionService: SubscriptionService,
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

      this.translationLoader.loadTranslations(english, italian, portuguese);

      this.types = L.types;
      this.contents = L.contents;
      this.goals = L.goals;
    }

  async ngOnInit(): Promise<void> {

    //initialize form
    this.horizontalStepperStep1 = this._formBuilder.group({
      goal: [''],
      strategy: [''],
      focus: ['']
      
    });

    this.horizontalStepperStep2 = this._formBuilder.group({
      description: [''],
      variants: ['']

    });

    this.horizontalStepperStep3 = this._formBuilder.group({
      name: [''],
      category: ['', [Validators.required]],
      type: [''],
      contents: [''],
      goals: [''],
      visibility: ['', [Validators.required]],
      observations: [''],
        
    });

    this.horizontalStepperStep4 = this._formBuilder.group({

      developements: [''],
      notes: ['']
        
    });

    try{
      //check if user can publish and/or is subscribed
      this.canPublish = await this.profileService.canPublish()

      const subscriptionInfo = await this.subscriptionService.getSubscription();
      this.isSubscribed = subscriptionInfo.status === 'active';

      //set default visibility
      this.defaultVisibility = (this.canPublish) ? 'public' : 'private';
      //initialize selected visibility to default visibility
      this.selectedVisibility = (this.canPublish) ? 'public' : 'private';
      
      this.horizontalStepperStep3.get('visibility').setValue(this.defaultVisibility);

      //get categories
      this.categories = await this.trainingCustomService.getCategories().toPromise();
      //get default categories
      this.defaultCategories = await this.adminCustomizeService.getCategories().toPromise()
      this.categories = this.categories.concat(this.defaultCategories);
      
      //get taxonomies
      this.customTaxonomies = await this.trainingCustomService.getTaxonomies().toPromise();
      this.defaultTaxonomies = await this.adminCustomizeService.getTaxonomies().toPromise()
      //get default taxonomies
      this.taxonomies = this.customTaxonomies.concat(this.defaultTaxonomies);

      //add form controls
      this.taxonomies.forEach((tax)=>{
        const fc = new FormControl('');
        fc.elementType = 'taxonomy';
        this.horizontalStepperStep3.addControl(tax.slug, fc);
        
      })

      //get select taxonomies
      this.selectTaxonomies = await this.trainingCustomService.getSelectTaxonomies().toPromise();
      //add control for custom taxonomies
      this.selectTaxonomies.forEach((selecT)=>{
        const fc = new FormControl('');
        fc.elementType = 'select-taxonomy';
        this.horizontalStepperStep3.addControl(selecT.name, fc);

      })

      //get default select taxonomies
      this.defaultSelectTaxonomies = await this.adminCustomizeService.getSelectTaxonomies().toPromise();
      //add control for default taxonomies and concat lists
      
      this.defaultSelectTaxonomies.forEach((selecT)=>{
        const fc = new FormControl('');
        fc.elementType = 'default-select-taxonomy';
        this.horizontalStepperStep3.addControl(selecT.name, fc);
        //add validator for public trainings
        this.horizontalStepperStep3.controls[selecT.name].setValidators([publicTrainingValidator]);
      })


      this.dataIsLoaded = true;
      
    }catch(e){

      this.handleError(e);
    }

     //change list of categories when visibility changes
     this.horizontalStepperStep3.get('visibility').valueChanges.subscribe(visibility => this.selectedVisibility=visibility);

     //update validity of controls on default select taxonomies when visibility changes
     this.horizontalStepperStep3.get('visibility').valueChanges.subscribe(() =>{
 
       Object.keys(this.horizontalStepperStep3.controls).forEach(key => {
         if(this.horizontalStepperStep3.controls[key].elementType === 'default-select-taxonomy')
           this.horizontalStepperStep3.get(key).updateValueAndValidity();
       })
     })

    
    //fill form with pre-existing values
    this.trainingId = this.route.snapshot.paramMap.get('id');

    this.trainingService.getTrainingFromId(this.trainingId).subscribe(
      data =>{
        

        const s1 = this.horizontalStepperStep1;
        const s2 = this.horizontalStepperStep2;
        const s3 = this.horizontalStepperStep3;
        const s4 = this.horizontalStepperStep4;

        //fill step 1
        Object.keys(s1.controls).forEach(key => {
          s1.get(key).setValue(data[key]);
        });

        //fill step 2
        Object.keys(s2.controls).forEach(key => {
          s2.get(key).setValue(data[key]);
        });

        //fill step 3
        Object.keys(s3.controls).forEach(key => {
          s3.get(key).setValue(data[key]);
        });


        //fill category, taxonomies and select taxonomies
        //category

        if(data.category)
          s3.get('category').setValue(data.category.map(cat => cat.slug));

        
        //select taxonomies
        if(data.selectTaxonomies && data.selectTaxonomies.length > 0){
          for (let selectT of this.selectTaxonomies){
            s3.get(selectT.name).setValue(
              data.selectTaxonomies
              .filter(select => select.name == selectT.name)
              .map(select => select.value)[0]
            );
          }
        

          //default select taxonomies
          for (let selectT of this.defaultSelectTaxonomies){
            s3.get(selectT.name).setValue(
              data.selectTaxonomies
              .filter(select => select.name == selectT.name)
              .map(select => select.value)[0]
            );
          }
        }

        //taxonomies
        if(data.taxonomies && data.taxonomies.length > 0){
          for(let tax of this.taxonomies){
            let match = data.taxonomies.filter(t => t.slug === tax.slug )[0];
            s3.get(tax.slug).setValue((match) ? match.value : '');
          } 
        }

        //fill step 4
        Object.keys(s4.controls).forEach(key => {
          s4.get(key).setValue(data[key]);
        });

        //fetch pictures
        if(data.image && data.image.length > 0){

          for(let imgPath of data.image){

            this.trainingService.getTrainingImg(imgPath,data._id).subscribe(
              data => {
                this.imgFiles = [...this.imgFiles, new File([data], 'temp_name.' + mime[data.type].extensions[0], {type: data.type})];
              },
              err => this.handleError(err)
            )
          
          }
        }

        //fetch non-img/video files
        if(data.files && data.files.length > 0){

          for(let f of data.files){

            this.trainingService.getTrainingFile(f.path, data._id).subscribe(
              data => this.files = [...this.files, new File([data], f.name)],
              err => this.handleError(err)
            )
          }
        }

      },
      err => this.handleError(err)
    );

  }

  async EditTraining(): Promise<void> {

    this.loading = true;

    const s1 = this.horizontalStepperStep1;
    const s2 = this.horizontalStepperStep2;
    const s3 = this.horizontalStepperStep3;
    const s4 = this.horizontalStepperStep4;

    const training = {};

    training['_id'] = this.trainingId;

    training['taxonomies'] = [];
    training['selectTaxonomies'] = [];

    Object.keys(s1.controls).forEach(key => {
      
      training[key] = s1.get(key).value;

    });
  

    Object.keys(s2.controls).forEach(key => {
        
      training[key] = s2.get(key).value;

    });


    Object.keys(s3.controls).forEach(key => {
      
      if(s3.controls[key].elementType === 'taxonomy'){
        //this is a custom taxonomy
        let label: string;
        for (let tax of this.taxonomies){
          if(tax.slug === key) label = tax.label;
        }

        let tax_obj = {
          label: label,
          slug: key,
          value: s3.get(key).value
        }

        training['taxonomies'].push(tax_obj);
      }

      else if(s3.controls[key].elementType === 'select-taxonomy' || s3.controls[key].elementType === 'default-select-taxonomy'){
        //this is a select taxonomy
        let select_tax_obj ={

          name: key,
          value: s3.get(key).value
        }

        training['selectTaxonomies'] = training['selectTaxonomies'].concat(select_tax_obj);
      }

      else if(key === 'category'){
        //this is the user category
        var trainingCategories = [];

        for(let cat of this.categories){
          if(s3.get(key).value.indexOf(cat.slug) != -1) {
            trainingCategories.push({
              label : cat.label,
              slug: cat.slug,
            });
          }
        }
        training['category'] = trainingCategories;
      }

      else  training[key] = s3.get(key).value;
    });

    Object.keys(s4.controls).forEach(key => {
        
      training[key] = s4.get(key).value;

    });

    try{
      //const trainingId = await this.trainingService.editTraining(training as Training);

      await this.trainingService.editTraining(training as Training);

      const trainingId = this.trainingId;

       //upload img files
       if(this.imgFiles){
        
        const trainingImage = new FormData();
        trainingImage.set('_id', trainingId);
        for(let file of this.imgFiles)
          trainingImage.append('file', file);

        await this.trainingService.addImagesToTraining(trainingImage);
      
      }else{

        await this.trainingService.deleteImagesFromTraining(trainingId);
      }

      //upload non img/video files
      if(this.files){

        const trainingFiles = new FormData();
        trainingFiles.set('_id', trainingId);
        for(let file of this.files)
          trainingFiles.append('file', file);

        
        await this.trainingService.addFilesToTraining(trainingFiles);

      }else{

        await this.trainingService.deleteFilesFromTraining(trainingId);
      }

      this.loading = false;

      if (trainingId)
        this.router.navigate(['/training/' + trainingId]);
      else
        this.router.navigate(['/training/library']);
    
    }catch(e){
      this.handleError(e);
    }

    
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

  onSelectImg(event) {
    this.handleDropzoneError(event);
    this.imgFiles.push(...event.addedFiles);
  }
  
  onRemoveImg(event) {
    this.imgFiles.splice(this.imgFiles.indexOf(event), 1);
  }

  onSelect(event) {
    this.handleDropzoneError(event);
    this.files.push(...event.addedFiles);
  }
  
  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  handleDropzoneError(event) {
    if (event.rejectedFiles)
      event.rejectedFiles.forEach(rejected => {
        if (rejected.reason == 'size') {
          this.snackbar.open(this.translate.instant('ERROR.FILE_SIZE_EXCEEDED'), this.translate.instant('SHARED.CLOSE'), {
            duration: 3000
          });
        } else {
          this.snackbar.open(this.translate.instant('ERROR.FILE_UPLOAD_GENERIC'), this.translate.instant('SHARED.CLOSE'), {
            duration: 3000
          });
        }
      });
  }

  handleError(error: any) {
    this.snackbar.open(this.translate.instant('ERROR.GENERIC_ERROR_MESSAGE'), this.translate.instant('SHARED.CLOSE'), {
      duration: 3000
    });
  }
  

}

/**
 * Public training Validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
 export const publicTrainingValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  if ( !control.parent || !control )
  {
      return null;
  }

  const visibility = control.parent.get('visibility').value;
  
  if(visibility !== 'public') return null;

  if(!control.value) return {required: true};
};
