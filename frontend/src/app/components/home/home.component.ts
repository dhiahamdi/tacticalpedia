import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { AdminCustomizeService } from 'app/services/admin-customize.service';
import { AuthenticationService } from 'app/services/authentication.service';
import { HomeService } from 'app/services/home.service';
import { MatExpansionModule } from '@angular/material/expansion';

// Import the locale files
import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { locale as portuguese } from '../i18n/pt';
import { TrainingGridComponent } from './training-grid/training-grid.component';
import { ActivatedRoute, Params, Router, RoutesRecognized } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild(TrainingGridComponent)
  private trainingGrid: TrainingGridComponent;

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  public defaultSelectTaxonomies;
  public defaultCategories;

  public selectedTaxonomies: any;
  public selectedCategory;
  public searchInput;

  public queryParams;

  private searchTimeout;

  constructor(
    private _fuseConfigService: FuseConfigService,
    private translationLoader: FuseTranslationLoaderService,
    private translate: TranslateService,
    private adminCustomizeService: AdminCustomizeService,
    private homeService: HomeService,
    private renderer: Renderer2,
    private snackbar: MatSnackBar,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) 
  {

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

    
    this.defaultSelectTaxonomies = this.route.snapshot.data.defaultSelectTaxonomies;

    //load translations
    this.translationLoader.loadTranslations(english, italian, portuguese);

    this.selectedTaxonomies = {};

    this.route.queryParams.subscribe(params => {

      this.searchInput = params['s'] ? params['s'] : null;
      this.selectedCategory = params['category'] ? params['category'] : null;

      this.selectedTaxonomies = params;

      this.selectedTaxonomies = Object.keys(params)
        .filter(key => this.defaultSelectTaxonomies.filter(e => e.name === key).length > 0)
        .reduce((obj, key) => {
          obj[key] = params[key];
          return obj;
        }, {});

      
      this.setCurrentCategory();
      this.setCurrentTaxonomies()
      this.setCurrentSearchInput();
      
    });
  }

  ngOnInit(): void {

    this.adminCustomizeService.getCategories().subscribe(

      data => this.defaultCategories = data,

      err => this.handleError(err)
    );

  }

  setCurrentCategory(){
    this.setQueryParams();
    this.homeService.setCurrentCategory(this.selectedCategory);
  }

  setCurrentTaxonomies(){
    this.setQueryParams();
    this.homeService.setCurrentTaxonomies(this.selectedTaxonomies);
  }

  setCurrentSearchInput(){
    this.setQueryParams();
    this.homeService.setCurrentSearchInput(this.searchInput);
  }

  setQueryParams() {

    const queryParams: Params = {...{category: this.selectedCategory}, ...this.selectedTaxonomies, ...{s: this.searchInput}};

    this.router.navigate(
      [], 
      {
        relativeTo: this.route,
        queryParams: queryParams, 
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
  }


  handleError(error: any) {
    this.snackbar.open(this.translate.instant('ERROR.GENERIC_ERROR_MESSAGE'), this.translate.instant('SHARED.CLOSE'), {
      duration: 3000
    });
  }


}
