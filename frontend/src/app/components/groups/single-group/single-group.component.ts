import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { ErrorService } from 'app/services/error.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProfileService } from 'app/services/profile.service';

import { GroupService } from 'app/services/group.service';
import { Group } from 'app/interfaces/Group';
import { Training } from 'app/components/training-library/training.model';
import { AuthenticationService } from 'app/services/authentication.service';
import { User } from 'app/interfaces/user';

@Component({
  selector: 'app-single-group',
  templateUrl: './single-group.component.html',
  styleUrls: ['./single-group.component.scss'],
  animations   : fuseAnimations
})
export class SingleGroupComponent implements OnInit {

  group_id: string;
  group_data: Group;
  image: Blob[];
  authors_img: Blob[];
  members_img: Blob[];
  public isDataLoaded: boolean;
  public isAuthorsImgLoaded: boolean;
  public isMembersImgLoaded: boolean;
  public isTrainigLoaded: boolean;
  public fullscreenOpen: boolean;
  public allowedToEdit: boolean;
  public selectedTab: number;
  public user: User;

  public trainings: Training[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _fuseConfigService: FuseConfigService,
    private translationLoader: FuseTranslationLoaderService,
    private translate: TranslateService,
    private errorService: ErrorService,
    private snackbar: MatSnackBar,
    private groupService: GroupService,
    private _location: Location,
    private profileService: ProfileService,
    private authenticationService: AuthenticationService,
  ) {
    // Configure the layout
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: this.fullscreenOpen ? true : false
        },
        toolbar: {
          hidden: this.fullscreenOpen ? true : false
        },
        footer: {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    };

    this.isDataLoaded = false;
    this.isAuthorsImgLoaded = false;
    this.isMembersImgLoaded = false;
    this.isTrainigLoaded = false;
    this.allowedToEdit = false;
  }

  async ngOnInit(): Promise<void> {
    this.selectedTab = 0;
    this.group_id = this.route.snapshot.paramMap.get('id');
    
    this.groupService.getSingleGroup(this.group_id).subscribe(data => {
      this.group_data = data;
      this.isDataLoaded = true;
      console.log(this.group_data)

      this.profileService.getProfilePicFromIdMany(this.group_data.authors).subscribe(
        data => {
          this.authors_img = data;
          this.isAuthorsImgLoaded = true;

          this.profileService.getProfilePicFromIdMany(this.group_data.subsciptions).subscribe(
            async data => {
              this.members_img = data;
              this.isMembersImgLoaded = true;

              if (this.authenticationService.isLogged()) {
                this.user = await this.authenticationService.getUser().toPromise();
                if(this.group_data.authors.find(el => el == this.user._id))
                this.allowedToEdit = true
              }

            },

            err => this.handleError(err)
          )

        },

        err => this.handleError(err)
      )

    },
      err => this.handleError(err)
    );

    this.groupService.getGroupTrainings(this.group_id).subscribe(data => {

      if (Array.isArray(data)) {
        const loadedTraining = data.map(training => new Training(training));
        this.trainings = loadedTraining;
      }

      console.log(this.trainings)

    },
      err => this.handleError(err)
    );

  }

  handleError(error: any) {
    this.snackbar.open(this.translate.instant('ERROR.GENERIC_ERROR_MESSAGE'), this.translate.instant('SHARED.CLOSE'), {
      duration: 3000
    });
  }

  fullscreen(action) {
    if (action === 'open') {
      this.fullscreenOpen = true;
    } else {
      this.fullscreenOpen = false;
    }

    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: this.fullscreenOpen ? true : false
        },
        toolbar: {
          hidden: this.fullscreenOpen ? true : false
        },
        footer: {
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
