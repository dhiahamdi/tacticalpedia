import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AdminDeleteDialogComponent } from 'app/components/utils/admin-delete-dialog/admin-delete-dialog.component';
import { User } from 'app/interfaces/user';
import { ManageUsersService } from 'app/services/admin/manage-users.service';
import { SubscriptionService } from 'app/services/subscription.service';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-admin-user-list',
  templateUrl: './admin-user-list.component.html',
  styleUrls: ['./admin-user-list.component.scss']
})
export class AdminUserListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'subscription', 'actions'];
  dataSource: any;

  confirmDialogRef: MatDialogRef<AdminDeleteDialogComponent>;

  constructor(
    private router: Router,
    private manageUsers: ManageUsersService,
    private subscriptionService: SubscriptionService,
    private snackbar: MatSnackBar,
    private translate: TranslateService, 
    private _matDialog: MatDialog
  ) { 

    
  }

  ngOnInit(): void {
    this.manageUsers.getUsers().pipe(map(users => {
        return users.map((user) => ({ ...user, subscription_status: this.subscriptionService.getSubscriptionStatus({paypal: user.paypal, stripe: user.stripe}) }));
      })).subscribe(users => {
        this.dataSource = users;
    });
  }


  goToUserDetail(_id: string) {
    if (_id)
      this.router.navigate(['/admin/user/' + _id]);
  }


  deleteUser(_id: string) {

    // Open confirm dialog
    this.confirmDialogRef = this._matDialog.open(AdminDeleteDialogComponent, {
      disableClose: false,
      data: {
        users: this.dataSource
      }
    });

    this.confirmDialogRef.componentInstance.confirmMessage = this.translate.instant('TRAINING_LIBRARY.WARNING_DELETE_MESSAGE') ;

    this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          
            // Admin confirmed
            const newUser = (result == 'DONT_ASSIGN') ? null : result;

            // Delete user and trainings
            this.manageUsers.deleteUser(_id, newUser).subscribe(
              data => {

                // Drop user from array and show snackbar
                this.dataSource = this.dataSource.filter(function(user) { return user._id != _id; });
                this.snackbar.open(this.translate.instant('ADMIN.USER_DELETED_SUCCESS'), this.translate.instant('SHARED.CLOSE'), {
                  duration: 3000
                });
                
              },
              error => {
                this.snackbar.open(this.translate.instant('ERROR.GENERIC_ERROR_MESSAGE'), this.translate.instant('SHARED.CLOSE'), {
                  duration: 3000
                });
              }
            );
        }
          
        this.confirmDialogRef = null;
    });
  }

}
