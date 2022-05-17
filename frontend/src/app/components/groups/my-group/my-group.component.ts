import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { ErrorService } from 'app/services/error.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';


import { GroupService } from 'app/services/group.service';
import { Group } from 'app/interfaces/Group';

// Import the locale files
import { locale as english } from '../../i18n/en';
import { locale as italian } from '../../i18n/it';
import { locale as portuguese } from '../../i18n/pt';

@Component({
  selector: 'app-my-group',
  templateUrl: './my-group.component.html',
  styleUrls: ['./my-group.component.scss'],
  animations   : fuseAnimations
})
export class MyGroupComponent implements OnInit {

  services_options: string[] = [ 'Training Library', 'Courses', 'Coaching & Tutoring', 'Insight' ,'Q&A','Articles & Publishings'];
  topic_options: string[] =['Training Metodology','Motor Preparation','Psychology  & Communication'];
  policy_options: string[] = ['PUBLIC', 'PRIVATE','HIDDEN'];
  typology_options: string[] = ['FREE', 'PAYED','SUBSCRIPTION','INVITATION'];
  discipline_options : string[] = ['Football', 'BasketBall', 'Volleyball', 'Rugby', 'Boating','Gymnastics','Other'];

  public groups: Group[];
  public filteredGroups: Group[];
  loading = false;

  public sel_group : Group;

  public sel_author;
  public sel_member;

  showAuthorGroupForm : boolean ;
  showMemberGroupForm : boolean ;

  public selected_service;
  public selected_topic;
  public selected_discipline;

  searchInput: FormControl;
  authorInput: FormControl;
  memberInput: FormControl;


  constructor(
    private _fuseConfigService: FuseConfigService,
    private translationLoader: FuseTranslationLoaderService,
    private translate: TranslateService,
    private errorService: ErrorService,
    private snackbar: MatSnackBar,
    private groupService: GroupService,
    private _fuseSidebarService: FuseSidebarService,
    private _formBuilder: FormBuilder,
  ) { 
    this.searchInput = new FormControl('');
    this.authorInput = new FormControl('');
    this.memberInput = new FormControl('');
    this.showAuthorGroupForm = false
    this.showMemberGroupForm = false
  }

  ngOnInit(): void {

    this.groupService.getMyGroups({service : this.selected_service , topic : this.selected_topic , discipline : this.selected_discipline}).subscribe(data => {
      this.groups = data;
      console.log(this.groups)
    });


  }


  showGroup(grp) {
    this.sel_group = grp ;
    this.showAuthorGroupForm = false;
    this.showMemberGroupForm = false;
  }
  openAddGroupAuthorForm() {
    this.sel_author = null;
    this.showAuthorGroupForm = true;
  }
  openAddGroupMemberForm() {
    this.sel_member = null;
    this.showMemberGroupForm = true;
  }

  async AuthoraddToGroupSubmit() {
    
    if (this.authorInput.value && this.sel_group) {
      this.loading = true;
      try {
        let grouId = await this.groupService.addGroupAuthorByEmail(this.sel_group._id, this.authorInput.value)
        this.loading = false;
        window.location.reload();
      } catch (error) {
        this.loading = false;
        this.snackbar.open(error, this.translate.instant('SHARED.CLOSE'), {
          duration: 3000
        });
      }
    }else{
      this.snackbar.open('You need to choose a group to add to !', this.translate.instant('SHARED.CLOSE'), {
        duration: 3000
      });
    }
  }


  async removeAuthorFromGroupSubmit(Id) {
    if (Id && this.sel_group) {
      this.loading = true;
      try {
        let grouId = await this.groupService.removeGroupAuthor(this.sel_group._id, Id)
        this.loading = false;
        window.location.reload();
      } catch (error) {
        this.loading = false;
        this.snackbar.open(error, this.translate.instant('SHARED.CLOSE'), {
          duration: 3000
        });
      }
    }else{
      this.snackbar.open('Failed !', this.translate.instant('SHARED.CLOSE'), {
        duration: 3000
      });
    }
  }



  async MemberaddToGroupSubmit() {
    
    if (this.memberInput.value && this.sel_group) {
      this.loading = true;
      try {
        let grouId = await this.groupService.addGroupSubs(this.sel_group._id, this.memberInput.value)
        this.loading = false;
        window.location.reload();
      } catch (error) {
        this.loading = false;
        this.snackbar.open(error, this.translate.instant('SHARED.CLOSE'), {
          duration: 3000
        });
      }
    }else{
      this.snackbar.open('You need to choose a group to add to !', this.translate.instant('SHARED.CLOSE'), {
        duration: 3000
      });
    }
  }


  async removeMemberFromGroupSubmit(Id) {
    if (Id && this.sel_group) {
      this.loading = true;
      try {
        let grouId = await this.groupService.removeGroupSubs(this.sel_group._id, Id)
        this.loading = false;
        window.location.reload();
      } catch (error) {
        this.loading = false;
        this.snackbar.open(error, this.translate.instant('SHARED.CLOSE'), {
          duration: 3000
        });
      }
    }else{
      this.snackbar.open('Failed !', this.translate.instant('SHARED.CLOSE'), {
        duration: 3000
      });
    }
  }



   /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void
    {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

}
