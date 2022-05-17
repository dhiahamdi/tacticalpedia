import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { ErrorService } from 'app/services/error.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Router ,ActivatedRoute } from '@angular/router';

import { ManageUsersService } from 'app/services/admin/manage-users.service';
import { GroupService } from 'app/services/group.service';
import { AuthenticationService } from 'app/services/authentication.service';
import { User } from 'app/interfaces/user';

import { Group } from 'app/interfaces/Group';

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.scss'],
  animations: fuseAnimations
})
export class GroupEditComponent implements OnInit {

  services_options: string[] = [ 'Training Library', 'Courses', 'Coaching & Tutoring', 'Insight' ,'Q&A','Articles & Publishings'];
  topic_options: string[] =['Training Metodology','Motor Preparation','Psychology  & Communication'];
  policy_options: string[] = ['PUBLIC', 'PRIVATE','HIDDEN'];
  typology_options: string[] = ['FREE', 'PAYED','SUBSCRIPTION','INVITATION'];
  discipline_options : string[] = ['Football', 'BasketBall', 'Volleyball', 'Rugby', 'Boating','Gymnastics','Other'];

  form: FormGroup;

  public authors: any[];

  public loading: boolean;

  public isDataLoaded: boolean;

  imgFiles: File[] = [];

  public cover_image;

  group_id: string;
  group_data: Group;
  public user: User;
  public allowedToEdit: boolean;

  constructor(
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _fuseConfigService: FuseConfigService,
    private translationLoader: FuseTranslationLoaderService,
    private translate: TranslateService,
    private errorService: ErrorService,
    private snackbar: MatSnackBar,
    private manageUsersService: ManageUsersService,
    private groupService: GroupService,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) { 
    this.isDataLoaded = false;
    this.allowedToEdit = false;
  }

  async ngOnInit(): Promise<void> {

    this.group_id = this.route.snapshot.paramMap.get('id');

    this.groupService.getSingleGroup(this.group_id).subscribe(data => {
      this.group_data = data;
      console.log(this.group_data)

      this.form = this._formBuilder.group({
        name: [ this.group_data.name , Validators.required],
        description: [ this.group_data.description , Validators.required],
        services: [ this.group_data.services , Validators.required],
        topic: [ this.group_data.topic , Validators.required],
        policy: [ this.group_data.privacy , Validators.required],
        discipline: [ this.group_data?.discipline[0] , Validators.required],
        typology: [ this.group_data.typology , Validators.required],
      });

      this.isDataLoaded = true;

      this.groupService.getGroupCover(this.group_data.img).subscribe(
        async data => {
  
          var reader = new FileReader();
  
          reader.readAsDataURL(data); // read file as data url
  
  
          reader.onload = (event) => { // called once readAsDataURL is completed
            this.cover_image = {
              data: (event.target.result), 
              type: data.type
            };
          }

          if (this.authenticationService.isLogged()) {
            this.user = await this.authenticationService.getUser().toPromise();
            if(this.group_data.authors.find(el => el == this.user._id)){
              
              this.allowedToEdit = true
      
            }else{
              this.router.navigate(['/group/'+this.group_data._id]);
            }
          }else{
            this.router.navigate(['/group/'+this.group_data._id]);
          }
  
        },
  
        err => console.log(err)
      )


    },
    err => this.handleError(err)
  );
    this.authors = [];
    this.loading = false;
  }


  async editGroup(): Promise<void> {


    Object.keys(this.form.controls).forEach(key => {
      this.group_data[key] = this.form.get(key).value;
    });
    this.group_data['privacy'] = this.form.get('policy').value;
    this.loading = true;

    try {

      let grouId = await this.groupService.editGroup(this.group_data as Group);

      //upload img files
      if (this.imgFiles.length > 0 ) {

        const groupImage = new FormData();
        groupImage.set('_id', this.group_data._id);
        for (let file of this.imgFiles)
          groupImage.append('file', file);

        await this.groupService.addImagesToGroup(groupImage);

      }

      this.loading = false;
      this.router.navigate(['/group/'+this.group_data._id]);

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
