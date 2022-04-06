import { Component, HostBinding, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { TranslateService } from '@ngx-translate/core';
import { ProfileService } from 'app/services/profile.service';
import { TrainingService } from 'app/services/training.service';
import { Training } from '../../training.model';

@Component({
  selector: 'training-item',
  templateUrl: './training-item.component.html',
  styleUrls: ['./training-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class TrainingItemComponent implements OnInit {

  @Input() training: Training;

  @HostBinding('class.selected')
  selected: boolean;

  public author;
  trainingCover = {data: "/assets/images/training-placeholder.png", type: "image/png"};

  constructor(
    private profileService: ProfileService,
    private trainingService: TrainingService,
    private snackbar: MatSnackBar,
    private translate: TranslateService) 
    {

    }

  ngOnInit(): void {

    //set initial value
    this.training = new Training(this.training);

    // //Load image
    this.trainingService.getTrainingCover(this.training._id).subscribe(

      data =>{
        
        var reader = new FileReader();
        
        reader.readAsDataURL(data); // read file as data url
    
        reader.onload = (event) => { // called once readAsDataURL is completed
            this.trainingCover = {
              data: String(event.target.result),
              type: data.type
            };

        }

      },

      err => this.handleError(err)
    );

    //get author name
    this.profileService.getProfile().subscribe(
      data => this.author = data.name+' '+ data.surname,
      err => this.author = '');

    
    //Update if mail is selected
    this.trainingService.onCurrentSelectedTrainingsChanged.subscribe(selectedTrainings =>{

      if(selectedTrainings.length > 0 && selectedTrainings.includes(this.training._id)) this.selected = true;

      else this.selected = false;
    
    });
  }

  getCategoriesLabel() {
    return this.training.category.map(cat => cat.label);
  }

  getSelectTaxonomiesList() {
    return this.training.selectTaxonomies.filter(tax => tax.value.filter(value => value).length > 0)
  }


  onSelectedChange(): void
  {
      this.trainingService.toggleSelectedTraining(this.training._id);
  }

  handleError(error: any) {
    this.snackbar.open(this.translate.instant('ERROR.GENERIC_ERROR_MESSAGE'), this.translate.instant('SHARED.CLOSE'), {
      duration: 3000
    });
  }

}
