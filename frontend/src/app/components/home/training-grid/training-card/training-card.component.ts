import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Training } from 'app/components/training-library/training.model';
import { ProfileService } from 'app/services/profile.service';
import { TrainingService } from 'app/services/training.service';

@Component({
  selector: 'training-card',
  templateUrl: './training-card.component.html',
  styleUrls: ['./training-card.component.scss']
})
export class TrainingCardComponent implements OnInit {

  @Input() training: Training;

  public author;
  public username;
  public profilePicUrl;
  public trainingCover;
  public videoThumb;

  constructor(
    private profileService: ProfileService,
    private trainingService: TrainingService,
    private snackbar: MatSnackBar,
    private translate: TranslateService,
    private router: Router
  ) 
  { 

  }

  ngOnInit(): void {
    
    this.training.updatedAt = new Date(this.training.updatedAt);
    this.training.updatedAt = this.training.updatedAt.toLocaleDateString();

    this.profileService.getFullNameFromId(this.training.user_id).subscribe(
      data => this.author=data.fullname,
      err => this.handleError(err)
    );

    this.profileService.getUsernameFromId(this.training.user_id).subscribe(
      data => this.username=data.username,
      err => this.handleError(err)
    );

    this.profileService.getProfilePicFromId(this.training.user_id).subscribe(
      data => {

        var reader = new FileReader();

        reader.readAsDataURL(data); // read file as data url


        reader.onload = (event) => { // called once readAsDataURL is completed
            this.profilePicUrl = String(event.target.result);
        }

      },

      err => this.handleError(err)
    )

    this.trainingService.getTrainingCover(this.training._id).subscribe(

      data =>{
        
        var reader = new FileReader();
        
        reader.readAsDataURL(data); // read file as data url

        reader.onload = (event) => { // called once readAsDataURL is completed

            console.log(data);
          
            this.trainingCover = {
              data: (event.target.result), 
              type: data.type
            };

            if(data.type.match('video.*')) {
              this.trainingService.getTrainingVideoThumb(this.training._id).subscribe(
                res => {
                  if (res) {
                        var readerThumb = new FileReader();
            
                        readerThumb.readAsDataURL(res); // read file as data url
                
                        readerThumb.onload = (event) => { // called once readAsDataURL is completed
                            this.videoThumb = (event.target.result);
                        }
                    }
                }
              )
            }
        }
      }
    );

  }


  goToProfile(username: string) {
    this.router.navigate(['/profile/user/' + username]);
  }

  truncate( str, n=160, useWordBoundary=true ){
    if (!str) return '';
    if (str.length <= n) { return str; }
    const subString = str.substr(0, n-1); // the original check
    return (useWordBoundary 
      ? subString.substr(0, subString.lastIndexOf(" ")) 
      : subString) + "...";
  };

  handleError(error: any) {
    this.snackbar.open(this.translate.instant('ERROR.GENERIC_ERROR_MESSAGE'), this.translate.instant('SHARED.CLOSE'), {
      duration: 3000
    });
  }

}
