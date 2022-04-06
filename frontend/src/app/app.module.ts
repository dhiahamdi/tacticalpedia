
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule} from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseHighlightModule, FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoginComponent } from 'app/components/login/login.component';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { AuthGuard } from './helpers/auth.guars';
import { RegisterComponent } from './components/register/register.component';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { MatSelectModule } from '@angular/material/select';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { LogoutComponent } from './components/logout/logout.component';
import { UpdatePasswordComponent } from './components/update-password/update-password.component';
import { NoAuthGuard } from './helpers/no.auth.guard';
import { HomeComponent } from './components/home/home.component';
import { Error404Component } from './components/error404/error404.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { ManageSubscriptionComponent } from './components/manage-subscription/manage-subscription.component';
import { StripePaymentComponent } from './components/stripe-payment/stripe-payment.component';

import { NgxStripeModule } from 'ngx-stripe';
import { WithCredentialsInterceptor } from './helpers/with-credentials.interceptor';

import { NgxPayPalModule } from 'ngx-paypal';
import { InsertTrainingComponent } from './components/insert-training/insert-training.component';
import { CustomizeTrainingFieldsComponent } from './components/customize-training-fields/customize-training-fields.component';

import { MatChipsModule } from '@angular/material/chips';
import { CreateSubscriptionComponent } from './components/create-subscription/create-subscription.component';

import {MatDividerModule} from '@angular/material/divider';
import { PaypalPaymentComponent } from './components/paypal-payment/paypal-payment.component';
import { SubscribeComponent } from './components/subscribe/subscribe.component';
import { SubscriptionGuard } from './helpers/subscription.guard';
import { AdminUserListComponent } from './components/admin/admin-user-list/admin-user-list.component';
import { AdminGuard } from './helpers/admin.guard';
import { AdminUpdateUserComponent } from './components/admin/admin-update-user/admin-update-user.component';
import { TrainingLibraryComponent } from './components/training-library/training-library.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatGridListModule} from '@angular/material/grid-list';
import { MainSidebarComponent } from './components/training-library/sidebar/main-sidebar/main-sidebar.component';
import { TrainingListComponent } from './components/training-library/training-list/training-list.component';
import { TrainingItemComponent } from './components/training-library/training-list/training-item/training-item.component';
import { TrainingDetailComponent } from './components/training-library/training-detail/training-detail.component';
import { SingleTrainingComponent } from './components/single-training/single-training.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { InsertDraftComponent } from './components/insert-draft/insert-draft.component';
import { ManageInsertTrainingComponent } from './components/manage-insert-training/manage-insert-training.component';
import { EditTrainingComponent } from './components/edit-training/edit-training.component';
import { TpWarningMessageComponent } from './components/utils/tp-warning-message/tp-warning-message.component';
import { SubscriptionResolverService } from './helpers/subscription.resolver';
import { AdminCustomizeComponent } from './components/admin/admin-customize/admin-customize.component';
import { TrainingGridComponent } from './components/home/training-grid/training-grid.component';
import { TrainingCardComponent } from './components/home/training-grid/training-card/training-card.component';
import { EditBillingInfoComponent } from './components/edit-billing-info/edit-billing-info.component';
import { CanInsertTrainingGuard } from './helpers/can-insert-training.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgImageSliderModule } from 'ng-image-slider';
import { CustomDropzonePreviewComponent } from './components/utils/custom-dropzone-preview/custom-dropzone-preview.component';
import { UnexpectedErrorComponent } from './components/unexpected-error/unexpected-error.component';
import { ConfirmDeleteDialogComponent } from './components/utils/confirm-delete-dialog/confirm-delete-dialog.component';
import { AdminDeleteDialogComponent } from './components/utils/admin-delete-dialog/admin-delete-dialog.component';
import { TrainingOwnerGuard } from './helpers/training-owner.guard';
import { defaultSelectTaxonomiesResolverService } from './helpers/defaultSelectTaxonomies.resolver';   
import { GroupsLibraryComponent } from './components/groups/groups-library/groups-library.component';
import { MatCardModule } from '@angular/material/card';
import { GroupItemComponent } from './components/groups/group-item/group-item.component';
import { GroupDetailsComponent } from './components/groups/group-details/group-details.component';
import { GroupCardComponent } from './components/groups/groups-library/group-card/group-card.component';
import { GroupInsertComponent } from './components/groups/group-insert/group-insert.component';


