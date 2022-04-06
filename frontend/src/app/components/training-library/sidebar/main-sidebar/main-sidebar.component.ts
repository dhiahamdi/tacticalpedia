import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { TrainingCategory } from 'app/interfaces/training-category';
import { ProfileService } from 'app/services/profile.service';
import { TrainingCustomizeService } from 'app/services/training-customize.service';
import { TrainingService } from 'app/services/training.service';
import { MatExpansionModule } from '@angular/material/expansion';

// Import the locale files
import { locale as english } from '../../../i18n/en';
import { locale as italian } from '../../../i18n/it';
import { locale as portuguese } from '../../../i18n/pt';

import { TrainingSelectTaxonomy } from 'app/interfaces/training-select-taxonomy';
import { TrainingTaxonomy } from 'app/interfaces/training-taxonomy';
import { AdminCustomizeService } from 'app/services/admin-customize.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-main-sidebar',
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.scss'],
  animations   : fuseAnimations
})
export class MainSidebarComponent implements OnInit {

  public fullName;
  public categories;
  public selectTaxonomies;
  public visibility;
  public currentCategory;
  public currentSelectTaxonomies;

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private translationLoader: FuseTranslationLoaderService,
    private translate: TranslateService,
    private _fuseConfigService: FuseConfigService,
    private trainingCustomizeService: TrainingCustomizeService,
    private trainingService: TrainingService,
    private adminCustomizeService: AdminCustomizeService,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute) 
    { 
      this.translationLoader.loadTranslations(english, italian, portuguese);

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
      
    }

  ngOnInit(): void {

    //initialize visibility to public

    this.route.queryParams.subscribe(params => {
      this.visibility = params['visibility'] ? params['visibility'] : 'private'
      this.trainingService.setCurrentVisibility(this.visibility);
    });
    
    

    // Gets user data
    this.profileService.getProfile().subscribe(
      data => {
        this.fullName = data.name + ' ' + data.surname;

      },
      error => {
        this.handleError(error);
      });
    
    // Load default categories
    this.trainingCustomizeService.getCategories().subscribe(
      data => {
        this.categories = data;

        //add default categories
        this.adminCustomizeService.getCategories().toPromise()
        .then(res => this.categories = this.categories.concat(res));
      },

      error => {
        this.handleError(error);
      }
    );

    // Get custom select taxonomies
    this.trainingCustomizeService.getSelectTaxonomies().subscribe(
      data => {
        this.selectTaxonomies = data;

        //add default select taxonomies
        this.adminCustomizeService.getSelectTaxonomies().toPromise()
        .then(res => this.selectTaxonomies = this.selectTaxonomies.concat(res));

        //set initial state for select taxonomies: none selected
        const initialTaxonomies = {};
        
        this.selectTaxonomies.forEach(selectT => {

          initialTaxonomies[selectT.name] = null;
          
        });

        this.trainingService.setCurrentTaxonomies(initialTaxonomies);
      },

      error => {
        this.handleError(error);
      }
    );
    
  }

  addNewTraining(): void {
    this.router.navigate(['/training/insert']);
  }


  setCurrentVisibility(): void {
    this.trainingService.setCurrentVisibility(this.visibility);
  }


  setCurrentCategory(category: TrainingCategory & {active?: boolean}): void {
    if(category){
      this.categories = this.categories.map(cat => {
        cat.slug == category.slug ? cat.active = true : cat.active = false;
        return cat;
      });
      this.currentCategory = category.slug;
      this.trainingService.setCurrentCategory(category.slug);

    }else {
      this.currentCategory = null;
      this.trainingService.setCurrentCategory(null);
    }
  }


  setCurrentTaxonomies(tax: TrainingSelectTaxonomy, option: string){

    this.currentSelectTaxonomies = this.trainingService.getCurrentTaxonomies();

    this.currentSelectTaxonomies[tax.name] = option;

    this.trainingService.setCurrentTaxonomies(this.currentSelectTaxonomies);

    //set active option
    if(tax){
      for(let selectT of this.selectTaxonomies){

        if(selectT.name === tax.name){
          
          selectT.active = option;

        }
      }
    }
  }


  resetFilters() {

    this.setCurrentCategory(null);

    //set initial state for select taxonomies: none selected
    const initialTaxonomies = {}; 
    this.selectTaxonomies.forEach(selectT => {
      this.setCurrentTaxonomies(selectT, null);
    });
  }

  handleError(error: any) {
    this.snackbar.open(this.translate.instant('ERROR.GENERIC_ERROR_MESSAGE'), this.translate.instant('SHARED.CLOSE'), {
      duration: 3000
    });
  }
}
