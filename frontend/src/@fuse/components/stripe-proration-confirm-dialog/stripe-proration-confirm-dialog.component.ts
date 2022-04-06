import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector   : 'stripe-proration-confirm-dialog',
    templateUrl: './stripe-proration-confirm-dialog.component.html',
    styleUrls  : ['./stripe-proration-confirm-dialog.component.scss']
})
export class StripeProrationConfirmDialogComponent
{
    public confirmMessage: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<FuseConfirmDialogComponent>} dialogRef
     */
    constructor(
        public dialogRef: MatDialogRef<StripeProrationConfirmDialogComponent>
    )
    {
    }

}
