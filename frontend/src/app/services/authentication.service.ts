import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { environment } from 'environments/environment';
import { LoginRequest } from 'app/interfaces/login-request';
import { LoginResponse } from 'app/interfaces/login-response';
import { Profile } from 'app/interfaces/profile';
import { BackendRoutes } from 'app/utils/backend-routes';
import { User } from 'app/interfaces/user';




@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
              private http: HttpClient,
              private cookieService: CookieService) { }
  
  

  login(logInInfo: LoginRequest) : Observable<LoginResponse> {
    return this.http.post<LoginResponse>(environment.apiUrl + BackendRoutes.LOGIN, logInInfo);
  }

  isLogged(): boolean{
    if(this.cookieService.get('login')){
      return true;
    }
    return false;
  }

  isAdmin(): Observable<boolean> {
    return this.getUser().pipe(map(user => {
        
        if(user.role != 'admin'){
            return false;
        }

        return true;
    }));
  }

  logout(): Observable<any>{
    return this.http.post<any>(environment.apiUrl + BackendRoutes.LOGOUT, {});
    //this.cookieService.delete('login');
  }

  signup(signUpInfo: FormData): Observable<any>{
    return this.http.post<any>(environment.apiUrl + BackendRoutes.SIGNUP, signUpInfo);
  }

  getUser(): Observable<User> {
    return this.http.get<any>(environment.apiUrl + BackendRoutes.GET_USER);
  }

  /* Confirm email*/
  confirmEmail(params: Object): Observable<any>{
    return this.http.get<any>(environment.apiUrl + BackendRoutes.CONFIRM, params);
  }

  sendConfirm(params: Object): Observable<any>{
    return this.http.post<any>(environment.apiUrl + BackendRoutes.SEND_CONFIRM, params);
  }

  sendResetLink(email: String): Observable<any> {
    return this.http.post<any>(environment.apiUrl + BackendRoutes.LOST_PASSWORD, {email: email});
  }

  /* validate reset*/

  validateReset(params: Object): Observable<any> {
    return this.http.get<any>(environment.apiUrl + BackendRoutes.RESET_PASSWORD, params);
  }


  resetPassword(password: String, key: String): Observable<any> {

    const resetInfo = {
      pass: password,
      key: key
    }

    return this.http.post<any>(environment.apiUrl + BackendRoutes.RESET_PASSWORD, resetInfo);

  }

  
  usernameValidator(): AsyncValidatorFn {
  
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {

      const username = control.parent.get('username');

      return this.http.post(environment.apiUrl + BackendRoutes.CHECK_USERNAME, {username: username.value} )
        .pipe(
          map(res => {
            // if username is taken
            if (res == true) {
              // return error (key: value)
              return { 'usernameAlreadyTaken': true};
            }
          })
        );
    };
  }


  emailValidator(): AsyncValidatorFn {
  
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {

      const email = control.parent.get('email');

      return this.http.post(environment.apiUrl + BackendRoutes.CHECK_EMAIL, {email: email.value} )
        .pipe(
          map(res => {
            // if username is taken
            if (res == true) {
              // return error (key: value)
              return { 'emailAlreadyTaken': true};
            }
          })
        );
    };
  }

  
}
