import { AfterViewInit, ApplicationRef, ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { Training } from 'app/components/training-library/training.model';
import { HomeService } from 'app/services/home.service';
import { TrainingService } from 'app/services/training.service';

// Import the locale files
import { locale as english } from '../../i18n/en';
import { locale as italian } from '../../i18n/it';
import { locale as portuguese } from '../../i18n/pt';

@Component({
  selector: 'training-grid',
  templateUrl: './training-grid.component.html',
  styleUrls: ['./training-grid.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})


export class TrainingGridComponent implements OnInit{

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  public trainings: Training[];
  public filteredTrainings: Training[];

  private currentCategory;
  private currentTaxonomies;
  private currentSearchInput;
  private searchTimeout;


  isLoading = false;
  loadedAll = false;
  isFirstLoad = true;

  constructor(
    private trainingService: TrainingService,
    private homeService: HomeService,
    public zone: NgZone,
    private ref: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private translate: TranslateService,
    private translationLoader: FuseTranslationLoaderService,
  ) 
  { 

    this.translationLoader.loadTranslations(english, italian, portuguese);
    
    
  }

  ngOnInit(): void{

    this.trainingService.resetPageNumber();

    this.homeService.onCurrentCategoryChanged.subscribe(category =>{
      if (this.currentCategory !== category) {
        this.currentCategory = category;
        this.trainingService.resetPageNumber();
        this.loadedAll = false;
        if (!this.isFirstLoad)
          this.getTrainings();
      }
    })

    this.homeService.onCurrentSelectTaxonomiesChanged.subscribe(tax =>{
      if (JSON.stringify(this.currentTaxonomies) !== JSON.stringify(tax) ) {
        this.currentTaxonomies = tax;
        this.trainingService.resetPageNumber();
        this.loadedAll = false;
        if (!this.isFirstLoad)
          this.getTrainings();
      }
    })

    this.homeService.onCurrentSearchInputChanged.subscribe(searchInput =>{
      if (this.currentSearchInput !== searchInput) {
      clearTimeout(this.searchTimeout);
      const ref = this;
      this.searchTimeout = setTimeout(function(){ 
        ref.currentSearchInput = searchInput;
        ref.trainingService.resetPageNumber();
        this.loadedAll = false;
        if (!this.isFirstLoad)
          ref.getTrainings();

      }, 1000);
    }
    
    })

    window.addEventListener('scroll', this.scroll.bind(this), true); 
  }


  filterTrainings(){

    this.filteredTrainings = this.trainings.filter((training) =>{
      const categotyCond: boolean = (this.currentCategory) ? training.category.map(category => category.slug).indexOf(this.currentCategory) != -1 : true;
      const searchTextCond: boolean = (this.currentSearchInput) ? 

        training.name.toLowerCase().includes(this.currentSearchInput.toLowerCase()) || 
        training.description.toLowerCase().includes(this.currentSearchInput.toLowerCase())
        : true;

      let taxonomiesCond: boolean = true;

      if(this.currentTaxonomies){

        Object.keys(this.currentTaxonomies).forEach((key) =>{

          let selected = this.currentTaxonomies[key];

          for(let selectT of training.selectTaxonomies){

            if(selectT.name === key){
              let tempCond = (selected) ? selectT.value.indexOf(selected) != -1  : true;
              taxonomiesCond = taxonomiesCond && tempCond;
            } 
          }
        });
      }

      return categotyCond && searchTextCond && taxonomiesCond

    });
    
  }

  /**
   * fetch training in lazy way
   */
  getTrainings(append?: boolean): void {

    if (this.isLoading) return;

    const filters = {
      search: this.homeService.getCurrentSearchInput(),
      category: this.homeService.getCurrentCategory(),
      selectTaxonomies: this.homeService.getCurrentTaxonomies(),
    }

    this.isLoading = true;
    this.trainingService.getPublicTrainingsLazy(filters).subscribe(res => {
        if ((res.length && append) || !append) {
          const loadedTraining = res.map(training => new Training(training));
          this.trainings = append ? this.trainings.concat(loadedTraining) : loadedTraining;
          
          //filter trainings
          this.filterTrainings()

          if (res.length < 12)
            this.loadedAll = true;

        } else {
          this.loadedAll = true;
        }
        this.isLoading = false;
        this.isFirstLoad = false;
    },
    err => {
      this.handleError(err)
      this.isLoading = false
    });

    
  }

  scroll(event): void {
    let element = event.target;
    
    let atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;

    if (atBottom) {
      if (!this.loadedAll) {
        this.zone.run(() => {
            this.trainingService.paginatePage();
            this.getTrainings(true);
          } 
        );
      }
    }
  }


  handleError(error: any) {
    this.snackbar.open(this.translate.instant('ERROR.GENERIC_ERROR_MESSAGE'), this.translate.instant('SHARED.CLOSE'), {
      duration: 3000
    });
  }

}
