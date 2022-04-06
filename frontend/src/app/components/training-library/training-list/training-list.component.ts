import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { TranslateService } from '@ngx-translate/core';

import { TrainingService } from 'app/services/training.service';
import { Training } from '../training.model';

@Component({
  selector: 'training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class TrainingListComponent implements OnInit {

  trainings: Training[];
  filteredTrainings: Training[];
  
  visibility: string;
  currentCategory: string;
  searchText: string;
  currentTaxonomies;
  selectedVisibility: string;

  constructor(
    private trainingService: TrainingService,
    private snackbar: MatSnackBar,
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute
  ) { 

    this.trainings = [];

  }

  async ngOnInit(): Promise<void> {

    //fetch trainings from db
    this.trainingService.getTrainings().subscribe(
      async data => {
        this.trainings = data.map(training => new Training(training));

        this.route.queryParams.subscribe(params => {
          this.selectedVisibility = params['visibility']; 
          
          this.visibility = this.selectedVisibility
          this.filterTrainingList();
        });


        //show all public training at the beginning
        this.filteredTrainings = this.trainings.filter((training) => training.visibility === this.visibility);

        this.trainingService.setCurrentFilteredTrainings(this.filteredTrainings.map(training => training._id));

      },
      err => {
        this.handleError(err);
      }
    );
    
    //Filter trainings by visibility
    this.trainingService.onCurrentVisibilityChanged.subscribe(visibility => {
      
      const queryParams: Params = {visibility: visibility};

      this.router.navigate(
        [], 
        {
          relativeTo: this.route,
          queryParams: queryParams, 
          queryParamsHandling: 'merge', // remove to replace all query params by provided
        });

      // this.visibility = visibility
      // this.filterTrainingList();
    });

    //Filter trainings by category
    this.trainingService.onCurrentCategoryChanged.subscribe(category =>{
      this.currentCategory = category;
      this.filterTrainingList();
    });


    //Filter trainings by search text
    this.trainingService.onSearchTextChanged.subscribe(searchText =>{
      this.searchText = searchText;
      this.filterTrainingList();
    });

    //Filter training by select taxonomies
    this.trainingService.onCurrentSelectTaxonomiesChanged.subscribe(taxonomies =>{
      this.currentTaxonomies = taxonomies;
      this.filterTrainingList();
    });

  }

  showTraining(training){

    this.trainingService.setCurrentTraining(training);
  }

  filterTrainingList(){

    //remove selected mails when filtering
    this.trainingService.resetSelectedTrainingList();

    this.filteredTrainings = this.trainings.filter((training) =>{

      const visibilityCond: boolean = (this.visibility) ? training.visibility === this.visibility : true;
      const categotyCond: boolean = (this.currentCategory) ? training.category.map(category => category.slug).indexOf(this.currentCategory) != -1 : true;
      const searchTextCond: boolean = (this.searchText) ? training.name.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1 : true;

      let taxonomiesCond: boolean = true;

      Object.keys(this.currentTaxonomies).forEach((key) =>{

        let selected = this.currentTaxonomies[key];

        for(let selectT of training.selectTaxonomies){

          if(selectT.name === key){
            let tempCond = (selected) ? selectT.value.indexOf(selected) != -1  : true;
            taxonomiesCond = taxonomiesCond && tempCond;
          } 
        }
      });

      return visibilityCond && categotyCond && searchTextCond && taxonomiesCond

    });

    //set Filtered Training, save id only
    this.trainingService.setCurrentFilteredTrainings(this.filteredTrainings.map(training => training._id));
  }

  handleError(error: any) {
    this.snackbar.open(this.translate.instant('ERROR.GENERIC_ERROR_MESSAGE'), this.translate.instant('SHARED.CLOSE'), {
      duration: 3000
    });
  }
}
