import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

// Import the locale files
import { locale as english } from '../../i18n/en';
import { locale as italian } from '../../i18n/it';

@Component({
  selector: 'app-admin-delete-dialog',
  templateUrl: './admin-delete-dialog.component.html',
  styleUrls: ['./admin-delete-dialog.component.scss']
})
export class AdminDeleteDialogComponent
{
    public confirmMessage: string;
    form: FormGroup;

    /**
     * Constructor
     *
     * @param {MatDialogRef<AdminDeleteDialogComponent>} dialogRef
     */
    constructor(
        public dialogRef: MatDialogRef<AdminDeleteDialogComponent>,
        private translationLoader: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any
    )
    {
      this.translationLoader.loadTranslations(english, italian);

      this.form = this._formBuilder.group({
        newUser: ['DONT_ASSIGN']
      });

    }


}
