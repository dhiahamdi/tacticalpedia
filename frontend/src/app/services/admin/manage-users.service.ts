import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'app/interfaces/user';
import { BackendRoutes } from 'app/utils/backend-routes';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageUsersService {

  constructor(
    private http: HttpClient,
  ) { }

  getUsers():  Observable<User[]> {
    return this.http.get<User[]>(environment.apiUrl + BackendRoutes.ADMIN_GET_USERS);
  }


  getUserInfo(user_id: string): Observable<any> {
    return this.http.get<any>(environment.apiUrl + BackendRoutes.ADMIN_GET_USER + user_id);
  }


  getProfilePic(user_id: string): Observable<any> {
    return this.http.get<any>(environment.apiUrl + BackendRoutes.ADMIN_GET_PROFILE_PIC + user_id);
  }


  updateUser(updatedUser): Observable<any> {
    console.log(updatedUser);
    return this.http.post<any>(environment.apiUrl + BackendRoutes.ADMIN_UPDATE_USER, updatedUser);
  }

  deleteUser(user_id: string, new_user_id?: string): Observable<any> {
    return this.http.post<any>(environment.apiUrl + BackendRoutes.ADMIN_DELETE_USER, {user_id: user_id, new_user_id: new_user_id});
  }


}
