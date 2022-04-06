import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'app/services/authentication.service';
import { BackendRoutes } from 'app/utils/backend-routes';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {

  key : string;
  email: string;

  constructor(
              private _fuseConfigService: FuseConfigService,
              private authService: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router,
              private translate: TranslateService,
              private snackbar: MatSnackBar,
              ) 
    {  

      // Configure the layout
      this._fuseConfigService.config = {
        layout: {
            navbar   : {
                hidden: true
            },
            toolbar  : {
                hidden: true
            },
            footer   : {
                hidden: true
            },
            sidepanel: {
                hidden: true
            }
        }
      };
      
    
      //get params from query
      this.route.queryParams.subscribe(params => {
        this.key = params['key'];
        this.email = params['email'];
      });
    }

  ngOnInit(): void {

    //params for confirmation
    const params = {
      params: {
        key: this.key,
        email: this.email
      }
    }

    //confirm e mail
    this.authService.confirmEmail(params).subscribe(
      data => {

        //if email is confirmed send back to login
        this.router.navigate(['/login'], { queryParams: { success: 'CONFIRM_EMAIL_SUCCES' }});

      },
      error => {
          this.handleError(error);
          throw error;    
      }
    );

  }

  handleError(error: any) {
    this.snackbar.open(this.translate.instant('ERROR.GENERIC_ERROR_MESSAGE'), this.translate.instant('SHARED.CLOSE'), {
      duration: 3000
    });
  }

}
