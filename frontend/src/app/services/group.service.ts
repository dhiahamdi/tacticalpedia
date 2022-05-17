import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'app/interfaces/user';
import { Group } from 'app/interfaces/Group';
import { Training } from 'app/interfaces/training';
import { BackendRoutes } from 'app/utils/backend-routes';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) {
    //set default behaviors
  }

  /**
  * search author by email
  * 
  * @returns 
  */
  searchAuthorByEmail(email: string): Observable<User> {
    return this.http.get<User>(environment.apiUrl + BackendRoutes.GROUP_SEARCH_ATHOR_BY_EMAIL + email);
  }


  async insertGroup(group: Group): Promise<string> {

    try {

      const groupId = await this.http.post<any>(environment.apiUrl + BackendRoutes.GROUP_CREATE, group).toPromise();
      return String(groupId.GroupId);

    } catch (e) {

      throw (e);
    }
  }

  async editGroup(group: Group): Promise<string> {

    try {

      const groupId = await this.http.post<any>(environment.apiUrl + BackendRoutes.GROUP_UPDATE, group).toPromise();
      return groupId;

    } catch (e) {

      throw (e);
    }
  }

  deleteGroups(groupIds: string[]): Observable<any> {

    return this.http.post<any>(environment.apiUrl + BackendRoutes.GROUP_DELETE, { GroupIds: groupIds });
  }


  async addImagesToGroup(groupImages: FormData): Promise<void> {

    try {

      const ImageResult = await this.http.post<any>(environment.apiUrl + BackendRoutes.GROUP_ADD_IMAGES, groupImages).toPromise();
      return;

    } catch (e) {

      throw (e);
    }

  }


  async deleteImagesFromGroup(groupId: string): Promise<void> {

    try {

      await this.http.post<any>(environment.apiUrl + BackendRoutes.GROUP_DEL_IMAGES, { _id: groupId }).toPromise();
      return

    } catch (e) {

      throw (e);
    }
  }


  /**
 * get public training in a lazy way
 * 
 * @returns 
 */
  getPublicGroups(filters : any): Observable<Group[]> {
    return this.http.post<Group[]>(environment.apiUrl + BackendRoutes.GROUPS , filters );
  }

  getMyGroups(filters : any): Observable<Group[]> {
    return this.http.post<Group[]>(environment.apiUrl + BackendRoutes.GROUPS_USER , filters  );
  }
  getMyGroupSub(filters : any): Observable<Group[]> {
    return this.http.post<Group[]>(environment.apiUrl + BackendRoutes.GROUPS_USER_SUB , filters  );
  }

  getSingleGroup( id : string): Observable<Group> {
    return this.http.get<Group>(environment.apiUrl + BackendRoutes.GROUPS_SINGLE + id  );
  }


  getGroupCover(imgPath: string): Observable<Blob>{

    return this.http.post(environment.apiUrl + BackendRoutes.GROUP_GET_IMAGE, {imagePath: imgPath}, {responseType: "blob"});
  }


  async addGroupTraining(groupId: string , trainingId : string): Promise<string> {

    try {

      const data = await this.http.post<any>(environment.apiUrl + BackendRoutes.GROUP_ADD_TRAINING, {groupId ,trainingId }).toPromise();
      return String(data.GroupId);

    } catch (e) {

      throw (e);
    }
  }

  async removeGroupTraining(groupId: string , trainingId : string): Promise<string> {

    try {

      const data = await this.http.post<any>(environment.apiUrl + BackendRoutes.GROUP_REMOVE_TRAINING, {groupId ,trainingId }).toPromise();
      return String(data.GroupId);

    } catch (e) {

      throw (e);
    }
  }


  getGroupTrainings(id : string): Observable<Training[]> {
    return this.http.get<Training[]>(environment.apiUrl + BackendRoutes.GROUPS_TRAINING + id  );
  }


  async addGroupAuthor(groupId: string , Id : string): Promise<string> {

    try {

      const data = await this.http.post<any>(environment.apiUrl + BackendRoutes.GROUP_ADD_AUTHOR, { group_id : groupId , user_id : Id }).toPromise();
      return String(data.GroupId);

    } catch (e) {

      throw (e);
    }
  }

  async addGroupAuthorByEmail(groupId: string , Id : string): Promise<string> {

    try {

      const data = await this.http.post<any>(environment.apiUrl + BackendRoutes.GROUP_ADD_AUTHOR_EMAIL, { group_id : groupId , user_id : Id }).toPromise();
      return String(data.GroupId);

    } catch (e) {

      throw (e);
    }
  }

  async removeGroupAuthor(groupId: string , Id : string): Promise<string> {

    try {

      const data = await this.http.post<any>(environment.apiUrl + BackendRoutes.GROUP_REMOVE_AUTHOR, { group_id : groupId , user_id : Id }).toPromise();
      return String(data.GroupId);

    } catch (e) {

      throw (e);
    }
  }

  async addGroupSubs(groupId: string , Id : string): Promise<string> {

    try {

      const data = await this.http.post<any>(environment.apiUrl + BackendRoutes.GROUP_ADD_SUBSCRIPTION, { group_id : groupId , user_id : Id }).toPromise();
      return String(data.GroupId);

    } catch (e) {

      throw (e);
    }
  }

  async removeGroupSubs(groupId: string , Id : string): Promise<string> {

    try {

      const data = await this.http.post<any>(environment.apiUrl + BackendRoutes.GROUP_REMOVE_SUBSCRIPTION, { group_id : groupId , user_id : Id }).toPromise();
      return String(data.GroupId);

    } catch (e) {

      throw (e);
    }
  }



}

