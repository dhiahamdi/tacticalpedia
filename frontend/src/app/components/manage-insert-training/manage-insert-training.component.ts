import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { Training } from 'app/interfaces/training';
import { TrainingDraft } from 'app/interfaces/training-draft';
import { TrainingService } from 'app/services/training.service';

// Import the locale files
import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { locale as portuguese } from '../i18n/pt';

@Component({
  selector: 'app-manage-insert-training',
  templateUrl: './manage-insert-training.component.html',
  styleUrls: ['./manage-insert-training.component.scss']
})
export class ManageInsertTrainingComponent implements OnInit {

  drafts: TrainingDraft[];

  constructor(
    private _fuseConfigService: FuseConfigService,
    private trainingService: TrainingService,
    private router: Router,
    private translationLoader: FuseTranslationLoaderService,
    private translate: TranslateService,
    private snackbar: MatSnackBar,
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

    this.drafts = [];
  }

  ngOnInit(): void {

    this.trainingService.getDrafts().subscribe(
    data =>{
      this.drafts = data;
      if(this.drafts.length === 0) this.router.navigate(['training/insert']);

    },
    err => this.handleError(err)  
    );
  }

  insertNewTraining(): void{

    this.router.navigate(['training/insert']);
  }

  completeDraft(draft: Training){
    const id = draft._id;

    this.router.navigate(['training/edit/'+id]);
  }

  handleError(error: any) {
    this.snackbar.open(this.translate.instant('ERROR.GENERIC_ERROR_MESSAGE'), this.translate.instant('SHARED.CLOSE'), {
      duration: 3000
    });
  }

}
