import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { ErrorService } from 'app/services/error.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';


import { GroupService } from 'app/services/group.service';
import { Group } from 'app/interfaces/Group';

// Import the locale files
import { locale as english } from '../../i18n/en';
import { locale as italian } from '../../i18n/it';
import { locale as portuguese } from '../../i18n/pt';

@Component({
  selector: 'app-group-library',
  templateUrl: './group-library.component.html',
  styleUrls: ['./group-library.component.scss'],
  animations   : fuseAnimations
})
export class GroupLibraryComponent implements OnInit {

  services_options: string[] = [ 'Training Library', 'Courses', 'Coaching & Tutoring', 'Insight' ,'Q&A','Articles & Publishings'];
  topic_options: string[] =['Training Metodology','Motor Preparation','Psychology  & Communication'];
  policy_options: string[] = ['PUBLIC', 'PRIVATE','HIDDEN'];
  typology_options: string[] = ['FREE', 'PAYED','SUBSCRIPTION','INVITATION'];
  discipline_options : string[] = ['Football', 'BasketBall', 'Volleyball', 'Rugby', 'Boating','Gymnastics','Other'];

  public groups: Group[];
  public filteredGroups: Group[];
  isLoading = false;

  public selected_service;
  public selected_topic;
  public selected_discipline;

  constructor(
    private _fuseConfigService: FuseConfigService,
    private translationLoader: FuseTranslationLoaderService,
    private translate: TranslateService,
    private errorService: ErrorService,
    private snackbar: MatSnackBar,
    private groupService: GroupService,
  ) { }

  ngOnInit(): void {

    this.groupService.getPublicGroups({service : this.selected_service , topic : this.selected_topic , discipline : this.selected_discipline}).subscribe(data => {
      this.groups = data;
      console.log(this.groups)
    });

  }

  getPublicGroups():void {
    this.groupService.getPublicGroups({service : this.selected_service , topic : this.selected_topic , discipline : this.selected_discipline}).subscribe(data => {
      this.groups = data;
      console.log(this.groups)
    });

  }


  handleError(error: any) {
    this.snackbar.open(this.translate.instant('ERROR.GENERIC_ERROR_MESSAGE'), this.translate.instant('SHARED.CLOSE'), {
      duration: 3000
    });
  }

}
