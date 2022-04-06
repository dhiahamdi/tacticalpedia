import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Location} from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { Training } from 'app/interfaces/training';
import { TrainingFile } from 'app/interfaces/training-file';
import { User } from 'app/interfaces/user';
import { AuthenticationService } from 'app/services/authentication.service';
import { ProfileService } from 'app/services/profile.service';
import { TrainingService } from 'app/services/training.service';

// Import the locale files
import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { locale as portuguese } from '../i18n/pt';

import { environment } from 'environments/environment';
import { AdminCustomizeComponent } from '../admin/admin-customize/admin-customize.component';
import { TrainingCustomizeService } from 'app/services/training-customize.service';
import { AdminCustomizeService } from 'app/services/admin-customize.service';

@Component({
  selector: 'app-single-training',
  templateUrl: './single-training.component.html',
  styleUrls: ['./single-training.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class SingleTrainingComponent implements OnInit {

  public authorName;

  private training_id: string;

  public user: User;

  public training: Training;

  public isDataLoaded: boolean;

  public selectedTab: number;

  private cookie: string;

  private forcedLang: string;

  public fullscreenOpen: boolean;

  private trainingTaxonomies: Array<any>;

  images: Blob[];

  imageObject: Array<object>;
  pdfImageObject: Array<object>;

  imgPaths: Array<string>;

  filePaths: Array<any>;

  constructor(
    private router: Router,
    private _fuseConfigService: FuseConfigService,
    private translationLoader: FuseTranslationLoaderService,
    private translate: TranslateService,
    private profileService: ProfileService,
    private adminCustomizeService: AdminCustomizeService,
    private trainingCustomizeService: TrainingCustomizeService,
    private route: ActivatedRoute,
    private trainingService: TrainingService,
    private snackbar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private _location: Location) 
    {

      // Configure the layout
      this._fuseConfigService.config = {
        layout: {
            navbar   : {
                hidden: this.fullscreenOpen ? true : false
            },
            toolbar  : {
                hidden: this.fullscreenOpen ? true : false
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

      this.isDataLoaded = false;

      this.imageObject = [];

      this.imgPaths = [];

      this.filePaths = [];


    }

  async ngOnInit(): Promise<void> {

    this.selectedTab = 0;

    if (this.authenticationService.isLogged()) {
      this.user = await this.authenticationService.getUser().toPromise();
    }

    this.route.queryParams.subscribe(params => {
      this.selectedTab = (params['pdf'] == 1) ? 3 : 0;
      this.cookie = params['ck'];
      if (params['lang']) {
        this.translate.use(params['lang']);
      }
    });

    this.training_id = this.route.snapshot.paramMap.get('id');
    
    this.trainingService.getTrainingFromId(this.training_id, {cookie: this.cookie, lang: this.translate.currentLang}).subscribe(
      async data => {
        this.training = data;

        const adminTaxonomies = await this.adminCustomizeService.getTaxonomies().toPromise();
        const userTaxonomies = await this.trainingCustomizeService.getUserTaxonomies(this.training.user_id).toPromise();

        this.trainingTaxonomies = (this.training.taxonomies.filter(tax => tax.value) as Array<any>).concat(adminTaxonomies ? adminTaxonomies : []).concat(userTaxonomies ? userTaxonomies : []).filter((elem) => {
        
          const inTraining = this.training.taxonomies.filter(tax => tax.value).some((el) => (el as any).label === (elem as any).label);
  
          if (inTraining && !elem.hasOwnProperty('value'))
            return false
  
          return true;
  
        });

        this.profileService.getFullNameFromId(this.training.user_id).subscribe(
          res => this.authorName = res.fullname,
          err => this.handleError(err)
        );

        //concat tacticalpedia img paths
        if(this.training.image && this.training.image.length > 0)
        this.imgPaths = this.imgPaths.concat(this.training.image);

        //concat tacticalpad img paths
        if(this.training.tacticalpad_publishing_id){

          const tacticalpadPaths = await this.trainingService.getTacticalPadImgPaths(this.training.tacticalpad_publishing_id, this.training._id).toPromise();

          this.imgPaths = this.imgPaths.concat(tacticalpadPaths);
        }

        //fetch trainings images
        if(this.imgPaths.length > 0){

          for(let imgPath of this.imgPaths){

            this.trainingService.getTrainingImg(imgPath, this.training._id).subscribe(
              data => {

                //fill the slider
                //read data in base 64
                var reader = new FileReader();
        
                reader.readAsDataURL(data); // read file as data url

            
                reader.onload = (event) => { // called once readAsDataURL is completed
                    
                  if(data.type ==='video/mp4'){

                    let newObject = {video: String(event.target.result), width: "100%"};

                    this.imageObject = [...this.imageObject, newObject]; 

                  }

                  else{

                    let newObject = {image: String(event.target.result), thumbImage: String(event.target.result), width: "100%"};

                    this.imageObject = [...this.imageObject, newObject];

                  }

                  this.imageObject.sort(function(a, b){
                    return (b as any).video ? 1 :-1;
                  })

                  this.pdfImageObject = this.imageObject.filter(obj => (obj as any).image);

                }


              },
              
              err => this.handleError(err));
          }
        }

        //Other files
        //concat tacticalpedia img paths
        if(this.training && this.training.files && this.training.files.length > 0)
        this.filePaths = this.filePaths.concat(this.training.files);

        //concat tacticalpad file paths
        if(this.training && this.training.tacticalpad_publishing_id){

          const tacticalpadFilePaths = await this.trainingService.getTacticalPadFilePaths(this.training.tacticalpad_publishing_id, this.training._id).toPromise();

          this.filePaths = this.filePaths.concat(tacticalpadFilePaths);
        }

        this.isDataLoaded = true;
      },
      err => this.handleError(err)
    );

  }

  public getTranslation(string: string):  string{
    return this.translate.instant(string);
  }

  public createPDF(){
  }

  async openfile(file: TrainingFile){

    const blob = await this.trainingService.getTrainingFile(file.path, this.training._id).toPromise();

    var reader = new FileReader();

    const fileURL = URL.createObjectURL(blob);

    window.open(fileURL, '_blank');
      
  }

  getTrainingTaxonomies() {
    return this.training.taxonomies.filter(tax => tax.value);
  }

  getTrainingSelectTaxonomies() {
    return this.training.selectTaxonomies.filter(tax => tax.value.length);
  }


  print() {
    //window.print();
    window.open(environment.apiUrl + `/training/pdf/${this.training._id}?lang=${this.translate.currentLang}` , "_blank");
  }


  handleError(error: any) {
    this.snackbar.open(this.translate.instant('ERROR.GENERIC_ERROR_MESSAGE'), this.translate.instant('SHARED.CLOSE'), {
      duration: 3000
    });
  }

  getCategoriesList() {
    return this.training.category.map(cat => cat.label);
  }

  fullscreen(action) {
    if (action === 'open') {
      this.fullscreenOpen = true;
    } else {
      this.fullscreenOpen = false;
    }

    this._fuseConfigService.config = {
      layout: {
          navbar   : {
              hidden: this.fullscreenOpen ? true : false
          },
          toolbar  : {
              hidden: this.fullscreenOpen ? true : false
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

  goBack() {
    this._location.back();
  }

}
