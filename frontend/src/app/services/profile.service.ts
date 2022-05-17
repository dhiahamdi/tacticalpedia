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

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
              private http: HttpClient,
              private cookieService: CookieService) { }

  /* Profile */

  getProfile(): Observable<Profile>{
    return this.http.get<any>(environment.apiUrl + BackendRoutes.PROFILE, {});
  }

  getProfileFromUsername(username: string): Observable<Profile>{
    return this.http.post<Profile>(environment.apiUrl + BackendRoutes.PROFILE_FROM_USERNAME, {username: username});
  }

  getPublicProfile(username: string): Observable<Profile>{
    return this.http.post<Profile>(environment.apiUrl + BackendRoutes.PUBLIC_PROFILE_FROM_USERNAME, {username: username});
  }

  async getUserIdFromUsername(username: string): Promise<string>{

    const user_id = await this.http.post<any>(environment.apiUrl + BackendRoutes.USERID_FROM_USERNAME, {username: username}).toPromise();
    return user_id.user_id;
  }

  updateProfile(updatedProfile: Object): Observable<any>{
    return this.http.post<any>(environment.apiUrl + BackendRoutes.UPDATE_PROFILE, updatedProfile);
  }

  updatePassword(passwordInfo: Object): Observable<any>{  
    return this.http.post<any>(environment.apiUrl + BackendRoutes.UPDATE_PASSWORD, passwordInfo);
  }

  getProfilePic(): Observable<any>{
    return this.http.get(environment.apiUrl + BackendRoutes.PROFILE_PIC, {responseType: "blob"});
  }

  getFullNameFromId(user_id: string): Observable<any>{
    return this.http.post<any>(environment.apiUrl + BackendRoutes.PROFILE_FULLNAME, {user_id: user_id});
  }

  getUsernameFromId(user_id: string): Observable<any>{
    return this.http.post<any>(environment.apiUrl + BackendRoutes.GET_PROFILE_USERNAME, {user_id: user_id});
  }

  getProfilePicFromId(user_id: string): Observable<any>{

    return  this.http.post(environment.apiUrl + BackendRoutes.PROFILE_PIC_FROM_ID, {user_id: user_id}, {responseType: "blob"});
  }

  getProfilePicFromIdMany(ids: string[]): Observable<any>{

    return  this.http.post(environment.apiUrl + BackendRoutes.PROFILE_PIC_MANY, {users: ids});
  }

  setLang(lang: string): Observable<any>{
    return this.http.post<any>(environment.apiUrl + BackendRoutes.PROFILE_SET_LANG, {lang: lang});
  }

  /*check if user is allowed to publis*/
  async canPublish(): Promise<boolean>{
    const canPublish = await this.http.get<any>(environment.apiUrl + BackendRoutes.CAN_PUBLISH).toPromise();

    return canPublish.canPublish;
  }
}

