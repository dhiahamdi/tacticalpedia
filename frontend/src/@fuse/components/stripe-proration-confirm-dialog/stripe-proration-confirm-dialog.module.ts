import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { StripeProrationConfirmDialogComponent } from './stripe-proration-confirm-dialog.component';

@NgModule({
    declarations: [
        StripeProrationConfirmDialogComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule
    ],
    entryComponents: [
        StripeProrationConfirmDialogComponent
    ],
})
export class StripeProrationConfirmDialogModule
{
}
