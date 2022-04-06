import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { TrainingDraft } from 'app/interfaces/training-draft';
import { AdminCustomizeService } from 'app/services/admin-customize.service';
import { TrainingCustomizeService } from 'app/services/training-customize.service';
import { TrainingService } from 'app/services/training.service';

// Import the locale files
import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { locale as portuguese } from '../i18n/pt';

var L = require('app/utils/lists');

@Component({
  selector: 'app-insert-draft',
  templateUrl: './insert-draft.component.html',
  styleUrls: ['./insert-draft.component.scss'],
  animations: fuseAnimations,
})
export class InsertDraftComponent implements OnInit {

  form: FormGroup;
  categories;
  defaultCategories;
  url: string;
  image: any;
  errorMessage: string;

  imgFiles: File[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private translationLoader: FuseTranslationLoaderService,
    private translate: TranslateService,
    private _fuseConfigService: FuseConfigService,
    private trainingCustomService: TrainingCustomizeService,
    private adminCustomizeService: AdminCustomizeService,
    private trainingService: TrainingService,
    private snackbar: MatSnackBar
  ) 
  { 
    this.url = '/assets/images/image-placeholder.jpg';

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
  }

  async ngOnInit(): Promise<void> {

    try {

      this.categories = await this.trainingCustomService.getCategories().toPromise()
      this.defaultCategories = await this.adminCustomizeService.getCategories().toPromise();
      this.categories = this.categories.concat(this.defaultCategories);

    } catch(e) {
      console.log(e);
    }



    this.form = this._formBuilder.group({
      name: [''],
      description: [''],
      category: ['', Validators.required],
  });
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
    this.imgFiles.push(...event.addedFiles);
  }

  onRemoveImg(event) {
    this.imgFiles.splice(this.imgFiles.indexOf(event), 1);
  }

  async insertDraft(){

    if(this.form.valid){

      if(!this.form.get('description').value && !this.image){

        this.errorMessage = 'INSERT_DRAFT.DESCR_OR_IMG_ERROR';
      }
      else{

        const trainingDraft = {};

        Object.keys(this.form.controls).forEach(key => {


          if(key === 'category'){
            //this is the user category
            var trainingCategories = [];
    
            for(let cat of this.categories){ 
              if(this.form.get(key).value.indexOf(cat.slug) != -1) {
                trainingCategories.push({
                  label : cat.label,
                  slug: cat.slug,
                });
              }
            }
    
            trainingDraft['category'] = trainingCategories;
          }

          //if no proposal name is set, give a default name
          else if(key ==='name' && !this.form.get(key).value) trainingDraft['name'] = 'DRAFT-' +  String(Date.now());
      
          else trainingDraft[key] = this.form.get(key).value;
    
        });

        try{
          const trainingDraftId = await this.trainingService.insertDraft({...trainingDraft, visibility:'private'} as TrainingDraft);

          //upload img files
          if(this.imgFiles){
            
            const trainingImage = new FormData();
            trainingImage.set('_id', trainingDraftId);
            for(let file of this.imgFiles)
              trainingImage.append('file', file);

            await this.trainingService.addImagesToTraining(trainingImage);
          
          }

          this.form.reset();
          this.form.controls['category'].setErrors(null);
          // Success snackbar
          this.snackbar.open(this.translate.instant('INSERT_DRAFT.SUCCESS_MESSAGE'), this.translate.instant('SHARED.CLOSE'), {
            duration: 3000
          });

        }catch(e){

          // Error Snackbar
          this.snackbar.open(this.translate.instant('ERROR.GENERIC_ERROR_MESSAGE'), this.translate.instant('SHARED.CLOSE'), {
            duration: 3000
          });
        }
      }

    }
  }
}
