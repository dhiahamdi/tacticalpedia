import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { TranslateService } from '@ngx-translate/core';
import { TrainingService } from 'app/services/training.service';
import { ConfirmDeleteDialogComponent } from '../utils/confirm-delete-dialog/confirm-delete-dialog.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Training } from './training.model';

@Component({
  selector: 'app-training-library',
  templateUrl: './training-library.component.html',
  styleUrls: ['./training-library.component.scss'],
  animations   : fuseAnimations
})
export class TrainingLibraryComponent implements OnInit, OnDestroy {

  searchInput: FormControl;
  hasSelectedMails: boolean;
  currentTraining: Training;

  confirmDialogRef: MatDialogRef<ConfirmDeleteDialogComponent>;

   // Private
   private _unsubscribeAll: Subject<any>;

  constructor(
    private trainingService: TrainingService,
    private _matDialog: MatDialog,
    private snackbar: MatSnackBar,
    private translate: TranslateService,
    private deviceService: DeviceDetectorService,
    private _fuseSidebarService: FuseSidebarService,
    ) { 

    // Set the defaults
    this.searchInput = new FormControl('');

    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    this.searchInput.valueChanges.subscribe(searchText => {
      this.trainingService.onSearchTextChanged.next(searchText);
    });


    this.trainingService.onCurrentSelectedTrainingsChanged.subscribe(selectedTrainings =>{
      setTimeout(() => {
        this.hasSelectedMails = selectedTrainings.length > 0;
      }, 0);
    });

    this.trainingService.onCurrentTrainingChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(currentTraining => {

                if ( !currentTraining )
                {
                    this.currentTraining = null;
                }
                else
                {
                    this.currentTraining = currentTraining;
                }
            });

  }


  /**
   * Deselect current training
   */
   deselectCurrentTraining(): void
   {
       this.trainingService.onCurrentTrainingChanged.next(null);
   }


  ngOnDestroy(): void {

    this.trainingService.setCurrentTraining(null);

    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  toggleSelectAll(): void
  {
      this.trainingService.toggleSelectAll();
  }

  deleteTrainings(): void {

    this.confirmDialogRef = this._matDialog.open(ConfirmDeleteDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = this.translate.instant('TRAINING_LIBRARY.WARNING_DELETE_MESSAGE') ;

    this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          // User confirmed
          const trainingIds = this.trainingService.getSelectedTrainings();
          this.trainingService.deleteTrainings(trainingIds).subscribe(
            data => window.location.reload(),
            err => {
              this.snackbar.open(this.translate.instant('ERROR.GENERIC_ERROR_MESSAGE'), this.translate.instant('SHARED.CLOSE'), {
                duration: 3000
              });
            }
          );
        }
          
        this.confirmDialogRef = null;
    });

    
  }


  /**
     * Toggle the sidebar
     *
     * @param name
     */
   toggleSidebar(name): void
   {
       this._fuseSidebarService.getSidebar(name).toggleOpen();
   }

}
