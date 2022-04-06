import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'app/services/authentication.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
              private authService: AuthenticationService,
              private router: Router,
              private snackbar: MatSnackBar,
              private translate: TranslateService,
              ) { }

  ngOnInit(): void {

    this.authService.logout().subscribe(
      data => {
        window.location.href = '/';
        
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

}
