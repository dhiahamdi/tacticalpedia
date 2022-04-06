import { Injectable } from '@angular/core';

// Import the locale files
import { locale as english } from 'app/components/i18n/en';
import { locale as italian } from 'app/components/i18n/it';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

    constructor() { }

    getErrorCode(error) : string {
      if (error in english.data['ERROR'])
        return 'ERROR.' + error;

      return 'ERROR.GENERIC_MESSAGE';
    }
}
