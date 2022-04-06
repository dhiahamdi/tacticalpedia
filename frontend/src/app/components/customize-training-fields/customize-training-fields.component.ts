import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseMatSidenavHelperService } from '@fuse/directives/fuse-mat-sidenav/fuse-mat-sidenav.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { TrainingCategory } from 'app/interfaces/training-category';
import { TrainingSelectTaxonomy } from 'app/interfaces/training-select-taxonomy';
import { TrainingTaxonomy } from 'app/interfaces/training-taxonomy';
import { TrainingCustomizeService } from 'app/services/training-customize.service';
import { Subject } from 'rxjs';

// Import the locale files
import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { locale as portuguese } from '../i18n/pt';

@Component({
  selector: 'app-customize-training-fields',
  templateUrl: './customize-training-fields.component.html',
  styleUrls: ['./customize-training-fields.component.scss']
})
export class CustomizeTrainingFieldsComponent implements OnInit {

  // Private
  private _unsubscribeAll: Subject<any>;

  public categories: TrainingCategory[];
  public taxonomies: TrainingTaxonomy[];
  public selectTaxonomies: TrainingSelectTaxonomy[];

  constructor(
    private _fuseConfigService: FuseConfigService,
    private trainingCustomizeService : TrainingCustomizeService,
    private snackbar: MatSnackBar,
    private translate: TranslateService,
    private translationLoader: FuseTranslationLoaderService) { 
    // Set the private defaults
    this._unsubscribeAll = new Subject();

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
              hidden: FuseMatSidenavHelperService
          }
      }
  };

    this.categories = [];
    this.taxonomies = [];
    this.selectTaxonomies = [];

    this.getCategories();
    this.getTaxonomies();
    this.getSelectTaxonomies();

    this.translationLoader.loadTranslations(english, italian, portuguese);
  }

  ngOnInit(): void {
    
  }

  /**
     * Add category
     *
     * @param {MatChipInputEvent} event
     */
   addCategory(event: MatChipInputEvent): void
   {
       const input = event.input;
       const value = event.value;

       // Add category
       if ( value )
       {

          var index = this.categories ? this.categories.findIndex(p => p.slug == this.slugify(value)) : -1;

          if (index == -1) { // Avoid duplicate categories

            this.categories.push({
              slug: this.slugify(value),
              label: value
            } as TrainingCategory);

            this.syncCategories();

          } else {
            // SHOW duplicate category message
          }

       }

       // Reset the input value
       if ( input )
       {
           input.value = '';
       }
   }

   /**
    * Remove category
    *
    * @param category
    */
   removeCategory(category): void
   {
       var index = this.categories.findIndex(p => p.slug == category);

       if ( index >= 0 )
       {
           this.categories.splice(index, 1);
       }

       this.syncCategories();
   }

    /**
    * Store categories
    *
    */
   syncCategories() {
     this.trainingCustomizeService.syncCategories(this.categories).subscribe(
        data => {
            if (data.response != "ok")
                console.log("error", data);
          },
        error => {
            this.handleError(error);
        }
      );
   }

    /**
    * Get user categories
    *
    */
   getCategories() {
    this.trainingCustomizeService.getCategories().subscribe(
      data => {
          this.categories = data;
        },
      error => {
          this.handleError(error);
      }
    );
   }
   

   /**
     * Add text input taxonomy
     *
     * @param {MatChipInputEvent} event
     */
    addTaxonomy(event: MatChipInputEvent): void
    {
      const input = event.input;
      const value = event.value;

      // Add taxonomy
      if ( value )
      {
          var index = this.taxonomies ? this.taxonomies.findIndex(p => p.slug == this.slugify(value)) : -1;

         if (index == -1) { // Avoid duplicate taxonomies

           this.taxonomies.push({
             slug: this.slugify(value),
             label: value
           } as TrainingTaxonomy);

           this.syncTaxonomies();

         } else {
           // SHOW duplicate category message
         }
      }

      // Reset the input value
      if ( input )
      {
          input.value = '';
      }
    }
 
    /**
     * Remove category
     *
     * @param category
     */
    removeTaxonomy(taxonomy): void
    {
      var index = this.taxonomies.findIndex(p => p.slug == taxonomy);
 
        if ( index >= 0 )
        {
            this.taxonomies.splice(index, 1);
            this.syncTaxonomies();
        }
    }


    /**
    * Sync taxonomies with db
    *
    */
   syncTaxonomies() {
    this.trainingCustomizeService.syncTaxonomies(this.taxonomies).subscribe(
       data => {
           if (data.response != "ok")
              this.handleError('GENERIC_ERROR');
               // Handle error
         },
       error => {
           this.handleError(error);
       }
     );
  }

   /**
   * Get user text taxonomies
   *
   */
  getTaxonomies() {
   this.trainingCustomizeService.getTaxonomies().subscribe(
     data => {
         this.taxonomies = data;
       },
     error => {
         this.handleError(error);
     }
   );
  }


   /**
   * Add a new select taxonomy
   *
   * @param {MatChipInputEvent} event
   */
  addNewSelectTaxonomy(): void
  {
    this.selectTaxonomies.push({
      name: "new taxonomy",
      options: []
    } as TrainingSelectTaxonomy);

  }


  /**
   * Removes a select taxonomy
   *
   * @param {MatChipInputEvent} event
   */
   removeSelectTaxonomy(field): void
   {
    var selectIndex = this.selectTaxonomies.findIndex(select => select.name == field.name);

    if ( selectIndex >= 0 ) {
            this.selectTaxonomies.splice(selectIndex, 1);
            this.syncSelectTaxonomies();
        }
   }


  /**
   * Add select taxonomy option
   *
   * @param {TrainingSelectTaxonomy} field
   * @param {MatChipInputEvent} event
   */
   addSelectTaxonomyOption(field: TrainingSelectTaxonomy, event: MatChipInputEvent): void
   {
     const input = event.input;
     const value = event.value;

     // Add option select taxonomy
     if ( value )
     {  
        var selectIndex = this.selectTaxonomies.findIndex(select => select.name == field.name);

        if (selectIndex >= 0) {

          var optionIndex = this.selectTaxonomies[selectIndex].options ? this.selectTaxonomies[selectIndex].options.findIndex(arrayOption => arrayOption == value) : -1;

          if (optionIndex == -1) { // Avoid duplicate taxonomies

            this.selectTaxonomies[selectIndex].options.push(value);
            this.syncSelectTaxonomies();

          } else {
            // SHOW duplicate category message
          }
          
        }     
     }

     // Reset the input value
     if ( input )
     {
         input.value = '';
     }
   }

  /**
   * Removes an option from a given select taxonomy option
   *
   * @param {TrainingSelectTaxonomy} field
   * @param {String} option
   */
  removeSelectTaxonomyOption(field, option) {

      // Find the select
      var selectIndex = this.selectTaxonomies.findIndex(select => select.name == field.name);
      if (selectIndex >= 0) {

        // Find the option 
        var optionIndex = this.selectTaxonomies[selectIndex].options.findIndex(arrayOption => arrayOption == option);
        if ( optionIndex >= 0 ) {
              this.selectTaxonomies[selectIndex].options.splice(optionIndex, 1);
              this.syncSelectTaxonomies();
          }
      }
  }


  /**
  * Handles the select taxonomy name change event
  * 
  * @param {TrainingSelectTaxonomy} field
  * @param {String} value
  */
  updateSelectTaxonomyName(field: TrainingSelectTaxonomy, value: string) {
    var selectIndex = this.selectTaxonomies.findIndex(select => select.name == field.name);
    if (selectIndex >= 0) {
      this.selectTaxonomies[selectIndex].name = value;
      
    }
  }


  /**
  * Sync taxonomies with db
  *
  */
  syncSelectTaxonomies() {
  this.trainingCustomizeService.syncSelectTaxonomies(this.selectTaxonomies).subscribe(
      data => {
          if (data.response != "ok")
            this.handleError('GENERIC_ERROR');
              // Handle error
        },
      error => {
          this.handleError(error);
      }
    );
  }


  /**
   * Get user text taxonomies
   *
   */
   getSelectTaxonomies() {
    this.trainingCustomizeService.getSelectTaxonomies().subscribe(
      data => {
          this.selectTaxonomies = data;
        },
      error => {
          this.handleError(error);
      }
    );
   }



    handleError(error: any) {
      this.snackbar.open(this.translate.instant('ERROR.GENERIC_ERROR_MESSAGE'), this.translate.instant('SHARED.CLOSE'), {
        duration: 3000
      });
    }


    slugify(input: string) : string{
      return input.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
    }
}
