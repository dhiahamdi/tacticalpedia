import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { ErrorService } from 'app/services/error.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

import { Router } from '@angular/router';
import { ManageUsersService } from 'app/services/admin/manage-users.service';
import { GroupService } from 'app/services/group.service';

import { Group } from 'app/interfaces/Group';

import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

// Import the locale files
import { locale as english } from '../../i18n/en';
import { locale as italian } from '../../i18n/it';
import { locale as portuguese } from '../../i18n/pt';

@Component({
  selector: 'app-group-insert',
  templateUrl: './group-insert.component.html',
  styleUrls: ['./group-insert.component.scss'],
  animations: fuseAnimations
})
export class GroupInsertComponent implements OnInit {
  form: FormGroup;
  services_options: string[] = [ 'Training Library', 'Courses', 'Coaching & Tutoring', 'Insight' ,'Q&A','Articles & Publishings'];
  topic_options: string[] =['Training Metodology','Motor Preparation','Psychology  & Communication'];
  policy_options: string[] = ['PUBLIC', 'PRIVATE','HIDDEN'];
  typology_options: string[] = ['FREE', 'PAYED','SUBSCRIPTION','INVITATION'];
  discipline_options : string[] = ['Football', 'BasketBall', 'Volleyball', 'Rugby', 'Boating','Gymnastics','Other'];
  public authors: any[];

  public loading: boolean;

  imgFiles: File[] = [];



  /**
    * Constructor
    *
    * @param {FormBuilder} _formBuilder
    */
  constructor(
    private _formBuilder: FormBuilder,
    private _fuseConfigService: FuseConfigService,
    private translationLoader: FuseTranslationLoaderService,
    private translate: TranslateService,
    private errorService: ErrorService,
    private snackbar: MatSnackBar,
    private manageUsersService: ManageUsersService,
    private groupService: GroupService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {

    this.form = this._formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      services: ['', Validators.required],
      topic: ['', Validators.required],
      discipline: ['', Validators.required],
      policy: ['', Validators.required],
      typology: ['', Validators.required],
      selected_user_mail: [''],
    });

    this.authors = [];
    this.loading = false;

  }




  async insertNewGroup(): Promise<void> {

    const group = {}

    Object.keys(this.form.controls).forEach(key => {
      group[key] = this.form.get(key).value;
    });

    group['authors'] = this.authors.map(el => el._id);
    console.log(group)
    this.loading = true;

    try {

      let grouId = await this.groupService.insertGroup(group as Group);

      //upload img files
      if (this.imgFiles) {

        const groupImage = new FormData();
        groupImage.set('_id', grouId);
        for (let file of this.imgFiles)
          groupImage.append('file', file);

        await this.groupService.addImagesToGroup(groupImage);

      }

      this.loading = false;
      this.router.navigate(['groups/groups-library']);

    } catch (e) {
      this.loading = false;
      this.snackbar.open(e, this.translate.instant('SHARED.CLOSE'), {
        duration: 3000
      });
    }

  }

  deleteAuthor(_id): void {
    console.log(_id)
    this.authors = this.authors.filter(el => el._id != _id)
  }

  async addAuthors(): Promise<void> {
    console.log(this.form.value.selected_user_mail)
    let user_exist = this.authors.find(el => el.email == this.form.value.selected_user_mail)
    if (!user_exist) {
      this.loading = true;
      try {

        let found_user = await this.groupService.searchAuthorByEmail(this.form.value.selected_user_mail).toPromise();
        this.authors.push(found_user)
        this.loading = false;

      } catch (e) {
        this.loading = false;
        this.snackbar.open(e, this.translate.instant('SHARED.CLOSE'), {
          duration: 3000
        });
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