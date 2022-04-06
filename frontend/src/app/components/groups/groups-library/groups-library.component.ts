import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { ErrorService } from 'app/services/error.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';


import { GroupService } from 'app/services/group.service';
import { Group } from 'app/interfaces/Group';

// Import the locale files
import { locale as english } from '../../i18n/en';
import { locale as italian } from '../../i18n/it';
import { locale as portuguese } from '../../i18n/pt';

@Component({
  selector: 'app-groups-library',
  templateUrl: './groups-library.component.html',
  styleUrls: ['./groups-library.component.scss']
})
export class GroupsLibraryComponent implements OnInit {

  public groups: Group[];
  public filteredGroups: Group[];
  isLoading = false;

  constructor(
    private _fuseConfigService: FuseConfigService,
    private translationLoader: FuseTranslationLoaderService,
    private translate: TranslateService,
    private errorService: ErrorService,
    private snackbar: MatSnackBar,
    private groupService: GroupService,
  ) { }

  ngOnInit(): void {

    this.groupService.getPublicGroups().subscribe(data => {
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

