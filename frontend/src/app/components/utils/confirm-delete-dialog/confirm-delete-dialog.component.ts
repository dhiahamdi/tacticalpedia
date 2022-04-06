import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

// Import the locale files
import { locale as english } from '../../i18n/en';
import { locale as italian } from '../../i18n/it';
import { locale as portuguese } from '../../i18n/pt';

@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.scss']
})
export class ConfirmDeleteDialogComponent
{
    public confirmMessage: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<ConfirmDeleteDialogComponent>} dialogRef
     */
    constructor(
        public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
        private translationLoader: FuseTranslationLoaderService,
    )
    {
      this.translationLoader.loadTranslations(english, italian, portuguese);
    }

}
