import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { Profile } from 'app/interfaces/profile';
import { ProfileService } from 'app/services/profile.service';
import { TrainingService } from 'app/services/training.service';

// Import the locale files
import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { locale as portuguese } from '../i18n/pt';
import { Training } from '../training-library/training.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ProfileComponent implements OnInit {

  private username;

  public profile: Profile;

  public dataIsLoaded: boolean;
  public user_id: string;

  public profilePicUrl: string;

  public trainings: Training[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private translationLoader: FuseTranslationLoaderService,
    private translate: TranslateService,
    private _fuseConfigService: FuseConfigService,
    private trainingService: TrainingService,
    private snackbar: MatSnackBar,
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

    //load translations
    this.translationLoader.loadTranslations(english, italian, portuguese);

  }

  async ngOnInit(): Promise<void> {

    this.username = this.route.snapshot.paramMap.get('username');

    try{

      this.profile = await this.profileService.getProfileFromUsername(this.username).toPromise()

      this.user_id =await this.profileService.getUserIdFromUsername(this.username);

      //get profile picture
      this.profileService.getProfilePicFromId(this.user_id).subscribe(
        data =>{
          var reader = new FileReader();

          reader.readAsDataURL(data); // read file as data url

          reader.onload = (event) => { // called once readAsDataURL is completed
              this.profilePicUrl = String(event.target.result);
          }

        },
        err => this.profilePicUrl = 'assets/images/avatars/profile.jpg'
      );
      
      //get all user public trainings
      const trainings = await this.trainingService.getUserPublicTrainings(this.user_id).toPromise();

      this.trainings = trainings.map(training => new Training(training));

      this.dataIsLoaded = true;

    }catch(e){

      this.handleError(e);
    }
  }

  handleError(error: any) {
    
    if (error == 'Unable to find user') this.router.navigate(['/404']);

    this.snackbar.open(this.translate.instant('ERROR.GENERIC_ERROR_MESSAGE'), this.translate.instant('SHARED.CLOSE'), {
      duration: 3000
    });
  }

}
