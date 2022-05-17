import { Component, Input, OnInit } from '@angular/core';
import { Group } from 'app/interfaces/GroupModel';
import { GroupService } from 'app/services/group.service';
import { ProfileService } from 'app/services/profile.service';

import { ErrorService } from 'app/services/error.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-group-item',
  templateUrl: './group-item.component.html',
  styleUrls: ['./group-item.component.scss']
})
export class GroupItemComponent implements OnInit {

  @Input() group: Group;
  public cover_image;

  constructor(
    private groupService: GroupService,
    private profileService: ProfileService,
    private translate: TranslateService,
    private errorService: ErrorService,
    private snackbar: MatSnackBar,
  ) { 
  }

  ngOnInit(): void {

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
  }

}
