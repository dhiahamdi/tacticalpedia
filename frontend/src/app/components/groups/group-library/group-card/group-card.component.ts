import { Component, Input, OnInit } from '@angular/core';
import { Group } from 'app/interfaces/GroupModel';
import { GroupService } from 'app/services/group.service';
import { ProfileService } from 'app/services/profile.service';

import { ErrorService } from 'app/services/error.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  styleUrls: ['./group-card.component.scss']
})
export class GroupCardComponent implements OnInit {

  @Input() group: Group;

  public cover_image;
  authors_img: Blob[];
  members_img: Blob[];
  public isAuthorsImgLoaded: boolean;
  public isMembersImgLoaded: boolean;

  constructor(
    private groupService: GroupService,
    private profileService: ProfileService,
    private translate: TranslateService,
    private errorService: ErrorService,
    private snackbar: MatSnackBar,
  ) { 
    this.isAuthorsImgLoaded = false;
    this.isMembersImgLoaded = false;
  }

  ngOnInit(): void {
    console.log(this.group)

    this.groupService.getGroupCover(this.group.img).subscribe(
      data => {

        var reader = new FileReader();

        reader.readAsDataURL(data); // read file as data url


        reader.onload = (event) => { // called once readAsDataURL is completed
          this.cover_image = {
            data: (event.target.result), 
            type: data.type
          };
        }

      },

      err => console.log(err)
    )

    let authors_ids = this.group.authors.map( el => el._id);
    this.profileService.getProfilePicFromIdMany(authors_ids).subscribe(
      data => {
        this.authors_img = data ;
        this.isAuthorsImgLoaded = true ;

        this.profileService.getProfilePicFromIdMany(this.group.subsciptions).subscribe(
          data => {
            this.members_img = data ;
            this.isMembersImgLoaded = true ;
  
          },
  
          err => this.handleError(err)
        )

      },

      err => this.handleError(err)
    )
  }

  handleError(error: any) {
    this.snackbar.open(this.translate.instant('ERROR.GENERIC_ERROR_MESSAGE'), this.translate.instant('SHARED.CLOSE'), {
      duration: 3000
    });
  }

}