const appRoutes: Routes = [
    {
        path      : '',
        pathMatch : 'full',
        component: HomeComponent,
        resolve: {
            defaultSelectTaxonomies: defaultSelectTaxonomiesResolverService
        }
        // canActivate: [AuthGuard]
    },
    {
        path      : 'login',
        pathMatch : 'full',
        component: LoginComponent,
        canActivate: [NoAuthGuard]
    },
    {
        path      : 'logout',
        pathMatch : 'full',
        component: LogoutComponent,
        canActivate: [AuthGuard]
    },
    
    {
        path      : 'signup',
        pathMatch : 'full',
        component: RegisterComponent,
        canActivate: [NoAuthGuard]
    },
    {
        path      : 'confirmEmail',
        pathMatch : 'full',
        component: ConfirmEmailComponent,
        canActivate: [NoAuthGuard]
    },
    {
        path      : 'my-profile',
        pathMatch : 'full',
        component: MyProfileComponent,
        canActivate: [AuthGuard]
    },
    {
        path      : 'profile/user/:username',
        pathMatch : 'full',
        component: ProfileComponent,
        canActivate: [AuthGuard]
    },
    {
        path      : 'profile/update',
        pathMatch : 'full',
        component: UpdateProfileComponent,
        canActivate: [AuthGuard]
    },
    {
        path      : 'profile/updatePassword',
        pathMatch : 'full',
        component: UpdatePasswordComponent,
        canActivate: [AuthGuard]
    },
    {
        path      : 'forgot',
        pathMatch : 'full',
        component: ForgotPasswordComponent,
        canActivate: [NoAuthGuard]
    },
    {
        path      : 'groups/groups-library',
        pathMatch : 'full',
        component: GroupsLibraryComponent,
        canActivate: [AuthGuard]
    },
    {
        path      : 'group/insert',
        pathMatch : 'full',
        component: GroupInsertComponent,
        canActivate: [AuthGuard]
    },
    {
        path      : 'groups/group-details',
        pathMatch : 'full',
        component: GroupDetailsComponent,
        canActivate: [AuthGuard]
    },
    {
        path      : 'reset',
        pathMatch : 'full',
        component: ResetPasswordComponent,
        canActivate: [NoAuthGuard]
    },
    {
        path      : 'home',
        pathMatch : 'full',
        component: HomeComponent,
        canActivate: [AuthGuard],
        resolve: {
            defaultSelectTaxonomies: defaultSelectTaxonomiesResolverService
        }
    },
    {
        path      : 'profile/manage-subscription',
        pathMatch : 'full',
        component: ManageSubscriptionComponent,
        canActivate: [AuthGuard, SubscriptionGuard],
        resolve: {
            subscription: SubscriptionResolverService
        }
    },
    {
        path      : 'subscription/create',
        pathMatch : 'full',
        component: CreateSubscriptionComponent
    },
    {
        path      : 'subscription/subscribe',
        pathMatch : 'full',
        component: SubscribeComponent,
        canActivate: [AuthGuard]
    },
    {
        path      : 'subscription/pay-with-stripe',
        pathMatch : 'full',
        component: StripePaymentComponent,
        canActivate: [AuthGuard]
    },
    {
        path      : 'training/manage-insert',
        pathMatch : 'full',
        component: ManageInsertTrainingComponent,
        canActivate: [CanInsertTrainingGuard]
    },
    {
        path      : 'training/insert',
        pathMatch : 'full',
        component: InsertTrainingComponent,
        canActivate: [AuthGuard, CanInsertTrainingGuard]
    },
    {
        path      : 'training/insert-draft',
        pathMatch : 'full',
        component: InsertDraftComponent,
        canActivate: [AuthGuard, CanInsertTrainingGuard]
    },
    {
        path      : 'training/edit/:id',
        pathMatch : 'full',
        component: EditTrainingComponent,
        canActivate: [AuthGuard]
    },
    {
        path      : 'training/customize',
        pathMatch : 'full',
        component: CustomizeTrainingFieldsComponent,
        canActivate: [AuthGuard]
    },
    {
        path      : 'training/library',
        pathMatch : 'full',
        component: TrainingLibraryComponent,
        canActivate: [AuthGuard]
    },
    {
        path      : 'training/:id',
        pathMatch : 'full',
        component: SingleTrainingComponent
    },
    {
        path      : 'admin/user-list',
        pathMatch : 'full',
        component: AdminUserListComponent,
        canActivate: [AdminGuard]
    },
    {
        path      : 'admin/user/:id',
        pathMatch : 'full',
        component: AdminUpdateUserComponent,
        canActivate: [AdminGuard]
    },
    {
        path      : 'admin/customize',
        pathMatch : 'full',
        component: AdminCustomizeComponent,
        canActivate: [AdminGuard]
    },
    {   path: '404', 
        component: Error404Component
    },
    {   path: 'unexpected-error', 
        component: UnexpectedErrorComponent
    },
    {
        path : '**',
        redirectTo: '404'

    }
];

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        UpdateProfileComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        LogoutComponent,
        UpdatePasswordComponent,
        HomeComponent,
        Error404Component,
        ConfirmEmailComponent,
        ManageSubscriptionComponent,
        StripePaymentComponent,
        InsertTrainingComponent,
        CustomizeTrainingFieldsComponent,
        CreateSubscriptionComponent,
        PaypalPaymentComponent,
        SubscribeComponent,
        AdminUserListComponent,
        AdminUpdateUserComponent,
        TrainingLibraryComponent,
        MainSidebarComponent,
        TrainingListComponent,
        TrainingItemComponent,
        TrainingDetailComponent,
        SingleTrainingComponent,
        InsertDraftComponent,
        ManageInsertTrainingComponent,
        EditTrainingComponent,
        TpWarningMessageComponent,
        AdminCustomizeComponent,
        TrainingGridComponent,
        TrainingCardComponent,
        EditBillingInfoComponent,
        ProfileComponent,
        MyProfileComponent,
        CustomDropzonePreviewComponent,
        UnexpectedErrorComponent,
        ConfirmDeleteDialogComponent,
        AdminDeleteDialogComponent,
        GroupsLibraryComponent,
        GroupItemComponent,
        GroupDetailsComponent,
        GroupCardComponent,
        GroupInsertComponent,
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' }),
        
        TranslateModule.forRoot(),

        //Stripe
        NgxStripeModule.forRoot('pk_test_W2XJny88W0yuVCMcJeyttZF9'),

        //PayPal
        NgxPayPalModule,

        //Dropzone
        NgxDropzoneModule,

        //Image slider
        NgImageSliderModule,

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatStepperModule,
        MatSelectModule,
        MatChipsModule,
        MatDividerModule,
        MatTableModule,
        MatCardModule,
        //added
        MatDialogModule,
        MatMenuModule,
        MatRippleModule,
        MatToolbarModule,
        MatGridListModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        //added for single training
        MatExpansionModule,
        MatPaginatorModule,
        MatSortModule,

        

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        FuseHighlightModule,

        // App modules
        LayoutModule,
        SampleModule,
        MatSnackBarModule
    ],
    bootstrap   : [
        AppComponent
    ],

    providers : [
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: WithCredentialsInterceptor, multi: true },
    ]
})
export class AppModule
{
}
