import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'app/services/authentication.service';
import { ProfileService } from 'app/services/profile.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private snackbar: MatSnackBar,
    private translate: TranslateService) 
  { 

  }

  async ngOnInit(): Promise<void> {

    try{
      const userRecord = await this.authService.getUser().toPromise();
      
      const username = userRecord.username;

      this.router.navigate(['/profile/user/' + username]);

    }catch(e){

      this.handleError(e);
    }
  }

  handleError(error: any) {
    this.snackbar.open(this.translate.instant('ERROR.GENERIC_ERROR_MESSAGE'), this.translate.instant('SHARED.CLOSE'), {
      duration: 3000
    });
  }

}
