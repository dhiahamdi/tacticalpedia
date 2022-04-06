import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'app/services/authentication.service';
import { stubFalse } from 'lodash';

// Import the locale files
import { locale as english } from '../i18n/en';
import { locale as italian } from '../i18n/it';
import { locale as portuguese } from '../i18n/pt';

@Component({
  selector: 'app-create-subscription',
  templateUrl: './create-subscription.component.html',
  styleUrls: ['./create-subscription.component.scss']
})
export class CreateSubscriptionComponent implements OnInit {

  logged: boolean;

  constructor(
              private translationLoader: FuseTranslationLoaderService,
              private translate: TranslateService,
              private authSerivce: AuthenticationService,
              private router: Router) { 

    this.translationLoader.loadTranslations(english, italian, portuguese);
  }

  async ngOnInit(): Promise<void> {
    this.logged =  await this.authSerivce.isLogged() ? true : false;
  }

  subscribeMonthly(): void {
    this.router.navigate(['subscription/subscribe'], { queryParams: { type: 'monthly' }});
  }

  subscribeYearly(): void{
    this.router.navigate(['subscription/subscribe'], { queryParams: { type: 'yearly' }})
  }

}
