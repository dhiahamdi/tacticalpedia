import '@angular/forms';

declare module '@angular/forms' {

    export interface AbstractControl {
      elementType: string; // input, textarea, select
    }
  }