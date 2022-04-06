import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { TranslateService } from '@ngx-translate/core';
import { TrainingFile } from 'app/interfaces/training-file';
import { AdminCustomizeService } from 'app/services/admin-customize.service';
import { TrainingCustomizeService } from 'app/services/training-customize.service';
import { TrainingService } from 'app/services/training.service';
import { Training } from '../training.model';

@Component({
  selector: 'training-detail',
  templateUrl: './training-detail.component.html',
  styleUrls: ['./training-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class TrainingDetailComponent implements OnInit, OnDestroy {

  training: Training;

  imageObject: Array<object>;

  imgPaths: Array<string>;

  filePaths: Array<any>;

  trainingTaxonomies: Array<any>;

  fullscreenOpen: boolean;

  constructor(
    private trainingService: TrainingService,
    private snackbar: MatSnackBar,
    private translate: TranslateService,
    private trainingCustomizeService: TrainingCustomizeService,
    private adminCustomizeService: AdminCustomizeService,
    private _fuseConfigService: FuseConfigService
  ) 
  { 

    this.imageObject = [];
    this.imgPaths = [];
    this.filePaths = [];
  }

  ngOnInit(): void {


    this.trainingService.onCurrentTrainingChanged.subscribe(async training => {

      this.imageObject = [];
      this.imgPaths = [];
      this.filePaths = [];

      this.training=training;

      const adminTaxonomies = await this.adminCustomizeService.getTaxonomies().toPromise();
      const userTaxonomies = await this.trainingCustomizeService.getUserTaxonomies(this.training.user_id).toPromise();
      console.log(this.training);

      this.trainingTaxonomies = (this.training.taxonomies.filter(tax => tax.value) as Array<any>).concat(adminTaxonomies ? adminTaxonomies : []).concat(userTaxonomies ? userTaxonomies : []).filter((elem) => {
        
        const inTraining = this.training.taxonomies.filter(tax => tax.value).some((el) => (el as any).label === (elem as any).label);

        if (inTraining && !elem.hasOwnProperty('value'))
          return false

        return true;

      });
      

      //Video and Images

      //concat tacticalpedia img paths
      if(this.training && this.training.image && this.training.image.length > 0)
        this.imgPaths = this.imgPaths.concat(this.training.image);
      
      //concat tacticalpad img paths
      if(this.training && this.training.tacticalpad_publishing_id){

        const tacticalpadPaths = await this.trainingService.getTacticalPadImgPaths(this.training.tacticalpad_publishing_id, this.training._id).toPromise();

        this.imgPaths = this.imgPaths.concat(tacticalpadPaths);
      }

      //fetch viedos/imgs
      if(this.training && this.imgPaths.length > 0){

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

    });
  }

  getCategoriesList() {
    return this.training.category.map(cat => cat.label);
  }

  getTaxonomiesList() {
    return this.training.taxonomies;
  }

  getSelectTaxonomiesList() {
    return this.training.selectTaxonomies.filter(tax => tax.value.length > 0);
  }

  ngOnDestroy(): void {
    this.imageObject = [];
    this.imgPaths = [];
    this.filePaths = [];
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

  async openfile(file: TrainingFile){

    const blob = await this.trainingService.getTrainingFile(file.path, this.training._id).toPromise();

    var reader = new FileReader();

    const fileURL = URL.createObjectURL(blob);

    window.open(fileURL, '_blank');
      
  }

  handleError(error: any) {
    this.snackbar.open(this.translate.instant('ERROR.GENERIC_ERROR_MESSAGE'), this.translate.instant('SHARED.CLOSE'), {
      duration: 3000
    });
  }

}
